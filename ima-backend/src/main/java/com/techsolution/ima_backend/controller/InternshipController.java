package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.InternshipRequest;
import com.techsolution.ima_backend.dtos.response.InternshipResponse;
import com.techsolution.ima_backend.services.InternshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour la gestion des offres de stages (Internships).
 * Permet la publication, la modification et le suivi des opportunités de stage.
 */
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/internships")
@Tag(name = "Internships", description = "Api de gestion des offres de stages (Publication et cycle de vie des offres)")
public class InternshipController {

    private final InternshipService internshipService;

    // Build add Internship REST API
    @Operation(
            summary = "Publier une nouvelle offre de stage",
            description = "Crée une offre de stage dans le système. L'offre sera visible par les étudiants après création."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Offre de stage publiée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données de l'offre invalides")
    })
    @PostMapping
    public ResponseEntity<InternshipResponse> createInternship(@RequestBody InternshipRequest internshipRequest) {
        InternshipResponse savedInternship = internshipService.createInternship(internshipRequest);
        return new ResponseEntity<>(savedInternship, HttpStatus.CREATED);
    }

    // Build get Internship REST API
    @Operation(summary = "Récupérer une offre de stage par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Offre trouvée"),
            @ApiResponse(responseCode = "404", description = "Offre de stage non trouvée")
    })
    @GetMapping("{id}")
    public ResponseEntity<InternshipResponse> getInternshipById(
            @Parameter(description = "Identifiant unique de l'offre") @PathVariable("id") Long internshipId ) {
        InternshipResponse internshipResponse = internshipService.findInternshipById(internshipId);
        return ResponseEntity.ok(internshipResponse);
    }

    // Build get all Internships REST API
    @Operation(
            summary = "Lister toutes les offres de stages actives",
            description = "Retourne la liste de toutes les offres qui n'ont pas été désactivées ou dont la date de validité n'est pas expirée."
    )
    @GetMapping
    public ResponseEntity<List<InternshipResponse>> getAllInternships() {
        List<InternshipResponse> internships = internshipService.findAllActiveInternships();
        return ResponseEntity.ok(internships);
    }

    // Build update Internship REST API
    @Operation(summary = "Mettre à jour une offre de stage")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Offre mise à jour avec succès"),
            @ApiResponse(responseCode = "404", description = "Offre introuvable")
    })
    @PutMapping("{id}")
    public ResponseEntity<InternshipResponse> updateInternship(
            @PathVariable("id") Long internshipId,
            @RequestBody InternshipRequest internshipRequest){
        InternshipResponse updateInternship = internshipService.updateInternship(internshipId, internshipRequest);
        return ResponseEntity.ok(updateInternship);
    }

    // Build deactivateInternship REST API
    @Operation(
            summary = "Désactiver une offre de stage",
            description = "Effectue une suppression logique (deactivation) pour retirer l'offre de la liste publique sans supprimer les données historiques."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Offre désactivée avec succès"),
            @ApiResponse(responseCode = "404", description = "Offre non trouvée")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deactivateInternship(@PathVariable("id") Long internshipId){
        internshipService.deactivateInternship(internshipId);
        return ResponseEntity.noContent().build();
    }
}