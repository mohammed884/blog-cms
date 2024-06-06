import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SAVED_ARTICLES_KEY, PUBLISHER_ARTICLES_KEY, USER_KEY, FEED_KEY } from "../keys";
import { getPublisherArticles, getSavedArticles, saveArticle, getFeed, publishArticle } from "../api/article";
import { IPublishArticleBody } from "../types/article";
export const getPublisherArticlesQuery = (publisherId: string) => {
    const LIMIT = 5;
    return useInfiniteQuery({
        queryKey: [PUBLISHER_ARTICLES_KEY, { publisherId }],
        queryFn: async (keys) => await getPublisherArticles(publisherId, keys.pageParam),
        getNextPageParam: (lastPage, _, lastPageParam) => {
            const publisherArticlesLength = lastPage.articles.length;
            if (publisherArticlesLength < 1 || publisherArticlesLength < LIMIT) return undefined;
            return lastPageParam + 1;
        },
        initialPageParam: 1,
        enabled: !!publisherId,
        retry: false
    })
};
export const getFeedQuery = () => {
    const LIMIT = 5;
    return useInfiniteQuery({
        queryKey: [FEED_KEY],
        queryFn: async (keys) => await getFeed(keys.pageParam),
        getNextPageParam: (lastPage, _, lastPageParam) => {
            const feedArticlesLength = lastPage.articles.length;
            if (feedArticlesLength < 1 || feedArticlesLength < LIMIT) return undefined;
            return lastPageParam + 1;
        },
        initialPageParam: 1,
        // enabled: !!publisherId,
        retry: false
    })
};
export const getSavedArticlesQuery = (skip: boolean) => {
    return useQuery({
        queryKey: [SAVED_ARTICLES_KEY],
        queryFn: getSavedArticles,
        enabled: skip
    })
};
export const useSaveArticleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { success: boolean, message: string; },
        { success: false, message: string },
        {
            articleId: string,
            action: "save" | "un-save",
            publisherId: string,
            username: string
        }>({
            mutationFn: (data) => saveArticle(data.articleId),
            onMutate: (variables) => {
                if (variables.action === "save") {
                    queryClient.setQueryData([USER_KEY, { username: variables.username }], (data: any) => {
                        data?.user.saved.push({ createdAt: new Date(), article: variables.articleId, _id: variables.articleId })
                    });
                };
            },
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: [SAVED_ARTICLES_KEY] });
                if (variables.action === "un-save") {
                    queryClient.invalidateQueries({ queryKey: [USER_KEY, { username: variables.username }] });
                };
            }
        })
};
export const usePublishArticleMutation = () => {
    return useMutation<{ success: true; title: string }, { success: false, message: string }, IPublishArticleBody>({
        mutationFn: async (data) => await publishArticle(data),
    });
};