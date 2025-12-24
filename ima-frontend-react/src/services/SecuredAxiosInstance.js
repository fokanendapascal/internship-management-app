import axios from "axios";

const securedAxiosInstance = axios.create({
    baseURL: "http://localhost:8090/api/v1"
});

securedAxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token && token !== null && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("Token envoyé au serveur :", token);
        return config;
    },
    (error) => Promise.reject(error)
);

export default securedAxiosInstance;
