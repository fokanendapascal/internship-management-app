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
public class ApplicationSummaryResponse {

    private Long id;
    private LocalDate applicationDate;
    private ApplicationStatus status;

    // Inclure un résumé de l'offre ou de l'étudiant pour le contexte
    private InternshipSummaryResponse internship; // Si l'étudiant voit la liste
    private StudentSummaryResponse student;     // Si l'entreprise voit la liste
}