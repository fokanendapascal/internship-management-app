package com.techsolution.ima_backend.dtos.response;
import com.techsolution.ima_backend.entities.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;

}
