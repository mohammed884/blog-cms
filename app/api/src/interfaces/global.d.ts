import { ObjectId } from "bson";
export interface IUser {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  gender: "male" | "female";
  birthdate: string;
  confirmed: boolean;
  saved: Array<{ createdAt: Date; article: ObjectId }>;
  save?: () => {};
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
  _id: ObjectId;
  title: string;
  publisher: ObjectId;
  content: object;
  topics: Array<{ mainTopic: string; subTopic?: string }>;
  estimatedReadTime: string;
  savedCount: number;
  cover?: string;
  save: () => {};
}
declare module 'express' {
  interface Request {
    user: IUser;
    requestedUser: IUser;
    article: IArticle;
  }
}

