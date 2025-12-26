package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.AgreementRequest;
import com.techsolution.ima_backend.dtos.response.AgreementResponse;
import com.techsolution.ima_backend.services.AgreementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid; // Nouvelle importation


import java.util.List;

/**
 * Contrôleur pour la gestion des conventions (Agreements).
 * Fournit les points de terminaison pour la création, la consultation, la validation et la suppression.
 */
@CrossOrigin("*")
@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/agreements")
@Tag(name = "Agreements", description = "Api de gestion des conventions")
public class AgreementController {

    private final AgreementService agreementService;

    //Build add agreement REST API (Teacher)
    @Operation(
            summary = "Créer une convention (Enseignant)",
            description = "Permet à un enseignant authentifié de créer une nouvelle convention liée à une candidature spécifique."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Convention créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données de requête invalides"),
            @ApiResponse(responseCode = "404", description = "Candidature non trouvée")
    })
    @PostMapping
    public ResponseEntity<AgreementResponse>  createAgreement(
            @Parameter(description = "ID de la candidature associée") @RequestParam Long applicationId,
            @Valid @RequestBody AgreementRequest agreementRequest) {

        logSecurityContext();
        AgreementResponse savedAgreement = agreementService.createAgreement(applicationId, agreementRequest);
        return new ResponseEntity<>(savedAgreement, HttpStatus.CREATED);
    }

    //Build add agreement REST API (Admin)
    @Operation(
            summary = "Créer une convention par l'Admin",
            description = "Permet à un administrateur de forcer la création d'une convention pour un enseignant et une candidature donnés."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Convention créée par l'administrateur"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - Rôle Admin requis")
    })
    @PostMapping("/admin-create")
    public ResponseEntity<AgreementResponse> createAgreementForAdmin(
            @Parameter(description = "ID de la candidature") @RequestParam Long applicationId,
            @Parameter(description = "ID de l'enseignant") @RequestParam Long teacherId,
            @Valid @RequestBody AgreementRequest agreementRequest) {

        logSecurityContext();
        AgreementResponse savedAgreement = agreementService.createAgreementByAdmin( // Appel via l'interface
                applicationId,
                teacherId,
                agreementRequest
        );
        return new ResponseEntity<>(savedAgreement, HttpStatus.CREATED);
    }

    //Build get agreement REST API
    @Operation(summary = "Récupérer une convention par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Convention trouvée"),
            @ApiResponse(responseCode = "404", description = "Convention non trouvée")
    })
    @GetMapping("{id}")
    public ResponseEntity<AgreementResponse> getAgreementById(
            @Parameter(description = "Identifiant unique de la convention") @PathVariable("id") Long agreementId ) {
        AgreementResponse agreement = agreementService.getAgreementById(agreementId);
        return ResponseEntity.ok(agreement);
    }

    //Build get all agreements REST API
    @Operation(summary = "Lister toutes les conventions")
    @GetMapping
    public ResponseEntity<List<AgreementResponse>> getAllAgreements() {
        List<AgreementResponse> agreements = agreementService.getAllAgreements();
        return ResponseEntity.ok(agreements);
    }

    //Build update agreement REST API (Validation)
    @Operation(
            summary = "Valider une convention",
            description = "Change le statut de la convention pour 'Validé' après vérification administrative."
    )
    @PutMapping("{id}/validate")
    public ResponseEntity<AgreementResponse> validateAgreement(@PathVariable("id") Long agreementId) {
        // Appelle la méthode via l'interface
        AgreementResponse validatedAgreement = agreementService.validateAgreement(agreementId);
        return ResponseEntity.ok(validatedAgreement);
    }

    //Build update agreement REST API (Générique)
    @Operation(summary = "Mettre à jour une convention")
    @PutMapping("{id}")
    public ResponseEntity<AgreementResponse> updateAgreement(
            @PathVariable("id") Long agreementId,
            @Valid @RequestBody AgreementRequest agreementRequest) { // Ajout de @Valid
        AgreementResponse agreement = agreementService.updateAgreement(agreementId, agreementRequest);
        return ResponseEntity.ok(agreement);
    }

    //Build delete agreement REST API
    @Operation(summary = "Supprimer une convention")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Convention supprimée avec succès"),
            @ApiResponse(responseCode = "404", description = "Convention inexistante")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteAgreement(@PathVariable("id") Long agreementId) {
        agreementService.deleteAgreement(agreementId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Utilitaire pour logger l'utilisateur actuel
     */
    private void logSecurityContext() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            log.info("Request by user: {} | Roles: {}", auth.getName(), auth.getAuthorities());
        }
    }
}