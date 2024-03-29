import apiService from '../index';
import { IArticle } from '../../../interfaces/global';
const slice = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getTopArticles: builder.query({
            query: () => ({
                url: "/article/top",
                method: "GET"
            }),
        }),
        getArticle: builder.query<IArticle, { id: string }>({
            query: (body) => ({
                url: `/article/${body.id}`,
                method: "GET"
            }),
        }),
        getFeed: builder.query<{ success: boolean, message?: string, articles: Array<IArticle>, hasMore: boolean }, { page?: number }>({
            query: ({ page }) => ({
                url: `/article/feed?page=${page}`,
                method: "GET",
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                if (!newItems.articles.length) {
                    return {
                        ...currentCache,
                        hasMore: false
                    }
                }
                if (currentCache.articles) {
                    return {
                        ...currentCache,
                        ...newItems,
                        hasMore: true,
                        articles: [...currentCache.articles, ...newItems.articles],
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
        getPublisherArticles: builder.query<{ success: boolean, articles: Array<IArticle>, hasMore: boolean }, { page?: number, publisherId: string }>({
            query: ({ publisherId, page }) => ({
                url: `/article/publisher/${publisherId}?page=${page}`,
                method: "GET"
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return queryArgs.publisherId;
            },
            merge: (currentCache, newItems) => {
                if (!newItems.articles.length) {
                    return {
                        ...currentCache,
                        hasMore: false
                    }
                }
                if (currentCache.articles.length > 0) {
                    return {
                        ...currentCache,
                        ...newItems,
                        hasMore: true,
                        articles: [...currentCache.articles, ...newItems.articles],
                    };
                }
                else return { ...newItems, hasMore: true };
            },
            forceRefetch({ currentArg, previousArg }) {
                if (currentArg?.page === previousArg?.page) return false;
                if (!currentArg?.page || !previousArg?.page) return true;
                if (currentArg.page > previousArg.page) return true;
                else return false;
            },
            providesTags: ["Publisher-Articles"]
        }),
        getSavedArticles: builder.query<{ success: boolean, savedArticles: Array<IArticle>, hasMore: boolean }, {}>({
            query: () => ({
                url: "/article/saved",
                method: "GET"
            }),
            providesTags: ["Saved-Articles"]
        }),
        addArticle: builder.mutation({
            query: (body) => ({
                url: "/article/add",
                method: "POST",
                body
            }),
        }),
        editArticle: builder.mutation({
            query: (body) => ({
                url: `/article/edit/${body.id}`,
                method: "PATCH",
                body
            }),
        }),
        deleteArticle: builder.mutation({
            query: (body) => ({
                url: `/article/delete/${body.id}`,
                method: "DELETE",
                body
            }),
        }),
        searchArticles: builder.query({
            query: (body) => ({
                url: `/article/search?title=${body.title || ""}&&topics=${body.topics || ""}`,
                method: "GET",
            }),
        }),
        saveArticle: builder.mutation<{ success: boolean, message?: string }, { _id: string }>({
            query: (body) => ({
                url: `/article/save/${body._id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Saved-Articles"]
        })
    }),
});
export const {
    useGetTopArticlesQuery,
    useGetArticleQuery,
    useGetFeedQuery,
    useGetPublisherArticlesQuery,
    useAddArticleMutation,
    useEditArticleMutation,
    useDeleteArticleMutation,
    useSearchArticlesQuery,
    useSaveArticleMutation,
    useGetSavedArticlesQuery,
} = slice;
export default slice;