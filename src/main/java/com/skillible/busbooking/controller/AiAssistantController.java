package com.skillible.busbooking.controller;

import com.skillible.busbooking.dto.AssistantRequest;
import com.skillible.busbooking.service.AiAssistantService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
public class AiAssistantController {
  private final AiAssistantService aiAssistantService;

  public AiAssistantController(AiAssistantService aiAssistantService) {
    this.aiAssistantService = aiAssistantService;
  }

  @PostMapping
  public Map<String, String> ask(@Valid @RequestBody AssistantRequest request) {
    return Map.of("response", aiAssistantService.respond(request.getMessage()));
  }
}
