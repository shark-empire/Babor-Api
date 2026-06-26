import React from "react";
import { Particles } from "../components/Particles";
import { Footer } from "../components/Navigation";

export const HomePage = ({ go }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <div className="hero">
      <Particles />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, padding: "60px 24px", margin: "0 auto" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--cyan)", fontFamily: "var(--fm)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 30, height: 1, background: "var(--cyan)", display: "inline-block" }} />NEXT-GEN DATA BUNDLES
        </div>
        <h1>Data for the <span className="ac">future</span>,<br />delivered now.</h1>
        <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 500, marginBottom: 36, lineHeight: 1.7 }}>
          Instant mobile data bundles across all Ghanaian networks. Every payment verified by Activepieces before your data is sent.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-p btn-lg" onClick={() => go("store")}>⚡ Buy Data Now</button>
          <button className="btn btn-c btn-lg" onClick={() => go("signup")}>Create Account</button>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 36 }}>
          {[["10K+", "Orders"], ["99.9%", "Uptime"], ["3", "Networks"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--fd)", fontSize: 24, fontWeight: 700, color: "var(--cyan)" }}>{v}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ color: "var(--cyan)", fontFamily: "var(--fm)", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Why SCI-FI DATA</div>
        <h2 style={{ fontFamily: "var(--fd)", fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Built different.</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
        {[
          ["⚡", "Instant Delivery", "Data activated in seconds, 24/7."],
          ["🔒", "Activepieces-Verified", "Every payment hits Paystack's verify API inside your Activepieces flow before any data is sent or wallet is credited."],
          ["📡", "All Networks", "MTN, Telecel, AirtelTigo — all carriers."],
          ["💳", "Wallet System", "Preload credits. Balance updated server-side only — no browser can inflate it."],
          ["📦", "Order Tracking", "Real-time status polled from live DB."],
          ["🛡", "Fraud-Resistant", "RLS on every table. Frontend is read-only. No client writes wallet or creates orders."],
        ].map(([i, t, d]) => (
          <div key={t} className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>{i}</div>
            <div style={{ fontFamily: "var(--fd)", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{t}</div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    <Footer go={go} />
  </div>
);
