package com.techsolution.ima_backend.repository;

import com.techsolution.ima_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findById(Long userId);

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findFirstByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName
    );

    @Query("""
        SELECT u FROM User u
        WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Optional<User> searchFirstByKeyword(@Param("keyword") String keyword);

}
