package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.UserResponse;
import com.techsolution.ima_backend.dtos.response.UserSummaryResponse;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.entities.UserRole; // Assurez-vous d'avoir cet Enum

import java.util.List;
import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {
        // Constructeur privé
    }

    // --- 1. Entity -> DTO de Résumé (Summary) ---
    public static UserSummaryResponse toSummaryResponse(User entity) {
        if (entity == null) return null;

        UserSummaryResponse dto = new UserSummaryResponse();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());

        return dto;
    }

    // --- 2. Entity -> DTO de Réponse Complet (Response) ---
    public static UserResponse toResponseDto(User entity) {
        if (entity == null) return null;

        UserResponse dto = new UserResponse();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setTelephone(entity.getTelephone());
        dto.setRoles(entity.getRoles());

        // ATTENTION: Le mot de passe n'est pas mappé ici.

        return dto;
    }

    // --- 3. DTO de Requête -> Entity (Enregistrement) ---
    /**
     * Convertit le DTO d'enregistrement en Entity User.
     * Le mot de passe DOIT être HACHÉ par la couche Service AVANT la persistance.
     */
    public static User toEntity(UserRegisterRequest dto) {
        if (dto == null) return null;

        User entity = new User();
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setTelephone(dto.getTelephone());

        // Le mot de passe du DTO est stocké ici pour être HACHÉ par le Service
        entity.setPassword(dto.getPassword());

        // Mapping des rôles
        List<UserRole> roles = dto.getRoles().stream()
                .map(roleName -> UserRole.valueOf(roleName.toUpperCase()))
                .collect(Collectors.toList());
        entity.setRoles(roles);

        return entity;
    }
}
