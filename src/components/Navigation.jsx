import React from "react";
import { Logo } from "./Logo";
import { toast } from "./Toasts";

export const Nav = ({ page, go, user, setUser }) => (
  <nav className="topnav">
    <div style={{ cursor: "pointer" }} onClick={() => go("home")}><Logo /></div>
    <div className="nav-links">
      <span className={`nl hide-m ${page === "home" ? "act" : ""}`} onClick={() => go("home")}>Home</span>
      <span className={`nl hide-m ${page === "store" ? "act" : ""}`} onClick={() => go("store")}>Buy Data</span>
      <span className={`nl hide-m ${page === "docs" ? "act" : ""}`} onClick={() => go("docs")}>API Docs</span>
      {user ? (
        <>
          <span className={`nl hide-m ${page === "dashboard" ? "act" : ""}`} onClick={() => go("dashboard")}>Dashboard</span>
          <button className="btn btn-c btn-sm hide-m" onClick={() => { setUser(null); sessionStorage.removeItem("sf_token"); go("home"); toast.inf("Signed out"); }}>
            Sign Out
          </button>
        </>
      ) : (
        <>
          <span className="nl hide-m" onClick={() => go("login")}>Log In</span>
          <button className="btn btn-p btn-sm" onClick={() => go("signup")}>Sign Up</button>
        </>
      )}
    </div>
  </nav>
);

export const Sidebar = ({ page, go }) => {
  const items = [
    { l: "Overview", i: "◈", p: "dashboard" }, { l: "Buy Data", i: "⚡", p: "store" },
    { l: "My Orders", i: "📦", p: "orders" }, { l: "Wallet", i: "💳", p: "wallet" },
    { l: "Fund Wallet", i: "➕", p: "fund" },
  ];
  const more = [
    { l: "API Docs", i: "📡", p: "docs" }, { l: "Support", i: "💬", p: "support" }, { l: "Settings", i: "⚙", p: "settings" },
  ];
  return (
    <aside className="sidebar">
      <div className="ss">Main</div>
      {items.map((x) => <div key={x.p} className={`si ${page === x.p ? "act" : ""}`} onClick={() => go(x.p)}><span>{x.i}</span>{x.l}</div>)}
      <div className="ss">More</div>
      {more.map((x) => <div key={x.p} className={`si ${page === x.p ? "act" : ""}`} onClick={() => go(x.p)}><span>{x.i}</span>{x.l}</div>)}
    </aside>
  );
};

export const BottomNav = ({ page, go, user }) => (
  <div className="mbn" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(6,8,15,.97)", borderTop: "1px solid var(--border)", backdropFilter: "blur(16px)", zIndex: 200, padding: "8px 0 12px" }}>
    {[
      { i: "🏠", l: "Home", p: "home" }, { i: "⚡", l: "Buy", p: "store" },
      ...(user ? [{ i: "📦", l: "Orders", p: "orders" }, { i: "💳", l: "Wallet", p: "wallet" }, { i: "◈", l: "Dash", p: "dashboard" }]
        : [{ i: "🔑", l: "Login", p: "login" }, { i: "📡", l: "API", p: "docs" }]),
    ].map((x) => (
      <div key={x.p} onClick={() => go(x.p)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1, cursor: "pointer", padding: "4px 0", color: page === x.p ? "var(--cyan)" : "var(--muted)", transition: "color .2s" }}>
        <span style={{ fontSize: 20 }}>{x.i}</span>
        <span style={{ fontSize: 10, fontWeight: 600 }}>{x.l}</span>
      </div>
    ))}
  </div>
);

export const Footer = ({ go }) => (
  <footer>
    <div className="footer-grid">
      <div><Logo /><p style={{ color: "var(--muted)", fontSize: 14, marginTop: 10, lineHeight: 1.7, maxWidth: 280 }}>Fast, reliable mobile data bundles for Ghana. Payments verified by Activepieces before data is sent.</p></div>
      <div>
        <h4 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)", marginBottom: 14 }}>Product</h4>
        <span className="fl" onClick={() => go("store")}>Buy Data</span>
        <span className="fl" onClick={() => go("signup")}>Create Account</span>
        <span className="fl" onClick={() => go("docs")}>API Access</span>
      </div>
      <div>
        <h4 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)", marginBottom: 14 }}>Support</h4>
        <span className="fl" onClick={() => go("support")}>Contact Us</span>
        <span className="fl" onClick={() => go("orders")}>Order Status</span>
      </div>
      <div>
        <h4 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)", marginBottom: 14 }}>Legal</h4>
        <span className="fl" onClick={() => go("terms")}>Terms</span>
        <span className="fl" onClick={() => go("privacy")}>Privacy</span>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} SCI-FI DATA. All rights reserved.</p>
      <p>🔒 Activepieces-verified · <span className="dot" />Operational</p>
    </div>
  </footer>
);
