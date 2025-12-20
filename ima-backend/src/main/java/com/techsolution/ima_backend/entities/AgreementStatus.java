package com.techsolution.ima_backend.entities;

public enum AgreementStatus {
    DRAFT, // En cours de création par l'entreprise ou l'étudiant
    PENDING_VALIDATION, // Envoyée à l'enseignant pour validation
    VALIDATED, // Validée par l'enseignant
    SENT_FOR_SIGNATURE, // Envoyée aux parties pour signature
    SIGNED, // Convention finale signée
    CANCELED
}
