import { Request } from "express";
import {ObjectId} from "bson"
export interface IUser {
    _id:ObjectId,
    name:string,
    email: string,
    password: string,
    gender: "male" | "female",
    birthdate: string,
    confirmed: boolean,
    saved:Array<{createdAt:Date,article:ObjectId}>,
    save:()=> {},
    role:"user" | "admin" | "moderator"
};
export interface IRequestWithUser extends Request {
    user:IUser,
}
export interface IArticle {
    _id:ObjectId,
    title:string,
    publisher: ObjectId,
    content: object,
    interests: ObjectId[],
    estimatedReadTime: string,
    createdAt: Date,
    likesCount:number,
    commentsCount:number,
    savedCount:number,
}
export interface IRequestWithArticle extends Request {
    user: IUser,
    article:IArticle,
};