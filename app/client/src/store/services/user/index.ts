import apiService from "../index";
import { INotification } from "../../../interfaces/global";
const slice = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => ({
                url: "/user/profile",
                method: "GET",
            }),
            providesTags: ["User"]
        }),
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
        }),
        getUnSeenNotifications: builder.query<{ success: boolean, count: number }, {}>({
            query: () => ({
                url: `/user/notifications/count`,
                method: "GET"
            }),
        }),
        getUser: builder.query({
            query: (body) => ({
                url: `/user/${body.username}`,
                method: "GET",
            }),
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
    useGetProfileQuery,
    useGetNotificationsQuery,
    useGetUnSeenNotificationsQuery,
    useGetUserQuery,
    useEditProfileMutation
} = slice;
export const userProfileSelector = (apiService.endpoints as any).getProfile.select({});
