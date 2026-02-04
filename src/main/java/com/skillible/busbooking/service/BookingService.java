package com.skillible.busbooking.service;

import com.skillible.busbooking.dto.BookingRequest;
import com.skillible.busbooking.model.Booking;
import com.skillible.busbooking.model.Route;
import com.skillible.busbooking.repository.BookingRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BookingService {
  private final BookingRepository bookingRepository;
  private final RouteService routeService;

  public BookingService(BookingRepository bookingRepository, RouteService routeService) {
    this.bookingRepository = bookingRepository;
    this.routeService = routeService;
  }

  public Booking create(BookingRequest request) {
    Route route = routeService.get(request.getRouteId());
    Booking booking = new Booking();
    booking.setCustomerName(request.getCustomerName());
    booking.setCustomerEmail(request.getCustomerEmail());
    booking.setSeats(request.getSeats());
    booking.setStatus("PENDING_PAYMENT");
    booking.setCreatedAt(LocalDateTime.now());
    booking.setRoute(route);
    return bookingRepository.save(booking);
  }

  public List<Booking> list() {
    return bookingRepository.findAll();
  }

  public Booking get(Long id) {
    return bookingRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + id));
  }

  public Booking updateStatus(Booking booking, String status) {
    booking.setStatus(status);
    return bookingRepository.save(booking);
  }
}
