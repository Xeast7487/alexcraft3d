"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ compact }: { compact?: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (compact) {
    return (
      <button
        onClick={handleLogout}
        className="text-muted hover:text-white p-1.5 rounded-lg hover:bg-border transition-colors text-sm"
        title="Déconnexion"
      >
        🚪
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 text-sm text-muted hover:text-white hover:bg-border rounded-lg transition-colors"
    >
      🚪 Déconnexion
    </button>
  );
}
