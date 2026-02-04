package com.skillible.busbooking.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiAssistantService {
  private final ChatClient chatClient;

  public AiAssistantService(@Autowired(required = false) ChatClient chatClient) {
    this.chatClient = chatClient;
  }

  public String respond(String message) {
    if (chatClient == null) {
      return "AI assistant is not configured. Please set spring.ai.openai.api-key in application.properties.";
    }
    try {
      return chatClient.prompt().user(message).call().content();
    } catch (Exception ex) {
      return "AI assistant is temporarily unavailable. Please try again later.";
    }
  }
}
