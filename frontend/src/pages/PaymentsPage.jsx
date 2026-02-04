import { useEffect, useMemo, useState } from "react";
import { api, formatCurrency, formatDateTime } from "../api.js";
import TopNav from "../components/TopNav.jsx";

const defaultPaymentForm = {
  bookingId: "",
  amount: "",
  provider: "Stripe",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(defaultPaymentForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

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

  const load = async () => {
    try {
      const [paymentsData, bookingsData] = await Promise.all([
        api.listPayments(),
        api.listBookings(),
      ]);
      setPayments(paymentsData);
      setBookings(bookingsData);
    } catch (err) {
      setError("Unable to load payment data.");
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
      await api.createPayment({
        ...form,
        bookingId: Number(form.bookingId),
        amount: Number(form.amount),
      });
      setForm(defaultPaymentForm);
      setStatus("Payment captured successfully.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBookingSelect = (value) => {
    const selected = bookingOptions.find((option) => String(option.value) === value);
    setForm((prev) => ({
      ...prev,
      bookingId: value,
      amount: selected?.amount ?? "",
    }));
  };

  return (
    <div className="page">
      <TopNav isAdmin={true} />
      <section className="hero hero--admin">
        <div>
          <span className="pill pill--dark">Payments</span>
          <h1>Capture payments and track settlements.</h1>
          <p>
            Link bookings to payments and monitor recent transactions across
            providers.
          </p>
        </div>
      </section>

      <main className="grid">
        <section className="panel">
          <h2>Capture payment</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__row">
              <label>
                Booking
                <select
                  value={form.bookingId}
                  onChange={(event) => handleBookingSelect(event.target.value)}
                  required
                >
                  <option value="">Select booking</option>
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
                  value={form.amount}
                  onChange={(event) =>
                    setForm({ ...form, amount: event.target.value })
                  }
                  required
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                Provider
                <select
                  value={form.provider}
                  onChange={(event) =>
                    setForm({ ...form, provider: event.target.value })
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
          <h2>Recent payments</h2>
          <div className="activity">
            {payments.map((payment) => (
              <div key={payment.id} className="activity__item">
                <div>
                  <strong>{payment.provider}</strong>
                  <span>{formatDateTime(payment.createdAt)}</span>
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

      {(status || error) && (
        <div className={`toast ${error ? "toast--error" : ""}`}>
          <span>{error || status}</span>
        </div>
      )}
    </div>
  );
}
