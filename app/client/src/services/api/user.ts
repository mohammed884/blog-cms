import { IBlockedUser, INotification, IUser } from "../../interfaces/global";
import axios from "../axiosInstance";
import { IGetUserSuccess } from "../types/user";
export const getUser = async (username: string) => {
    return (await axios.get<IGetUserSuccess>(`/user/${username}`, { withCredentials: true })).data;
};
export const followUser = async (username: string) => {
    return (await axios.post(`/user/follow/${username}`)).data;
};
export const unfollowUser = async (username: string) => {
    return (await axios.post(`/user/unfollow/${username}`)).data;
};
export const editUser = async (userData: IUser) => {
    return (await axios.patch("/user/edit", { userData })).data;
};
export const deleteUser = async () => {
    return (await axios.delete("/user/delete")).data;
};
export const searchUsers = async (username: string) => {
    return (await axios.get(`/user/search?username=${username}`)).data;
};
export const getNotifications = async (page: number) => {
    return (await axios.get<{
        success: boolean;
        notifications: Array<INotification>;
        receiver: string;
        message?: string;
    }>(`/user/notifications?page=${page}`, { withCredentials: true })).data;
};
export const getUnSeenNotificationsCount = async () => {
    return (await axios.get<{
        success: boolean,
        count: number
    }>("/user/notifications/count/unseen", { withCredentials: true })).data;
};
export const markNotificationAsReaded = async (retrieveId: string) => {
    return (
        await axios.patch(
            `/user/notifications/mark-as-readed/${retrieveId}`,
            {}, { withCredentials: true }
        )
    ).data;
};
export const getBlockedUsers = async () => {
    return (
        (await axios.get<{ blockedUsers: Array<IBlockedUser>, success: boolean }>("/user/blocked", { withCredentials: true })).data
    )
};
export const handleBlockActions = async (userId: string, action: "block" | "un-block") => {
    return (
        action === "block" ?
            (
                await axios.patch<{
                    message: string,
                    success: boolean
                }>
                    (`/user/block/${userId}`, {}, { withCredentials: true })).data
            :
            (
                (await axios.patch<{
                    message: string,
                    success: boolean
                }>
                    (`/user/unblock/${userId}`, {}, { withCredentials: true })).data
            )
    )
};