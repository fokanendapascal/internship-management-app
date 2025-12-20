package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.ApplicationRequest;
import com.techsolution.ima_backend.dtos.response.ApplicationResponse;

import java.util.List;

public interface ApplicationService {

    ApplicationResponse createApplication(ApplicationRequest applicationRequest);
    ApplicationResponse createApplicationForStudent( Long studentId, ApplicationRequest applicationRequest );
    List<ApplicationResponse> getAllApplications();
    ApplicationResponse getApplicationById(Long applicationId);
    ApplicationResponse updateApplication(Long applicationId, ApplicationRequest applicationRequest);
    void deleteApplication(Long applicationId);

}
