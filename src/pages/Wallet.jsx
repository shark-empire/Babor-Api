import React, { useState, useEffect } from "react";
import { sb, tok, genTxRef } from "../services/supabase";
import { PAYSTACK_KEY } from "../config/constants";
import { toast } from "../components/Toasts";

export const WalletPage = ({ user, go, setUser }) => {
  const [txns, setTxns] = useState([]);
  const [balance, setBalance] = useState(user?.wallet_balance || 0);

  const refreshBalance = () => {
    sb.get("users", `?id=eq.${user.id}&select=wallet_balance&limit=1`, tok(user)).then(r => {
      if (r[0]) { setBalance(Number(r[0].wallet_balance)); setUser({ ...user, wallet_balance: Number(r[0].wallet_balance) }); }
    });
  };

  useEffect(() => { if (user?.id) { refreshBalance(); sb.get("wallet_transactions", `?user_id=eq.${user.id}&order=created_at.desc`, tok(user)).then(setTxns); } }, [user]);

  return (
    <div className="page-enter">
      <div className="wallet-card">
        <h3>Available Secured Balance</h3>
        <h1>GH₵ {balance.toFixed(2)}</h1>
        <button className="btn btn-p" onClick={() => go("fund")} style={{ marginTop: 12 }}>+ Load Funds</button>
      </div>
    </div>
  );
};

export const FundWalletPage = ({ user }) => {
  const [amount, setAmt] = useState("");
  const fund = () => {
    const amt = parseFloat(amount); if (!amt || amt < 1) return;
    window.PaystackPop.setup({
      key: PAYSTACK_KEY, email: user.email, amount: Math.round(amt * 100), currency: "GHS", ref: genTxRef(),
      metadata: { type: "wallet_funding", user_id: user.id },
      callback: () => { toast.ok("Processing Topup. Check back in a minute!"); setAmt(""); },
    }).openIframe();
  };
  return (
    <div className="page-enter card" style={{ padding: 32, maxWidth: 400 }}>
      <h3>Fund Personal Wallet</h3>
      <input className="inp" type="number" placeholder="GHS Amount" value={amount} onChange={e => setAmt(e.target.value)} style={{ margin: "16px 0" }} />
      <button className="btn btn-p" onClick={fund} style={{ width: "100%" }}>Authorize Inbound Transaction</button>
    </div>
  );
};
