package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.ApplicationRequest;
import com.techsolution.ima_backend.dtos.response.ApplicationResponse;
import com.techsolution.ima_backend.services.ApplicationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/applications")
@Tag(name = "Applications", description = "Api de gestion des candidatures")
public class ApplicationController {

    private final ApplicationService applicationService;

    //Build add application REST API
    @PostMapping(value = "/with-cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicationResponse> createApplicationWithCV(
            @RequestPart("application") ApplicationRequest applicationRequest,
            @RequestPart("cvFile") MultipartFile cvFile) {

        // Le service va : 1. Sauvegarder le fichier, 2. Enregistrer l'appli en BDD
        ApplicationResponse savedApplication = applicationService.createApplicationWithCV(applicationRequest, cvFile);
        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    @PostMapping("/for-student/{id}")
    public ResponseEntity<ApplicationResponse> createApplicationForStudent(@PathVariable("id") Long studentId,
                                                                           @RequestBody ApplicationRequest applicationRequest) {
        ApplicationResponse savedApplication = applicationService.createApplicationForStudent( studentId, applicationRequest);
        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    //Build get application REST API
    @GetMapping("{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable("id") Long applicationId) {
        ApplicationResponse application = applicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(application);
    }

    //Build get all applications REST API
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        List<ApplicationResponse> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    //Build update application REST API
    @PutMapping("{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(@PathVariable("id") Long applicationId,
                                                                 @RequestBody ApplicationRequest applicationRequest) {
        ApplicationResponse updatedApplication = applicationService.updateApplication(applicationId, applicationRequest);
        return ResponseEntity.ok(updatedApplication);
    }

    //Build delete application REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable("id") Long applicationId) {
        applicationService.deleteApplication(applicationId);
        return ResponseEntity.noContent().build();
    }
}
