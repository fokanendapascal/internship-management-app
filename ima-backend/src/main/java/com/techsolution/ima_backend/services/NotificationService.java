package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.NotificationUpdateRequest;
import com.techsolution.ima_backend.dtos.response.NotificationResponse;
import com.techsolution.ima_backend.entities.User;

import java.util.List;

public interface NotificationService {

    NotificationResponse createSystemNotification(String message, String relatedUrl, Long recipientId);

    List<NotificationResponse> getAllNotifications();
    NotificationResponse getNotificationById(Long notificationId);

    // La méthode update gère maintenant la mise à jour de l'état 'viewed'
    NotificationResponse updateNotification(Long notificationId, NotificationUpdateRequest notificationUpdateRequest);

    void deleteNotificationById(Long notificationId);
}
