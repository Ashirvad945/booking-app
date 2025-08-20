import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!auth?.token) navigate("/login");
    if (auth?.role !== "admin") navigate("/");
  }, [auth, navigate]);

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const { data } = await api.get(`/all-bookings`);
      setRows(data.bookings || []);
    } catch (e) {
      setErr(e?.response?.data?.error?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (auth?.token) load(); }, [auth]);

  return (
    <div className="container">
      <div className="card">
        <h2>Admin – All Bookings</h2>
        <button onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
      </div>

      {err && <div className="card" style={{ color: "#b91c1c" }}>{err}</div>}

      {rows.map(b => (
        <div key={b._id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div><strong>{b.userId?.name}</strong> <span className="muted">({b.userId?.email})</span></div>
              <div className="muted">{b._id}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div><strong>{new Date(b.slotId?.startAt).toLocaleString()}</strong></div>
              <div className="muted">{new Date(b.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}

      {rows.length === 0 && !loading && !err && (
        <div className="card muted">No bookings found.</div>
      )}
    </div>
  );
};

export default AdminDashboard;
