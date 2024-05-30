import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, getBlockedUsers, getNotifications, getUnSeenNotificationsCount, markNotificationAsReaded, handleBlockActions } from "../api/user";
import { IUser } from "../../interfaces/global"
import { NOTIFICATIONS_KEY, UNSEEN_NOTIFICATIONS_COUNT, USER_KEY, BLOCKED_USERS_KEY } from "../keys";
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
        queryKey: [USER_KEY, { username }],
        queryFn: async () => await getUser(username),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false
    });
};
export const getNotificationsQuery = () => {
    return useInfiniteQuery({
        queryKey: [NOTIFICATIONS_KEY],
        queryFn: async (keys) => await getNotifications(keys.pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (lastPage.notifications.length < 1) return undefined;
            return lastPageParam + 1
        },
        retry: false
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
        USER_KEY,
        { username },
    ]);
    return userData
};
export const useMarkNotificationAsReadedMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean, username: string; }, { success: false, message: string }, { retrieveId: string, pageIndex: number, notificationIndex: number }>({
        mutationFn: ({ retrieveId }) => markNotificationAsReaded(retrieveId),
        onMutate: ({ pageIndex, notificationIndex }) => {
            queryClient.setQueryData([NOTIFICATIONS_KEY], (data: any) => {
                data.pages[pageIndex].notifications[notificationIndex].seen = true;
            })
        }
    })
};
export const useBlockUserActionsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean, message: string; }, { success: boolean, message: string }, { userId: string, action: "block" | "un-block", blockIndex?: number; }>({
        mutationFn: async ({ userId, action }) => {
            const data = await handleBlockActions(userId, action);
            console.log(data);

            return data;
        },
        onMutate: ({ userId, action }) => {
            if (action === "un-block") {
                queryClient.setQueryData([BLOCKED_USERS_KEY], (data: any) => {
                    const updatedList = data.blockedUsers.filter((block: { _id: string }) => block._id !== userId)
                    if (data) {
                        return {
                            ...data,
                            blockedUsers: updatedList
                        }
                    }
                })
            }
        },
    })
}
export const getBlockedUsersQuery = () => {
    return useQuery({
        queryKey: [BLOCKED_USERS_KEY],
        queryFn: getBlockedUsers,
    })
};