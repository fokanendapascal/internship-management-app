package com.techsolution.ima_backend.dtos.response;

import com.techsolution.ima_backend.entities.AgreementStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgreementResponse {

    private Long id;
    private LocalDate creationDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private AgreementStatus status;
    private String documentPdfUrl;

    // DTOs imbriqués pour les relations
    private ApplicationSummaryResponse application;
    private TeacherSummaryResponse validator;
}