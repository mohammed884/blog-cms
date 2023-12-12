import User from "./models/user";
import { Request, Response } from "express";
import { uploadSingle } from "../../helpers/fileopreations";
import Follow from "./models/follow";
import pagination from "../../helpers/pagination";
import { sendNotification, deleteNotification } from "../notification/controller";
const getUser = async (req: Request, res: Response) => {
  try {
    /*
      pirority for getting the user
      1. requestedUser
      2. req.user
      3. query the username
    */

    const requestedUser = req.requestedUser;
    const user = requestedUser || req.user || await User.findOne({ username: req.params.username }).lean();
    res.status(201).send({ success: true, user })
  } catch (err) {
    console.log(err);
  };
};
const blockUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const userIdToBlock = req.params.id;
    if (String(user._id) === userIdToBlock) {
      return res
        .status(401)
        .send({ success: false, message: "لا يمكنك حظر نفسك" });
    }
    // Check && Add the user ID to the blocked list
    const updatedStatus = await User.updateOne(
      { _id: user._id, "blocked.user": { $ne: userIdToBlock } },
      {
        $push: {
          blocked: {
            user: userIdToBlock,
            createdAt: new Date(),
          }
        }
      }
    );
    if (updatedStatus.modifiedCount === 0) {
      return res
        .status(401)
        .send({ success: false, message: "حدث خطأ أثناء حظر المستخدم" });
    }
    res.status(201).send({ success: true, message: "تم حظر المستخدم بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server error" });
  }
};
const unBlockUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const userIdToUnBlock = req.params.id;
    // Check && Add the user ID to the blocked list
    const updatedStatus = await User.updateOne(
      { _id: user._id },
      {
        $pull: {
          blocked: {
            user: userIdToUnBlock
          }
        }
      }
    );
    if (updatedStatus.modifiedCount === 0) {
      return res
        .status(401)
        .send({ success: false, message: "حدث خطأ أثناء فك الحظر على المستخدم" });
    }
    res.status(201).send({ success: true, message: "تم فك الحظر على المستخدم بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Internal Server error" });
  }
};
const searchUser = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const matchQuery = {
      // "bio.title": new RegExp(username, "i"),
      username: new RegExp(username, "i"),
    };
    const users = await pagination({ matchQuery, Model: User, page: 1 });
    console.log(users);
    res.status(201).send({ success: true, users })
  } catch (err) {
    console.log(err);

  }
};
const editUser = async (req: Request, res: Response) => {
  try {
    //handle edit bio!!
    const user = req.user;
    const { username, bio, gender } = req.body;
    const files = req.files;
    if (username && user.username !== username)
      user.username = username;
    if (gender && user.gender !== gender)
      user.gender !== gender
    if (bio) {
      if (user.bio.title !== bio.title) user.bio.title = bio.title
      if (user.bio.text !== bio.text) user.bio.text = bio.text
    }
    if (files && files.cover) {
      const uploadStatus = uploadSingle(files.cover);
      if (!uploadStatus.success)
        return res
          .status(401)
          .send({ success: false, message: uploadStatus.err });
      user.cover = uploadStatus.path;
    }
    if (files && files.avatar) {
      const uploadStatus = uploadSingle(files.avatar);
      if (!uploadStatus.success)
        return res
          .status(401)
          .send({ success: false, message: uploadStatus.err });
      user.avatar = uploadStatus.path;
    }
    await user.save();
    res.status(201).send({ success: true, message: "تم تحديث المعلومات" });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.username === 1) {
      return res
        .status(401)
        .send({ success: false, message: "هذا الاسم مستخدم من قبل" });
    } else {
      console.log(err);
    }
  }
};
const followUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const bucketOwnerId = req.params.user;
    if (String(user._id) === bucketOwnerId) {
      return res.status(401).send({ success: false, message: "لا يمكنك متابعة نفسك" })
    }

    const followersBucket = await Follow.findOne({ owner: bucketOwnerId });
    if (!followersBucket) {
      const newBucket = await Follow.create({
        user: bucketOwnerId,
        followers: [
          {
            user: user._id,
            createdAt: new Date()
          }
        ],
        followersCount: 1
      });
      const followId = newBucket.followers[newBucket.followers.length - 1]._id;
      console.log("new bucket follow id ->", followId);
      
      const notificationStatus = await sendNotification({
        receiver: bucketOwnerId,
        sender: user._id,
        type: "follow",
        retrieveId: String(followId)
      });
      if (!notificationStatus.success) {
        return res.status(401).send({ success: false, message: notificationStatus.err });
      }
      return res.status(201).send({ success: true, message: "تمت المتابعة" });
    };
    const isFollowedBefore = followersBucket.followers.some((follow) => String(follow.user) === String(user._id));
    if (isFollowedBefore) {
      const followId = req.body.followId;
      if (!followId) {
        return res.status(401).send({ success: false, message: "plese provide followId" });
      }
      console.log("isFollowedBefore = true follow id ->", followId);

      const notificationDeletion = await deleteNotification({
        receiver: bucketOwnerId,
        retrieveId: followId
      });
      if (!notificationDeletion.success) {
        return res.status(401).send({ success: false, message: notificationDeletion.err });
      }
      followersBucket.followers = followersBucket.followers.filter((follow) => String(follow.user) !== String(user._id));
      followersBucket.followersCount--
      await followersBucket.save();
      return res.status(201).send({ success: true, message: "تم الغاء المتابعة" });
    } else {
      followersBucket.followers.push({
        user: user._id,
        createdAt: new Date()
      })
      followersBucket.followersCount++
      const followId = followersBucket.followers[followersBucket.followers.length - 1]._id;
      console.log("isFollowedBefore = false follow id ->", followId);
      const notificationStatus = await sendNotification({
        receiver: bucketOwnerId,
        sender: user._id,
        type: "follow",
        retrieveId: String(followId)
      });
      if (!notificationStatus.success) {
        return res.status(401).send({ success: false, message: notificationStatus.err });
      }
      await followersBucket.save();
      return res.status(201).send({ success: true, message: "تم المتابعة" });
    }
  } catch (err) {
    console.log(err);

  }
};
export {
  getUser,
  blockUser,
  unBlockUser,
  searchUser,
  editUser,
  followUser,
}