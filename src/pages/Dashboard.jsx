import React, { useState, useEffect } from "react";
import { sb, tok } from "../services/supabase";

export const DashboardPage = ({ user, go }) => {
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(user?.wallet_balance || 0);

  useEffect(() => {
    if (!user?.id) return;
    sb.get("users", `?id=eq.${user.id}&select=wallet_balance&limit=1`, tok(user)).then(r => r[0] && setBalance(Number(r[0].wallet_balance)));
    sb.get("orders", `?user_id=eq.${user.id}&order=created_at.desc&limit=5`, tok(user)).then(setOrders);
  }, [user]);

  return (
    <div className="page-enter">
      <h2>Account Dashboard Overview</h2>
      <div style={{ display: "flex", gap: 16, margin: "20px 0" }}>
        <div className="stat-card" style={{ flex: 1 }}>
          <h4>Wallet Balance</h4>
          <p style={{ fontSize: 24, fontWeight: 700, color: "var(--cyan)" }}>GH₵ {balance.toFixed(2)}</p>
        </div>
        <div className="stat-card" style={{ flex: 1 }}><h4>Total Inbound Operations</h4><p style={{ fontSize: 24 }}>{orders.length}</p></div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3>Recent Secure Orders</h3>
        <table className="data-table" style={{ width: "100%", marginTop: 12 }}>
          <thead><tr><th>Order ID</th><th>Cost</th><th>State</th></tr></thead>
          <tbody>
            {orders.map(o => <tr key={o.order_id}><td>{o.order_id}</td><td>GH₵{o.amount}</td><td>{o.status}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};
