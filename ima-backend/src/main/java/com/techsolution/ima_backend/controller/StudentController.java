package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.StudentRequest;
import com.techsolution.ima_backend.dtos.response.StudentResponse;
import com.techsolution.ima_backend.services.StudentService;
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
 * Contrôleur pour la gestion des profils étudiants.
 * Permet l'enregistrement des informations académiques et personnelles des étudiants liés à un compte utilisateur.
 */
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Students", description = "API de gestion des étudiants (Profils académiques et informations personnelles)")
public class StudentController {

    private final StudentService studentService;

    //Build add student REST API
    @Operation(
            summary = "Enregistrer un profil étudiant",
            description = "Crée un profil étudiant complet et le lie à un compte utilisateur existant via son ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Profil étudiant créé avec succès"),
            @ApiResponse(responseCode = "400", description = "Données du profil invalides"),
            @ApiResponse(responseCode = "404", description = "Compte utilisateur non trouvé")
    })
    @PostMapping
    public ResponseEntity<StudentResponse> addStudent(
            @Parameter(description = "ID de l'utilisateur à associer au profil étudiant") @RequestParam Long userId,
            @RequestBody StudentRequest studentRequest) {
        StudentResponse savedStudent = studentService.createStudent(userId, studentRequest);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    //Build get student REST API
    @Operation(summary = "Récupérer un étudiant par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Étudiant trouvé"),
            @ApiResponse(responseCode = "404", description = "Profil étudiant inexistant")
    })
    @GetMapping("{id}")
    public ResponseEntity<StudentResponse> getStudentById(
            @Parameter(description = "Identifiant unique de l'étudiant") @PathVariable("id") Long studentId) {
        StudentResponse student = studentService.getStudentById(studentId);
        return ResponseEntity.ok(student);
    }

    //Build all students REST API
    @Operation(summary = "Lister tous les étudiants")
    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    //Build update student REST API
    @Operation(summary = "Mettre à jour le profil d'un étudiant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profil mis à jour avec succès"),
            @ApiResponse(responseCode = "404", description = "Étudiant non trouvé")
    })
    @PutMapping("{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable("id") Long studentId,
            @RequestBody StudentRequest studentRequest) {
        StudentResponse updatedStudent = studentService.updateStudent(studentId, studentRequest);
        return ResponseEntity.ok(updatedStudent);
    }

    //Build delete student REST API
    @Operation(
            summary = "Supprimer un profil étudiant",
            description = "Supprime définitivement les données liées au profil de l'étudiant."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Étudiant supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Profil non trouvé")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable("id") Long studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }
}
