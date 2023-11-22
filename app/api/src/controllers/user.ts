import User from "../models/user";
import { Request, Response } from "express";
import { uploadSingle } from "../helpers/fileupload";
import { IRequestWithUser } from "interfaces/global";
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
    const user = req.user;
    const followedId = req.params.id;
    if (String(user._id) === followedId) return res.status(401).send({ success: false, message: "لا يمكنك متابعة نفسك" })
    const updateStatus = await Follow.updateOne(
      {
        user: followedId,
        "followers.user": { $ne: user._id },
        count: {
          $lt: 100,
        },
      },
      {
        $push: {
          followers: {
            user: user._id,
            createdAt: new Date(),
          },
        },
        $inc: {
          followersCount: 1,
        },
      }
    );
    if (updateStatus.modifiedCount === 1) {
      res.status(201).send({ success: true, message: "تم اضافة المتابعة" });
    } else {
      //if the user liked the article before
      const updateStatus = await Follow.updateOne(
        {
          user: followedId,
          "followers.user": user._id,
          count: {
            $lt: 100,
          },
        },
        {
          $pull: {
            followers: {
              user: user._id,
            },
          },
          $inc: {
            followersCount: -1,
          },
        }
      );
      if (updateStatus.modifiedCount === 1) {
        res.status(201).send({ success: true, message: "تم ازالة الاعجاب" });
      } else {
        //if there is no bucket and the user didn't like the article before
        await Follow.create({
          user: followedId,
          followers: [
            {
              user: user._id,
              createdAt: new Date(),
            },
          ],
          followersCount: 1,
        });
        res.status(201).send({ success: true, message: "تم اضافة المتابعة" });
      }
    }
  } catch (err) {
    console.log(err);

  }
};
// const sendNotification = async (req, res) => {
//   try {
//     // const {}
//   } catch (err) {
//     console.log(err);
    
//   }
// }
export {
  getUser,
  searchUser,
  editUser,
  followUser,
}