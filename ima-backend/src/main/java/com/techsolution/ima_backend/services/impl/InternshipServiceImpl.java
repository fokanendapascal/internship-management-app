package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.InternshipRequest;
import com.techsolution.ima_backend.dtos.response.InternshipResponse;
import com.techsolution.ima_backend.entities.Company;
import com.techsolution.ima_backend.entities.CustomUserDetails;
import com.techsolution.ima_backend.entities.Internship;
import com.techsolution.ima_backend.mappers.InternshipMapper;
import com.techsolution.ima_backend.repository.CompanyRepository;
import com.techsolution.ima_backend.repository.InternshipRepository;
import com.techsolution.ima_backend.services.InternshipService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j // Utilisation de l'annotation Lombok pour le logger
public class InternshipServiceImpl implements InternshipService {

    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;

    // --- CRUD: Création ---
    @Override
    @Transactional // Transaction d'écriture
    public InternshipResponse createInternship(InternshipRequest internshipRequest) {

        // Extraction de l'ID utilisateur via la méthode utilitaire
        Long authenticatedUserId = getAuthenticatedUserId();

        log.info("Tentative de création de stage par l'utilisateur ID: {}", authenticatedUserId);

        Internship internship = InternshipMapper.toEntity(internshipRequest);

        // 1. Trouver l'entité Company associée à l'utilisateur authentifié
        Optional<Company> companyOpt = companyRepository.findByUserId(authenticatedUserId);

        if (companyOpt.isEmpty()) {
            // L'erreur 403 sera renvoyée si l'utilisateur est COMPANY mais n'est pas lié en BDD.
            throw new AccessDeniedException("Only a registered Company can create an internship offer. (ID: " + authenticatedUserId + " not linked to a Company)");
        }

        Company company = companyOpt.get();

        // AJOUT DE LOG CRITIQUE
        log.info("Tentative de création de stage pour Company ID: {}", company.getId());

        // 2. Lier l'offre à l'entité Company et sauvegarder
        internship.setCompany(company);
        Internship savedInternship = internshipRepository.save(internship);

        log.info("Stage créé avec succès par l'utilisateur ID: {}", authenticatedUserId);

        return InternshipMapper.toResponseDto(savedInternship);
    }

    // --- CRUD: Lecture (Tous les actifs) ---
    @Override
    @Transactional(readOnly = true)
    public List<InternshipResponse> findAllActiveInternships() {
        List<Internship> activeInternships = internshipRepository.findByIsActiveTrue();
        return InternshipMapper.toResponseDtoList(activeInternships);
    }

    // --- CRUD: Lecture (Par ID) ---
    @Override
    @Transactional(readOnly = true)
    public InternshipResponse findInternshipById(Long internshipId) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new EntityNotFoundException("Internship offer not found with ID: " + internshipId));

        return InternshipMapper.toResponseDto(internship);
    }

    // --- CRUD: Mise à Jour ---
    @Override
    @Transactional
    public InternshipResponse updateInternship(Long internshipId, InternshipRequest request ) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long authenticatedUserId = getAuthenticatedUserId();

        Internship existingInternship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new EntityNotFoundException("Internship offer not found with ID: " + internshipId));

        // Vérification d'autorisation (Propriétaire OU Admin)
        boolean isAdmin = checkIsAdmin(authentication.getAuthorities());

        if (!isAdmin && !existingInternship.getCompany().getUser().getId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You are not authorized to modify this internship offer.");
        }

        // Mise à jour des champs
        existingInternship.setTitle(request.getTitle());
        existingInternship.setDescription(request.getDescription());
        existingInternship.setCity(request.getCity());
        existingInternship.setCountry(request.getCountry());
        existingInternship.setStartDate(request.getStartDate());
        existingInternship.setEndDate(request.getEndDate());
        existingInternship.setIsActive(request.getIsActive());
        existingInternship.setIsPaid(request.getIsPaid());

        Internship updatedInternship = internshipRepository.save(existingInternship);
        return InternshipMapper.toResponseDto(updatedInternship);
    }

    // --- CRUD: Désactivation ---
    @Override
    @Transactional
    public void deactivateInternship(Long internshipId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long authenticatedUserId = getAuthenticatedUserId();

        Internship existingInternship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new EntityNotFoundException("Internship offer not found with ID: " + internshipId));

        // Vérification d'autorisation (Propriétaire OU Admin)
        boolean isAdmin = checkIsAdmin(authentication.getAuthorities());

        if (!isAdmin && !existingInternship.getCompany().getUser().getId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You are not authorized to deactivate this internship offer.");
        }

        // Désactivation
        existingInternship.setIsActive(false);
        internshipRepository.save(existingInternship);
    }

    /**
     * Méthode utilitaire pour extraire l'ID de l'utilisateur à partir du SecurityContext.
     * @return L'ID de l'utilisateur authentifié (Long).
     * @throws AccessDeniedException si le principal n'est pas CustomUserDetails.
     */
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication.getPrincipal() instanceof CustomUserDetails customUserDetails)) {
            // Cela indique une erreur de configuration (l'utilisateur est authentifié mais sans CustomUserDetails)
            throw new AccessDeniedException("Authentication principal missing or invalid.");
        }
        return customUserDetails.getUserId();
    }

    /**
     * Méthode utilitaire pour vérifier si l'utilisateur possède le rôle ADMIN.
     */
    private boolean checkIsAdmin(Collection<? extends GrantedAuthority> authorities) {
        // Vérifie l'autorité "ROLE_ADMIN" (selon la convention standard)
        return authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}