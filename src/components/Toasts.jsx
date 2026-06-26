import React, { useState, useEffect } from "react";

let _st = null;
export const toast = {
  ok: (m) => _st && _st((p) => [...p, { id: Date.now(), t: "success", m }]),
  err: (m) => _st && _st((p) => [...p, { id: Date.now(), t: "error", m }]),
  inf: (m) => _st && _st((p) => [...p, { id: Date.now(), t: "info", m }]),
};

export const Toasts = () => {
  const [list, set] = useState([]);
  useEffect(() => { _st = set; }, []);
  useEffect(() => {
    if (!list.length) return;
    const t = setTimeout(() => set((p) => p.slice(1)), 3500);
    return () => clearTimeout(t);
  }, [list]);

  const ico = { success: "✓", error: "✕", info: "ℹ" };
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {list.map((x) => (
        <div key={x.id} style={{
          padding: "12px 18px", borderRadius: 12, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, minWidth: 280, maxWidth: 380, backdropFilter: "blur(12px)", animation: "slideIn .25s ease",
          background: x.t === "success" ? "rgba(16,185,129,0.2)" : x.t === "error" ? "rgba(239,68,68,0.2)" : "rgba(0,212,255,0.15)",
          border: x.t === "success" ? "1px solid rgba(16,185,129,0.4)" : x.t === "error" ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(0,212,255,0.4)",
          color: x.t === "success" ? "#34D399" : x.t === "error" ? "#F87171" : "#00D4FF",
        }}>
          <span>{ico[x.t]}</span>{x.m}
        </div>
      ))}
    </div>
  );
};
