import User from "./model";
import { Request, Response } from "express";
import { uploadSingle } from "../helpers/fileopreations";
import { IRequestWithUser } from "../interfaces/global";
import Follow from "../models/follow";
const getUser = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).lean();
    if (!user) return res.status(401).send({ success: false, message: "لم يتم العثور على المستخدم" })
    res.status(201).send({ success: true, user })
  } catch (err) {
    console.log(err);
  };
};
const searchUser = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const searchOptions = {
      // "bio.title": new RegExp(username, "i"),
      username: new RegExp(username, "i"),
    };
    const users = await User.find(searchOptions).limit(10).lean();
    console.log(users);
    res.status(201).send({ success: true, users })
  } catch (err) {
    console.log(err);

  }
};
const editUser = async (req: IRequestWithUser, res: Response) => {
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
const followUser = async (req: IRequestWithUser, res: Response) => {
  try {
    //add notifiction
    const user = req.user;
    const id = req.params.id;
    if (String(user._id) === id) {
      return res.status(401).send({ success: false, message: "لا يمكنك متابعة نفسك" })
    }
    /*
      step 1 get the bucket
      step 2 check the bucket
      step 3 if the user already follows remove him
      step 4 if he don't add him 
    */
    const followersBucket = await Follow.findOne({ user: id });
    if (!followersBucket) {
      await Follow.create({
        user: id,
        followers: [
          {
            user: user._id,
            createdAt: new Date()
          }
        ],
        followersCount: 1
      })
    };
    const isFollowedBefore = followersBucket.followers.some((follow) => String(follow.user) === String(user._id));
    switch (true) {
      case isFollowedBefore:
        followersBucket.followers = followersBucket.followers.filter((follow) => String(follow.user) !== String(user._id));
        followersBucket.followersCount--
        await followersBucket.save();
        return res.status(201).send({ success: true, message: "تم الغاء المتابعة" });
      case !isFollowedBefore:
        followersBucket.followers.push({
          user: user._id,
          createdAt: new Date()
        })
        followersBucket.followersCount++
        await followersBucket.save();
        return res.status(201).send({ success: true, message: "تم المتابعة" });
      default:
        return res.status(401).send({ success: false, message: "حدث خطأ ما" })
    }
  } catch (err) {
    console.log(err);

  }
};
export {
  getUser,
  searchUser,
  editUser,
  followUser,
}