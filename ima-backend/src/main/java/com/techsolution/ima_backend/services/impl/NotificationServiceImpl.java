package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.NotificationUpdateRequest;
import com.techsolution.ima_backend.dtos.response.NotificationResponse;
import com.techsolution.ima_backend.entities.Notification;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.NotificationMapper;
import com.techsolution.ima_backend.repository.NotificationRepository;
import com.techsolution.ima_backend.repository.UserRepository;
import com.techsolution.ima_backend.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    @Override
    @Transactional
    public NotificationResponse createSystemNotification(String message, String relatedUrl, Long recipientId) {

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("User is not exists with given id : " + recipientId));

        Notification newNotification = NotificationMapper.createNewEntity(
                message,
                relatedUrl,
                recipient
        );

        Notification savedNotification = notificationRepository.save(newNotification);

        return NotificationMapper.toResponseDto(savedNotification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getAllNotifications() {
        List<Notification> notifications = notificationRepository.findAll();

        return notifications.stream()
                .map(NotificationMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification is not exists with given id : " + notificationId));

        return NotificationMapper.toResponseDto(notification);
    }

    @Override
    @Transactional
    public NotificationResponse updateNotification(Long notificationId, NotificationUpdateRequest notificationUpdateRequest) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification is not exists with given id : " + notificationId));

        notification.setViewed(notificationUpdateRequest.isViewed());

        Notification updatedNotification = notificationRepository.save(notification);
        return NotificationMapper.toResponseDto(updatedNotification);
    }

    @Override
    @Transactional
    public void deleteNotificationById(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification is not exists with given id : " + notificationId));

        notificationRepository.deleteById(notificationId);
    }
}
