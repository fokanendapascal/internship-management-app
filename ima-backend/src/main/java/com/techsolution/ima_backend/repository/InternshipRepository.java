package com.techsolution.ima_backend.repository;

import com.techsolution.ima_backend.entities.Internship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByIsActiveTrue(); // Pour la liste des offres publiques
}
