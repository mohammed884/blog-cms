import { Request } from "express";
import { IUser } from "./global";
export interface ILoginBody {
    email: string,
    password: string,
}
export interface IRegisterBody extends ILoginBody {
    name:string,
    gender: "male | female",
    birthdate: string,
}
export interface ISendEmailRequest extends Request {
    user:IUser,
}