import { ObjectId } from "bson";
export interface IUser {
  id?: string;
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  gender?: "male" | "female";
  birthdate?: string;
  confirmed: boolean;
  saved: Array<{
    createdAt: any;
    article: ObjectId;
  }>;
  save?: () => Promise<{}>;
  role: "user" | "admin" | "moderator";
  avatar?: string;
  cover?: string;
  bio?: {
    title?: string;
    text?: string;
  };
  topics: Array<string>
  blocked: Array<{
    user: ObjectId,
    createdAt: Date
  }>
}
export interface IArticle {
  _id: ObjectId;
  title: string;
  subTitle: string;
  publisher: ObjectId;
  content: object;
  topics: Array<{ mainTopic: string; subTopic?: string }>;
  estimatedReadTime: string;
  savedCount: number;
  cover?: string;
  save?: () => Promise<{}>;
  createdAt?: Date;
}
declare module 'express' {
  interface Request {
    user: IUser;
    requestedUser: IUser;
    article: IArticle;
  }
}

