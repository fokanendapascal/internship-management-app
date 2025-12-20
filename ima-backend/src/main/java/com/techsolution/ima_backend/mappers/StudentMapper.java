package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.request.StudentRequest;
import com.techsolution.ima_backend.dtos.response.ApplicationSummaryResponse;
import com.techsolution.ima_backend.dtos.response.StudentResponse;
import com.techsolution.ima_backend.dtos.response.StudentSummaryResponse;
import com.techsolution.ima_backend.entities.Student;

import java.util.List;
import java.util.stream.Collectors;

public final class StudentMapper {

    private StudentMapper() {
        // Constructeur privé
    }

    // --- 1. Entity -> DTO de Résumé (Summary) ---
    public static StudentSummaryResponse toSummaryResponse(Student entity) {
        if (entity == null) return null;

        StudentSummaryResponse dto = new StudentSummaryResponse();
        dto.setId(entity.getId());
        dto.setLevel(entity.getLevel());

        if (entity.getUser() != null) {
            dto.setFirstName(entity.getUser().getFirstName());
            dto.setLastName(entity.getUser().getLastName());
            dto.setEmail(entity.getUser().getEmail());
        }

        return dto;
    }

    // --- 2. Entity -> DTO de Réponse Complet (Response) ---
    public static StudentResponse toResponseDto(Student entity) {
        if (entity == null) return null;

        StudentResponse dto = new StudentResponse();
        dto.setId(entity.getId());
        dto.setStudentCode(entity.getStudentCode());
        dto.setLevel(entity.getLevel());

        // 🔗 USER (null-safe)
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setFirstName(entity.getUser().getFirstName());
            dto.setLastName(entity.getUser().getLastName());
            dto.setEmail(entity.getUser().getEmail());
            dto.setTelephone(entity.getUser().getTelephone());
        }

        // 📄 Applications
        if (entity.getApplications() != null && !entity.getApplications().isEmpty()) {
            dto.setSubmittedApplications(
                    entity.getApplications()
                            .stream()
                            .map(ApplicationMapper::toSummaryResponse)
                            .toList()
            );
        }

        return dto;
    }

    // --- 3. DTO de Requête -> Entity (Request) ---
    public static Student toEntity(StudentRequest dto) {
        if (dto == null) return null;

        Student entity = new Student();
        entity.setStudentCode(dto.getStudentCode());
        entity.setLevel(dto.getLevel());
        return entity;
    }

}