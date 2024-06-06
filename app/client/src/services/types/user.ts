import { IUser } from "../../interfaces/global"
export interface IGetUserSuccess {
    success: boolean,
    isLoggedIn: boolean,
    isSameUser: boolean,
    user: IUser,
    youFollowing: boolean;
    isFollowingYou: boolean;
};
export interface IGetUserError {
    response: {
        data: {
            success: boolean;
            isBlocked: boolean;
            message: string;
        }
    }
}