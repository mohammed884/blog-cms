import { IFollower, IFollowing } from "../../interfaces/global";
import axios from "../axiosInstance";
export const followMutation = async ({ userId, action }: { userId: string, action: "follow" | "un-follow" }) => {
    return (
        (
            await axios.patch(`/user/follow/${userId}?action=${action}`,
                {},
                { withCredentials: true })
        ).data
    )
};
export const getFollowers = async (id: string, page: number) => {
    return (await axios<{
        success: boolean,
        followers: Array<IFollower>
    }>(`/user/followers/${id}?page=${page}`, { withCredentials: true })).data
};
export const getFollowing = async (id: string, page: number) => {
    return (await axios<{
        success: boolean,
        following: Array<IFollowing>
    }>(`/user/following/${id}?page=${page}`, { withCredentials: true })).data
}
export const getFollowersCount = async (id: string) => {
    return (await axios<{
        success: boolean,
        count: number
    }>(`/user/count/followers/${id}`, { withCredentials: true })).data
}
export const getFollowingCount = async (id: string) => {
    return (await axios<{ success: boolean, count: number }>(`/user/count/following/${id}`)).data
}