import React from "react";

const fmt = (iso) => new Date(iso).toLocaleString();

const SlotCard = ({ slot, onBook, disabled }) => {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600 }}>{fmt(slot.startAt)} → {fmt(slot.endAt)}</div>
          <div className="muted">30 min window</div>
        </div>
        <button disabled={disabled} onClick={() => onBook(slot._id || slot.id)}>
          {disabled ? "Booked" : "Book"}
        </button>
      </div>
    </div>
  );
};

export default SlotCard;
