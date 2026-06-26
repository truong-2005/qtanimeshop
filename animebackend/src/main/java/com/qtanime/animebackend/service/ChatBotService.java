package com.qtanime.animebackend.service;

import com.qtanime.animebackend.dto.chatbot.ChatRequest;
import com.qtanime.animebackend.dto.chatbot.ChatResponse;

public interface ChatBotService {

    ChatResponse ask(ChatRequest request);
}