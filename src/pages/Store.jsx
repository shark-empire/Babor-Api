import React, { useState, useEffect } from "react";
import { sb, validatePhone, genTxRef, p2email, tok } from "../services/supabase";
import { PAYSTACK_KEY, AP_WEBHOOKS } from "../config/constants";
import { toast } from "../components/Toasts";
import { Footer } from "../components/Navigation";

export const StorePage = ({ user, go, setPending }) => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoad] = useState(true);
  const [sel, setSel] = useState(null);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneErr, setPE] = useState("");
  const [guestName, setGN] = useState("");
  const [payMode, setPM] = useState("paystack");
  const [paying, setPaying] = useState(false);
  const [net, setNet] = useState("all");

  useEffect(() => {
    sb.get("bundles", "?select=bundle_id,size,price,network,available&order=price.asc")
      .then(setBundles)
      .catch(() => setBundles([
        { bundle_id: "b1", size: "1GB", price: 5, network: "MTN", available: true },
        { bundle_id: "b2", size: "2GB", price: 9, network: "MTN", available: true },
        { bundle_id: "b5", size: "2GB", price: 10, network: "Telecel", available: false },
      ]))
      .finally(() => setLoad(false));
  }, []);

  const openCheckout = (b) => {
    if (!b.available) return; setSel(b); setPhone(user?.phone || ""); setPE(""); setGN("");
    setPM(user && user.wallet_balance >= b.price ? "wallet" : "paystack"); setOpen(true);
  };

  const buy = async () => {
    if (!sel || paying) return;
    const r = validatePhone(phone.trim()); if (!r.ok) { toast.err("Valid Ghana phone required"); return; }
    setPaying(true);

    if (payMode === "wallet") {
      try {
        const res = await fetch(AP_WEBHOOKS.walletPurchase, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_jwt: tok(user), user_id: user.id, bundle_id: sel.bundle_id, recipient_phone: phone.trim() }),
        });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) { toast.err(d.message || "Wallet purchase failed"); setPaying(false); return; }
        setPending({ type: "wallet", bundle: sel, phone: phone.trim(), apOrderId: d.order_id });
        setOpen(false); go("success");
      } catch { toast.err("Reach error."); } finally { setPaying(false); }
      return;
    }

    if (!window.PaystackPop) { toast.err("Paystack failed to initialize"); setPaying(false); return; }
    const txRef = genTxRef();
    window.PaystackPop.setup({
      key: PAYSTACK_KEY, email: user ? user.email : p2email(phone.trim()), amount: Math.round(sel.price * 100), currency: "GHS", ref: txRef,
      metadata: { bundle_id: sel.bundle_id, recipient_phone: phone.trim(), user_id: user?.id || null, type: "bundle_purchase" },
      callback: (res) => { setPaying(false); setPending({ type: "paystack", txRef, paystackRef: res.reference, bundle: sel, phone: phone.trim() }); setOpen(false); go("success"); },
      onClose: () => { setPaying(false); toast.inf("Cancelled"); },
    }).openIframe();
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 60, display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", width: "100%", flex: 1 }}>
        <div className="tab-bar" style={{ marginBottom: 28, display: "inline-flex" }}>
          {["all", "MTN", "Telecel"].map(n => <div key={n} className={`tab ${net === n ? "act" : ""}`} onClick={() => setNet(n)}>{n}</div>)}
        </div>
        <div className="bundle-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
          {bundles.filter(b => net === "all" || b.network === net).map(b => (
            <div key={b.bundle_id} className={`bundle-card ${!b.available ? "oos" : ""}`} onClick={() => openCheckout(b)}>
              <h3>{b.size} - {b.network}</h3>
              <p>GH₵ {Number(b.price).toFixed(2)}</p>
              <button className="btn btn-p" style={{ width: "100%", marginTop: 16 }}>Buy Bundle</button>
            </div>
          ))}
        </div>
      </div>
      <Footer go={go} />
      {open && (
        <div className="modal-bd" onClick={() => !paying && setOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24 }}>
              <h2>Confirm Checkout</h2>
              <input className="inp" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} style={{ marginTop: 12 }} />
              <button className="btn btn-p btn-lg" onClick={buy} style={{ width: "100%", marginTop: 16 }} disabled={paying}>
                {paying ? "Processing payment..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
