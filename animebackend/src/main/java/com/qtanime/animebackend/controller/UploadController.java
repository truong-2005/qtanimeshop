package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.common.MessageResponse;
import com.qtanime.animebackend.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/uploads")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping
    public MessageResponse uploadFile(
            @RequestParam("file") MultipartFile file
    ) {

        String fileName = uploadService.uploadFile(file);

        return MessageResponse.builder()
                .message(fileName)
                .build();
    }

    @DeleteMapping
    public MessageResponse deleteFile(
            @RequestParam String fileName
    ) {

        uploadService.deleteFile(fileName);

        return MessageResponse.builder()
                .message("Xóa file thành công")
                .build();
    }
}