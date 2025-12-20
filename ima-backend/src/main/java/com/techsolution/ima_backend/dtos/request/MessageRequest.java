package com.techsolution.ima_backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

    @NotNull(message = "Recipient ID is mandatory")
    private Long recipientId; // L'ID de l'utilisateur destinataire

    @NotBlank(message = "Content is mandatory")
    private String content;

    // L'ID de l'expéditeur est déduit du TOKEN de l'utilisateur authentifié (sécurité).
}
