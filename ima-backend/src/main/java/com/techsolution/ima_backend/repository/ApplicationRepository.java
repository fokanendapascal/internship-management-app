package com.techsolution.ima_backend.repository;

import com.techsolution.ima_backend.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
}
