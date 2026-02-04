package com.skillible.busbooking.controller;

import com.skillible.busbooking.dto.BankAccountRequest;
import com.skillible.busbooking.model.BankAccount;
import com.skillible.busbooking.service.BankAccountService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bank-accounts")
public class BankAccountController {
  private final BankAccountService bankAccountService;

  public BankAccountController(BankAccountService bankAccountService) {
    this.bankAccountService = bankAccountService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BankAccount createBankAccount(@Valid @RequestBody BankAccountRequest request) {
    return bankAccountService.create(request);
  }

  @GetMapping
  public List<BankAccount> listBankAccounts() {
    return bankAccountService.list();
  }
}
