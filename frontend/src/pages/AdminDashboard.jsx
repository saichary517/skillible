import { useEffect, useState } from "react";
import { api, formatCurrency } from "../api.js";
import TopNav from "../components/TopNav.jsx";

const defaultRouteForm = {
  origin: "",
  destination: "",
  fare: "",
};

const defaultBankForm = {
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  accountHolderName: "",
};

export default function AdminDashboard() {
  const [routes, setRoutes] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [routeForm, setRouteForm] = useState(defaultRouteForm);
  const [bankForm, setBankForm] = useState(defaultBankForm);
  const [fareUpdates, setFareUpdates] = useState({});
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [routesData, bankData] = await Promise.all([
        api.listRoutes(),
        api.listBankAccounts(),
      ]);
      setRoutes(routesData);
      setBankAccounts(bankData);
    } catch (err) {
      setError("Unable to load admin data. Check the backend connection.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRouteSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      await api.createRoute({
        ...routeForm,
        fare: Number(routeForm.fare),
      });
      setRouteForm(defaultRouteForm);
      setStatus("Route added successfully.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFareUpdate = async (routeId) => {
    setStatus("");
    setError("");
    try {
      await api.updateFare(routeId, { fare: Number(fareUpdates[routeId]) });
      setStatus("Fare updated.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBankSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      await api.createBankAccount(bankForm);
      setBankForm(defaultBankForm);
      setStatus("Bank account saved.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.assign("/admin/login");
  };

  return (
    <div className="page">
      <TopNav isAdmin={true} />
      <section className="hero hero--admin">
        <div>
          <span className="pill pill--dark">Admin dashboard</span>
          <h1>Manage routes, fares, and payout accounts.</h1>
          <p>
            Add routes without manually entering date and time. The system
            automatically schedules departures and arrivals.
          </p>
        </div>
        <div className="hero__card hero__card--admin">
          <h3>Quick actions</h3>
          <button className="button button--primary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>

      <main className="grid">
        <section className="panel">
          <h2>Add new route</h2>
          <p className="panel__subtitle">
            Only origin, destination, and fare are required.
          </p>
          <form className="form" onSubmit={handleRouteSubmit}>
            <div className="form__row">
              <label>
                Origin
                <input
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
                Fare (USD)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={routeForm.fare}
                  onChange={(event) =>
                    setRouteForm({ ...routeForm, fare: event.target.value })
                  }
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
          <h2>Manage fares</h2>
          <p className="panel__subtitle">
            Update fares to respond to demand or seasonal changes.
          </p>
          <div className="list">
            {routes.map((route) => (
              <div key={route.id} className="list__item">
                <div>
                  <strong>
                    {route.origin} → {route.destination}
                  </strong>
                  <span>Current: {formatCurrency(route.fare)}</span>
                </div>
                <div className="list__actions">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fareUpdates[route.id] ?? route.fare}
                    onChange={(event) =>
                      setFareUpdates({
                        ...fareUpdates,
                        [route.id]: event.target.value,
                      })
                    }
                  />
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={() => handleFareUpdate(route.id)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
            {routes.length === 0 && (
              <p className="empty">No routes yet. Add one above.</p>
            )}
          </div>
        </section>

        <section className="panel panel--highlight">
          <h2>Bank accounts</h2>
          <p className="panel__subtitle">
            Add payout bank accounts for payment settlements.
          </p>
          <form className="form" onSubmit={handleBankSubmit}>
            <div className="form__row">
              <label>
                Bank name
                <input
                  value={bankForm.bankName}
                  onChange={(event) =>
                    setBankForm({ ...bankForm, bankName: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Account number
                <input
                  value={bankForm.accountNumber}
                  onChange={(event) =>
                    setBankForm({
                      ...bankForm,
                      accountNumber: event.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                IFSC / Swift code
                <input
                  value={bankForm.ifscCode}
                  onChange={(event) =>
                    setBankForm({ ...bankForm, ifscCode: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Account holder
                <input
                  value={bankForm.accountHolderName}
                  onChange={(event) =>
                    setBankForm({
                      ...bankForm,
                      accountHolderName: event.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>
            <button className="button" type="submit">
              Save bank account
            </button>
          </form>
          <div className="list">
            {bankAccounts.map((account) => (
              <div key={account.id} className="list__item">
                <div>
                  <strong>{account.bankName}</strong>
                  <span>{account.accountHolderName}</span>
                </div>
                <div>
                  <span>Acct: {account.accountNumber}</span>
                  <span>IFSC: {account.ifscCode}</span>
                </div>
              </div>
            ))}
            {bankAccounts.length === 0 && (
              <p className="empty">No bank accounts added.</p>
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
