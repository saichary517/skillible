import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `nav__link ${isActive ? "nav__link--active" : ""}`;

export default function TopNav({ isAdmin }) {
  return (
    <header className="nav">
      <Link to="/" className="nav__brand">
        BusGo
      </Link>
      <nav className="nav__links">
        <NavLink className={navLinkClass} to="/book">
          Book tickets
        </NavLink>
        {isAdmin ? (
          <>
            <NavLink className={navLinkClass} to="/admin/dashboard">
              Admin dashboard
            </NavLink>
            <NavLink className={navLinkClass} to="/admin/payments">
              Payments
            </NavLink>
          </>
        ) : (
          <NavLink className={navLinkClass} to="/admin/login">
            Admin login
          </NavLink>
        )}
      </nav>
    </header>
  );
}
