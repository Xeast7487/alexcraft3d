"use client";

import { useState } from "react";
import { ajouterFourniture, supprimerFourniture, toggleFourniturefacturee } from "@/app/actions";
import { Fourniture } from "@/lib/supabase";
import { formatMontant } from "@/lib/utils";

type Client = { id: number; nom: string };

export default function FournituresSection({
  fournitures,
  commandeId,
  clients,
}: {
  fournitures: Fourniture[];
  commandeId: number;
  clients: Client[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white">Fournitures commandées</h2>
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
            fd.set("commande_id", String(commandeId));
            await ajouterFourniture(fd);
            setOpen(false);
          }}
          className="bg-bg border border-border rounded-lg p-4 mb-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted">Description *</label>
              <input name="description" required
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                placeholder="ex: Filament PLA rouge 1kg" />
            </div>
            <div>
              <label className="text-xs text-muted">Fournisseur</label>
              <input name="fournisseur"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                placeholder="Amazon, Bambu..." />
            </div>
            <div>
              <label className="text-xs text-muted">Montant ($)</label>
              <input name="montant" type="number" step="0.01" min="0"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs text-muted">Date d'achat</label>
              <input name="date_achat" type="date" defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" name="est_facture" value="true" id="facture_comm" className="rounded" />
              <label htmlFor="facture_comm" className="text-xs text-muted">Déjà facturé au client</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm">
              Ajouter
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-muted text-sm px-4 py-2">Annuler</button>
          </div>
        </form>
      )}

      {fournitures.length === 0 ? (
        <p className="text-muted text-sm">Aucune fourniture enregistrée.</p>
      ) : (
        <div className="space-y-2">
          {fournitures.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border/50">
              <div>
                <p className="text-sm text-white">{f.description}</p>
                <p className="text-xs text-muted">{f.fournisseur} · {f.date_achat}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">{formatMontant(f.montant)}</p>
                <button
                  onClick={async () => toggleFourniturefacturee(f.id, f.est_facture)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                    f.est_facture
                      ? "text-status-livre bg-green-950/40 border-green-800/50"
                      : "text-muted border-border hover:border-gray-500"
                  }`}
                >
                  {f.est_facture ? "Facturé ✓" : "Non facturé"}
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Supprimer cette fourniture ?")) {
                      await supprimerFourniture(f.id);
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-border"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
