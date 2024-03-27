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
export interface IArticle {
  _id: string;
  title: string;
  subTitle: string;
  cover: string;
  publisher?: {
    _id: String;
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