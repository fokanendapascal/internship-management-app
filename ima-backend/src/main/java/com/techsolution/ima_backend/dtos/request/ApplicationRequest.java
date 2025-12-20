package com.techsolution.ima_backend.dtos.request;

import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationRequest {

    // URL du CV stocké (ex: S3 link)
    @NotBlank(message = "CV URL is mandatory")
    private String cvUrl;

    @NotBlank(message = "Cover letter content is mandatory")
    private String coverLetter;

    @NotNull(message = "Internship ID is mandatory")
    private Long internshipId;
}
