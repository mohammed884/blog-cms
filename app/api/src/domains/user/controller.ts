import User from "./model";
import { Request, Response } from "express";
import { uploadSingle } from "../../helpers/fileopreations";
import pagination from "../../helpers/pagination";
import Article from "../article/model";
import Topic from "../topic/model";
import { setCache, deleteCache } from "../../helpers/node-cache";
const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user || await User.findOne({ username: req.params.username }).lean();
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
    const blockStatus = await User.updateOne(
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
    if (blockStatus.modifiedCount === 0) {
      return res
        .status(401)
        .send({ success: false, message: "حدث خطأ أثناء حظر المستخدم" });
    };
    const deleteUnAcceptedCollaborations = await Article.updateOne(
      {
        publisher: { $in: [userIdToBlock, user._id] },
        "collaborators.accepted": false,
        "collaborators.collaborator": { $in: [userIdToBlock, user._id] },
      },
      {
        $pull: {
          collaborators: {
            collaborator: userIdToBlock
          }
        }
      }
    );
    //fix this
    setCache({
      key: userIdToBlock,
      value: [{ _id: String(user._id), username: user.username }],
      ttl: "30-days",
    });
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
    deleteCache(userIdToUnBlock)
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
    const { username, bio, gender, topics } = req.body;
    const files = req.files;

    if (username && user.username !== username) {
      user.username = username;
    };
    if (gender && user.gender !== gender) {
      user.gender !== gender
    };
    if (bio) {
      if (user.bio.title !== bio.title) user.bio.title = bio.title
      if (user.bio.text !== bio.text) user.bio.text = bio.text
    };
    if (Array.isArray(topics) && length > 0) {
      //check the checking
      const newTopics = topics.map(t => t.title.toLowerCase()).toString();
      const oldTopics = user.topics.map(t => t.title.toLowerCase()).toString();
      if (newTopics !== oldTopics) return;
      const checkDb = await Topic.countDocuments({ mainTopic: { $in: topics } });
      if (checkDb !== topics.length)
        return res
          .status(401)
          .send({ success: false, message: "حدث خطأ أثناء تحديث المعلومات" });

      user.topics = topics;
    };
    if (files) {
      if (files.cover) {
        const uploadStatus = uploadSingle(files.cover);
        if (!uploadStatus.success)
          return res
            .status(401)
            .send({ success: false, message: uploadStatus.err });
        user.cover = uploadStatus.path;
      };
      if (files.avatar) {
        const uploadStatus = uploadSingle(files.avatar);
        if (!uploadStatus.success)
          return res
            .status(401)
            .send({ success: false, message: uploadStatus.err });
        user.avatar = uploadStatus.path;
      };
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

export {
  getUser,
  editUser,
  searchUser,
  blockUser,
  unBlockUser,
}