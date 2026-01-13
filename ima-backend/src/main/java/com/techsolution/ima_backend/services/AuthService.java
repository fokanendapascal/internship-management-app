package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.UserLoginRequest;
import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.AuthResponse;
import com.techsolution.ima_backend.dtos.response.UserResponse;
import com.techsolution.ima_backend.entities.User;
import org.springframework.security.core.Authentication;

public interface AuthService {

    // Authentification de base
    AuthResponse login(UserLoginRequest userLoginRequest);

    // Inscription d'un nouvel utilisateur
    AuthResponse register(UserRegisterRequest userRegisterRequest);

    // Récupération de l'utilisateur connecté (Utile pour la logique métier interne)
    User getAuthenticatedUserEntity();

    // Récupération du profil utilisateur (Utile pour l'affichage Frontend)
    UserResponse getAuthenticatedUserResponse();

    // Optionnel : Pour rafraîchir le token sans se reconnecter
     AuthResponse refreshToken(String refreshToken);

}
