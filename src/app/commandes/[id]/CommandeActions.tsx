"use client";

import { useState } from "react";
import { modifierCommande, supprimerCommande, modifierStatutCommande, genererLienSuivi } from "@/app/actions";
import { Commande } from "@/lib/supabase";

type Client = { id: number; nom: string };

export default function CommandeActions({ commande, clients }: { commande: Commande; clients: Client[] }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [suiviCopied, setSuiviCopied] = useState(false);

  async function partagerSuivi() {
    let token = commande.suivi_token;
    if (!token) token = await genererLienSuivi(commande.id);
    const url = `${window.location.origin}/suivi/${token}`;
    await navigator.clipboard.writeText(url);
    setSuiviCopied(true);
    setTimeout(() => setSuiviCopied(false), 2000);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs bg-surface border border-border hover:border-gray-500 text-white px-3 py-1.5 rounded-lg transition-colors"
      >
        ⚙️ Actions
      </button>

      {open && (
        <div className="absolute right-0 top-9 bg-surface border border-border rounded-xl shadow-xl z-10 w-52 py-1">
          <p className="text-xs text-muted px-3 py-1.5">Changer le statut</p>
          {[
            { v: "a_imprimer", l: "À imprimer" },
            { v: "en_cours", l: "En cours" },
            { v: "complete", l: "Complété" },
            { v: "livre", l: "Livré" },
          ].map((s) => (
            <button
              key={s.v}
              disabled={commande.statut === s.v}
              onClick={async () => {
                await modifierStatutCommande(commande.id, s.v);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {commande.statut === s.v ? "✓ " : ""}{s.l}
            </button>
          ))}
          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={partagerSuivi}
              className="w-full text-left px-3 py-2 text-sm hover:bg-border transition-colors text-accent"
            >
              {suiviCopied ? "✓ Lien copié !" : "🔗 Lien de suivi client"}
            </button>
            <button
              onClick={() => { setEditOpen(true); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-border transition-colors"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={async () => {
                if (confirm("Supprimer cette commande ?")) {
                  await supprimerCommande(commande.id);
                }
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-border transition-colors"
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setEditOpen(false)}>
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-4">Modifier la commande</h3>
            <form
              action={async (fd) => {
                await modifierCommande(commande.id, fd);
                setEditOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-muted">Titre</label>
                <input
                  name="titre"
                  defaultValue={commande.titre}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Client</label>
                <select
                  name="client_id"
                  defaultValue={commande.client_id || ""}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                >
                  <option value="">— Sans client —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={commande.notes}
                  rows={3}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm">
                  Sauvegarder
                </button>
                <button type="button" onClick={() => setEditOpen(false)} className="text-muted text-sm px-4 py-2">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
