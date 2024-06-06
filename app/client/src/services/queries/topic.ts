import { useQuery } from "@tanstack/react-query"
import { getTopics, searchTopics } from "../api/topic"
import { TOPICS_KEY, TOPICS_SEARCH_KEY } from "../keys"
export const getTopicsQuery = () => {
    return useQuery({
        queryKey: [TOPICS_KEY],
        queryFn: getTopics,
    })
};
export const searchTopicsQuery = (title: string) => {
    return useQuery({
        queryKey: [TOPICS_SEARCH_KEY, { title }],
        queryFn: async () => await searchTopics(title),
        enabled: !!title
    })
}