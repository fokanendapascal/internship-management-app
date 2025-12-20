import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_TEACHERS = '/teachers';

export const listTeachers = () => securedAxiosInstance.get(`${REST_API_TEACHERS}`);

export const getTeacher = (teacherId) => securedAxiosInstance.get(`${REST_API_TEACHERS}/${teacherId}`);

export const deleteTeacher = (teacherId) => securedAxiosInstance.delete(`${REST_API_TEACHERS}/${teacherId}`);

export const createTeacher = (userId, teacherRequest) =>
    securedAxiosInstance.post(
        REST_API_TEACHERS,
        teacherRequest,
        {
            params: { userId }
        }
    );

export const updateTeacher = (teacherId, teacherRequest) => securedAxiosInstance.put(`${REST_API_TEACHERS}/${teacherId}`, teacherRequest);