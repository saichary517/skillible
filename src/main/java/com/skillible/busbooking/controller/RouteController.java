package com.skillible.busbooking.controller;

import com.skillible.busbooking.dto.FareUpdateRequest;
import com.skillible.busbooking.dto.RouteRequest;
import com.skillible.busbooking.model.Route;
import com.skillible.busbooking.service.RouteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
  private final RouteService routeService;

  public RouteController(RouteService routeService) {
    this.routeService = routeService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Route createRoute(@Valid @RequestBody RouteRequest request) {
    return routeService.create(request);
  }

  @GetMapping
  public List<Route> listRoutes() {
    return routeService.list();
  }

  @PutMapping("/{id}/fare")
  public Route updateFare(@PathVariable Long id, @Valid @RequestBody FareUpdateRequest request) {
    return routeService.updateFare(id, request.getFare());
  }
}
