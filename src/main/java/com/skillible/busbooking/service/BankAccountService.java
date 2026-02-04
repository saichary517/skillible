package com.skillible.busbooking.service;

import com.skillible.busbooking.dto.BankAccountRequest;
import com.skillible.busbooking.model.BankAccount;
import com.skillible.busbooking.repository.BankAccountRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BankAccountService {
  private final BankAccountRepository bankAccountRepository;

  public BankAccountService(BankAccountRepository bankAccountRepository) {
    this.bankAccountRepository = bankAccountRepository;
  }

  public BankAccount create(BankAccountRequest request) {
    BankAccount account = new BankAccount();
    account.setBankName(request.getBankName());
    account.setAccountNumber(request.getAccountNumber());
    account.setIfscCode(request.getIfscCode());
    account.setAccountHolderName(request.getAccountHolderName());
    return bankAccountRepository.save(account);
  }

  public List<BankAccount> list() {
    return bankAccountRepository.findAll();
  }
}
