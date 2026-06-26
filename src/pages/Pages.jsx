import React from "react";

export const DocsPage = () => (
  <div className="page-enter">
    <h2>Secure Infrastructure API Specification</h2>
    <div className="code-block" style={{ marginTop: 16 }}>Base Endpoint: https://api.sci-fidata.com</div>
  </div>
);

export const SupportPage = () => (
  <div className="page-enter card" style={{ padding: 24 }}>
    <h3>System Support Interface</h3>
    <p style={{ color: "var(--muted)" }}>Open an asynchronous customer ticket by mailing support@sci-fidata.com</p>
  </div>
);

export const SettingsPage = () => (
  <div className="page-enter card" style={{ padding: 24 }}>
    <h3>User Profile Configurations</h3>
    <p>Read-only infrastructure node.</p>
  </div>
);

export const OrdersPage = () => <div className="page-enter"><h2>Transactional History Logs</h2></div>;
export const TermsPage = () => <div className="page-enter"><h2>User Terms of Service Policy</h2></div>;
export const PrivacyPage = () => <div className="page-enter"><h2>Data Protection Policy</h2></div>;
