package com.skillible.busbooking.service;

import com.skillible.busbooking.dto.PaymentRequest;
import com.skillible.busbooking.model.Booking;
import com.skillible.busbooking.model.Payment;
import com.skillible.busbooking.repository.PaymentRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
  private final PaymentRepository paymentRepository;
  private final BookingService bookingService;

  public PaymentService(PaymentRepository paymentRepository, BookingService bookingService) {
    this.paymentRepository = paymentRepository;
    this.bookingService = bookingService;
  }

  public Payment create(PaymentRequest request) {
    Booking booking = bookingService.get(request.getBookingId());
    Payment payment = new Payment();
    payment.setBooking(booking);
    payment.setAmount(request.getAmount());
    payment.setProvider(request.getProvider());
    payment.setStatus("SUCCESS");
    payment.setTransactionReference(UUID.randomUUID().toString());
    payment.setCreatedAt(LocalDateTime.now());
    bookingService.updateStatus(booking, "CONFIRMED");
    return paymentRepository.save(payment);
  }

  public List<Payment> list() {
    return paymentRepository.findAll();
  }
}
