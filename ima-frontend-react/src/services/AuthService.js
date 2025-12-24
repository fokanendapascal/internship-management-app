import publicAxiosInstance from "./PublicAxiosInstance";

const REST_API_AUTH = '/auth';

export const registerUser = (registerRequest) => publicAxiosInstance.post(`${REST_API_AUTH}/register`, registerRequest);

export const loginUser = (loginRequest) => publicAxiosInstance.post(`${REST_API_AUTH}/login`, loginRequest);

export const authenticatedUser = () => publicAxiosInstance.get(`${REST_API_AUTH}/authenticated`); 
