import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import MobileNav from "@/components/MobileNav";
import NavWrapper from "@/components/NavWrapper";
import TawkChat from "@/components/TawkChat";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "2F3D — Les Deux Frères de l'Impression 3D",
  description: "Alex et Vincent partagent leur passion pour l'impression 3D avec la Bambu Lab.",
  openGraph: {
    title: "2F3D — Les Deux Frères de l'Impression 3D",
    description: "Alex et Vincent partagent leur passion pour l'impression 3D avec la Bambu Lab.",
    url: "https://2f3d.ca",
    siteName: "2F3D",
    images: [{ url: "https://2f3d.ca/2f3d-logo.jpg", width: 800, height: 800, alt: "2F3D" }],
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "2F3D",
    description: "Les Deux Frères de l'Impression 3D",
    images: ["https://2f3d.ca/2f3d-logo.jpg"],
  },
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
        <TawkChat />
      </body>
    </html>
  );
}
