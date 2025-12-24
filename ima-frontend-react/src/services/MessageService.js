import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_MESSAGES = '/messages';

export const listMessages = (page, size) => 
    securedAxiosInstance.get(`${REST_API_MESSAGES}?page=${page}&size=${size}`);

export const getMessage = (messageId) => 
    securedAxiosInstance.get(`${REST_API_MESSAGES}/${messageId}`);

export const createMessage = (messageRequest) => 
    securedAxiosInstance.post(`${REST_API_MESSAGES}`, messageRequest);

export const updateMessage = (messageId, messageRequest) => 
    securedAxiosInstance.put(`${REST_API_MESSAGES}/${messageId}`, messageRequest);

export const deleteMessage = (messageId) => 
    securedAxiosInstance.delete(`${REST_API_MESSAGES}/${messageId}`);