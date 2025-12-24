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
import com.techsolution.ima_backend.services.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final FileStorageService fileStorageService;

    // ============================================================
    // 🎓 ÉTUDIANT → postule pour lui-même (JWT)
    // ============================================================
    @Override
    @Transactional
    public ApplicationResponse createApplicationWithCV(ApplicationRequest applicationRequest, MultipartFile cvFile) {

        // 1. Identifier l'étudiant via le SecurityContext (JWT)
        CustomUserDetails principal = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Student student = studentRepository.findByUserId(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé"));

        // 🚨 AJOUT : Récupérer le stage via l'ID fourni dans la requête
        Internship internship = internshipRepository.findById(applicationRequest.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Stage non trouvé avec l'ID: " + applicationRequest.getInternshipId()));

        // 2. Sauvegarder le fichier PDF physiquement
        String fileName = fileStorageService.save(cvFile);

        // 3. Construire l'URL de téléchargement
        String downloadUrl = "http://localhost:8090/api/v1/files/cv/" + fileName;

        // 4. Créer l'entité Application
        Application application = ApplicationMapper.toEntity(applicationRequest);

        // 🚨 CRUCIAL : Lier les entités chargées à l'application
        application.setStudent(student);
        application.setInternship(internship); // <--- C'est cette ligne qui manquait !

        application.setCvUrl(downloadUrl);
        application.setStatus(ApplicationStatus.PENDING);
        application.setApplicationDate(LocalDate.now());

        Application savedApplication = applicationRepository.save(application);

        log.info("Candidature créée avec succès pour l'étudiant ID: {} sur le stage ID: {}",
                student.getId(), internship.getId());

        return ApplicationMapper.toResponseDto(savedApplication);
    }

    // ============================================================
    // 👮 ADMIN → postule pour un étudiant
    // ============================================================
    @Override
    @Transactional
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

