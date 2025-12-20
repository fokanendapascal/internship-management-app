package com.techsolution.ima_backend.repository;

import com.techsolution.ima_backend.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
