"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

const ADMIN_ROUTES = ["/commandes", "/clients", "/devis", "/fournitures", "/dashboard", "/login"];

declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
      minimize: () => void;
      toggle: () => void;
      hideWidget: () => void;
      showWidget: () => void;
      isChatMaximized: () => boolean;
      onLoad?: () => void;
      onStatusChange?: (status: string) => void;
      onChatMinimized?: () => void;
      onChatMaximized?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

const PROPERTY_ID = "6ad5312c0d940634ca4822d6";
const WIDGET_ID   = "1k58cg5nr";

export default function TawkChat() {
  const pathname = usePathname();
  const isAdmin  = ADMIN_ROUTES.some(r => pathname.startsWith(r));

  const [loaded, setLoaded]   = useState(false);
  const [online, setOnline]   = useState(false);
  const [open, setOpen]       = useState(false);
  const [pulse, setPulse]     = useState(false);

  useEffect(() => {
    // Préparer l'API avant le chargement du script
    window.Tawk_API = window.Tawk_API || {} as NonNullable<typeof window.Tawk_API>;
    window.Tawk_LoadStart = new Date();

    window.Tawk_API!.onLoad = () => {
      window.Tawk_API!.hideWidget();
      setLoaded(true);
      // Petit pulse d'attention après 3s
      setTimeout(() => { setPulse(true); setTimeout(() => setPulse(false), 1200); }, 3000);
    };

    window.Tawk_API!.onStatusChange = (status) => {
      setOnline(status === "online");
    };

    window.Tawk_API!.onChatMinimized = () => setOpen(false);
    window.Tawk_API!.onChatMaximized = () => setOpen(true);

    const s = document.createElement("script");
    s.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    s.async = true;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.head.appendChild(s);

    return () => { document.head.removeChild(s); };
  }, []);

  const toggle = useCallback(() => {
    if (!window.Tawk_API) return;
    if (open) {
      window.Tawk_API.minimize();
    } else {
      window.Tawk_API.maximize();
    }
  }, [open]);

  if (!loaded || isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Bulle de teasing — apparaît avant que le client clique */}
      {!open && (
        <div className="bg-[#1a1a1a] border border-white/10 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm shadow-lg animate-fade-in max-w-[220px] leading-snug">
          <p className="font-medium text-[#f26217]">Une question ?</p>
          <p className="text-gray-400 text-xs mt-0.5">On répond en moins de 24h 👋</p>
        </div>
      )}

      {/* Bouton principal */}
      <button
        onClick={toggle}
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
        className={`
          relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center
          transition-all duration-200 active:scale-95
          ${open
            ? "bg-[#222] border border-white/10 hover:bg-[#2a2a2a]"
            : "bg-[#f26217] hover:bg-[#d9561a]"
          }
          ${pulse ? "ring-4 ring-[#f26217]/40 scale-110" : ""}
        `}
      >
        {/* Indicateur online */}
        {online && !open && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-bg" />
        )}

        {/* Icône — chat ou X */}
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
