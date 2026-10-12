"use client";

import { supprimerFourniture, toggleFourniturefacturee } from "@/app/actions";
import { formatMontant } from "@/lib/utils";

type Fourniture = {
  id: number;
  description: string;
  fournisseur: string;
  montant: number;
  est_facture: boolean;
  date_achat: string;
  notes: string;
  ac3d_clients?: { nom: string } | null;
  ac3d_commandes?: { titre: string } | null;
};

export default function FournitureRow({ fourniture: f }: { fourniture: Fourniture }) {
  return (
    <div className="flex items-center justify-between bg-surface border border-border hover:border-gray-500 rounded-xl p-4 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm">{f.description}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
          {f.fournisseur && <span className="text-xs text-muted">{f.fournisseur}</span>}
          {f.ac3d_clients && <span className="text-xs text-muted">Client: {f.ac3d_clients.nom}</span>}
          {f.ac3d_commandes && <span className="text-xs text-muted">Cmd: {f.ac3d_commandes.titre}</span>}
          <span className="text-xs text-muted">{f.date_achat}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <span className="text-sm font-semibold text-white">{formatMontant(f.montant)}</span>
        <button
          onClick={async () => toggleFourniturefacturee(f.id, f.est_facture)}
          className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
            f.est_facture
              ? "text-status-livre bg-green-950/40 border-green-800/50 hover:bg-green-950/60"
              : "text-muted border-border hover:border-gray-500 hover:text-white"
          }`}
        >
          {f.est_facture ? "Remboursé ✓" : "À rembourser"}
        </button>
        <button
          onClick={async () => {
            if (confirm("Supprimer cette fourniture ?")) {
              await supprimerFourniture(f.id);
            }
          }}
          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-border transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
