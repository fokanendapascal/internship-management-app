package com.techsolution.ima_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private LocalDateTime notificationDate;

    private boolean isViewed = false; // Par défaut, non vue
    private boolean isRead = false;

    // Optionnel: Champ pour l'URI où cliquer pour voir le détail (ex: /applications/5)
    private String relatedUrl;

    // Lien ManyToOne vers l'Utilisateur qui reçoit la notification
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optionnel: type de notification pour l'icône dans l'UI (ex: INFO, WARNING, SUCCESS)
    // @Enumerated(EnumType.STRING)
    // private NotificationType type;
}
