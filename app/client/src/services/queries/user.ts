import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, getNotifications, getUnSeenNotificationsCount } from "../api/user";
import { IUser } from "../../interfaces/global"
import { NOTIFICATIONS_QUERY_KEY, UNSEEN_NOTIFICATIONS_COUNT, USER_QUERY_KEY } from "../keys";
interface IUserSelector {
    data: {
        success: boolean;
        isLoggedIn: boolean;
        isSameUser: boolean;
        youFollowing: boolean;
        isFollowingYou: boolean;
        user: IUser;
    };
    isLoading: false;
    isError: false;
}
export const getUserQuery = (username: string) => {
    return useQuery({
        queryKey: [USER_QUERY_KEY, { username }],
        queryFn: async () => await getUser(username),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};
export const getNotificationsQuery = () => {
    return useInfiniteQuery({
        queryKey: [NOTIFICATIONS_QUERY_KEY],
        queryFn: async (keys) => await getNotifications(keys.pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages, lastPageParam) => {
            if (lastPage.notifications.length < 1) return undefined;
            return lastPageParam + 1
        },
    })
};
export const getUnSeenNotificationsQuery = (loggedIn: boolean) => {
    return useQuery({
        queryKey: [UNSEEN_NOTIFICATIONS_COUNT],
        queryFn: async () => {
            const data = await getUnSeenNotificationsCount();
            return data;
        },
        refetchOnWindowFocus: true,
        enabled: loggedIn,
    });
}
export const userSelector = (username: string) => {
    const queryClient = useQueryClient();
    const userData = queryClient.getQueryData<IUserSelector>([
        USER_QUERY_KEY,
        { username },
    ]);
    return userData
};