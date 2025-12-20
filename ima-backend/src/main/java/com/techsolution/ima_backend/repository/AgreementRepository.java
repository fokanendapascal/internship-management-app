package com.techsolution.ima_backend.repository;

import com.techsolution.ima_backend.entities.Agreement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgreementRepository extends JpaRepository<Agreement, Long> {
}
