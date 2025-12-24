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

export const createApplication = (internshipId, applicationRequest, cvFile) => {
    const formData = new FormData();

    // 1. On ajoute le fichier binaire
    formData.append('cvFile', cvFile);

    // 2. On injecte l'internshipId dans l'objet de requête avant de le sérialiser
    const updatedRequest = {
        ...applicationRequest,
        internshipId: internshipId // S'assure que l'ID est présent dans le JSON
    };

    // 3. On ajoute les données JSON avec l'ID inclus
    const blob = new Blob([JSON.stringify(updatedRequest)], {
        type: 'application/json'
    });
    formData.append('application', blob);

    // Facultatif : Si votre backend attend l'ID en paramètre d'URL plutôt que dans le JSON
    // changez l'URL en : `${REST_API_APPLICATIONS}/with-cv?internshipId=${internshipId}`

    return securedAxiosInstance.post(`${REST_API_APPLICATIONS}/with-cv`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

