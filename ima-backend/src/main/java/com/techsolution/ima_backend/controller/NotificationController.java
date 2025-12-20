package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.NotificationUpdateRequest;
import com.techsolution.ima_backend.dtos.response.NotificationResponse;
import com.techsolution.ima_backend.services.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "Api de gestion des notifications")
public class NotificationController {

    private final NotificationService notificationService;

    //Build get notification REST API
    @GetMapping("{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable("id") Long notificationId) {
        NotificationResponse notification = notificationService.getNotificationById(notificationId);
        return ResponseEntity.ok(notification);
    }

    //Build gel all notifications REST API
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() {
        List<NotificationResponse> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    //Build update notification REST API
    @PutMapping("{id}")
    public ResponseEntity<NotificationResponse> updateNotification(@PathVariable("id") Long notificationId,
                                                                   @RequestBody NotificationUpdateRequest updateRequest){
        NotificationResponse updateNotification = notificationService.updateNotification(notificationId, updateRequest);
        return ResponseEntity.ok(updateNotification);
    }

    //Build delete notification REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable("id") Long notificationId){
        notificationService.deleteNotificationById(notificationId);
        return ResponseEntity.noContent().build();
    }

}
