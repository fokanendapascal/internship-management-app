package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.InternshipRequest;
import com.techsolution.ima_backend.dtos.response.InternshipResponse;

import java.util.List;

public interface InternshipService {

    InternshipResponse createInternship(InternshipRequest internshipRequest);
    List<InternshipResponse> findAllActiveInternships();
    InternshipResponse findInternshipById(Long internshipId);
    InternshipResponse updateInternship(Long internshipId, InternshipRequest internshipRequest);
    void deactivateInternship(Long internshipId);
}
