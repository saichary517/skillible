import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

const defaultRouteForm = {
  origin: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  fare: "",
};

const defaultBookingForm = {
  customerName: "",
  customerEmail: "",
  seats: 1,
  routeId: "",
};

const defaultPaymentForm = {
  bookingId: "",
  amount: "",
  provider: "Stripe",
};

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString();
};

const formatCurrency = (value) => {
  if (value == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json();
};

export default function App() {
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [routeForm, setRouteForm] = useState(defaultRouteForm);
  const [bookingForm, setBookingForm] = useState(defaultBookingForm);
  const [paymentForm, setPaymentForm] = useState(defaultPaymentForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const bookingOptions = useMemo(
    () =>
      bookings.map((booking) => ({
        value: booking.id,
        label: `${booking.customerName} · ${booking.route?.origin ?? ""} → ${
          booking.route?.destination ?? ""
        } · ${booking.seats} seats`,
        amount: booking.totalAmount,
      })),
    [bookings]
  );

  const loadAll = async () => {
    try {
      setErrorMessage("");
      const [routesData, bookingsData, paymentsData] = await Promise.all([
        fetchJson(`${API_BASE}/routes`),
        fetchJson(`${API_BASE}/bookings`),
        fetchJson(`${API_BASE}/payments`),
      ]);
      setRoutes(routesData);
      setBookings(bookingsData);
      setPayments(paymentsData);
    } catch (error) {
      setErrorMessage(
        "Unable to reach the backend. Make sure the Spring Boot API is running."
      );
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleRouteSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    try {
      await fetchJson(`${API_BASE}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...routeForm,
          fare: Number(routeForm.fare),
        }),
      });
      setRouteForm(defaultRouteForm);
      setStatusMessage("Route added successfully.");
      loadAll();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    try {
      await fetchJson(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingForm,
          routeId: Number(bookingForm.routeId),
          seats: Number(bookingForm.seats),
        }),
      });
      setBookingForm(defaultBookingForm);
      setStatusMessage("Booking created. Proceed to payment.");
      loadAll();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    try {
      await fetchJson(`${API_BASE}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...paymentForm,
          bookingId: Number(paymentForm.bookingId),
          amount: Number(paymentForm.amount),
        }),
      });
      setPaymentForm(defaultPaymentForm);
      setStatusMessage("Payment captured. Booking confirmed.");
      loadAll();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleBookingSelection = (value) => {
    const selectedBooking = bookingOptions.find(
      (option) => String(option.value) === value
    );
    setPaymentForm((prev) => ({
      ...prev,
      bookingId: value,
      amount: selectedBooking?.amount ?? "",
    }));
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__content">
          <span className="hero__badge">BusGo</span>
          <h1>Book your bus journey in minutes.</h1>
          <p>
            Plan routes, reserve seats, and capture payments with a single
            dashboard that stays in sync with the Spring Boot API.
          </p>
          <div className="hero__stats">
            <div>
              <strong>{routes.length}</strong>
              <span>Routes</span>
            </div>
            <div>
              <strong>{bookings.length}</strong>
              <span>Bookings</span>
            </div>
            <div>
              <strong>{payments.length}</strong>
              <span>Payments</span>
            </div>
          </div>
        </div>
        <div className="hero__card">
          <h3>Today&apos;s routes</h3>
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
            <p className="empty">No routes yet. Add one below.</p>
          )}
        </div>
      </header>

      <main className="grid">
        <section className="panel">
          <h2>Add a new route</h2>
          <p className="panel__subtitle">
            Define origin, destination, and timings for upcoming services.
          </p>
          <form className="form" onSubmit={handleRouteSubmit}>
            <div className="form__row">
              <label>
                Origin
                <input
                  type="text"
                  value={routeForm.origin}
                  onChange={(event) =>
                    setRouteForm({ ...routeForm, origin: event.target.value })
                  }
                  placeholder="City A"
                  required
                />
              </label>
              <label>
                Destination
                <input
                  type="text"
                  value={routeForm.destination}
                  onChange={(event) =>
                    setRouteForm({
                      ...routeForm,
                      destination: event.target.value,
                    })
                  }
                  placeholder="City B"
                  required
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                Departure time
                <input
                  type="datetime-local"
                  value={routeForm.departureTime}
                  onChange={(event) =>
                    setRouteForm({
                      ...routeForm,
                      departureTime: event.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Arrival time
                <input
                  type="datetime-local"
                  value={routeForm.arrivalTime}
                  onChange={(event) =>
                    setRouteForm({
                      ...routeForm,
                      arrivalTime: event.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                Fare (USD)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={routeForm.fare}
                  onChange={(event) =>
                    setRouteForm({ ...routeForm, fare: event.target.value })
                  }
                  placeholder="25.00"
                  required
                />
              </label>
            </div>
            <button className="button" type="submit">
              Save route
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Create a booking</h2>
          <p className="panel__subtitle">
            Reserve seats for a customer and keep track of booking status.
          </p>
          <form className="form" onSubmit={handleBookingSubmit}>
            <div className="form__row">
              <label>
                Customer name
                <input
                  type="text"
                  value={bookingForm.customerName}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      customerName: event.target.value,
                    })
                  }
                  placeholder="Alex Jordan"
                  required
                />
              </label>
              <label>
                Customer email
                <input
                  type="email"
                  value={bookingForm.customerEmail}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      customerEmail: event.target.value,
                    })
                  }
                  placeholder="alex@example.com"
                  required
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                Route
                <select
                  value={bookingForm.routeId}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      routeId: event.target.value,
                    })
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
                  value={bookingForm.seats}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      seats: event.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>
            <button className="button" type="submit">
              Confirm booking
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Capture payment</h2>
          <p className="panel__subtitle">
            Simulate payment capture for pending bookings.
          </p>
          <form className="form" onSubmit={handlePaymentSubmit}>
            <div className="form__row">
              <label>
                Booking
                <select
                  value={paymentForm.bookingId}
                  onChange={(event) => handleBookingSelection(event.target.value)}
                  required
                >
                  <option value="">Select a booking</option>
                  {bookingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Amount (USD)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(event) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: event.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                Provider
                <select
                  value={paymentForm.provider}
                  onChange={(event) =>
                    setPaymentForm({
                      ...paymentForm,
                      provider: event.target.value,
                    })
                  }
                >
                  <option value="Stripe">Stripe</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Paystack">Paystack</option>
                </select>
              </label>
            </div>
            <button className="button button--primary" type="submit">
              Capture payment
            </button>
          </form>
        </section>

        <section className="panel panel--highlight">
          <h2>Live activity</h2>
          <p className="panel__subtitle">
            The latest booking and payment activity syncs here in real time.
          </p>
          <div className="activity">
            {bookings.slice(0, 4).map((booking) => (
              <div key={booking.id} className="activity__item">
                <div>
                  <strong>{booking.customerName}</strong>
                  <span>
                    {booking.route?.origin} → {booking.route?.destination}
                  </span>
                </div>
                <div>
                  <span>{booking.status}</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="empty">No bookings yet.</p>
            )}
          </div>
          <div className="activity activity--payments">
            <h3>Recent payments</h3>
            {payments.slice(0, 3).map((payment) => (
              <div key={payment.id} className="activity__item">
                <div>
                  <strong>{payment.provider}</strong>
                  <span>{formatDateTime(payment.capturedAt)}</span>
                </div>
                <div>
                  <span>{formatCurrency(payment.amount)}</span>
                  <span>Booking #{payment.booking?.id}</span>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="empty">No payments captured.</p>
            )}
          </div>
        </section>
      </main>

      {(statusMessage || errorMessage) && (
        <div className={`toast ${errorMessage ? "toast--error" : ""}`}>
          <span>{errorMessage || statusMessage}</span>
        </div>
      )}
    </div>
  );
}
