import { SUPABASE_URL, SUPABASE_ANON } from "../config/constants";

export const sb = {
  async get(table, params = "", token = "") {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${token || SUPABASE_ANON}`,
        "Content-Type": "application/json",
      },
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async patch(table, params, token, body) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(await r.text());
  },
  async post(table, token, body) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(await r.text());
  },
};

// Application Utilities
export const genTxRef = () => "SCIFI-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
export const tok = (u) => u?._token || sessionStorage.getItem("sf_token") || "";
export const p2email = (p) => p.replace(/\D/g, "") + "@sci-fidata.com";

export const validatePhone = (phone) => {
  const c = phone.replace(/\D/g, "");
  if (c.length !== 10) return { ok: false, msg: "Must be 10 digits" };
  if (!c.startsWith("0")) return { ok: false, msg: "Must start with 0" };
  const pfx = parseInt(c.substring(1, 3));
  if (![20, 24, 25, 26, 27, 28, 50, 54, 55, 56, 57, 59].includes(pfx))
    return { ok: false, msg: "Invalid Ghana network prefix" };
  return { ok: true, msg: "" };
};

export const RL = (() => {
  const s = {};
  return {
    check(key, max, ms) {
      const now = Date.now();
      s[key] = (s[key] || []).filter((t) => now - t < ms);
      if (s[key].length >= max)
        return { ok: false, wait: Math.ceil((ms - (now - s[key][0])) / 1000) };
      s[key].push(now);
      return { ok: true };
    },
  };
})();
