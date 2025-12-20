import securedAxiosInstance from "./SecuredAxiosInstance";

const REST_API_COMPANIES = '/companies';

export const listCompanies = () => securedAxiosInstance.get(`${REST_API_COMPANIES}`);

export const getCompany = (companyId) => securedAxiosInstance.get(`${REST_API_COMPANIES}/${companyId}`);

export const deleteCompany = (companyId) => securedAxiosInstance.delete(`${REST_API_COMPANIES}/${companyId}`);

export const updateCompany = (companyId, companyRequest) => securedAxiosInstance.put(`${REST_API_COMPANIES}/${companyId}`, companyRequest);

export const createCompany = (userId, companyRequest) => 
    securedAxiosInstance.post(
        REST_API_COMPANIES,
        companyRequest,
        {
            params: {userId}
        }
    );