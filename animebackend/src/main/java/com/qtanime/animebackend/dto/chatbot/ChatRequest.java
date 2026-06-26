package com.qtanime.animebackend.dto.chatbot;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {

    @NotBlank(message = "Câu hỏi không được để trống")
    private String question;
}