package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.AgreementRequest;
import com.techsolution.ima_backend.dtos.response.AgreementResponse;
import com.techsolution.ima_backend.entities.*;
import com.techsolution.ima_backend.exceptions.InvalidAgreementStateException;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.AgreementMapper;
import com.techsolution.ima_backend.repository.AgreementRepository;
import com.techsolution.ima_backend.repository.ApplicationRepository;
import com.techsolution.ima_backend.repository.TeacherRepository;
import com.techsolution.ima_backend.services.AgreementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgreementServiceImpl implements AgreementService {

    private final AgreementRepository agreementRepository;
    private final ApplicationRepository applicationRepository;
    private final TeacherRepository teacherRepository;

    // ============================================================
    // 🔒 UTILITAIRE SÉCURITÉ
    // ============================================================
    private CustomUserDetails currentUser() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // ============================================================
    // ⚙️ CRÉATION COMMUNE
    // ============================================================
    private Agreement createAndSaveAgreement(
            Long applicationId,
            AgreementRequest request,
            Teacher validator
    ) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Application not found with id: " + applicationId)
                );

        Agreement agreement = AgreementMapper.toEntity(request);
        agreement.setApplication(application);
        agreement.setValidator(validator);
        agreement.setCreationDate(LocalDate.now());
        agreement.setStatus(AgreementStatus.DRAFT);

        return agreementRepository.save(agreement);
    }

    // ============================================================
    // 1️⃣ TEACHER → création (auto-validateur)
    // POST /api/v1/agreements
    // ============================================================
    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public AgreementResponse createAgreement(Long applicationId, AgreementRequest request) {

        Long teacherId = currentUser().getUserId();

        Teacher validator = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found with id: " + teacherId)
                );

        Agreement agreement = createAndSaveAgreement(applicationId, request, validator);

        log.info("Agreement created by TEACHER [{}] for application [{}]", teacherId, applicationId);
        return AgreementMapper.toResponseDto(agreement);
    }

    // ============================================================
    // 2️⃣ ADMIN → création avec validateur explicite
    // POST /api/v1/agreements/admin-create
    // ============================================================
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public AgreementResponse createAgreementByAdmin(
            Long applicationId,
            Long teacherId,
            AgreementRequest request
    ) {
        Teacher validator = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found with id: " + teacherId)
                );

        Agreement agreement = createAndSaveAgreement(applicationId, request, validator);

        log.warn("Agreement created by ADMIN, assigned to TEACHER [{}]", teacherId);
        return AgreementMapper.toResponseDto(agreement);
    }

    // ============================================================
    // 3️⃣ UPDATE → uniquement DRAFT
    // STUDENT / COMPANY / TEACHER / ADMIN
    // ============================================================
    @Override
    @Transactional
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT', 'ROLE_COMPANY')")
    public AgreementResponse updateAgreement(Long agreementId, AgreementRequest request) {

        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Agreement not found with id: " + agreementId)
                );

        if (agreement.getStatus() != AgreementStatus.DRAFT) {
            throw new InvalidAgreementStateException(
                    "Only agreements in DRAFT status can be updated"
            );
        }

        CustomUserDetails user = currentUser();

        // 🔐 Sécurité métier STUDENT
        if (user.hasAuthority("ROLE_STUDENT")) {
            if (!agreement.getApplication().getStudent().getId().equals(user.getUserId())) {
                throw new AccessDeniedException("Student not owner of this agreement");
            }
        }

        // 🔐 Sécurité métier COMPANY
        if (user.hasAuthority("ROLE_COMPANY")) {
            if (!agreement.getApplication()
                    .getInternship()
                    .getCompany()
                    .getId()
                    .equals(user.getUserId())) {
                throw new AccessDeniedException("Company not owner of this agreement");
            }
        }

        // Mise à jour des champs autorisés
        agreement.setStartDate(request.getStartDate());
        agreement.setEndDate(request.getEndDate());
        agreement.setDocumentPdfUrl(request.getDocumentPdfUrl());

        // 🔁 Transition contrôlée
        if (request.getStatus() == AgreementStatus.PENDING_VALIDATION) {
            agreement.setStatus(AgreementStatus.PENDING_VALIDATION);
            log.info("Agreement [{}] moved to PENDING_VALIDATION", agreementId);
        }

        return AgreementMapper.toResponseDto(
                agreementRepository.save(agreement)
        );
    }

    // ============================================================
    // 4️⃣ VALIDATION → TEACHER assigné uniquement
    // PUT /api/v1/agreements/{id}/validate
    // ============================================================
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public AgreementResponse validateAgreement(Long agreementId) {

        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Agreement not found with id: " + agreementId)
                );

        if (agreement.getStatus() != AgreementStatus.PENDING_VALIDATION) {
            throw new InvalidAgreementStateException(
                    "Agreement must be PENDING_VALIDATION to be validated"
            );
        }

        Long currentTeacherId = currentUser().getUserId();

        if (!agreement.getValidator().getId().equals(currentTeacherId)) {
            throw new AccessDeniedException("You are not the assigned validator");
        }

        agreement.setStatus(AgreementStatus.VALIDATED);

        log.info("Agreement [{}] validated by TEACHER [{}]", agreementId, currentTeacherId);
        return AgreementMapper.toResponseDto(
                agreementRepository.save(agreement)
        );
    }

    // ============================================================
    // 5️⃣ READ
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public List<AgreementResponse> getAllAgreements() {
        return agreementRepository.findAll()
                .stream()
                .map(AgreementMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AgreementResponse getAgreementById(Long agreementId) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Agreement not found with id: " + agreementId)
                );
        return AgreementMapper.toResponseDto(agreement);
    }

    // ============================================================
    // 6️⃣ DELETE → ADMIN uniquement
    // ============================================================
    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteAgreement(Long agreementId) {
        Agreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Agreement not found with id: " + agreementId)
                );

        agreementRepository.delete(agreement);
        log.warn("Agreement [{}] deleted by ADMIN", agreementId);
    }
}
