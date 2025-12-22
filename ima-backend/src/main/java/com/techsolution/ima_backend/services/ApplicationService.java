package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.ApplicationRequest;
import com.techsolution.ima_backend.dtos.response.ApplicationResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ApplicationService {

    ApplicationResponse createApplicationWithCV(ApplicationRequest applicationRequest, MultipartFile cvFile);

    ApplicationResponse createApplicationForStudent( Long studentId, ApplicationRequest applicationRequest );
    List<ApplicationResponse> getAllApplications();
    ApplicationResponse getApplicationById(Long applicationId);
    ApplicationResponse updateApplication(Long applicationId, ApplicationRequest applicationRequest);
    void deleteApplication(Long applicationId);


}
