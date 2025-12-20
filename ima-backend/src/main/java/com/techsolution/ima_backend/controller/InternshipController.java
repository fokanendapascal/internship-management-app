package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.InternshipRequest;
import com.techsolution.ima_backend.dtos.response.InternshipResponse;
import com.techsolution.ima_backend.services.InternshipService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/internships")
@Tag(name = "Internships", description = "Api de gestion des offres de stages")
public class InternshipController {

    private final InternshipService internshipService;

    // *******************************************************************
    // NOTE DE SÉCURITÉ : L'ID utilisateur doit être extrait du contexte Security
    // *******************************************************************

    // Build add Internship REST API
    @PostMapping
    public ResponseEntity<InternshipResponse> createInternship(@RequestBody InternshipRequest internshipRequest) {
        InternshipResponse savedInternship = internshipService.createInternship(internshipRequest);
        return new ResponseEntity<>(savedInternship, HttpStatus.CREATED);
    }

    // Build get Internship REST API
    @GetMapping("{id}")
    public ResponseEntity<InternshipResponse> getInternshipById(@PathVariable("id") Long internshipId) {
        InternshipResponse internshipResponse = internshipService.findInternshipById(internshipId);
        return ResponseEntity.ok(internshipResponse);
    }

    // Build get all Internships REST API
    @GetMapping
    public ResponseEntity<List<InternshipResponse>> getAllInternships() {
        List<InternshipResponse> internships = internshipService.findAllActiveInternships();
        return ResponseEntity.ok(internships);
    }

    // Build update Internship REST API
    @PutMapping("{id}")
    public ResponseEntity<InternshipResponse> updateInternship(@PathVariable("id") Long internshipId,
                                                               @RequestBody InternshipRequest internshipRequest){
        InternshipResponse updateInternship = internshipService.updateInternship(internshipId, internshipRequest);
        return ResponseEntity.ok(updateInternship);
    }

    // Build deactivateInternship REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deactivateInternship(@PathVariable("id") Long internshipId){
        internshipService.deactivateInternship(internshipId);
        return ResponseEntity.noContent().build();
    }
}