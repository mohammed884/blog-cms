import { ITopic } from "../../interfaces/global";
import axios from "../axiosInstance";
export const getTopics = async () => {
    return (
        (await (axios.get<{ sucess: boolean, topics: Array<ITopic> }>("/topics"))).data
    )
};