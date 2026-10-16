"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import MobileNav from "./MobileNav";
import Printer3DIcon from "./Printer3DIcon";

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname.startsWith("/suivi");

  if (isPublicPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop only */}
      <nav className="hidden md:flex w-56 bg-surface border-r border-border flex-col flex-shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Printer3DIcon size={28} color="#6366f1" />
            <div>
              <p className="font-bold text-white text-sm">AlexCraft3D</p>
              <p className="text-xs text-muted">Gestion commandes</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-3 space-y-1">
          <NavLink href="/" label="Tableau de bord" icon="📊" active={pathname === "/"} />
          <NavLink href="/commandes" label="Commandes" icon="📦" active={pathname.startsWith("/commandes")} />
          <NavLink href="/clients" label="Clients" icon="👤" active={pathname.startsWith("/clients")} />
          <NavLink href="/fournitures" label="Fournitures" icon="🛒" active={pathname.startsWith("/fournitures")} />
        </div>
        <div className="p-3 border-t border-border">
          <LogoutButton />
        </div>
      </nav>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Printer3DIcon size={22} color="#6366f1" />
          <span className="font-bold text-white text-sm">AlexCraft3D</span>
        </div>
        <LogoutButton compact />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <MobileNav />
    </div>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? "bg-border text-white" : "text-gray-300 hover:bg-border hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
