import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_AGREEMENTS = '/agreements';

export const listAgreements = () => securedAxiosInstance.get(`${REST_API_AGREEMENTS}`);

export const getAgreement = (agreementId) => 
    securedAxiosInstance.get(`${REST_API_AGREEMENTS}/${agreementId}`);

export const validateAgreement = (agreementId) => 
    securedAxiosInstance.put(`${REST_API_AGREEMENTS}/${agreementId}`);

export const updateAgreement = (agreementId, agreementRequest) => 
    securedAxiosInstance.put(`${REST_API_AGREEMENTS}/${agreementId}`, agreementRequest);

export const deleteAgreement = (agreementId) => 
    securedAxiosInstance.delete(`${REST_API_AGREEMENTS}/${agreementId}`);

export const createAgreement = (applicationId, agreementRequest) => 
    securedAxiosInstance.post(
        REST_API_AGREEMENTS,
        agreementRequest,
        {
            params: {applicationId}
        }
    );

export const createAgreementForAdmin = (applicationId, teacherId, agreementRequest) => 
    securedAxiosInstance.post(
        REST_API_AGREEMENTS,
        agreementRequest,
        {
            params: {applicationId, teacherId}
        }
    );    