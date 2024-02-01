import apiService from "..";
import { ITopic } from '../../../interfaces/global';
interface IGetTopicsProps {
    success: boolean;
    message?: string;
    topics: Array<ITopic>;
}
const slice = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getTopics: builder.query<IGetTopicsProps, {}>({
            query: () => ({
                url: "/topics",
                method: "GET"
            })
        }),
        addTopic: builder.mutation({
            query: (body) => ({
                url: "/topics",
                method: "POST",
                body
            })
        }),
        addMultipleTopic: builder.mutation({
            query: (body) => ({
                url: "/topics/multiple",
                method: "POST",
                body
            })
        }),
        editTopic: builder.mutation({
            query: (body) => ({
                url: "/topics",
                method: "PATCH",
                body
            })
        }),
        deleteTopic: builder.mutation({
            query: (body) => ({
                url: "/topics",
                method: "DELETE",
                body
            })
        }),
        deleteSubTopic: builder.mutation({
            query: (body) => ({
                url: "/topics/sub",
                method: "DELETE",
                body
            })
        }),
    })
});
export const selectTopics = (apiService.endpoints as any).getTopics.select({});
export const {
    useGetTopicsQuery,
    useAddTopicMutation,
    useAddMultipleTopicMutation,
    useEditTopicMutation,
    useDeleteTopicMutation,
    useDeleteSubTopicMutation
} = slice;