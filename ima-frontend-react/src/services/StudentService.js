import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_STUDENTS = '/students';

export const listStudents = () => securedAxiosInstance.get(`${REST_API_STUDENTS}`);

export const getStudent = (studentId) => securedAxiosInstance.get(`${REST_API_STUDENTS}/${studentId}`);

export const deleteStudent = (studentId) => securedAxiosInstance.delete(`${REST_API_STUDENTS}/${studentId}`);

export const createStudent = (userId, studentRequest) =>
    securedAxiosInstance.post(
        REST_API_STUDENTS,
        studentRequest,
        {
            params: { userId }
        }
    );

export const updateStudent = (studentId, studentRequest) => securedAxiosInstance.put(`${REST_API_STUDENTS}/${studentId}`, studentRequest);