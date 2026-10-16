"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import MobileNav from "./MobileNav";

const NAV = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/commandes",
    label: "Commandes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
  },
  {
    href: "/clients",
    label: "Clients",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: "/fournitures",
    label: "Fournitures",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
];

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname.startsWith("/suivi");

  if (isPublicPage) return <main>{children}</main>;

  return (
    <div className="flex min-h-screen bg-bg">

      {/* Sidebar — desktop */}
      <nav className="hidden md:flex w-52 bg-surface border-r border-border flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-black text-lg tracking-tight">
              <span className="text-white">2F</span><span className="text-accent">3D</span>
            </span>
            <span className="text-[10px] text-muted uppercase tracking-widest font-semibold mt-0.5">Admin</span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted hover:text-white hover:bg-border"
                }`}
              >
                <span className={active ? "text-accent" : ""}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border">
          <LogoutButton />
        </div>
      </nav>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-surface border-b border-border px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-black text-base tracking-tight">
            <span className="text-white">2F</span><span className="text-accent">3D</span>
          </span>
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">Admin</span>
        </Link>
        <LogoutButton compact />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 pt-16 md:pt-8 pb-20 md:pb-8">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
