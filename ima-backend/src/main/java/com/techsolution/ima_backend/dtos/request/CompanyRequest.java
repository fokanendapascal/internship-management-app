package com.techsolution.ima_backend.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequest {

    @NotBlank(message = "Company name is mandatory")
    private String name;

    @NotBlank(message = "Address is mandatory")
    private String address;

    private String description;
    private String website;
    private String phone;

    @NotBlank(message = "Professional email is mandatory")
    @Email(message = "Must be a valid email format")
    private String professionalEmail;
}
