package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.exceptions.StorageException;
import com.techsolution.ima_backend.services.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    // Dossier racine où seront stockés les fichiers
    private final Path root = Paths.get("uploads");

    @Override
    public String save(MultipartFile file) {
        try {
            // Créer le dossier s'il n'existe pas
            if (!Files.exists(root)) Files.createDirectories(root);

            // Générer un nom unique (timestamp + nom original)
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));

            return "/api/v1/files/cv/" + filename; // On retourne le nom pour le stocker en BDD
        } catch (Exception e) {
            throw new StorageException("Impossible de stocker le fichier : " + e.getMessage());
        }
    }
}
