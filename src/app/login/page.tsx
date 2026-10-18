"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = "/commandes";
    } else {
      setError("Identifiants incorrects.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-black text-3xl tracking-tight">
            <span className="text-white">2F</span><span className="text-accent">3D</span>
          </span>
          <p className="text-muted text-xs mt-2 uppercase tracking-widest font-semibold">Espace admin</p>
        </div>

        {/* Form */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wider">Utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent transition-colors placeholder-[#333]"
                placeholder="alex ou vincent"
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-medium uppercase tracking-wider">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent transition-colors placeholder-[#333]"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs pt-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40 mt-1"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
