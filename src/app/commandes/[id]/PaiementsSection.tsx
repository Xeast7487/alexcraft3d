"use client";

import { useState } from "react";
import { ajouterPaiement, supprimerPaiement } from "@/app/actions";
import { Paiement } from "@/lib/supabase";
import { formatMontant, formatDate } from "@/lib/utils";

export default function PaiementsSection({ paiements, commandeId }: { paiements: Paiement[]; commandeId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white">Paiements reçus</h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          + Ajouter
        </button>
      </div>

      {open && (
        <form
          action={async (fd) => {
            await ajouterPaiement(commandeId, fd);
            setOpen(false);
          }}
          className="bg-bg border border-border rounded-lg p-4 mb-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted">Montant ($)</label>
              <input name="montant" type="number" step="0.01" min="0" required
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs text-muted">Note</label>
              <input name="note"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                placeholder="Virement, cash..." />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm">
              Enregistrer
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-muted text-sm px-4 py-2">Annuler</button>
          </div>
        </form>
      )}

      {paiements.length === 0 ? (
        <p className="text-muted text-sm">Aucun paiement enregistré.</p>
      ) : (
        <div className="space-y-2">
          {paiements.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border/50">
              <div>
                <p className="text-sm font-medium text-status-livre">{formatMontant(p.montant)}</p>
                {p.note && <p className="text-xs text-muted">{p.note}</p>}
                <p className="text-xs text-muted">{formatDate(p.created_at)}</p>
              </div>
              <button
                onClick={async () => {
                  if (confirm("Supprimer ce paiement ?")) {
                    await supprimerPaiement(p.id, commandeId);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-border"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
