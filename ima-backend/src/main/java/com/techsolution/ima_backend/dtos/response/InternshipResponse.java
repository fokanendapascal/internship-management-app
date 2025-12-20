package com.techsolution.ima_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InternshipResponse {
    private Long id;
    private String title;
    private String description;
    private String city;
    private String country;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private Boolean isPaid;

    // DTO imbriqué pour afficher les infos de l'entreprise
    private CompanySummaryResponse company;
}
