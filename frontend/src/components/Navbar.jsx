import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>SupplyGuard</h2>
        <span>Decision Analytics</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/materials">
          Materials
        </NavLink>

        <NavLink to="/suppliers">
          Suppliers
        </NavLink>

        <NavLink to="/disruptions">
          Disruptions
        </NavLink>

        <NavLink to="/analytics">
          Analytics
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;