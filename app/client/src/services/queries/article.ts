import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SAVED_ARTICLES_KEY, PUBLISHER_ARTICLES_KEY, USER_QUERY_KEY } from "../keys";
import { getPublisherArticles, getSavedArticles, saveArticle } from "../api/article"
export const getPublisherArticlesQuery = (publisherId: string) => {
    return useInfiniteQuery({
        queryKey: [PUBLISHER_ARTICLES_KEY, { publisherId }],
        queryFn: async (keys) => await getPublisherArticles(publisherId, keys.pageParam),
        getNextPageParam: (lastPage, pages, lastPageParam) => {
            if (lastPage.articles.length < 1) return undefined;
            return lastPageParam + 1;
        },
        initialPageParam: 1,
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
                    queryClient.setQueryData([USER_QUERY_KEY, { username: variables.username }], (data: any) => {
                        data?.user.saved.push({ createdAt: new Date(), article: variables.articleId, _id: variables.articleId })
                    });
                };
            },
            onSuccess: (response, variables) => {
                queryClient.invalidateQueries({ queryKey: [SAVED_ARTICLES_KEY] });
                if (variables.action === "un-save") {
                    queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, { username: variables.username }] });
                };
            }
        })
}