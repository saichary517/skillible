package com.skillible.busbooking.controller;

import com.skillible.busbooking.dto.AdminLoginRequest;
import com.skillible.busbooking.service.AdminAuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {
  private final AdminAuthService adminAuthService;

  public AdminAuthController(AdminAuthService adminAuthService) {
    this.adminAuthService = adminAuthService;
  }

  @PostMapping("/login")
  public Map<String, String> login(@Valid @RequestBody AdminLoginRequest request) {
    if (!adminAuthService.authenticate(request.getUsername(), request.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials");
    }
    return Map.of("token", "admin-session");
  }
}
