import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL
const instance = axios.create({
    baseURL: BASE_URL,
    //   headers: {
    //  Authorization: `<Your Auth Token>`,
    //     Content-Type: "application/json",
    //     timeout : 1000,
    //   }, 
    // .. other options
});

export default instance;
