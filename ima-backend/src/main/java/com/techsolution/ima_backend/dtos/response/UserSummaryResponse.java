package com.techsolution.ima_backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    // On n'inclut pas le téléphone ou les rôles dans un résumé simple de message
}
