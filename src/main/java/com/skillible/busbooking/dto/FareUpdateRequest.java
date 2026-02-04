package com.skillible.busbooking.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class FareUpdateRequest {
  @NotNull
  private BigDecimal fare;

  public BigDecimal getFare() {
    return fare;
  }

  public void setFare(BigDecimal fare) {
    this.fare = fare;
  }
}
