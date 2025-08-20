import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/login", form);
      login(data.token, data.role);
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (error) {
      setErr(error?.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form className="row" onSubmit={onSubmit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        {err && <div className="space"></div>}
        {err && <div style={{ color: "#b91c1c" }}>{err}</div>}
        <div className="space"></div>
        <span className="muted">No account? <Link className="link" to="/register">Register</Link></span>
      </div>
    </div>
  );
};

export default Login;
