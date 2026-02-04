const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json();
};

export const api = {
  listRoutes: () => fetchJson(`${API_BASE}/routes`),
  createRoute: (payload) =>
    fetchJson(`${API_BASE}/routes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  updateFare: (id, payload) =>
    fetchJson(`${API_BASE}/routes/${id}/fare`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  listBookings: () => fetchJson(`${API_BASE}/bookings`),
  createBooking: (payload) =>
    fetchJson(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  listPayments: () => fetchJson(`${API_BASE}/payments`),
  createPayment: (payload) =>
    fetchJson(`${API_BASE}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  listBankAccounts: () => fetchJson(`${API_BASE}/bank-accounts`),
  createBankAccount: (payload) =>
    fetchJson(`${API_BASE}/bank-accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  adminLogin: (payload) =>
    fetchJson(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  askAssistant: (payload) =>
    fetchJson(`${API_BASE}/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

export const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString();
};

export const formatCurrency = (value) => {
  if (value == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
};
