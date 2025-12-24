package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.UserLoginRequest;
import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.AuthResponse;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.services.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentications", description = "Api de gestion des authentifications")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest userRegisterRequest) {
        return new ResponseEntity<>(authService.register(userRegisterRequest), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest userLoginRequest) {
        return ResponseEntity.ok(authService.login(userLoginRequest));
    }

    @GetMapping("/authenticated")
    public ResponseEntity<User> getAuth() {
        User user = authService.getAuthenticatedUser();
        return ResponseEntity.ok(user);
    }
}
