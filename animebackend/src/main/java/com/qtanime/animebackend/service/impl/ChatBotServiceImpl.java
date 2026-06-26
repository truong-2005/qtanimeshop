package com.qtanime.animebackend.service.impl;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.dto.chatbot.ChatRequest;
import com.qtanime.animebackend.dto.chatbot.ChatResponse;
import com.qtanime.animebackend.service.ChatBotService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatBotServiceImpl implements ChatBotService {

    @Override
    public ChatResponse ask(ChatRequest request) {

        return ChatResponse.builder()
                .question(request.getQuestion())
                .answer("AI chatbot đang xử lý câu hỏi: " + request.getQuestion())
                .build();
    }
}