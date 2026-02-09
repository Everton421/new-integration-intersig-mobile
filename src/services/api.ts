import axios from "axios";

const baseURL = process.env.API_URL
const token = process.env.API_TOKEN

export const api = axios.create({
    baseURL: baseURL,
        headers:{
            token: token
        }
})