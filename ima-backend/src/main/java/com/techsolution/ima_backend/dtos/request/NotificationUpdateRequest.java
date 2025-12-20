package com.techsolution.ima_backend.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationUpdateRequest {
    // La seule chose que l'utilisateur peut mettre à jour est généralement l'état de lecture
    private boolean isViewed;
}
