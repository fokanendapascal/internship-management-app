import axios from "axios";

const securedAxiosInstance = axios.create({
    baseURL: 'http://localhost:8090/api/v1'
});

securedAxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if(token && token !== null && token !== 'undefined'){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

export default securedAxiosInstance;