package com.techsolution.ima_backend.dtos.response;

import com.techsolution.ima_backend.entities.AgreementStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AgreementSummaryResponse {

    private Long id;
    private LocalDate creationDate;
    private AgreementStatus status;
    private String documentPdfUrl; // Pour accéder rapidement au PDF

    // Si nécessaire, inclure le nom du validateur ou de l'étudiant
    private TeacherSummaryResponse validator;
}
