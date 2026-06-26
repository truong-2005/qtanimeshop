package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.chatbot.ChatRequest;
import com.qtanime.animebackend.dto.chatbot.ChatResponse;
import com.qtanime.animebackend.service.ChatBotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class ChatBotController {

    private final ChatBotService chatBotService;

    @PostMapping("/ask")
    public ChatResponse ask(
            @Valid @RequestBody ChatRequest request
    ) {

        return chatBotService.ask(request);
    }
}