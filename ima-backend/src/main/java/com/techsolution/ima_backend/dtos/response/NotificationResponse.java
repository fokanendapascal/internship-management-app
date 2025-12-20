package com.techsolution.ima_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private String message;
    private LocalDateTime notificationDate;
    private boolean isViewed;
    private String relatedUrl;

    // Si NotificationType est implémenté, il doit être inclus ici
    // private NotificationType type;

    // Nous omettons l'objet User complet car le destinataire est l'utilisateur qui fait la requête.
}
