import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import TopNav from "../components/TopNav.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await api.adminLogin(form);
      localStorage.setItem("adminToken", response.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="page">
      <TopNav isAdmin={false} />
      <section className="hero hero--login">
        <div>
          <span className="pill">Admin access</span>
          <h1>Admin login</h1>
          <p>Secure access for route and payment management.</p>
        </div>
        <div className="hero__card hero__card--admin">
          <h3>Default credentials</h3>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
      </section>

      <main className="grid">
        <section className="panel panel--highlight">
          <h2>Sign in</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                value={form.username}
                onChange={(event) =>
                  setForm({ ...form, username: event.target.value })
                }
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                required
              />
            </label>
            <button className="button button--primary" type="submit">
              Login
            </button>
            {error && <p className="form__error">{error}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
