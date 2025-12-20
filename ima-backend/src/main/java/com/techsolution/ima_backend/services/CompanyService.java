package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.CompanyRequest;
import com.techsolution.ima_backend.dtos.response.CompanyResponse;


import java.util.List;

public interface CompanyService {

    CompanyResponse createCompany(Long userId, CompanyRequest companyRequest);
    List<CompanyResponse> getAllCompanies();
    CompanyResponse getCompanyById(Long companyId);
    CompanyResponse updateCompany(Long companyId, CompanyRequest companyRequest);
    void deleteCompany(Long companyId);
}
