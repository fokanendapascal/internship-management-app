package com.techsolution.ima_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InternshipSummaryResponse {

    private Long id;
    private String title;
    private String city;
    private String country;

    // Ajoutez CompanySummaryResponse si l'étudiant doit savoir de quelle entreprise il s'agit
    private CompanySummaryResponse company;
}
