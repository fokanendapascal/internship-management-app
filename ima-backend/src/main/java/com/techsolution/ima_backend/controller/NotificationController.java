package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.NotificationUpdateRequest;
import com.techsolution.ima_backend.dtos.response.NotificationResponse;
import com.techsolution.ima_backend.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour la gestion des notifications système et utilisateur.
 * Permet de consulter l'historique des alertes, de les marquer comme lues et de les supprimer.
 */
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "Api de gestion des notifications (Alertes système, rappels et suivi d'activité)")
public class NotificationController {

    private final NotificationService notificationService;

    //Build get notification REST API
    @Operation(summary = "Récupérer une notification par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification trouvée"),
            @ApiResponse(responseCode = "404", description = "Notification non trouvée")
    })
    @GetMapping("{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @Parameter(description = "Identifiant unique de la notification") @PathVariable("id") Long notificationId) {
        NotificationResponse notification = notificationService.getNotificationById(notificationId);
        return ResponseEntity.ok(notification);
    }

    //Build gel all notifications REST API
    @Operation(
            summary = "Lister toutes les notifications",
            description = "Récupère l'intégralité des notifications destinées à l'utilisateur actuel."
    )
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() {
        List<NotificationResponse> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    //Build update notification REST API
    @Operation(
            summary = "Mettre à jour une notification",
            description = "Principalement utilisé pour changer le statut d'une notification (ex: marquer comme lue)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification mise à jour avec succès"),
            @ApiResponse(responseCode = "404", description = "Notification introuvable")
    })
    @PutMapping("{id}")
    public ResponseEntity<NotificationResponse> updateNotification(
            @PathVariable("id") Long notificationId,
            @RequestBody NotificationUpdateRequest updateRequest){
        NotificationResponse updateNotification = notificationService.updateNotification(notificationId, updateRequest);
        return ResponseEntity.ok(updateNotification);
    }

    //Build delete notification REST API
    @Operation(
            summary = "Supprimer une notification",
            description = "Supprime définitivement une notification de l'historique de l'utilisateur."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Notification supprimée avec succès"),
            @ApiResponse(responseCode = "404", description = "Notification non trouvée")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable("id") Long notificationId){
        notificationService.deleteNotificationById(notificationId);
        return ResponseEntity.noContent().build();
    }

}
