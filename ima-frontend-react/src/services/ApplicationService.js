import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_APPLICATIONS = '/applications';

export const listApplications = () => securedAxiosInstance.get(`${REST_API_APPLICATIONS}`);

export const getApplication = (applicationId) => 
    securedAxiosInstance.get(`${REST_API_APPLICATIONS}/${applicationId}`);

export const createApplicationForStudent = (studentId, applicationRequest) => 
    securedAxiosInstance.post(`${REST_API_APPLICATIONS}/for-student/${studentId}`, applicationRequest);

export const updateApplication = (applicationId, applicationRequest) => 
    securedAxiosInstance.put(`${REST_API_APPLICATIONS}/${applicationId}`, applicationRequest);

export const deleteApplication = (applicationId) => 
    securedAxiosInstance.delete(`${REST_API_APPLICATIONS}/${applicationId}`);

export const createApplication = (applicationRequest, cvFile) => {
    const formData = new FormData();

    // 1. On ajoute le fichier binaire
    // Le nom 'cvFile' doit correspondre exactement au @RequestPart du Backend
    formData.append('cvFile', cvFile);

    // 2. On ajoute les données JSON
    // On les transforme en Blob avec le type application/json pour que Spring les reconnaisse
    const blob = new Blob([JSON.stringify(applicationRequest)], {
        type: 'application/json'
    });
    formData.append('application', blob);

    return securedAxiosInstance.post(`${REST_API_APPLICATIONS}/with-cv`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};