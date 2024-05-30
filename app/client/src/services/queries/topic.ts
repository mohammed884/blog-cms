import { useQuery } from "@tanstack/react-query"
import { getTopics } from "../api/topic"
import { TOPICS_KEY } from "../keys"
export const getTopicsQuery = () => {
    return useQuery({
        queryKey: [TOPICS_KEY],
        queryFn: getTopics,
    })
}