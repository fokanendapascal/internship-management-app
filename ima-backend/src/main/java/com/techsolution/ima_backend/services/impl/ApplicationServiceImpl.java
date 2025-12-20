package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.ApplicationRequest;
import com.techsolution.ima_backend.dtos.response.ApplicationResponse;
import com.techsolution.ima_backend.entities.*;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.ApplicationMapper;
import com.techsolution.ima_backend.repository.ApplicationRepository;
import com.techsolution.ima_backend.repository.InternshipRepository;
import com.techsolution.ima_backend.repository.StudentRepository;
import com.techsolution.ima_backend.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;

    // ============================================================
    // 🎓 ÉTUDIANT → postule pour lui-même (JWT)
    // ============================================================
    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ApplicationResponse createApplication(ApplicationRequest applicationRequest) {

        CustomUserDetails principal =
                (CustomUserDetails) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        Long userId = principal.getUserId();

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found for user id: " + userId
                        )
                );

        Application savedApplication = createAndSaveApplication(
                student,
                applicationRequest.getInternshipId(),
                applicationRequest
        );

        log.info("Student [{}] applied to internship [{}]",
                student.getId(), applicationRequest.getInternshipId());

        return ApplicationMapper.toResponseDto(savedApplication);
    }

    // ============================================================
    // 👮 ADMIN → postule pour un étudiant
    // ============================================================
    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApplicationResponse createApplicationForStudent(
            Long studentId,
            ApplicationRequest applicationRequest
    ) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + studentId
                        )
                );

        Application savedApplication = createAndSaveApplication(
                student,
                applicationRequest.getInternshipId(),
                applicationRequest
        );

        log.info("Admin created application for student [{}] to internship [{}]",
                studentId, applicationRequest.getInternshipId());

        return ApplicationMapper.toResponseDto(savedApplication);
    }

    // ============================================================
    // 🔧 LOGIQUE COMMUNE CENTRALISÉE
    // ============================================================
    private Application createAndSaveApplication(
            Student student,
            Long internshipId,
            ApplicationRequest request
    ) {

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Internship not found with id: " + internshipId
                        )
                );

        Application application = ApplicationMapper.toEntity(request);
        application.setStudent(student);
        application.setInternship(internship);
        application.setApplicationDate(LocalDate.now());
        application.setStatus(ApplicationStatus.PENDING);

        return applicationRepository.save(application);
    }

    // ============================================================
    // 📄 LISTE (ADMIN / COMPANY)
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_COMPANY')")
    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(ApplicationMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    // ============================================================
    // 🔍 DÉTAIL
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + applicationId
                        )
                );

        return ApplicationMapper.toResponseDto(application);
    }

    // ============================================================
    // ✏️ MODIFICATION (seulement le propriétaire)
    // ============================================================
    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ApplicationResponse updateApplication(
            Long applicationId,
            ApplicationRequest applicationRequest
    ) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + applicationId
                        )
                );

        application.setCvUrl(applicationRequest.getCvUrl());
        application.setCoverLetter(applicationRequest.getCoverLetter());

        return ApplicationMapper.toResponseDto(applicationRepository.save(application));
    }

    // ============================================================
    // 🗑️ SUPPRESSION (ADMIN)
    // ============================================================
    @Override
    @Transactional
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteApplication(Long applicationId) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + applicationId
                        )
                );

        applicationRepository.delete(application);
    }
}

