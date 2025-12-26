package com.techsolution.ima_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Contrôleur dédié au téléchargement et à la visualisation des fichiers.
 * Gère principalement l'accès aux CV stockés sur le serveur.
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/files")
@Tag(name = "File Management", description = "API de gestion et téléchargement de fichiers (CV, documents)")
public class FileDownloadController {

    private final Path root = Paths.get("uploads/cvs");

    @Operation(
            summary = "Visualiser ou télécharger un CV",
            description = "Récupère un fichier CV par son nom. Le fichier est renvoyé avec un Content-Disposition 'inline' pour permettre une visualisation directe dans le navigateur."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fichier récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Fichier introuvable sur le serveur"),
            @ApiResponse(responseCode = "500", description = "Erreur lors de la lecture du fichier")
    })
    @GetMapping("/cv/{filename:.+}")
    public ResponseEntity<Resource> downloadCV(
            @Parameter(description = "Nom complet du fichier avec son extension (ex: cv_jean.pdf)")
            @PathVariable String filename) {
        try {
            Path file = root.resolve(filename);
            UrlResource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        // Affiche le PDF dans le navigateur au lieu de le télécharger directement
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body((Resource) resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
