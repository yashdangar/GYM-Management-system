import axios from "axios";

const instance = axios.create({
    baseURL: "https://gym.mybackends.xyz/",
    headers: {
        accept: 'application/json'
    }
})

export default instance;