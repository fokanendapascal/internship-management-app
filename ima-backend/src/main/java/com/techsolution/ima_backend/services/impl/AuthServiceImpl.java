package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.UserLoginRequest;
import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.AuthResponse;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.entities.UserRole;
import com.techsolution.ima_backend.exceptions.DuplicateResourceException;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.UserMapper;
import com.techsolution.ima_backend.repository.UserRepository;
import com.techsolution.ima_backend.security.JwtUtil;
import com.techsolution.ima_backend.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(UserLoginRequest userLoginRequest) {

        // 1. Authentification via Spring Security AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLoginRequest.getEmail(),
                        userLoginRequest.getPassword()
                )
        );

        // 2. Si l'authentification réussit, récupérer l'utilisateur par Email
        User user = userRepository.findByEmail(userLoginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User is not exists with given email: " + userLoginRequest.getEmail()));

        // 3. Conversion des rôles en Set<String> pour le JWT
        List<String> roles = user.getRoles().stream()
                .map(UserRole::name) // Conversion de l'enum UserRole en String
                .collect(Collectors.toList());

        // 4. Génération des Tokens
        String accessToken = jwtUtil.generateToken(user.getEmail(), roles);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // 5. Retour de la réponse
        return new AuthResponse(
                accessToken,
                refreshToken,
                UserMapper.toSummaryResponse(user)
        );
    }

    @Override
    @Transactional
    public AuthResponse register(UserRegisterRequest userRegisterRequest) {

        // 1. Vérification de l'unicité par email
        if (userRepository.findByEmail(userRegisterRequest.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User already exists with email: " + userRegisterRequest.getEmail());
        }

        // 2. Création de l'entité User (Rôles par défaut : USER)
        User newUser = new User();
        newUser.setEmail(userRegisterRequest.getEmail());
        newUser.setFirstName(userRegisterRequest.getFirstName());
        newUser.setLastName(userRegisterRequest.getLastName());
        newUser.setTelephone(userRegisterRequest.getTelephone());
        newUser.setPassword(passwordEncoder.encode(userRegisterRequest.getPassword()));

        List<UserRole> assignedRoles;
        if (userRegisterRequest.getRoles() != null && !userRegisterRequest.getRoles().isEmpty()) {
            assignedRoles = userRegisterRequest.getRoles().stream()
                    .map(UserRole::valueOf)
                    .collect(Collectors.toList());
        } else {
            assignedRoles = new ArrayList<>();
            assignedRoles.add(UserRole.USER);
        }
        newUser.setRoles(assignedRoles);

        // 3. Sauvegarde
        userRepository.save(newUser);

        List<String> roles = newUser.getRoles().stream()
                .map(UserRole::name)
                .collect(Collectors.toList());

        String accessToken = jwtUtil.generateToken(newUser.getEmail(), roles);
        String refreshToken = jwtUtil.generateRefreshToken(newUser);

        // 6. Retour de la réponse
        return new AuthResponse(
                accessToken,
                refreshToken,
                UserMapper.toSummaryResponse(newUser)
        );
    }

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {

            throw new AccessDeniedException("Utilisateur non authentifié");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utilisateur non trouvé : " + email
                ));
    }
}