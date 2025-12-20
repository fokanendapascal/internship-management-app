package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.request.TeacherRequest;
import com.techsolution.ima_backend.dtos.response.AgreementSummaryResponse;
import com.techsolution.ima_backend.dtos.response.TeacherResponse;
import com.techsolution.ima_backend.dtos.response.TeacherSummaryResponse;
import com.techsolution.ima_backend.entities.Teacher;

import java.util.List;
import java.util.stream.Collectors;

public final class TeacherMapper {

    private TeacherMapper() {
        // Constructeur privé
    }

    // --- 1. Entity -> DTO de Résumé (Summary) ---
    public static TeacherSummaryResponse toSummaryResponse(Teacher entity) {
        if (entity == null) return null;

        TeacherSummaryResponse dto = new TeacherSummaryResponse();
        dto.setId(entity.getId());
        dto.setDepartment(entity.getDepartment());
        dto.setGrade(entity.getGrade());

        // Récupération des données héritées de l'utilisateur
        if (entity.getUser() != null) {
            dto.setFirstName(entity.getUser().getFirstName());
            dto.setLastName(entity.getUser().getLastName());
            dto.setEmail(entity.getUser().getEmail());
        }
        return dto;
    }

    // --- 2. Entity -> DTO de Réponse Complet (Response) ---
    public static TeacherResponse toResponseDto(Teacher entity) {
        if (entity == null) return null;

        TeacherResponse dto = new TeacherResponse();
        dto.setId(entity.getId());
        dto.setDepartment(entity.getDepartment());
        dto.setGrade(entity.getGrade());
        dto.setSpecialty(entity.getSpecialty());

        // Récupération des données héritées de l'utilisateur
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setFirstName(entity.getUser().getFirstName());
            dto.setLastName(entity.getUser().getLastName());
            dto.setEmail(entity.getUser().getEmail());
            dto.setTelephone(entity.getUser().getTelephone());
        }

        // Mapping de la relation OneToMany (Conventions validées)
        if (entity.getValidatedAgreements() != null) {
            // Vous devez implémenter AgreementMapper.toSummaryResponse
            List<AgreementSummaryResponse> agreements = entity.getValidatedAgreements().stream()
                    .map(AgreementMapper::toSummaryResponse)
                    .collect(Collectors.toList());
            dto.setValidatedAgreements(agreements);
        }

        return dto;
    }

    // --- 3. DTO de Requête -> Entity (Request) ---
    public static Teacher toEntity(TeacherRequest dto) {
        if (dto == null) return null;

        Teacher entity = new Teacher();
        entity.setDepartment(dto.getDepartment());
        entity.setGrade(dto.getGrade());
        entity.setSpecialty(dto.getSpecialty());

        // ATTENTION: Le champ 'user' doit être setté dans la couche Service.

        return entity;
    }
}
