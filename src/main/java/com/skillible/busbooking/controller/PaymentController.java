package com.skillible.busbooking.controller;

import com.skillible.busbooking.dto.PaymentRequest;
import com.skillible.busbooking.model.Payment;
import com.skillible.busbooking.service.PaymentService;
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
@RequestMapping("/api/payments")
public class PaymentController {
  private final PaymentService paymentService;

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Payment createPayment(@Valid @RequestBody PaymentRequest request) {
    return paymentService.create(request);
  }

  @GetMapping
  public List<Payment> listPayments() {
    return paymentService.list();
  }
}
