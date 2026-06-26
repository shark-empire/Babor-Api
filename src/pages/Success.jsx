import React, { useState, useEffect } from "react";
import { Particles } from "../components/Particles";
import { sb } from "../services/supabase";
import { toast } from "../components/Toasts";

export const SuccessPage = ({ pending, go }) => {
  const [order, setOrder] = useState(null);
  const [polls, setPolls] = useState(0);
  const [status, setStatus] = useState("waiting");

  useEffect(() => {
    if (!pending?.txRef && !pending?.apOrderId) return;
    if (status === "found" || polls >= 24) { if (polls >= 24) setStatus("timeout"); return; }
    const t = setTimeout(async () => {
      try {
        let rows = [];
        if (pending.txRef) rows = await sb.get("orders", `?tx_ref=eq.${encodeURIComponent(pending.txRef)}&select=*&limit=1`);
        else if (pending.apOrderId) rows = await sb.get("orders", `?order_id=eq.${encodeURIComponent(pending.apOrderId)}&select=*&limit=1`);
        if (rows.length) {
          setOrder(rows[0]); setStatus("found");
          if (rows[0].status === "completed") toast.ok("Data delivered successfully!");
        }
      } catch {}
      setPolls(p => p + 1);
    }, 5000);
    return () => clearTimeout(t);
  }, [polls, status, pending]);

  if (!pending) { go("store"); return null; }

  return (
    <div style={{ minHeight: "100vh", paddingTop: 60, display: "flex", flexDirection: "column" }}>
      <Particles />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyCenter: "center", padding: 24, position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }} className="page-enter">
          <div className="success-anim">⏳</div>
          <h1>Verifying Transaction Flow</h1>
          <p style={{ color: "var(--muted)" }}>Status via activepieces polling: {status === "found" ? order?.status : "Awaiting Webhook Action..."}</p>
          <button className="btn btn-c" onClick={() => go("dashboard")} style={{ marginTop: 24 }}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};
