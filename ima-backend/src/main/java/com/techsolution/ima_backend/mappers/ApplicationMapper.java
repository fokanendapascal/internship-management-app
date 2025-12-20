package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.request.ApplicationRequest;
import com.techsolution.ima_backend.dtos.response.ApplicationResponse;
import com.techsolution.ima_backend.dtos.response.ApplicationSummaryResponse;
import com.techsolution.ima_backend.entities.Application;
import com.techsolution.ima_backend.entities.ApplicationStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public final class ApplicationMapper {

    private ApplicationMapper() {
        // Constructeur privé
    }

    // --- 1. Entity -> DTO de Résumé (Summary) ---
    public static ApplicationSummaryResponse toSummaryResponse(Application entity) {
        if (entity == null) return null;

        ApplicationSummaryResponse dto = new ApplicationSummaryResponse();
        dto.setId(entity.getId());
        dto.setApplicationDate(entity.getApplicationDate());
        dto.setStatus(entity.getStatus());

        // On pourrait ajouter ici le summary de Internship ou Student si le contexte l'exige

        return dto;
    }

    // --- 2. Entity -> DTO de Réponse Complet (Response) ---
    public static ApplicationResponse toResponseDto(Application entity) {
        if (entity == null) return null;

        ApplicationResponse dto = new ApplicationResponse();
        dto.setId(entity.getId());
        dto.setApplicationDate(entity.getApplicationDate());
        dto.setStatus(entity.getStatus());
        dto.setCvUrl(entity.getCvUrl());
        dto.setCoverLetter(entity.getCoverLetter());

        // Mapping des relations ManyToOne
        if (entity.getStudent() != null) {
            dto.setStudent(StudentMapper.toSummaryResponse(entity.getStudent()));
        }
        if (entity.getInternship() != null) {
            dto.setInternship(InternshipMapper.toSummaryResponse(entity.getInternship()));
        }

        // Mapping de la relation OneToOne (Convention)
        if (entity.getAgreement() != null) {
            // Vous devez implémenter AgreementMapper.toSummaryResponse
            dto.setAgreement(AgreementMapper.toSummaryResponse(entity.getAgreement()));
        }

        return dto;
    }

    // --- 3. DTO de Requête -> Entity (Request) ---
    public static Application toEntity(ApplicationRequest dto) {
        if (dto == null) return null;

        Application entity = new Application();

        entity.setCvUrl(dto.getCvUrl());
        entity.setCoverLetter(dto.getCoverLetter());

        // Initialisation des champs par défaut
        entity.setApplicationDate(LocalDate.now());
        entity.setStatus(ApplicationStatus.PENDING);

        // ATTENTION: Les entités Student et Internship doivent être settées dans la couche Service.

        return entity;
    }

    // --- Conversion de Listes ---
    public static List<ApplicationResponse> toResponseDtoList(List<Application> entities) {
        return entities.stream()
                .map(ApplicationMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}