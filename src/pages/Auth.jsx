import React, { useState } from "react";
import { Particles } from "../components/Particles";
import { Logo } from "../components/Logo";
import { toast } from "../components/Toasts";
import { SUPABASE_URL, SUPABASE_ANON } from "../config/constants";
import { sb, RL, validatePhone, p2email } from "../services/supabase";

export const LoginPage = ({ go, setUser }) => {
  const [f, setF] = useState({ id: "", pw: "" });
  const [loading, setL] = useState(false);
  const [showPw, setSP] = useState(false);

  const login = async () => {
    if (!f.id || !f.pw) { toast.err("Fill all fields"); return; }
    const rl = RL.check("login", 5, 60000);
    if (!rl.ok) { toast.err(`Too many attempts — wait ${rl.wait}s`); return; }
    setL(true);
    try {
      const isPhone = /^\d/.test(f.id.replace(/\s/g, ""));
      const email = isPhone ? p2email(f.id) : f.id;
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST", headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: f.pw }),
      });
      const d = await r.json();
      if (!r.ok) { toast.err("Invalid credentials"); return; }
      const token = d.access_token;
      sessionStorage.setItem("sf_token", token);
      const profiles = await sb.get("users", "?select=*&limit=1", token).catch(() => []);
      const p = profiles[0] || {};
      setUser({ id: d.user.id, email: d.user.email, first_name: p.first_name || "User", last_name: p.last_name || "", phone: p.phone || "", wallet_balance: p.wallet_balance || 0, _token: token });
      toast.ok(`Welcome back, ${p.first_name || "there"}!`);
      go("dashboard");
    } catch { toast.err("Login failed — check connection"); }
    finally { setL(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyCenter: "center", padding: 20, paddingTop: 80, position: "relative", overflow: "hidden" }}>
      <Particles />
      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }} className="page-enter">
        <div style={{ marginBottom: 32, textAlign: "center" }}><Logo size={22} /></div>
        <div className="auth-card">
          <div style={{ fontFamily: "var(--fd)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Welcome back</div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Sign in to your SCI-FI DATA account</div>
          <div className="fg"><label className="lbl">Email or Phone Number</label>
            <input className="inp" placeholder="you@email.com or 0244..." value={f.id} onChange={e => setF({ ...f, id: e.target.value })} />
          </div>
          <div className="fg"><label className="lbl">Password</label>
            <div style={{ position: "relative" }}>
              <input className="inp" type={showPw ? "text" : "password"} placeholder="••••••••" value={f.pw} onChange={e => setF({ ...f, pw: e.target.value })} onKeyDown={e => e.key === "Enter" && login()} style={{ paddingRight: 44 }} />
              <span onClick={() => setSP(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--muted)" }}>{showPw ? "🙈" : "👁"}</span>
            </div>
          </div>
          <button className="btn btn-p btn-lg" onClick={login} disabled={loading} style={{ width: "100%" }}>{loading ? "Signing in…" : "Sign In"}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} /><span style={{ color: "var(--muted)", fontSize: 12 }}>or</span><div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <div style={{ textAlign: "center", fontSize: 14, color: "var(--muted)" }}>No account? <span style={{ color: "var(--cyan)", cursor: "pointer" }} onClick={() => go("signup")}>Sign Up</span></div>
        </div>
      </div>
    </div>
  );
};

