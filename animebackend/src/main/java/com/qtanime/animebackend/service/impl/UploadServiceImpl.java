package com.qtanime.animebackend.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.qtanime.animebackend.exception.BadRequestException;
import com.qtanime.animebackend.service.UploadService;

@Service
public class UploadServiceImpl implements UploadService {

    private static final String UPLOAD_DIR = "uploads/";

    @Override
    public String uploadFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File upload không hợp lệ");
        }

        try {

            File directory = new File(UPLOAD_DIR);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            String filePath = UPLOAD_DIR + fileName;

            file.transferTo(new File(filePath));

            return fileName;

        } catch (IOException exception) {

            throw new RuntimeException("Upload file thất bại");
        }
    }

    @Override
    public void deleteFile(String fileName) {

        File file = new File(UPLOAD_DIR + fileName);

        if (file.exists()) {
            file.delete();
        }
    }
}