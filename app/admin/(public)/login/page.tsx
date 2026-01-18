"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendLink() {
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/admin/orders`;
      const { error: err } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      if (err) throw err;
      setSent(true);
    } catch (e: any) {
      setError(e?.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <p className="mt-2 text-sm text-zinc-600">Enter your admin email to receive a magic link.</p>

      <div className="mt-6 space-y-3">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 border p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="admin@example.com"
          />
        </div>

        <button
          onClick={sendLink}
          disabled={loading}
          className="inline-flex items-center justify-center rounded bg-zinc-900 text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>

        {sent ? <p className="text-sm text-green-700">Check your inbox for the login link.</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
