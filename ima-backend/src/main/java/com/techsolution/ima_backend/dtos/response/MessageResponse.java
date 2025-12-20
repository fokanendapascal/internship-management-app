package com.techsolution.ima_backend.dtos.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MessageResponse {

    private Long id;
    private String content;
    private LocalDateTime sentDate;
    private boolean isRead;

    // DTOs imbriqués pour les relations (Résumé de l'utilisateur)
    private UserSummaryResponse sender;
    private UserSummaryResponse recipient;
}
