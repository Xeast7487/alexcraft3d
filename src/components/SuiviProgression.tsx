"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ItemProgress = {
  id: number;
  progression: number;
  temps_restant: number;
  en_impression: boolean;
};

export default function SuiviProgression({ itemIds }: { itemIds: number[] }) {
  const [progress, setProgress] = useState<Record<number, ItemProgress>>({});

  useEffect(() => {
    if (itemIds.length === 0) return;

    const channel = supabase
      .channel("items-progress")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ac3d_items",
          filter: `id=in.(${itemIds.join(",")})`,
        },
        (payload) => {
          const updated = payload.new as ItemProgress;
          setProgress((prev) => ({ ...prev, [updated.id]: updated }));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [itemIds.join(",")]);

  if (Object.keys(progress).length === 0) return null;

  return (
    <>
      {Object.values(progress)
        .filter((p) => p.en_impression)
        .map((p) => (
          <div key={p.id} id={`progress-${p.id}`} style={{
            marginTop: "8px",
            padding: "10px 14px",
            background: "rgba(242,98,23,0.08)",
            borderRadius: "10px",
            border: "1px solid rgba(242,98,23,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#f26217", fontWeight: 600 }}>
                Impression en cours…
              </span>
              <span style={{ fontSize: "12px", color: "#f26217", fontWeight: 700 }}>
                {p.progression}%
              </span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${p.progression}%`,
                background: "linear-gradient(90deg, #f26217, #fb923c)",
                borderRadius: "999px",
                transition: "width 1s ease",
              }} />
            </div>
            {p.temps_restant > 0 && (
              <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "5px" }}>
                ~{p.temps_restant < 60
                  ? `${p.temps_restant} min restantes`
                  : `${Math.floor(p.temps_restant / 60)}h${p.temps_restant % 60 > 0 ? ` ${p.temps_restant % 60}min` : ""} restantes`}
              </p>
            )}
          </div>
        ))}
    </>
  );
}
