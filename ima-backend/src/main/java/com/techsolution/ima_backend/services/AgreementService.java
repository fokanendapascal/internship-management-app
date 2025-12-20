package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.AgreementRequest;
import com.techsolution.ima_backend.dtos.response.AgreementResponse;

import java.util.List;

public interface AgreementService {
    AgreementResponse createAgreement(Long applicationId, AgreementRequest agreementRequest);
    AgreementResponse createAgreementByAdmin(Long applicationId, Long teacherId, AgreementRequest agreementRequest);
    AgreementResponse validateAgreement(Long agreementId);
    List<AgreementResponse> getAllAgreements();
    AgreementResponse getAgreementById(Long agreementId);
    AgreementResponse updateAgreement(Long agreementId, AgreementRequest agreementRequest);
    void deleteAgreement(Long agreementId);
}
