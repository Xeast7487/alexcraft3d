"use client";

import { useState } from "react";
import Link from "next/link";
import { supprimerCommande, modifierCommande, modifierStatutCommande } from "@/app/actions";
import { formatMontant, statutColor, statutLabel, formatDate } from "@/lib/utils";

const STATUTS = ["a_imprimer", "en_cours", "complete", "livre"] as const;
type Statut = typeof STATUTS[number];

type Client = { id: number; nom: string } | null;
type CommandeRow = {
  id: number;
  titre: string;
  statut: string;
  montant_recu: number;
  notes: string;
  client_id: number | null;
  created_at: string;
  ac3d_clients: Client;
  ac3d_items: { prix: number }[];
};

export default function CommandeRow({
  commande: c,
  clients,
}: {
  commande: CommandeRow;
  clients: { id: number; nom: string }[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [statut, setStatut] = useState<Statut>(c.statut as Statut);
  const [toggling, setToggling] = useState(false);
  const total = (c.ac3d_items || []).reduce((sum, i) => sum + i.prix, 0);
  const restant = total - c.montant_recu;

  async function cycleStatut(e: React.MouseEvent) {
    e.preventDefault();
    if (toggling) return;
    setToggling(true);
    const idx = STATUTS.indexOf(statut);
    const next = STATUTS[(idx + 1) % STATUTS.length];
    setStatut(next);
    await modifierStatutCommande(c.id, next);
    setToggling(false);
  }

  return (
    <>
      <div className="flex items-center justify-between bg-surface border border-border hover:border-gray-500 rounded-xl p-4 transition-colors group">
        <Link href={`/commandes/${c.id}`} className="flex-1 min-w-0 flex items-center gap-4">
          <div className="min-w-0">
            <p className="font-medium text-white truncate">{c.titre}</p>
            <div className="flex items-center gap-3 mt-0.5">
              {c.ac3d_clients && (
                <span className="text-xs text-muted">{c.ac3d_clients.nom}</span>
              )}
              <span className="text-xs text-muted">{formatDate(c.created_at)}</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{formatMontant(total)}</p>
            {restant > 0 && (
              <p className="text-xs text-status-print">−{formatMontant(restant)}</p>
            )}
          </div>
          <button
            onClick={cycleStatut}
            disabled={toggling}
            title="Cliquer pour changer le statut"
            className={`text-xs px-2.5 py-1 rounded-full border transition-all hover:opacity-80 active:scale-95 ${statutColor(statut)} ${toggling ? "opacity-50" : ""}`}
          >
            {statutLabel(statut)}
          </button>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditOpen(true)}
              className="p-1.5 text-muted hover:text-white hover:bg-border rounded-lg transition-colors"
              title="Modifier"
            >
              ✏️
            </button>
            <button
              onClick={async () => {
                if (confirm(`Supprimer "${c.titre}" ?`)) {
                  await supprimerCommande(c.id);
                }
              }}
              className="p-1.5 text-muted hover:text-red-400 hover:bg-border rounded-lg transition-colors"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {editOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-white mb-4">Modifier la commande</h3>
            <form
              action={async (fd) => {
                await modifierCommande(c.id, fd);
                setEditOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-muted">Titre</label>
                <input
                  name="titre"
                  defaultValue={c.titre}
                  required
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Client</label>
                <select
                  name="client_id"
                  defaultValue={c.client_id || ""}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                >
                  <option value="">— Sans client —</option>
                  {clients.map((cl) => (
                    <option key={cl.id} value={cl.id}>{cl.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={c.notes}
                  rows={3}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm"
                >
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="text-muted text-sm px-4 py-2"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
