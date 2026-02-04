package com.skillible.busbooking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {
  private final String adminUsername;
  private final String adminPassword;

  public AdminAuthService(
      @Value("${app.admin.username}") String adminUsername,
      @Value("${app.admin.password}") String adminPassword) {
    this.adminUsername = adminUsername;
    this.adminPassword = adminPassword;
  }

  public boolean authenticate(String username, String password) {
    return adminUsername.equals(username) && adminPassword.equals(password);
  }
}
