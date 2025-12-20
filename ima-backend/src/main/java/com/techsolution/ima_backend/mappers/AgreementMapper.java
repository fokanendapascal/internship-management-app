package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.request.AgreementRequest;
import com.techsolution.ima_backend.dtos.response.AgreementResponse;
import com.techsolution.ima_backend.dtos.response.AgreementSummaryResponse;
import com.techsolution.ima_backend.entities.Agreement;
import com.techsolution.ima_backend.entities.AgreementStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public final class AgreementMapper {

    private AgreementMapper() {
        // Constructeur privé
    }

    // --- 1. Entity -> DTO de Résumé (Summary) ---
    public static AgreementSummaryResponse toSummaryResponse(Agreement entity) {
        if (entity == null) return null;

        AgreementSummaryResponse dto = new AgreementSummaryResponse();
        dto.setId(entity.getId());
        dto.setCreationDate(entity.getCreationDate());
        dto.setStatus(entity.getStatus());
        dto.setDocumentPdfUrl(entity.getDocumentPdfUrl());

        // Mapping de la relation (optionnel pour le résumé)
        /*
        if (entity.getValidator() != null) {
            dto.setValidator(TeacherMapper.toSummaryResponse(entity.getValidator()));
        }
        */

        return dto;
    }

    // --- 2. Entity -> DTO de Réponse Complet (Response) ---
    public static AgreementResponse toResponseDto(Agreement entity) {
        if (entity == null) return null;

        AgreementResponse dto = new AgreementResponse();
        dto.setId(entity.getId());
        dto.setCreationDate(entity.getCreationDate());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStatus(entity.getStatus());
        dto.setDocumentPdfUrl(entity.getDocumentPdfUrl());

        // Mapping des relations OneToOne et ManyToOne
        if (entity.getApplication() != null) {
            // Vous avez besoin d'un DTO de résumé pour l'application
            dto.setApplication(ApplicationMapper.toSummaryResponse(entity.getApplication()));
        }
        if (entity.getValidator() != null) {
            dto.setValidator(TeacherMapper.toSummaryResponse(entity.getValidator()));
        }

        return dto;
    }

    // --- 3. DTO de Requête -> Entity (Request) ---
    /**
     * Utilisé pour mettre à jour les dates ou l'URL du PDF sur une entité EXISTANTE.
     * Pour la création, la couche Service doit fournir l'Application et les valeurs par défaut.
     */
    public static Agreement toEntity(AgreementRequest dto) {
        if (dto == null) return null;

        Agreement entity = new Agreement();

        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setDocumentPdfUrl(dto.getDocumentPdfUrl());

        // Initialisation des champs par défaut lors de la création
        entity.setCreationDate(LocalDate.now());
        entity.setStatus(AgreementStatus.DRAFT); // Par défaut: Brouillon

        // ATTENTION: Les entités Application et Teacher sont gérées par la couche Service.

        return entity;
    }
}
