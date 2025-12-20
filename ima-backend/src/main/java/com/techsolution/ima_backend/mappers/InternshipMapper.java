package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.request.InternshipRequest;
import com.techsolution.ima_backend.dtos.response.InternshipResponse;
import com.techsolution.ima_backend.dtos.response.InternshipSummaryResponse;
import com.techsolution.ima_backend.entities.Internship;

import java.util.List;
import java.util.stream.Collectors;

// Rendre la classe finale pour empêcher l'héritage et s'assurer qu'elle agit comme un utilitaire statique
public final class InternshipMapper {

    // Constructeur privé pour empêcher l'instanciation (classe utilitaire statique)
    private InternshipMapper() {
        // Constructeur privé
    }

    // --- Conversion Entity -> DTO de Réponse Complet (GET /internships/{id}) ---

    /**
     * Convertit l'Entity Internship en DTO de Réponse (InternshipResponse).
     * @param entity L'entité Internship à convertir.
     * @return Le DTO de réponse complet.
     */
    public static InternshipResponse toResponseDto(Internship entity) {
        if (entity == null) {
            return null;
        }

        InternshipResponse dto = new InternshipResponse();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setCity(entity.getCity());
        dto.setCountry(entity.getCountry());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        // Utiliser les getters standard (isActive/isPaid)
        dto.setIsActive(entity.getIsActive());
        dto.setIsPaid(entity.getIsPaid());


        // Mapping de la relation imbriquée
        if (entity.getCompany() != null) {
            dto.setCompany(CompanyMapper.toSummaryResponse(entity.getCompany()));
        }

        return dto;
    }

    // --- Conversion Entity -> DTO de Résumé (InternshipSummaryResponse) ---

    /**
     * Convertit l'Entity Internship en DTO de Résumé (InternshipSummaryResponse).
     * Utilisé pour les vues imbriquées (ex: dans Candidature).
     * @param entity L'entité Internship à convertir.
     * @return Le DTO de résumé.
     */
    public static InternshipSummaryResponse toSummaryResponse(Internship entity) {
        if (entity == null) {
            return null;
        }

        InternshipSummaryResponse dto = new InternshipSummaryResponse();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setCity(entity.getCity());
        dto.setCountry(entity.getCountry());

        // Mapping de la relation imbriquée
        if (entity.getCompany() != null) {
            dto.setCompany(CompanyMapper.toSummaryResponse(entity.getCompany()));
        }

        return dto;
    }

    // --- Conversion DTO de Requête -> Entity (POST /internships) ---

    /**
     * Convertit le DTO de Requête (InternshipRequest) en Entity Internship.
     * L'ID et l'objet Company seront définis par la couche Service.
     * @param dto Le DTO de requête à convertir.
     * @return L'entité Internship prête pour la persistance.
     */
    public static Internship toEntity(InternshipRequest dto) {
        if (dto == null) {
            return null;
        }

        Internship entity = new Internship();

        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setCity(dto.getCity());
        entity.setCountry(dto.getCountry());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setIsActive(dto.getIsActive());
        entity.setIsPaid(dto.getIsPaid());

        // Initialisation de l'état par défaut (logique métier dans le mapper ou le service)
        entity.setIsActive(true);

        return entity;
    }

    // --- Conversion de Listes ---

    /**
     * Convertit une liste d'Entités Internship en une liste de DTOs de Réponse.
     * @param entities La liste d'entités Internship.
     * @return La liste de DTOs InternshipResponse.
     */
    public static List<InternshipResponse> toResponseDtoList(List<Internship> entities) {
        return entities.stream()
                .map(InternshipMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}