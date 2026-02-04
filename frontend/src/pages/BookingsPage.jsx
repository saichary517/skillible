import { useEffect, useState } from "react";
import { api, formatCurrency, formatDateTime } from "../api.js";
import TopNav from "../components/TopNav.jsx";

const defaultBookingForm = {
  customerName: "",
  customerEmail: "",
  seats: 1,
  routeId: "",
};

export default function BookingsPage() {
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(defaultBookingForm);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const [routesData, bookingsData] = await Promise.all([
        api.listRoutes(),
        api.listBookings(),
      ]);
      setRoutes(routesData);
      setBookings(bookingsData);
    } catch (err) {
      setError("Unable to reach the backend. Please start the API server.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      await api.createBooking({
        ...form,
        routeId: Number(form.routeId),
        seats: Number(form.seats),
      });
      setForm(defaultBookingForm);
      setStatus("Booking created! Your QR ticket is ready below.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAskAssistant = async (event) => {
    event.preventDefault();
    setAssistantReply("");
    try {
      const response = await api.askAssistant({ message: assistantMessage });
      setAssistantReply(response.response);
    } catch (err) {
      setAssistantReply("Unable to reach the AI assistant right now.");
    }
  };

  return (
    <div className="page">
      <TopNav isAdmin={false} />
      <section className="hero hero--customer">
        <div>
          <span className="pill">Book your ride</span>
          <h1>Fast bus ticket booking with instant QR tickets.</h1>
          <p>
            Choose a route, reserve seats, and receive a unique QR code with the
            booking time and milliseconds encoded for security.
          </p>
          <div className="hero__stats">
            <div>
              <strong>{routes.length}</strong>
              <span>Routes available</span>
            </div>
            <div>
              <strong>{bookings.length}</strong>
              <span>Tickets issued</span>
            </div>
          </div>
        </div>
        <div className="hero__card">
          <h3>Popular routes</h3>
          {routes.slice(0, 3).map((route) => (
            <div key={route.id} className="route-preview">
              <div>
                <span>{route.origin}</span>
                <span className="route-preview__arrow">→</span>
                <span>{route.destination}</span>
              </div>
              <div className="route-preview__meta">
                <span>{formatDateTime(route.departureTime)}</span>
                <span>{formatCurrency(route.fare)}</span>
              </div>
            </div>
          ))}
          {routes.length === 0 && (
            <p className="empty">No routes available yet.</p>
          )}
        </div>
      </section>

      <main className="grid">
        <section className="panel">
          <h2>Reserve your seat</h2>
          <p className="panel__subtitle">
            Tickets are generated instantly with a unique QR code.
          </p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__row">
              <label>
                Full name
                <input
                  value={form.customerName}
                  onChange={(event) =>
                    setForm({ ...form, customerName: event.target.value })
                  }
                  placeholder="Alex Jordan"
                  required
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(event) =>
                    setForm({ ...form, customerEmail: event.target.value })
                  }
                  placeholder="alex@example.com"
                  required
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                Choose route
                <select
                  value={form.routeId}
                  onChange={(event) =>
                    setForm({ ...form, routeId: event.target.value })
                  }
                  required
                >
                  <option value="">Select a route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.origin} → {route.destination} ·{" "}
                      {formatCurrency(route.fare)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Seats
                <input
                  type="number"
                  min="1"
                  value={form.seats}
                  onChange={(event) =>
                    setForm({ ...form, seats: event.target.value })
                  }
                  required
                />
              </label>
            </div>
            <button className="button button--primary" type="submit">
              Book ticket
            </button>
          </form>
        </section>

        <section className="panel panel--highlight">
          <h2>Ask the AI travel assistant</h2>
          <p className="panel__subtitle">
            Get help with routes, fares, and travel tips powered by Spring AI.
          </p>
          <form className="form" onSubmit={handleAskAssistant}>
            <label>
              Your question
              <textarea
                rows="4"
                value={assistantMessage}
                onChange={(event) => setAssistantMessage(event.target.value)}
                placeholder="Which route is best for a morning trip?"
                required
              />
            </label>
            <button className="button" type="submit">
              Ask assistant
            </button>
          </form>
          {assistantReply && <p className="assistant__reply">{assistantReply}</p>}
        </section>

        <section className="panel">
          <h2>Issued tickets</h2>
          <p className="panel__subtitle">
            Show the QR code at boarding for quick verification.
          </p>
          <div className="tickets">
            {bookings.slice(0, 4).map((booking) => (
              <div key={booking.id} className="ticket">
                <div>
                  <strong>{booking.customerName}</strong>
                  <span>
                    {booking.route?.origin} → {booking.route?.destination}
                  </span>
                  <span>{formatDateTime(booking.createdAt)}</span>
                </div>
                <div className="ticket__meta">
                  <span>{booking.status}</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>
                {booking.qrCodeImage && (
                  <img
                    className="ticket__qr"
                    src={`data:image/png;base64,${booking.qrCodeImage}`}
                    alt={`QR code for booking ${booking.id}`}
                  />
                )}
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="empty">No tickets booked yet.</p>
            )}
          </div>
        </section>
      </main>

      {(status || error) && (
        <div className={`toast ${error ? "toast--error" : ""}`}>
          <span>{error || status}</span>
        </div>
      )}
    </div>
  );
}
