"use client";

import { useState } from "react";
import Link from "next/link";
import { supprimerClient, modifierClient } from "@/app/actions";

type ClientRow = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  notes: string;
  ac3d_commandes: { id: number; statut: string }[];
};

export default function ClientRow({ client: c }: { client: ClientRow }) {
  const [editOpen, setEditOpen] = useState(false);
  const actives = (c.ac3d_commandes || []).filter((cmd) => cmd.statut !== "livre").length;
  const total = (c.ac3d_commandes || []).length;

  return (
    <>
      <div className="flex items-center justify-between bg-surface border border-border hover:border-gray-500 rounded-xl p-4 transition-colors group">
        <Link href={`/clients/${c.id}`} className="flex-1 min-w-0">
          <p className="font-medium text-white">{c.nom}</p>
          <div className="flex items-center gap-3 mt-0.5">
            {c.email && <span className="text-xs text-muted">{c.email}</span>}
            {c.telephone && <span className="text-xs text-muted">{c.telephone}</span>}
          </div>
        </Link>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm text-white">{total} commande{total !== 1 ? "s" : ""}</p>
            {actives > 0 && (
              <p className="text-xs text-status-cours">{actives} en cours</p>
            )}
          </div>
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
                if (confirm(`Supprimer "${c.nom}" ?`)) {
                  await supprimerClient(c.id);
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
            <h3 className="font-semibold text-white mb-4">Modifier le client</h3>
            <form
              action={async (fd) => {
                await modifierClient(c.id, fd);
                setEditOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-muted">Nom</label>
                <input
                  name="nom"
                  defaultValue={c.nom}
                  required
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted">Courriel</label>
                  <input
                    name="email"
                    defaultValue={c.email}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted">Téléphone</label>
                  <input
                    name="telephone"
                    defaultValue={c.telephone}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
                  />
                </div>
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
