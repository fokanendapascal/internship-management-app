package com.techsolution.ima_backend.controller;

import jakarta.annotation.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/files")
public class FileDownloadController {

    private final Path root = Paths.get("uploads/cvs");

    @GetMapping("/cv/{filename:.+}")
    public ResponseEntity<Resource> downloadCV(@PathVariable String filename) {
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
