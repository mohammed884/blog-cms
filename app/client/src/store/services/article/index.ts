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
        getFeed: builder.query<Array<IArticle>, {}>({
            query: () => ({
                url: "/article/feed",
                method: "GET"
            }),
        }),
        getPublisherArticles: builder.query<Array<IArticle>, { publisherId: string }>({
            query: (body) => ({
                url: `/article/publisher/${body.publisherId}`,
                method: "GET"
            }),
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
        saveArticle: builder.mutation({
            query: (body) => ({
                url: `/article/save/${body.id}`,
                method: "PATCH",
                body
            }),
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
} = slice;
export default slice;