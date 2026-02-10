"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setError(null);
      setMessage(null);

      try {
        const supabase = createSupabaseBrowserClient();

        const url = new URL(window.location.href);
        const type = url.searchParams.get("type");
        const tokenHash = url.searchParams.get("token_hash");
        const code = url.searchParams.get("code");

        if (type === "recovery" && tokenHash) {
          const { error: verifyErr } = await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
          if (verifyErr) throw verifyErr;
          router.replace("/admin/reset-password");
        } else if (code) {
          const { error: exchErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchErr) throw exchErr;
          router.replace("/admin/reset-password");
        } else {
          const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
          const hashParams = new URLSearchParams(hash);
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          const hashType = hashParams.get("type");

          if (hashType === "recovery" && accessToken && refreshToken) {
            const { error: sessErr } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            if (sessErr) throw sessErr;
            router.replace("/admin/reset-password");
          }
        }

        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setMessage("Open the password reset link from your email to continue.");
        }

        if (!cancelled) setReady(true);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to initialize password reset");
          setReady(true);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function updatePassword() {
    setError(null);
    setMessage(null);

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setError("Reset link is missing or expired. Please request a new password reset email.");
        return;
      }

      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;

      setMessage("Password updated. You can now sign in.");
      router.push("/admin/login");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold">Set Password</h1>
      <p className="mt-2 text-sm text-zinc-600">Choose a new password for your admin account.</p>

      <div className="mt-6 space-y-3">
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input
            className="mt-1 border p-2 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="New password"
            disabled={!ready || loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm password</label>
          <input
            className="mt-1 border p-2 rounded w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm password"
            disabled={!ready || loading}
          />
        </div>

        <button
          onClick={updatePassword}
          disabled={!ready || loading}
          className="inline-flex items-center justify-center rounded bg-zinc-900 text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update password"}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-zinc-700">{message}</p> : null}
      </div>
    </div>
  );
}
