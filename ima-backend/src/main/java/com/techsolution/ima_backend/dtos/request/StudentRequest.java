package com.techsolution.ima_backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRequest {

    @NotBlank(message = "Student code (Matricule) is mandatory")
    private String studentCode;

    @NotBlank(message = "Level is mandatory")
    private String level;

}
