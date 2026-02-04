package com.skillible.busbooking.service;

import com.skillible.busbooking.dto.RouteRequest;
import com.skillible.busbooking.model.Route;
import com.skillible.busbooking.repository.RouteRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RouteService {
  private final RouteRepository routeRepository;

  public RouteService(RouteRepository routeRepository) {
    this.routeRepository = routeRepository;
  }

  public Route create(RouteRequest request) {
    Route route = new Route();
    route.setOrigin(request.getOrigin());
    route.setDestination(request.getDestination());
    route.setDepartureTime(request.getDepartureTime());
    route.setArrivalTime(request.getArrivalTime());
    route.setFare(request.getFare());
    return routeRepository.save(route);
  }

  public List<Route> list() {
    return routeRepository.findAll();
  }

  public Route get(Long id) {
    return routeRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Route not found: " + id));
  }
}
