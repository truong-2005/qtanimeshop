package com.qtanime.animebackend.service;

import org.springframework.web.multipart.MultipartFile;

public interface UploadService {

    String uploadFile(MultipartFile file);

    void deleteFile(String fileName);
}