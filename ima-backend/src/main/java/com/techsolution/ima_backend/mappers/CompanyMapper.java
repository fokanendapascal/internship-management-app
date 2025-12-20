package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.request.CompanyRequest;
import com.techsolution.ima_backend.dtos.response.CompanyResponse;
import com.techsolution.ima_backend.dtos.response.CompanySummaryResponse;
import com.techsolution.ima_backend.dtos.response.InternshipSummaryResponse;
import com.techsolution.ima_backend.entities.Company;

import java.util.List;
import java.util.stream.Collectors;

public final class CompanyMapper {

    private CompanyMapper() {
        // Constructeur privé
    }

    // --- 1. Entity -> DTO de Résumé (Summary) ---
    // (Déjà implémenté précédemment, réitéré ici pour complétude)
    public static CompanySummaryResponse toSummaryResponse(Company entity) {
        if (entity == null) return null;

        CompanySummaryResponse dto = new CompanySummaryResponse();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setWebsite(entity.getWebsite());
        // dto.setProfessionalEmail(entity.getProfessionalEmail()); // Optionnel dans le résumé
        return dto;
    }

    // --- 2. Entity -> DTO de Réponse Complet (Response) ---
    /**
     * Convertit l'Entity Company en DTO de Réponse complet (CompanyResponse).
     */
    public static CompanyResponse toResponseDto(Company entity) {
        if (entity == null) return null;

        CompanyResponse dto = new CompanyResponse();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAddress(entity.getAddress());
        dto.setDescription(entity.getDescription());
        dto.setWebsite(entity.getWebsite());
        dto.setPhone(entity.getPhone());
        dto.setProfessionalEmail(entity.getProfessionalEmail());

        // Récupération des données héritées de l'utilisateur
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setFirstName(entity.getUser().getFirstName());
            dto.setLastName(entity.getUser().getLastName());
            dto.setEmail(entity.getUser().getEmail());
            dto.setTelephone(entity.getUser().getTelephone());
        }

        // Mapping de la relation OneToMany (Offres de stages)
        // Utilisation du mapper d'offre de stage pour obtenir des DTO de résumé imbriqués
        if (entity.getInternships() != null) {
            List<InternshipSummaryResponse> internships = entity.getInternships().stream()
                    .map(InternshipMapper::toSummaryResponse)
                    .collect(Collectors.toList());
            dto.setPublishedInternships(internships);
        }

        return dto;
    }

    // --- 3. DTO de Requête -> Entity (Request) ---
    /**
     * Convertit le DTO de Requête (CompanyRequest) en Entity Company.
     * @return L'entité Company. L'objet User (pour l'héritage) doit être setté dans la couche Service.
     */
    public static Company toEntity(CompanyRequest dto) {
        if (dto == null) return null;

        Company entity = new Company();
        // L'ID est null lors de la création
        entity.setName(dto.getName());
        entity.setAddress(dto.getAddress());
        entity.setDescription(dto.getDescription());
        entity.setWebsite(dto.getWebsite());
        entity.setPhone(dto.getPhone());
        entity.setProfessionalEmail(dto.getProfessionalEmail());

        // ATTENTION: Les champs 'id' et 'user' (OneToOne) sont gérés par la couche Service.

        return entity;
    }
}