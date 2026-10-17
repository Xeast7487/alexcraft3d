"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Printer3DIcon from "@/components/Printer3DIcon";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Item = {
  id: number;
  nom_piece: string;
  statut: string;
  progression: number;
  temps_restant: number;
  en_impression: boolean;
};

type StatusLabels = {
  a_imprimer: string;
  en_cours: string;
  complete: string;
  livre: string;
};

export default function SuiviLiveItems({
  initialItems,
  statusLabels,
}: {
  initialItems: Item[];
  statusLabels: StatusLabels;
}) {
  const [items, setItems] = useState<Item[]>(initialItems);

  useEffect(() => {
    const ids = initialItems.map((i) => i.id);
    if (ids.length === 0) return;

    const channel = supabase
      .channel("suivi-items-live")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ac3d_items",
          filter: `id=in.(${ids.join(",")})`,
        },
        (payload) => {
          const updated = payload.new as Item;
          setItems((prev) =>
            prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="p-3 space-y-2">
      {items.map((item, idx) => {
        const isLivre = item.statut === "livre";
        const isEnCours = item.statut === "en_cours";
        const isEnImpression = item.en_impression;
        const label = statusLabels[item.statut as keyof StatusLabels] ?? item.statut;

        return (
          <div
            key={item.id}
            className={`relative rounded-xl p-4 overflow-hidden card-anim ${isEnCours && !isEnImpression ? "glow-blue" : ""} ${isEnImpression ? "glow-orange" : ""}`}
            style={{
              animationDelay: `${150 + idx * 60}ms`,
              background: isLivre
                ? "rgba(34,197,94,0.05)"
                : isEnImpression
                ? "rgba(242,98,23,0.08)"
                : isEnCours
                ? "rgba(59,130,246,0.08)"
                : "rgba(255,255,255,0.03)",
              border: isLivre
                ? "1px solid rgba(34,197,94,0.25)"
                : isEnImpression
                ? "1px solid rgba(242,98,23,0.35)"
                : isEnCours
                ? "1px solid rgba(59,130,246,0.35)"
                : "1px solid rgba(242,98,23,0.12)",
            }}
          >
            {isEnImpression && (
              <div className="absolute left-0 right-0 h-px pointer-events-none" style={{
                background: "linear-gradient(90deg, transparent, rgba(242,98,23,0.6), transparent)",
                animation: "scanLine 1.5s linear infinite",
              }} />
            )}
            {isEnCours && !isEnImpression && (
              <div className="absolute left-0 right-0 h-px pointer-events-none" style={{
                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)",
                animation: "scanLine 1.5s linear infinite",
              }} />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{
                    background: isLivre
                      ? "rgba(34,197,94,0.15)"
                      : isEnImpression
                      ? "rgba(242,98,23,0.15)"
                      : isEnCours
                      ? "rgba(59,130,246,0.15)"
                      : "rgba(242,98,23,0.08)",
                  }}>
                  {isLivre
                    ? "✅"
                    : isEnImpression
                    ? <span className="nozzle inline-flex"><Printer3DIcon size={16} color="#f26217" /></span>
                    : isEnCours
                    ? <span className="nozzle inline-flex"><Printer3DIcon size={16} color="#60a5fa" /></span>
                    : "⏳"}
                </div>
                <span className="text-sm font-medium">{item.nom_piece}</span>
              </div>
              <div className="flex items-center gap-2">
                {isEnImpression && (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#f26217" }}>
                    {item.progression}%
                  </span>
                )}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                  background: isLivre
                    ? "rgba(34,197,94,0.15)"
                    : isEnImpression
                    ? "rgba(242,98,23,0.15)"
                    : isEnCours
                    ? "rgba(59,130,246,0.15)"
                    : "rgba(242,98,23,0.1)",
                  color: isLivre ? "#4ade80" : isEnImpression ? "#f26217" : isEnCours ? "#60a5fa" : "#fdba74",
                  border: isLivre
                    ? "1px solid rgba(34,197,94,0.3)"
                    : isEnImpression
                    ? "1px solid rgba(242,98,23,0.3)"
                    : isEnCours
                    ? "1px solid rgba(59,130,246,0.3)"
                    : "1px solid rgba(242,98,23,0.25)",
                }}>
                  {isEnImpression ? "Impression…" : label}
                </span>
              </div>
            </div>

            {isEnImpression && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${item.progression}%`,
                    background: "linear-gradient(90deg, #f26217, #fb923c)",
                    borderRadius: "999px",
                    transition: "width 1.5s ease",
                  }} />
                </div>
                {item.temps_restant > 0 && (
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "5px" }}>
                    ~{item.temps_restant < 60
                      ? `${item.temps_restant} min restantes`
                      : `${Math.floor(item.temps_restant / 60)}h${item.temps_restant % 60 > 0 ? ` ${item.temps_restant % 60}min` : ""} restantes`}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
