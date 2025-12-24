package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.AgreementRequest;
import com.techsolution.ima_backend.dtos.response.AgreementResponse;
import com.techsolution.ima_backend.services.AgreementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid; // Nouvelle importation

import java.util.List;

@CrossOrigin("*")
@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/agreements")
@Tag(name = "Agreements", description = "Api de gestion des conventions")
public class AgreementController {

    private final AgreementService agreementService; // Doit maintenant contenir les méthodes createAgreementByAdmin et validateAgreement

    //Build add agreement REST API (Teacher)
    @PostMapping
    public ResponseEntity<AgreementResponse>  createAgreement(@RequestParam Long applicationId,
                                                              @Valid @RequestBody AgreementRequest agreementRequest) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("User {} roles: {}", auth.getName(), auth.getAuthorities());

        AgreementResponse savedAgreement = agreementService.createAgreement(applicationId, agreementRequest);
        return new ResponseEntity<>(savedAgreement, HttpStatus.CREATED);
    }

    //Build add agreement REST API (Admin)
    @PostMapping("/admin-create")
    public ResponseEntity<AgreementResponse> createAgreementForAdmin(@RequestParam Long applicationId,
                                                                     @RequestParam Long teacherId,
                                                                     @Valid @RequestBody AgreementRequest agreementRequest) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("User {} roles: {}", auth.getName(), auth.getAuthorities());

        AgreementResponse savedAgreement = agreementService.createAgreementByAdmin( // Appel via l'interface
                applicationId,
                teacherId,
                agreementRequest
        );
        return new ResponseEntity<>(savedAgreement, HttpStatus.CREATED);
    }

    //Build get agreement REST API
    @GetMapping("{id}")
    public ResponseEntity<AgreementResponse> getAgreementById(@PathVariable("id") Long agreementId) {
        AgreementResponse agreement = agreementService.getAgreementById(agreementId);
        return ResponseEntity.ok(agreement);
    }

    //Build get all agreements REST API
    @GetMapping
    public ResponseEntity<List<AgreementResponse>> getAllAgreements() {
        List<AgreementResponse> agreements = agreementService.getAllAgreements();
        return ResponseEntity.ok(agreements);
    }

    //Build update agreement REST API (Validation)
    @PutMapping("{id}/validate")
    public ResponseEntity<AgreementResponse> validateAgreement(@PathVariable("id") Long agreementId) {
        // Appelle la méthode via l'interface
        AgreementResponse validatedAgreement = agreementService.validateAgreement(agreementId);
        return ResponseEntity.ok(validatedAgreement);
    }

    //Build update agreement REST API (Générique)
    @PutMapping("{id}")
    public ResponseEntity<AgreementResponse> updateAgreement(@PathVariable("id") Long agreementId,
                                                             @Valid @RequestBody AgreementRequest agreementRequest) { // Ajout de @Valid
        AgreementResponse agreement = agreementService.updateAgreement(agreementId, agreementRequest);
        return ResponseEntity.ok(agreement);
    }

    //Build delete agreement REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteAgreement(@PathVariable("id") Long agreementId) {
        agreementService.deleteAgreement(agreementId);
        return ResponseEntity.noContent().build();
    }
}