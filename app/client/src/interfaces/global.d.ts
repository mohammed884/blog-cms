export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  gender: "male" | "female";
  birthdate: string;
  confirmed: boolean;
  saved: Array<{
    createdAt: any;
    article: ObjectId;
  }>;
  role: "user" | "admin" | "moderator";
  avatar?: string;
  cover?: string;
  bio?: {
    title?: string;
    text?: string;
  };
  topics: Array<{ title: string }>
  blocked: Array<{
    user: ObjectId,
    createdAt: Date
  }>
}
export interface IArticleList {
  _id: string;
  title: string;
  subTitle: string;
  cover: string;
  publisher?: {
    _id: string;
    username: string;
    avatar: string;
  };
  readTime: number;
  createdAt: Date;
};
export interface ITopic {
  _id: string;
  title: string;
  subTopics?: Array<{ _id: string, title: string, createdAt: Date }>;
  createdAt?: Date;
};
export interface INotification {
  sender: {
    _id: string;
    username: string;
    avatar?: string;
  };
  retrieveId: string;
  article?: {
    cover: string;
    title: string;
  },
  seen: boolean;
  type:
  "follow" |
  "comment" |
  "reply" |
  "collaboration-request" |
  "collaboration-accept" |
  "collaboration-deny";
  createdAt: Date,
  isFollowingYou?: boolean;
  youFollowing?: boolean;
};
export interface IFollowing {
  user: {
    _id: string,
    username: string,
    avatar: string,
    bio: {
      _id: string;
      text: string;
    };
  };
  followedBy: string;
  createdAt: Date;
  isFollowingYou: boolean;
  youFollowing: boolean;
  bio: {
    _id: string;
    text: string
  }
}
export interface IFollower {
  user: string;
  followedBy: {
    _id: string;
    username: string;
    avatar: string;
    bio: {
      _id: string;
      text: string;
    };
  };
  createdAt: Date,
  isFollowingYou: boolean;
  youFollowing: boolean;
};
export interface IBlockedUser {
  _id: string;
  username: string;
  avatar: string;
}