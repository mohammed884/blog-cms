import axios from "../axiosInstance";
import { IArticleList } from "../../interfaces/global"
export const getFeed = async (page: number): Promise<{ success: boolean, articles: Array<IArticleList>, message?: string }> => {
    return (
        (await axios.get<{ success: boolean, articles: Array<IArticleList>, message?: string }>(`/article/feed?page=${page}`)).data
    )
};
export const getTopArticles = async (): Promise<Array<IArticleList>> => {
    return (
        (await axios.get("/article/top")).data
    )
};
export const getArticle = async (id: string): Promise<IArticleList> => {
    return (
        (await axios.get(`/article/${id}`)).data
    )
};
export const getPublisherArticles = async (publisherId: string, page: number): Promise<{ success: boolean, articles: Array<IArticleList>, message?: string, }> => {
    return (
        (await axios.get<{
            success: boolean, articles: Array<IArticleList>, message?: string,
        }>(`/article/publisher/${publisherId}?page=${page}`)).data
    )
};
export const getSavedArticles = async () => {
    return (
        (await axios.get<{
            success: boolean,
            articles: Array<IArticleList>,
            message?:
            string,
        }>("/article/saved", { withCredentials: true })).data
    )
};
export const saveArticle = async (id: string) => {
    return (
        (await axios.patch(`/article/save/${id}`, {}, { withCredentials: true })).data
    )
};
// export const publishArticle = async (data) => {
//     return (
//         (await axios.post("/article/publish", { data }, { withCredentials: true })).data
//     )
// };
export const editArticle = async (id: string) => {
    return (
        (await axios.patch(`/article/edit/${id}`)).data
    )
};
export const deleteArticle = async () => {
    return (
        (await axios.get("/article/saved")).data
    )
};
export const searchArticles = async (title: string, topics: Array<string>) => {
    return (
        (await axios.get(`/article/search?title=${title || ""}&&topics=${topics || ""}`)).data
    );
};