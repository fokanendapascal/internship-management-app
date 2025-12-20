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
public class CompanyResponse {

    private Long id;

    // 🔑 Identifiant utilisateur (IMPORTANT)
    private Long userId;
    // Informations héritées de l'utilisateur
    private String firstName;
    private String lastName;
    private String email;
    private String telephone;


    private String name;
    private String address;
    private String description;
    private String website;
    private String phone;
    private String professionalEmail;

    // Informations héritées de l'utilisateur (pour le contact principal/connexion)
    //private String userEmail;

    // Relation inverse : Liste des offres de stages publiées
    private List<InternshipSummaryResponse> publishedInternships;
}
