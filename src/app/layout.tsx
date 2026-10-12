import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import MobileNav from "@/components/MobileNav";
import NavWrapper from "@/components/NavWrapper";

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
  return (
    <html lang="fr">
      <body className={inter.className}>
        <NavWrapper>
          {children}
        </NavWrapper>
      </body>
    </html>
  );
}
