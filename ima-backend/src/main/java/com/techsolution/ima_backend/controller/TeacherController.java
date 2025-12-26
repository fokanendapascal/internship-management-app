package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.TeacherRequest;
import com.techsolution.ima_backend.dtos.response.TeacherResponse;
import com.techsolution.ima_backend.entities.Teacher;
import com.techsolution.ima_backend.services.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour la gestion des profils enseignants.
 * Permet de définir les spécialités et informations professionnelles des enseignants liés à un compte utilisateur.
 */
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/teachers")
@Tag(name = "Teachers", description = "Api de gestion des enseignants (Profils professionnels et spécialités)")
public class TeacherController {

    private final TeacherService teacherService;

    //Build add teacher REST API
    @Operation(
            summary = "Enregistrer un profil enseignant",
            description = "Crée un profil enseignant complet et le lie à un compte utilisateur existant via son ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Profil enseignant créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Données du profil invalides"),
            @ApiResponse(responseCode = "404", description = "Compte utilisateur non trouvé")
    })
    @PostMapping
    public ResponseEntity<TeacherResponse> createTeacher(
            @Parameter(description = "ID de l'utilisateur à associer au profil enseignant") @RequestParam Long userId,
            @RequestBody TeacherRequest teacherRequest) {
        TeacherResponse savedTeacher = teacherService.createTeacher(userId, teacherRequest);
        return new ResponseEntity<>(savedTeacher, HttpStatus.CREATED);
    }

    //Build get teacher REST API
    @Operation(summary = "Récupérer un enseignant par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Enseignant trouvé"),
            @ApiResponse(responseCode = "404", description = "Profil enseignant inexistant")
    })
    @GetMapping("{id}")
    public ResponseEntity<TeacherResponse> getTeacher(
            @Parameter(description = "Identifiant unique de l'enseignant") @PathVariable("id") Long teacherId) {
        TeacherResponse teacher = teacherService.getTeacherById(teacherId);
        return ResponseEntity.ok(teacher);
    }

    //Build get all teachers REST API
    @Operation(summary = "Lister tous les enseignants")
    @GetMapping
    public ResponseEntity<List<TeacherResponse>> getAllTeachers() {
        List<TeacherResponse> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    //Build update teacher REST API
    @Operation(summary = "Mettre à jour le profil d'un enseignant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profil mis à jour avec succès"),
            @ApiResponse(responseCode = "404", description = "Enseignant non trouvé")
    })
    @PutMapping("{id}")
    public ResponseEntity<TeacherResponse> updateTeacher(
            @PathVariable("id") Long teacherId,
            @RequestBody TeacherRequest teacherRequest) {
        TeacherResponse updatedTeacher = teacherService.updateTeacherById(teacherId, teacherRequest);
        return ResponseEntity.ok(updatedTeacher);
    }

    //Build delete teacher REST API
    @Operation(
            summary = "Supprimer un profil enseignant",
            description = "Supprime définitivement les données liées au profil de l'enseignant."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Enseignant supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Profil non trouvé")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable("id") Long teacherId) {
        teacherService.deleteTeacherById(teacherId);
        return ResponseEntity.noContent().build();
    }
}
