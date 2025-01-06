import axios from "axios";

const instance = axios.create({
    baseURL: "http://ec2-13-61-15-101.eu-north-1.compute.amazonaws.com:3000/",
    headers: {
        accept: 'application/json'
    }
})

export default instance;