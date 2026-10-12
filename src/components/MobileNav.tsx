"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/commandes", label: "Commandes", icon: "📦" },
  { href: "/clients", label: "Clients", icon: "👤" },
  { href: "/fournitures", label: "Fournitures", icon: "🛒" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border safe-area-pb">
      <div className="flex items-center justify-around px-2 py-1">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-0 ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <span className="text-xl leading-none">{link.icon}</span>
              <span className="text-[10px] font-medium truncate">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
