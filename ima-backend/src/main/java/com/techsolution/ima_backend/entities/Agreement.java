package com.techsolution.ima_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "agreements")
public class Agreement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate creationDate;
    private LocalDate startDate;
    private LocalDate endDate;

    // État de la convention (ex: Draft, Pending_Validation, Validated, Signed)
    @Enumerated(EnumType.STRING)
    private AgreementStatus status;

    private String documentPdfUrl;

    // 1. Lien OneToOne vers la Candidature (Source de la Convention)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", unique = true, nullable = false)
    private Application application;

    // 2. Lien ManyToOne vers l'Enseignant (Validateur)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_validator_id")
    // Peut être nullable si la validation n'est pas encore faite
    private Teacher validator;

}
