import User from "./model";
import { Request, Response } from "express";
import { uploadSingle } from "../../helpers/fileopreations";
import pagination from "../../helpers/pagination";
import Article from "../article/models/article";
import Topic from "../topic/model";
import { formatDateToYMD } from "../../helpers/date";
import { delCache, getOrSetCache, redisClient } from "../../redis-cache";
import { USER_BLOCKED_ID_KEY, USER_ID_KEY, USER_USERNAME_KEY } from "../../redis-cache/keys";
import { USER_BLOCKED_CACHE_EXPIARY, USER_CACHE_EXPIARY } from "../../redis-cache/expiries";
import { requestSenderAndReciverFollowingStatus } from "../../helpers/follow";
// const getProfile = async (req: Request, res: Response) => {
//   try {
//     const user = req.user;
//     res.status(201).send({ success: true, user })
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ success: false, message: "Internal server error" })

//   };
// };
const getBlockedUsers = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const blockedUsersIds = user.blocked.map(block => block.user);
    const cacheCb = async () => {
      return (
        await User.find({ _id: { $in: blockedUsersIds } }).select("username avatar")
      )
    }
    const blockedUsers = await getOrSetCache(
      redisClient,
      `${USER_BLOCKED_ID_KEY}=${user._id}`,
      cacheCb,
      USER_BLOCKED_CACHE_EXPIARY,
    );
    res.status(201).send({ success: true, blockedUsers })
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" })
  }
}
const getUser = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const requestSender = req.user;
    const requestReciver = req.requestReciver;

    const isSameUser =
      requestSender?._id === requestReciver?._id
      ||
      (!requestReciver && requestSender && true);
    if (isSameUser && username === "profile") {
      return res.status(201).send({
        success: true,
        isSameUser: true,
        isLoggedIn: true,
        user: requestSender,
      })
    }
    const followingStatus =
      !isSameUser
      &&
      (!!requestSender && !!requestReciver)
      && await requestSenderAndReciverFollowingStatus(requestSender._id, requestReciver._id);

    const getRequestReciverInfo = async () => {
      return await User.findOne({ username }).select("-password").lean();
    }
    const user = isSameUser ? requestSender : (
      req.requestReciver && await getOrSetCache(
        redisClient, `${USER_USERNAME_KEY}=${username}`,
        getRequestReciverInfo,
        USER_CACHE_EXPIARY,
      ))
    if (!user) {
      return res.status(401).send({ success: false, message: "لم يتم العثور على المستخدم" })
    }
    if (isSameUser) {
      res.status(201).send({
        success: true,
        isSameUser: true,
        isLoggedIn: true,
        user,
      })
    } else {
      res.status(201).send({
        success: true,
        isSameUser: false,
        isLoggedIn: !!requestSender,
        user,
        youFollowing: followingStatus.youFollowing,
        isFollowingYou: followingStatus.isFollowingYou,
      })
    }
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
    const blockStatus = await User.updateOne(
      { _id: user._id, "blocked.user": { $ne: userIdToBlock } },
      {
        $push: {
          blocked: {
            user: userIdToBlock,
            createdAt: formatDateToYMD(new Date(), "_"),
          }
        }
      }
    );
    if (blockStatus.modifiedCount === 0) {
      return res
        .status(401)
        .send({ success: false, message: "حدث خطأ أثناء حظر المستخدم" });
    };
    await Article.updateOne(
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
    await delCache(redisClient, `${USER_ID_KEY}=${user._id}`)
    await delCache(redisClient, `${USER_USERNAME_KEY}=${user.username}`)
    await delCache(redisClient, `${USER_BLOCKED_ID_KEY}=${user._id}`)
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
    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      {
        $pull: {
          blocked: {
            user: userIdToUnBlock
          }
        }
      }
    );
    if (updatedUser) {
      return res
        .status(401)
        .send({ success: false, message: "حدث خطأ أثناء فك الحظر على المستخدم" });
    }
    await delCache(redisClient, `${USER_ID_KEY}=${user._id}`)
    await delCache(redisClient, `${USER_USERNAME_KEY}=${user.username}`)
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
const editProfile = async (req: Request, res: Response) => {
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
      const oldTopics = user.topics.map(t => t.toLowerCase()).toString();
      if (newTopics === oldTopics) return;
      const areTopicsValid = await Topic.countDocuments({ title: { $in: topics } });
      if (areTopicsValid !== topics.length)
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
  // getProfile,
  getBlockedUsers,
  getUser,
  editProfile,
  searchUser,
  blockUser,
  unBlockUser,
}