package com.techsolution.ima_backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRequest {

    @NotBlank(message = "Department is mandatory")
    private String department;

    @NotBlank(message = "Grade is mandatory")
    private String grade;

    private String specialty;
}
