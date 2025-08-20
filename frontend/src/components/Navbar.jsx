import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <div className="container">
        <div>
          <Link to="/" className="link" style={{ fontWeight: 700 }}>Appointment Booking</Link>
        </div>
        <div className="right">
          {auth?.role === "admin" && <Link className="link" to="/admin">Admin</Link>}
          {!auth?.token && (
            <>
              <Link className="link" to="/login">Login</Link>
              <Link className="link" to="/register">Register</Link>
            </>
          )}
          {auth?.token && (
            <>
              <span className="badge">{auth.role}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
