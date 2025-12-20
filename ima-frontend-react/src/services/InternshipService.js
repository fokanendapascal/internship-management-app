import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_INTERNSHIPS = '/internships';

export const listInternships = () => securedAxiosInstance.get(`${REST_API_INTERNSHIPS}`);

export const getInternship = (internshipId) => 
    securedAxiosInstance.get(`${REST_API_INTERNSHIPS}/${internshipId}`);

export const createInternship = (internshipRequest) => 
    securedAxiosInstance.post(`${REST_API_INTERNSHIPS}`, internshipRequest);

export const updateInternship = (internshipId, internshipRequest) => 
    securedAxiosInstance.put(`${REST_API_INTERNSHIPS}/${internshipId}`, internshipRequest);

export const deactivateInternship = (internshipId) => 
    securedAxiosInstance.delete(`${REST_API_INTERNSHIPS}/${internshipId}`);