export const SignupPage = ({ go, setUser }) => {
  const [method, setM] = useState("phone");
  const [f, setF] = useState({ fn: "", ln: "", phone: "", email: "", pw: "", pw2: "" });
  const [loading, setL] = useState(false);
  const [showPw, setSP] = useState(false);
  const [phoneErr, setPE] = useState("");
  const up = (k, v) => setF(p => ({ ...p, [k]: v }));

  const chkPhone = v => { const r = validatePhone(v); setPE(v && !r.ok ? r.msg : ""); up("phone", v); };

  const pwStr = (() => {
    const p = f.pw; if (!p) return null;
    let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return { pct: (s / 5) * 100, label: ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][s], color: ["", "var(--red)", "var(--amber)", "var(--amber)", "var(--green)", "var(--cyan)"][s] };
  })();

  const signup = async () => {
    if (!f.fn || !f.ln) { toast.err("Enter full name"); return; }
    if (method === "phone") { const r = validatePhone(f.phone); if (!r.ok) { toast.err("Invalid phone: " + r.msg); return; } }
    else if (!f.email.includes("@")) { toast.err("Enter valid email"); return; }
    if (f.pw.length < 8) { toast.err("Password: min 8 chars"); return; }
    if (!/[A-Z]/.test(f.pw) || !/[0-9]/.test(f.pw)) { toast.err("Password needs uppercase + number"); return; }
    if (f.pw !== f.pw2) { toast.err("Passwords don't match"); return; }
    const rl = RL.check("signup", 3, 300000); if (!rl.ok) { toast.err(`Too many attempts — wait ${rl.wait}s`); return; }
    setL(true);
    const email = method === "phone" ? p2email(f.phone) : f.email;
    try {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST", headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: f.pw }),
      });
      const d = await r.json();
      if (!r.ok) { toast.err(d.msg || d.error_description || "Signup failed"); return; }
      const token = d.access_token, uid = d.user?.id;
      sessionStorage.setItem("sf_token", token);
      if (uid && token) { await sb.post("users", token, { id: uid, first_name: f.fn, last_name: f.ln, phone: f.phone || "" }); }
      setUser({ id: uid, email, first_name: f.fn, last_name: f.ln, phone: f.phone || "", wallet_balance: 0, _token: token });
      toast.ok("Account created! Welcome."); go("dashboard");
    } catch { toast.err("Signup failed — check connection"); }
    finally { setL(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyCenter: "center", padding: 20, paddingTop: 80, position: "relative", overflow: "hidden" }}>
      <Particles />
      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }} className="page-enter">
        <div style={{ marginBottom: 32, textAlign: "center" }}><Logo size={22} /></div>
        <div className="auth-card">
          <div style={{ fontFamily: "var(--fd)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Create account</div>
          <div className="tab-bar" style={{ marginBottom: 20 }}>
            <div className={`tab ${method === "phone" ? "act" : ""}`} onClick={() => setM("phone")}>📱 Phone</div>
            <div className={`tab ${method === "email" ? "act" : ""}`} onClick={() => setM("email")}>✉ Email</div>
          </div>
          <div className="fr" style={{ marginBottom: 16 }}>
            <div className="fg"><label className="lbl">First Name</label><input className="inp" placeholder="Kofi" value={f.fn} onChange={e => up("fn", e.target.value)} /></div>
            <div className="fg"><label className="lbl">Last Name</label><input className="inp" placeholder="Mensah" value={f.ln} onChange={e => up("ln", e.target.value)} /></div>
          </div>
          {method === "phone" ? (
            <div className="fg"><label className="lbl">Ghana Phone Number</label>
              <input className={`inp ${f.phone && (phoneErr ? "inp-err" : "inp-ok")}`} placeholder="0244123456" value={f.phone} onChange={e => chkPhone(e.target.value)} />
            </div>
          ) : (
            <div className="fg"><label className="lbl">Email Address</label><input className="inp" placeholder="you@email.com" value={f.email} onChange={e => up("email", e.target.value)} /></div>
          )}
          <div className="fg"><label className="lbl">Password</label>
            <input className="inp" type={showPw ? "text" : "password"} placeholder="Min 8 chars" value={f.pw} onChange={e => up("pw", e.target.value)} />
            {pwStr && <div style={{ marginTop: 6 }}><div className="progress-bar"><div className="progress-fill" style={{ width: pwStr.pct + "%", background: pwStr.color }} /></div></div>}
          </div>
          <div className="fg"><label className="lbl">Confirm Password</label><input className="inp" type="password" placeholder="••••••••" value={f.pw2} onChange={e => up("pw2", e.target.value)} /></div>
          <button className="btn btn-p btn-lg" onClick={signup} disabled={loading} style={{ width: "100%" }}>Create Account</button>
        </div>
      </div>
    </div>
  );
};
