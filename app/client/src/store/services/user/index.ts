import apiService from "../index";
import { INotification, IUser } from "../../../interfaces/global";
const slice = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<{ success: boolean, notifications: Array<INotification>, hasMore: boolean }, { page?: number }>({
            query: ({ page }) => ({
                url: `/user/notifications?page=${page}`,
                method: "GET"
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                if (!newItems.notifications.length) {
                    return {
                        ...currentCache,
                        hasMore: false
                    }
                }
                if (currentCache.notifications) {
                    return {
                        ...currentCache,
                        ...newItems,
                        hasMore: true,
                        articles: [...currentCache.notifications, ...newItems.notifications],
                    };
                }
                else return { ...newItems, hasMore: true };
            },
            forceRefetch({ currentArg, previousArg }) {
                if (!currentArg?.page || !previousArg?.page) return true;
                if (currentArg.page > previousArg.page) return true;
                else return false;
            },
            providesTags: ["Notifications"]
        }),
        getUnSeenNotifications: builder.query<{ success: boolean, count: number }, {}>({
            query: () => ({
                url: `/user/notifications/count`,
                method: "GET"
            }),
        }),
        getUser: builder.query<{
            success: boolean,
            isSameUser: boolean,
            isLoggedIn: boolean,
            user: IUser
            isFollowingYou?: boolean,
            youFollowing?: boolean,
        }, { username: string }>
            ({
                query: (body) => ({
                    url: `/user/${body.username}`,
                    method: "GET",
                }),
                providesTags: ["User"]
            }),
        editProfile: builder.mutation({
            query: (body) => ({
                url: "/user/edit",
                method: "POST",
                body,
            }),
        }),
    }),
})
export const {
    useGetNotificationsQuery,
    useGetUnSeenNotificationsQuery,
    useGetUserQuery,
    useEditProfileMutation
} = slice;
export const selectUser = (apiService.endpoints as any).getUser.select({});
// export const selectUser = createSelector(
//     (state) => {
//         console.log(state.api.queries.getUser.select({}))
//     }
//     , // Access query result from state
//     (data) => {
//         if (!data) return null; // Handle cases where data is not available

//         return {
//             success: data.success,
//             isSameUser: data.isSameUser,
//             isLoggedIn: data.isLoggedIn,
//             user: data.user,
//             isFollowingYou: data.isFollowingYou,
//             youFollowing: data.youFollowing,
//         };
//     }
// );
// export const userSelector = (apiService.endpoints as any).getUser.select({});
