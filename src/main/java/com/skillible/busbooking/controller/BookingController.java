package com.skillible.busbooking.controller;

import com.skillible.busbooking.dto.BookingRequest;
import com.skillible.busbooking.model.Booking;
import com.skillible.busbooking.service.BookingService;
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
@RequestMapping("/api/bookings")
public class BookingController {
  private final BookingService bookingService;

  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Booking createBooking(@Valid @RequestBody BookingRequest request) {
    return bookingService.create(request);
  }

  @GetMapping
  public List<Booking> listBookings() {
    return bookingService.list();
  }
}
