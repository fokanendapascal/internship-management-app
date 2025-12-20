package com.techsolution.ima_backend.repository;

import com.techsolution.ima_backend.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher,Long> {
    Optional<Teacher> findByUserId(Long userId);
}
