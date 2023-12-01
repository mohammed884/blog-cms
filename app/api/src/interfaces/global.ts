import { Request } from "express";
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
  save: () => {};
  role: "user" | "admin" | "moderator";
  avatar?: string;
  cover?: string;
  bio?: {
    title?: string;
    text?: string;
  }
}
export interface IRequestWithUser extends Request {
  user: IUser;
}
export interface IArticle {
  _id: ObjectId;
  title: string;
  publisher: ObjectId;
  content: object;
  topics: Array<{ _id: ObjectId }>;
  estimatedReadTime: string;
  likesCount: number;
  commentsCount: number;
  savedCount: number;
  cover?: string;
  save: () => {};
  // remove: () => {};
}
export interface IRequestWithArticle extends Request {
  user: IUser;
  article: IArticle;
}
export interface ISendEmailRequest extends Request {
  user: IUser;
}
