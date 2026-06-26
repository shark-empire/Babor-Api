import React, { useState, useEffect } from "react";
import "./styles/global.css";
import { Toasts } from "./components/Toasts";
import { Nav, Sidebar, BottomNav } from "./components/Navigation";
import { sb, tok } from "./services/supabase";
import { SUPABASE_URL, SUPABASE_ANON } from "./config/constants";

// Import Views
import { HomePage } from "./pages/Home";
import { LoginPage, SignupPage } from "./pages/Auth";
import { StorePage } from "./pages/Store";
import { SuccessPage } from "./pages/Success";
import { DashboardPage } from "./pages/Dashboard";
import { WalletPage, FundWalletPage } from "./pages/Wallet";
import { OrdersPage, DocsPage, SupportPage, SettingsPage, TermsPage, PrivacyPage } from "./pages/Pages";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("sf_token"); if (!token) return;
    fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then(async (au) => {
        if (!au) { sessionStorage.removeItem("sf_token"); return; }
        const profiles = await sb.get("users", `?id=eq.${au.id}&select=*&limit=1`, token).catch(() => []);
        const p = profiles[0] || {};
        setUser({ id: au.id, email: au.email, first_name: p.first_name || "User", last_name: p.last_name || "", phone: p.phone || "", wallet_balance: p.wallet_balance || 0, _token: token });
      }).catch(() => {});
  }, []);

  const go = (p) => { setPage(p); window.scrollTo(0, 0); };

  if (["wallet", "fund", "settings", "dashboard"].includes(page) && !user) {
    return (
      <>
        <Toasts /><Nav page={page} go={go} user={user} setUser={setUser} />
        <LoginPage go={go} setUser={setUser} />
      </>
    );
  }

  if (page === "home") return <><Toasts /><Nav page={page} go={go} user={user} setUser={setUser} /><BottomNav page={page} go={go} user={user} /><HomePage go={go} /></>;
  if (page === "login") return <><Toasts /><Nav page={page} go={go} user={user} setUser={setUser} /><BottomNav page={page} go={go} user={user} /><LoginPage go={go} setUser={setUser} /></>;
  if (page === "signup") return <><Toasts /><Nav page={page} go={go} user={user} setUser={setUser} /><BottomNav page={page} go={go} user={user} /><SignupPage go={go} setUser={setUser} /></>;
  if (page === "store") return <><Toasts /><Nav page={page} go={go} user={user} setUser={setUser} /><BottomNav page={page} go={go} user={user} /><StorePage user={user} go={go} setPending={setPending} /></>;
  if (page === "success") return <><Toasts /><Nav page={page} go={go} user={user} setUser={setUser} /><BottomNav page={page} go={go} user={user} /><SuccessPage pending={pending} go={go} /></>;

  const pageMap = {
    dashboard: <DashboardPage user={user} go={go} />,
    orders: <OrdersPage user={user} />,
    wallet: <WalletPage user={user} go={go} setUser={setUser} />,
    fund: <FundWalletPage user={user} />,
    support: <SupportPage user={user} />,
    settings: <SettingsPage user={user} setUser={setUser} />,
    docs: <DocsPage />,
    terms: <TermsPage />,
    privacy: <PrivacyPage />,
  };

  return (
    <>
      <Toasts />
      <Nav page={page} go={go} user={user} setUser={setUser} />
      <BottomNav page={page} go={go} user={user} />
      <div className="app-shell">
        {user && <Sidebar page={page} go={go} />}
        <main className="mc">
          {pageMap[page] || <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Page link failure.</div>}
        </main>
      </div>
    </>
  );
}
