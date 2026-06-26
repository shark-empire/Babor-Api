// Only PUBLIC keys here. All secret keys live in Activepieces environment variables.
export const SUPABASE_URL = "https://ixezaagxxptcedteyrac.supabase.co";
export const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZXphYWd4eHB0Y2VkdGV5cmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTI5NzIsImV4cCI6MjA5NzQyODk3Mn0.J8biZ_9TsupriNk8z1jXiSVzehEFOiTz8PHqGH4QUHs";
export const PAYSTACK_KEY = "pk_live_68410a36c97591a8e61aa8fc998b9e39cf51b92f";

export const AP_WEBHOOKS = {
  // Flow: verify payment + create order + call Datamart
  paystackVerify: "https://cloud.activepieces.com/api/v1/webhooks/YOUR_PAYSTACK_FLOW_ID",
  // Flow: wallet debit + create order + call Datamart (for wallet purchases)
  walletPurchase: "https://cloud.activepieces.com/api/v1/webhooks/YOUR_WALLET_FLOW_ID",
};
