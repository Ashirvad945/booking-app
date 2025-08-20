import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr(""); setLoading(true);
    try {
      await api.post("/register", form);
      setMsg("Registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      setErr(error?.response?.data?.error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>
        <form className="row" onSubmit={onSubmit}>
          <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Create Account"}</button>
        </form>
        {msg && <div className="space"></div>}
        {msg && <div style={{ color: "#065f46" }}>{msg}</div>}
        {err && <div className="space"></div>}
        {err && <div style={{ color: "#b91c1c" }}>{err}</div>}
        <div className="space"></div>
        <span className="muted">Already have an account? <Link className="link" to="/login">Login</Link></span>
      </div>
    </div>
  );
};

export default Register;
