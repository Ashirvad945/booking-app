import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import SlotCard from "../components/SlotCard";
import { Link, useNavigate } from "react-router-dom";

function addDays(date, n){ const d = new Date(date); d.setDate(d.getDate()+n); return d; }
function toYMD(d){ const x = new Date(d); const m = `${x.getMonth()+1}`.padStart(2,"0"); const day = `${x.getDate()}`.padStart(2,"0"); return `${x.getFullYear()}-${m}-${day}`; }

const PatientDashboard = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [from, setFrom] = useState(toYMD(new Date()));
  const [to, setTo] = useState(toYMD(addDays(new Date(), 6))); // next 7 days
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(null);
  const [err, setErr] = useState("");
  const [my, setMy] = useState([]);

  // Redirect if not logged-in
  useEffect(() => {
    if (!auth?.token) navigate("/login");
  }, [auth, navigate]);

  const dateSummary = useMemo(() => `${from} → ${to}`, [from, to]);

  const loadSlots = async () => {
    setLoading(true); setErr("");
    try {
      const { data } = await api.get(`/slots`, { params: { from, to } });
      setSlots(data.slots || []);
    } catch (e) {
      setErr(e?.response?.data?.error?.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  const loadMy = async () => {
    try {
      const { data } = await api.get(`/my-bookings`);
      setMy(data.bookings || []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => { if (auth?.token) { loadSlots(); loadMy(); } }, [auth, from, to]);

  const onBook = async (slotId) => {
    setBookLoading(slotId);
    try {
      await api.post(`/book`, { slotId });
      await loadSlots();
      await loadMy();
      alert("Booked successfully!");
    } catch (e) {
      alert(e?.response?.data?.error?.message || "Booking failed");
    } finally {
      setBookLoading(null);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Available Slots</h2>
        <div className="row">
          <div>
            <div className="muted">From</div>
            <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
          </div>
          <div>
            <div className="muted">To</div>
            <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
          </div>
          <button onClick={loadSlots} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
        </div>
        <div className="space"></div>
        <div className="muted">Range: {dateSummary}</div>
      </div>

      {err && <div className="card" style={{ color: "#b91c1c" }}>{err}</div>}

      {slots.map(s => (
        <SlotCard key={s._id || s.id} slot={s} onBook={onBook} disabled={bookLoading === s._id}/>
      ))}

      <div className="card">
        <h3>My Bookings</h3>
        {(!my || my.length===0) && <div className="muted">No bookings yet.</div>}
        {my.map(b => (
          <div key={b._id} style={{ padding: "6px 0", borderBottom: "1px dashed #e5e7eb" }}>
            <div><strong>{new Date(b.slotId?.startAt).toLocaleString()}</strong> → {new Date(b.slotId?.endAt).toLocaleString()}</div>
            <div className="muted">{b._id}</div>
          </div>
        ))}
        <div className="space"></div>
        <Link className="link" to="/admin">Are you admin?</Link>
      </div>
    </div>
  );
};

export default PatientDashboard;
