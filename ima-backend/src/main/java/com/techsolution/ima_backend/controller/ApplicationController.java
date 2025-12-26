package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.ApplicationRequest;
import com.techsolution.ima_backend.dtos.response.ApplicationResponse;
import com.techsolution.ima_backend.services.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Contrôleur pour la gestion des candidatures (Applications).
 * Gère le dépôt de dossiers, l'upload de CV et le suivi des candidatures.
 */
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/applications")
@Tag(name = "Applications", description = "Api de gestion des candidatures(Soumission de dossiers et gestion des CV)")
public class ApplicationController {

    private final ApplicationService applicationService;

    //Build add application REST API
    @Operation(
            summary = "Créer une candidature avec CV",
            description = "Permet de soumettre une candidature complète en téléchargeant un fichier CV au format PDF/Docx."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Candidature et CV enregistrés avec succès"),
            @ApiResponse(responseCode = "400", description = "Format de fichier invalide ou données manquantes"),
            @ApiResponse(responseCode = "500", description = "Erreur lors du stockage du fichier")
    })
    @PostMapping(value = "/with-cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicationResponse> createApplicationWithCV(
            @RequestPart("application") ApplicationRequest applicationRequest,
            @Parameter(description = "Fichier CV (PDF, DOCX)") @RequestPart("cvFile") MultipartFile cvFile) {

        // Le service va : 1. Sauvegarder le fichier, 2. Enregistrer l'appli en BDD
        ApplicationResponse savedApplication = applicationService.createApplicationWithCV(applicationRequest, cvFile);
        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Créer une candidature pour un étudiant spécifique",
            description = "Permet à l'administration de créer manuellement une candidature pour un étudiant via son ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Candidature créée"),
            @ApiResponse(responseCode = "404", description = "Étudiant non trouvé")
    })
    @PostMapping("/for-student/{id}")
    public ResponseEntity<ApplicationResponse> createApplicationForStudent(
            @Parameter(description = "ID de l'étudiant") @PathVariable("id") Long studentId,
            @RequestBody ApplicationRequest applicationRequest) {
        ApplicationResponse savedApplication = applicationService.createApplicationForStudent( studentId, applicationRequest);
        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    //Build get application REST API
    @Operation(summary = "Récupérer une candidature par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Candidature trouvée"),
            @ApiResponse(responseCode = "404", description = "Candidature non trouvée")
    })
    @GetMapping("{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @Parameter(description = "Identifiant de la candidature") @PathVariable("id") Long applicationId ) {
        ApplicationResponse application = applicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(application);
    }

    //Build get all applications REST API
    @Operation(summary = "Lister toutes les candidatures")
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        List<ApplicationResponse> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    //Build update application REST API
    @Operation(summary = "Mettre à jour une candidature")
    @PutMapping("{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable("id") Long applicationId,
            @RequestBody ApplicationRequest applicationRequest) {
        ApplicationResponse updatedApplication = applicationService.updateApplication(applicationId, applicationRequest);
        return ResponseEntity.ok(updatedApplication);
    }

    //Build delete application REST API
    @Operation(summary = "Supprimer une candidature")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Candidature supprimée"),
            @ApiResponse(responseCode = "404", description = "Candidature introuvable")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable("id") Long applicationId) {
        applicationService.deleteApplication(applicationId);
        return ResponseEntity.noContent().build();
    }
}
