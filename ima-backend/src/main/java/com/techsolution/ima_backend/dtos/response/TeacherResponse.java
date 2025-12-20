package com.techsolution.ima_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherResponse {

    private Long id;

    // 🔑 Identifiant utilisateur (IMPORTANT)
    private Long userId;

    private String firstName;
    private String lastName;
    private String email;
    private String telephone;

    private String department;
    private String grade;
    private String specialty;

    // Relation inverse : Liste des conventions validées
    private List<AgreementSummaryResponse> validatedAgreements;
}