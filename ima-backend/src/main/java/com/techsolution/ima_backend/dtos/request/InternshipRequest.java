package com.techsolution.ima_backend.dtos.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InternshipRequest {

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotBlank(message = "City is mandatory")
    private String city;

    private String country;

    @NotNull(message = "Start date is mandatory")
    private LocalDate startDate;

    @NotNull(message = "End date is mandatory")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    private Boolean isActive = false;
    private Boolean isPaid = false;

    /**
     * Validation cross-field : startDate doit être avant endDate
     */
    @AssertTrue(message = "Start date must be before end date")
    public boolean isValidDates() {
        return startDate != null && endDate != null && startDate.isBefore(endDate);
    }
}
