package com.techsolution.ima_backend.services;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String save(MultipartFile file);
}
