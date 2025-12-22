import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_NOTIFICATIONS = '/notifications';

export const listNotifications = () => securedAxiosInstance.get(`${REST_API_NOTIFICATIONS}`);

export const getNotification = (notificationId) => 
    securedAxiosInstance.get(`${REST_API_NOTIFICATIONS}/${notificationId}`);

export const updateNotification = (notificationId, notificationRequest) => 
    securedAxiosInstance.put(`${REST_API_NOTIFICATIONS}/${notificationId}`, notificationRequest);

export const deleteNotification = (notificationId) => securedAxiosInstance.delete(`${notificationId}`);