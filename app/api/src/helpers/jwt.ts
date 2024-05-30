import jwt from "jsonwebtoken";
import User from "../domains/user/model";
import { IUser } from "../interfaces/global";
const JWT_SECRET = process.env.JWT_SECRET;
interface verifyInterface {
    success: boolean,
    err?: string
    decoded?: { _id: string, iat: number, exp: number }
}
export const signAccessToken = (_id: string, options: object = { expiresIn: "30d" }) => {
    try {
        return jwt.sign({ _id }, JWT_SECRET, options);
    } catch (err) {
        console.log("JWT error during singing a toke", err);
    }
}
export const verifyToken = (token: string): verifyInterface => {
    try {
        let result: verifyInterface;
        jwt.verify(token, JWT_SECRET, (err, decoded: { _id: string, iat: number, exp: number }) => {
            if (err) return result = { ...result, success: false, err: err.message };
            return result = { ...result, success: true, decoded }
        });
        return result;
    } catch (err) {
        if (err) {
            console.log(err);
            return { success: true, err: err }
        }
    }
};
export const getUserFromToken = async (token: string | "_", _id?: string, populateArticles?: boolean): Promise<null | IUser> => {
    const userId = token === "_" ? _id : (verifyToken(token)).decoded._id;
    if (!userId) return null;
    // const pipline: Array<PipelineStage> = [
    //     { $match: { _id: new ObjectId(userId) } },
    //     {
    //         $project: {
    //             password: 1
    //         },
    //     },
    //     {
    //         $lookup: {
    //             from: 'articles',
    //             localField: 'saved.article',
    //             foreignField: '_id',
    //             as: 'saved',
    //             pipeline: [
    //                 {
    //                     $project: {
    //                         title: 1,
    //                         subTitle: 1,
    //                         cover: 1
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $unwind: '$saved'
    //     },
    //     {
    //         $lookup: {
    //             from: 'articles',
    //             localField: 'saved.author',
    //             foreignField: '_id',
    //             as: 'saved.author',
    //             pipeline: [
    //                 {
    //                     $project: {
    //                         username: 1,
    //                         avatar: 1,
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // ]
    // console.log(pipline);

    const user = await User.findById(userId).select("-password");

    // ?
    // await User.aggregate(pipline) as any
    // :
    return user
};
