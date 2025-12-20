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
public class StudentResponse {

    private Long id;

    // 🔑 Identifiant utilisateur (IMPORTANT)
    private Long userId;

    // Informations héritées de l'utilisateur
    private String firstName;
    private String lastName;
    private String email;
    private String telephone;

    // Informations spécifiques à l'étudiant
    private String studentCode;
    private String level;

    // Relation inverse : Liste des candidatures (utilisant le DTO de résumé)
    private List<ApplicationSummaryResponse> submittedApplications;
}
