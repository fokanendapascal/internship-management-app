import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_USERS = '/users';

export const listUsers = () => securedAxiosInstance.get(`${REST_API_USERS}`);

export const createUser = (user) => securedAxiosInstance.post(`${REST_API_USERS}`, user);

export const getUser = (userId) => securedAxiosInstance.get(`${REST_API_USERS}/${userId}`);

export const updateUser = (userId, user) => securedAxiosInstance.put(`${REST_API_USERS}/${userId}`, user);

export const deleteUser = (userId) => securedAxiosInstance.delete(`${REST_API_USERS}/${userId}`);

export const searchUser = (keyword, email, name) => {
    const params = {};

    if (keyword?.trim()) params.keyword = keyword;
    if (email?.trim()) params.email = email;
    if (name?.trim()) params.name = name;

    return securedAxiosInstance.get(`${REST_API_USERS}/search`, { params });
};
