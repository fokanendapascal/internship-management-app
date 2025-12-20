package com.techsolution.ima_backend.dtos.request;

import com.techsolution.ima_backend.entities.AgreementStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgreementRequest {

    @NotNull(message = "Start date is mandatory")
    private LocalDate startDate;

    @NotNull(message = "End date is mandatory")
    private LocalDate endDate;

    // URL du document PDF final (peut être envoyé lors d'une mise à jour)
    private String documentPdfUrl;

    // L'ID du validateur (enseignant) pourrait être envoyé lors de l'assignation
    //private Long validatorId;

    // Statut de la convention : DRAFT, PENDING, VALIDATED, etc.
    private AgreementStatus status;

}
