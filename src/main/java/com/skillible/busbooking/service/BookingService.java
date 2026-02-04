package com.skillible.busbooking.service;

import com.skillible.busbooking.dto.BookingRequest;
import com.skillible.busbooking.model.Booking;
import com.skillible.busbooking.model.Route;
import com.skillible.busbooking.repository.BookingRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class BookingService {
  private final BookingRepository bookingRepository;
  private final RouteService routeService;
  private final QrCodeService qrCodeService;

  public BookingService(
      BookingRepository bookingRepository,
      RouteService routeService,
      QrCodeService qrCodeService) {
    this.bookingRepository = bookingRepository;
    this.routeService = routeService;
    this.qrCodeService = qrCodeService;
  }

  public Booking create(BookingRequest request) {
    Route route = routeService.get(request.getRouteId());
    Booking booking = new Booking();
    booking.setCustomerName(request.getCustomerName());
    booking.setCustomerEmail(request.getCustomerEmail());
    booking.setSeats(request.getSeats());
    booking.setStatus("PENDING_PAYMENT");
    LocalDateTime createdAt = LocalDateTime.now();
    booking.setCreatedAt(createdAt);
    booking.setTotalAmount(route.getFare().multiply(BigDecimal.valueOf(request.getSeats())));
    String qrPayload = buildQrPayload(route.getId());
    booking.setQrCodePayload(qrPayload);
    booking.setQrCodeImage(qrCodeService.generateBase64Png(qrPayload));
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

  private String buildQrPayload(Long routeId) {
    long millis = System.currentTimeMillis();
    String timestamp = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")
        .format(Instant.ofEpochMilli(millis).atZone(ZoneId.systemDefault()));
    String nonce = UUID.randomUUID().toString().substring(0, 8);
    return "BOOKING-" + routeId + "-" + timestamp + "-" + millis + "-" + nonce;
  }
}
