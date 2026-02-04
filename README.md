# Bus Ticket Booking API

Spring Boot backend for a mobile bus ticket booking application with routes, bookings, and payments.

## Features
- Manage bus routes
- Create bookings tied to a route
- Capture payments through a simulated payment gateway

## Requirements
- Java 17+
- Maven
- MySQL

## Configure MySQL
Create a database and user (example):

```sql
CREATE DATABASE bus_booking;
CREATE USER 'bus_user'@'localhost' IDENTIFIED BY 'bus_password';
GRANT ALL PRIVILEGES ON bus_booking.* TO 'bus_user'@'localhost';
```

Update `src/main/resources/application.properties` as needed.

## Run
```bash
mvn spring-boot:run
```

## API Endpoints
### Routes
- `POST /api/routes` - create a route
- `GET /api/routes` - list routes

### Bookings
- `POST /api/bookings` - create a booking
- `GET /api/bookings` - list bookings

### Payments
- `POST /api/payments` - capture a payment
- `GET /api/payments` - list payments

## Sample Requests
Create a route:

```json
POST /api/routes
{
  "origin": "City A",
  "destination": "City B",
  "departureTime": "2024-08-01T09:00:00",
  "arrivalTime": "2024-08-01T12:00:00",
  "fare": 25.50
}
```

Create a booking:

```json
POST /api/bookings
{
  "customerName": "Alex",
  "customerEmail": "alex@example.com",
  "seats": 2,
  "routeId": 1
}
```

Capture a payment:

```json
POST /api/payments
{
  "bookingId": 1,
  "amount": 51.00,
  "provider": "Stripe"
}
```
