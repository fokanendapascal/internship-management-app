package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.CompanyRequest;
import com.techsolution.ima_backend.dtos.response.CompanyResponse;
import com.techsolution.ima_backend.entities.Company;
import com.techsolution.ima_backend.services.CompanyService;
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
 * Contrôleur pour la gestion des entreprises partenaires.
 * Gère le référencement des entreprises et leurs informations de contact.
 */
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/companies")
@Tag(name = "Companies", description = "Api de gestion des entreprises (Partenaires de stages et employeurs)")
public class CompanyController {

    private final CompanyService companyService;

    //Build add company REST API
    @Operation(
            summary = "Enregistrer une entreprise",
            description = "Crée une nouvelle fiche entreprise et l'associe à un utilisateur (généralement un représentant d'entreprise)."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Entreprise créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données de l'entreprise invalides"),
            @ApiResponse(responseCode = "404", description = "Utilisateur référent non trouvé")
    })
    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @Parameter(description = "ID de l'utilisateur rattaché à l'entreprise") @RequestParam Long userId,
            @RequestBody CompanyRequest companyRequest) {
        CompanyResponse savedCompany = companyService.createCompany(userId, companyRequest);
        return new ResponseEntity<>(savedCompany, HttpStatus.CREATED);
    }

    //Build get company REST API
    @Operation(summary = "Récupérer une entreprise par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Entreprise trouvée"),
            @ApiResponse(responseCode = "404", description = "Entreprise non trouvée")
    })
    @GetMapping("{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(
            @Parameter(description = "Identifiant unique de l'entreprise") @PathVariable("id") Long companyId ) {
        CompanyResponse company = companyService.getCompanyById(companyId);
        return ResponseEntity.ok(company);
    }

    //Build get all companies REST API
    @Operation(summary = "Lister toutes les entreprises")
    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        List<CompanyResponse> companyList = companyService.getAllCompanies();
        return ResponseEntity.ok(companyList);
    }

    //Build update company REST API
    @Operation(summary = "Mettre à jour les informations d'une entreprise")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Informations mises à jour"),
            @ApiResponse(responseCode = "404", description = "Entreprise introuvable")
    })
    @PutMapping("{id}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable("id") Long companyId,
            @RequestBody CompanyRequest companyRequest) {
        CompanyResponse updatedCompany = companyService.updateCompany(companyId, companyRequest);
        return ResponseEntity.ok(updatedCompany);
    }

    //Build delete company REST API
    @Operation(summary = "Supprimer une entreprise")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Entreprise supprimée avec succès"),
            @ApiResponse(responseCode = "404", description = "Entreprise non trouvée"),
            @ApiResponse(responseCode = "500", description = "Erreur interne lors de la suppression")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable("id") Long companyId) {
        companyService.deleteCompany(companyId);
        return ResponseEntity.noContent().build();
    }

}
