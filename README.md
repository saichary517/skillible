# Bus Ticket Booking API

Spring Boot backend for a mobile bus ticket booking application with routes, bookings, and payments.

## Features
- Manage bus routes
- Create bookings tied to a route
- Capture payments through a simulated payment gateway
- Generate unique QR tickets on booking
- Admin login for route, fare, and bank account management
- AI travel assistant endpoint powered by Spring AI

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

To enable the AI assistant, set `spring.ai.openai.api-key` to a valid OpenAI key.

## Run
```bash
mvn spring-boot:run
```

## Frontend (React)
The React dashboard lives in `frontend/` and proxies API calls to the Spring Boot server.

```bash
cd frontend
npm install
npm run dev
```

Optional: set `VITE_API_URL` to point at a hosted API (defaults to `/api` with the dev proxy).

### Admin Login
The admin portal uses credentials configured in `application.properties`.

Default credentials:
- Username: `admin`
- Password: `admin123`

Update `app.admin.username` and `app.admin.password` to change them.

## API Endpoints
### Routes
- `POST /api/routes` - create a route
- `GET /api/routes` - list routes
- `PUT /api/routes/{id}/fare` - update a fare

### Bookings
- `POST /api/bookings` - create a booking
- `GET /api/bookings` - list bookings

### Payments
- `POST /api/payments` - capture a payment
- `GET /api/payments` - list payments

### Bank Accounts
- `POST /api/bank-accounts` - add a bank account
- `GET /api/bank-accounts` - list bank accounts

### Admin
- `POST /api/admin/login` - login for admins

### AI Assistant
- `POST /api/assistant` - ask the Spring AI assistant

## Sample Requests
Create a route:

```json
POST /api/routes
{
  "origin": "City A",
  "destination": "City B",
  "fare": 25.50
}
```

`departureTime` and `arrivalTime` are optional; when omitted they are auto-populated.

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

Ask the assistant:

```json
POST /api/assistant
{
  "message": "Suggest the best morning route from City A."
}
```
