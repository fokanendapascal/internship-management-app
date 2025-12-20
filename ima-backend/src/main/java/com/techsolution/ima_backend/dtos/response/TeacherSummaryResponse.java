package com.techsolution.ima_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherSummaryResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email; // Email de contact/connexion
    private String department;
    private String grade;
}