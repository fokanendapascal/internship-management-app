package com.techsolution.ima_backend.dtos.response;

import com.techsolution.ima_backend.entities.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private Long id;
    private LocalDate applicationDate;
    private ApplicationStatus status;
    private String cvUrl;
    private String coverLetter;

    // DTOs imbriqués pour les relations
    private StudentSummaryResponse student;
    private InternshipSummaryResponse internship;

    // Statut de la convention liée (si elle existe)
    private AgreementSummaryResponse agreement;
}
