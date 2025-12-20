package com.techsolution.ima_backend.repository;

import com.techsolution.ima_backend.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    @Query("SELECT c FROM Company c WHERE c.user.id = :userId")
    Optional<Company> findByUserId(@Param("userId") Long userId);
    // OU, si les noms de propriétés sont respectés: Optional<Company> findByUser_Id(Long userId);
}
