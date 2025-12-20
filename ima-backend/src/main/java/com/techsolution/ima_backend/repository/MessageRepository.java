package com.techsolution.ima_backend.repository;

import com.techsolution.ima_backend.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
