package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.UserResponse;
import com.techsolution.ima_backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour l'administration et la gestion des comptes utilisateurs.
 * Gère les opérations de base (CRUD) ainsi que les fonctionnalités de recherche multicritères.
 */
@Slf4j
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Api de gestion des utilisateurs (Comptes, profils et recherche)")
public class UserController {

    private final UserService userService;

    //Build add User REST API
    @Operation(
            summary = "Créer un nouvel utilisateur",
            description = "Enregistre un utilisateur de base dans le système. Note : pour l'authentification, utilisez l'API /auth/register."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Utilisateur créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Données d'inscription invalides")
    })
    @PostMapping
    public ResponseEntity<UserResponse>  createUser(@RequestBody UserRegisterRequest userRegisterRequest) {
        UserResponse savedUser = userService.createUser(userRegisterRequest);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    //Build get User REST API
    @Operation(summary = "Récupérer un utilisateur par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilisateur trouvé"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @GetMapping("{id}")
    public ResponseEntity<UserResponse> getUserById(
            @Parameter(description = "Identifiant unique de l'utilisateur") @PathVariable("id") Long userId) {
        UserResponse userResponse = userService.getUserById(userId);
        return ResponseEntity.ok(userResponse);
    }

    //Build get all User REST API
    @Operation(summary = "Lister tous les utilisateurs")
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    //Build update User REST API
    @Operation(summary = "Mettre à jour les informations d'un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilisateur mis à jour"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @PutMapping("{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable("id") Long userId,
            @RequestBody UserRegisterRequest userRegisterRequest) {
        UserResponse updatedUser = userService.updateUser(userId, userRegisterRequest);
        return ResponseEntity.ok(updatedUser);
    }

    //Build delete User REST API
    @Operation(summary = "Supprimer un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Utilisateur supprimé"),
            @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    //Build search User REST API
    @Operation(
            summary = "Rechercher un utilisateur",
            description = "Permet de rechercher un utilisateur spécifique en utilisant un mot-clé global, une adresse email ou un nom."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Résultat de la recherche retourné"),
            @ApiResponse(responseCode = "404", description = "Aucun utilisateur ne correspond aux critères")
    })
    @GetMapping("/search")
    public ResponseEntity<UserResponse> searchUser(
            @Parameter(description = "Mot-clé de recherche globale") @RequestParam(value = "keyword", required = false) String keyword,
            @Parameter(description = "Recherche exacte par email") @RequestParam(value = "email", required = false) String email,
            @Parameter(description = "Recherche par nom") @RequestParam(value = "name", required = false) String name
    ) {
        // It's often helpful to log the incoming request for debugging
        log.info("Searching for users with keyword: {}, email: {}, name: {}", keyword, email, name);

        UserResponse user = userService.searchUser(keyword, email, name);
        return ResponseEntity.ok(user);
    }
}
