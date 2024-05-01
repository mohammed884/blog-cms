import { useQueryClient, useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { followMutation, getFollowers, getFollowersCount, getFollowing, getFollowingCount } from "../api/follow"
import { FOLLOWERS_QUERY_KEY, NOTIFICATIONS_QUERY_KEY, FOLLOWING_QUERY_KEY, FOLLOWING_COUNT_QUERY_KEY, FOLLOWERS_COUNT_QUERY_KEY, USER_QUERY_KEY } from "../keys";
import { IFollowErrorBody, IFollowData } from "../types/follow";
export const useFollowMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean, message: string; }, IFollowErrorBody, IFollowData>({
        mutationFn: async ({ userId, action }) => {
            const data = await followMutation({ userId, action });
            return data;
        },
        onMutate: ({ action, ownerUsername, }) => {
            console.log(ownerUsername);
            if (ownerUsername) {

                queryClient.setQueryData([USER_QUERY_KEY, { username: ownerUsername }], (data: any) => {
                    console.log("data before", data);

                    if (action === "follow") {
                        data = {
                            ...data,
                            youFollowing: true
                        };
                        console.log("data after", data);
                        return data;
                    } else {
                        data = {
                            ...data,
                            youFollowing: false
                        };
                        console.log("data after", data);
                        return data
                    }
                })
            }
        },
        onSuccess: (response, { ownerId, ownerUsername }) => {
            if (!ownerUsername) {
                const query = queryClient.getQueryCache().findAll().filter(query =>
                (
                    query.queryKey[0] === USER_QUERY_KEY
                    &&
                    (query.queryKey[1] as any)?.username !== "profile")

                );
                queryClient.invalidateQueries({ queryKey: query[0].queryKey })
            }
            queryClient.invalidateQueries({ queryKey: [FOLLOWERS_QUERY_KEY, { id: ownerId }] })
            queryClient.invalidateQueries({ queryKey: [FOLLOWING_QUERY_KEY, { id: ownerId }] })
            queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
            return response;
        },
    });
};
export const getFollowersQuery = (id: string) => {
    return useInfiniteQuery({
        queryKey: [FOLLOWERS_QUERY_KEY, { id }],
        queryFn: async (keys) => await getFollowers(id, keys.pageParam),
        enabled: !!id,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages, lastPageParam) => {
            if (lastPage.followers.length < 1) return undefined;
            return lastPageParam + 1
        },
    })
};
export const getFollowingQuery = (id: string) => {
    return useInfiniteQuery({
        queryKey: [FOLLOWING_QUERY_KEY, { id }],
        queryFn: async (keys) => await getFollowing(id, keys.pageParam),
        enabled: !!id,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages, lastPageParam) => {
            if (lastPage.following.length < 1) return undefined;
            return lastPageParam + 1
        },
    })
}
export const getFollowersCountQuery = (id: string) => {
    return useQuery({
        queryKey: [FOLLOWERS_COUNT_QUERY_KEY, { id }],
        queryFn: async () => await getFollowersCount(id),
        enabled: !!id,
    })
}
export const getFollowingCountQuery = (id: string) => {
    return useQuery({
        queryKey: [FOLLOWING_COUNT_QUERY_KEY, { id }],
        queryFn: async () => await getFollowingCount(id),
        enabled: !!id,
    })
}