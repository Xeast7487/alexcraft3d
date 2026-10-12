import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";
import MobileNav from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlexCraft3D",
  description: "Gestion des commandes d'impression 3D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const isAuth = cookieStore.get("ac3d_auth")?.value === process.env.ADMIN_PASSWORD;

  return (
    <html lang="fr">
      <body className={inter.className}>
        {isAuth ? (
          <div className="flex min-h-screen">
            {/* Sidebar — desktop only */}
            <nav className="hidden md:flex w-56 bg-surface border-r border-border flex-col flex-shrink-0">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🖨️</span>
                  <div>
                    <p className="font-bold text-white text-sm">AlexCraft3D</p>
                    <p className="text-xs text-muted">Gestion commandes</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-3 space-y-1">
                <NavLink href="/" label="Tableau de bord" icon="📊" />
                <NavLink href="/commandes" label="Commandes" icon="📦" />
                <NavLink href="/clients" label="Clients" icon="👤" />
                <NavLink href="/fournitures" label="Fournitures" icon="🛒" />
              </div>
              <div className="p-3 border-t border-border">
                <LogoutButton />
              </div>
            </nav>

            {/* Mobile header */}
            <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🖨️</span>
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
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-border hover:text-white transition-colors"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
