import { useQueryClient, useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { followMutation, getFollowers, getFollowersCount, getFollowing, getFollowingCount } from "../api/follow"
import { FOLLOWERS_KEY, NOTIFICATIONS_KEY, FOLLOWING_KEY, FOLLOWING_COUNT_KEY, FOLLOWERS_COUNT_KEY, USER_KEY } from "../keys";
import { IFollowErrorBody, IFollowData } from "../types/follow";
export const useFollowMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean, message: string; }, IFollowErrorBody, IFollowData>({
        mutationFn: async ({ userId, action }) => {
            const data = await followMutation({ userId, action });
            return data;
        },
        onMutate: ({ action, ownerUsername, ownerId, viewerId }) => {
            if (ownerUsername) {
                queryClient.setQueryData([USER_KEY, { username: ownerUsername }], (data: any) => {
                    data = {
                        ...data,
                        youFollowing: action === "follow" ? true : false
                    };
                    return data;
                })
            };
            const countQuery = viewerId !== ownerId ?
                [FOLLOWERS_COUNT_KEY, { id: ownerId }]
                :
                [FOLLOWING_COUNT_KEY, { id: viewerId }]
            queryClient.setQueryData(
                countQuery,
                (data: any) => {
                    data.count = action === "follow" ? data.count + 1 : data.count - 1;
                })
        },
        onSuccess: (response, { ownerId, ownerUsername }) => {
            if (!ownerUsername) {
                const query = queryClient.getQueryCache().findAll().filter(query =>
                (
                    query.queryKey[0] === USER_KEY
                    &&
                    (query.queryKey[1] as any)?.username !== "profile")

                );
                queryClient.invalidateQueries({ queryKey: query[0].queryKey })
            }
            queryClient.invalidateQueries({ queryKey: [FOLLOWERS_KEY, { id: ownerId }] })
            queryClient.invalidateQueries({ queryKey: [FOLLOWING_KEY, { id: ownerId }] })
            queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
            return response;
        },
    });
};
export const getFollowersQuery = (id: string) => {
    const LIMIT = 5;
    return useInfiniteQuery({
        queryKey: [FOLLOWERS_KEY, { id }],
        queryFn: async (keys) => await getFollowers(id, keys.pageParam),
        enabled: !!id,
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            const followersLength = lastPage.followers.length;
            if (followersLength < 1 || followersLength < LIMIT) return undefined;
            return lastPageParam + 1
        },
    })
};
export const getFollowingQuery = (id: string) => {
    const LIMIT = 5;
    return useInfiniteQuery({
        queryKey: [FOLLOWING_KEY, { id }],
        queryFn: async (keys) => await getFollowing(id, keys.pageParam),
        enabled: !!id,
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            const followingLength = lastPage.following.length;
            if (followingLength < 1 || followingLength < LIMIT) return undefined;
            return lastPageParam + 1
        },
    })
}
export const getFollowersCountQuery = (id: string) => {
    return useQuery({
        queryKey: [FOLLOWERS_COUNT_KEY, { id }],
        queryFn: async () => await getFollowersCount(id),
        enabled: !!id,
        retry: false
    })
}
export const getFollowingCountQuery = (id: string) => {
    return useQuery({
        queryKey: [FOLLOWING_COUNT_KEY, { id }],
        queryFn: async () => await getFollowingCount(id),
        enabled: !!id,
    })
}