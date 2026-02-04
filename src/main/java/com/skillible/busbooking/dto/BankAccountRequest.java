package com.skillible.busbooking.dto;

import jakarta.validation.constraints.NotBlank;

public class BankAccountRequest {
  @NotBlank
  private String bankName;

  @NotBlank
  private String accountNumber;

  @NotBlank
  private String ifscCode;

  @NotBlank
  private String accountHolderName;

  public String getBankName() {
    return bankName;
  }

  public void setBankName(String bankName) {
    this.bankName = bankName;
  }

  public String getAccountNumber() {
    return accountNumber;
  }

  public void setAccountNumber(String accountNumber) {
    this.accountNumber = accountNumber;
  }

  public String getIfscCode() {
    return ifscCode;
  }

  public void setIfscCode(String ifscCode) {
    this.ifscCode = ifscCode;
  }

  public String getAccountHolderName() {
    return accountHolderName;
  }

  public void setAccountHolderName(String accountHolderName) {
    this.accountHolderName = accountHolderName;
  }
}
