import React from "react";

export const Logo = ({ size = 18 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <img
      src="https://i.imgur.com/wKOG6wP.png"
      alt="SCI-FI DATA"
      onError={(e) => (e.target.style.display = "none")}
      style={{ height: 36, width: "auto", maxWidth: 48, objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(0,212,255,.35))" }}
    />
    <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: size, whiteSpace: "nowrap", letterSpacing: "-.5px" }}>
      SCI-FI <span style={{ color: "var(--cyan)" }}>DATA</span>
    </span>
  </div>
);
