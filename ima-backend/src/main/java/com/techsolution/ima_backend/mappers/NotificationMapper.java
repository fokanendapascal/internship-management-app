package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.response.NotificationResponse;
import com.techsolution.ima_backend.entities.Notification;
import com.techsolution.ima_backend.entities.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public final class NotificationMapper {

    private NotificationMapper() {
        // Constructeur privé
    }

    // --- 1. Entity -> DTO de Réponse Complet (Response) ---
    public static NotificationResponse toResponseDto(Notification entity) {
        if (entity == null) return null;

        NotificationResponse dto = new NotificationResponse();
        dto.setId(entity.getId());
        dto.setMessage(entity.getMessage());
        dto.setNotificationDate(entity.getNotificationDate());
        dto.setViewed(entity.isViewed());
        dto.setRelatedUrl(entity.getRelatedUrl());

        return dto;
    }

    // --- 2. Construction d'une Entity (Utilisation dans la Couche Service) ---
    /**
     * Crée une nouvelle entité Notification à partir des paramètres de service.
     * Cette méthode est utilisée par le Service pour générer une alerte système.
     * @param message Le texte de la notification.
     * @param relatedUrl L'URL de la ressource concernée.
     * @param user Le destinataire de la notification.
     * @return L'entité Notification prête pour la persistance.
     */
    public static Notification createNewEntity(String message, String relatedUrl, User user) {

        Notification entity = new Notification();

        entity.setMessage(message);
        entity.setRelatedUrl(relatedUrl);
        entity.setUser(user);

        // Initialisation des champs par défaut par le Mapper (ou Service)
        entity.setNotificationDate(LocalDateTime.now());
        entity.setRead(false);

        return entity;
    }

    // --- Conversion de Listes ---
    public static List<NotificationResponse> toResponseDtoList(List<Notification> entities) {
        return entities.stream()
                .map(NotificationMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}