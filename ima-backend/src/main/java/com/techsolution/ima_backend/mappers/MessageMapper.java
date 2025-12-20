package com.techsolution.ima_backend.mappers;

import com.techsolution.ima_backend.dtos.request.MessageRequest;
import com.techsolution.ima_backend.dtos.response.MessageResponse;
import com.techsolution.ima_backend.dtos.response.UserSummaryResponse;
import com.techsolution.ima_backend.entities.Message;
import com.techsolution.ima_backend.entities.User; // Importation nécessaire

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public final class MessageMapper {

    private MessageMapper() {
        // Constructeur privé
    }

    // --- Mapper de Résumé d'Utilisateur ---
    // (Cette méthode doit être implémentée, soit ici, soit dans un UserMapper dédié)
    public static UserSummaryResponse toUserSummaryResponse(User entity) {
        if (entity == null) return null;

        UserSummaryResponse dto = new UserSummaryResponse();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        return dto;
    }

    // --- 1. Entity -> DTO de Réponse Complet (Response) ---
    public static MessageResponse toResponseDto(Message entity) {
        if (entity == null) return null;

        MessageResponse dto = new MessageResponse();
        dto.setId(entity.getId());
        dto.setContent(entity.getContent());
        dto.setSentDate(entity.getSentDate());
        dto.setRead(entity.isRead());

        // Mapping de l'expéditeur et du destinataire
        dto.setSender(toUserSummaryResponse(entity.getSender()));
        dto.setRecipient(toUserSummaryResponse(entity.getRecipient()));

        return dto;
    }

    // --- 2. DTO de Requête -> Entity (Request) ---
    public static Message toEntity(MessageRequest dto) {
        if (dto == null) return null;

        Message entity = new Message();

        entity.setContent(dto.getContent());

        // Initialisation des champs par défaut
        entity.setSentDate(LocalDateTime.now());
        entity.setRead(false);

        // ATTENTION: Les entités Sender et Recipient doivent être récupérées
        // et définies par la COUCHE SERVICE en utilisant les IDs.

        return entity;
    }

    // --- Conversion de Listes ---
    public static List<MessageResponse> toResponseDtoList(List<Message> entities) {
        return entities.stream()
                .map(MessageMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}
