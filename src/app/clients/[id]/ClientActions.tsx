"use client";

import { useState } from "react";
import { modifierClient, supprimerClient } from "@/app/actions";
import { Client } from "@/lib/supabase";

export default function ClientActions({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs bg-surface border border-border hover:border-gray-500 text-white px-3 py-1.5 rounded-lg transition-colors"
      >
        ⚙️ Actions
      </button>

      {open && (
        <div className="absolute right-0 top-9 bg-surface border border-border rounded-xl shadow-xl z-10 w-44 py-1">
          <button
            onClick={() => { setEditOpen(true); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-border transition-colors"
          >
            ✏️ Modifier
          </button>
          <button
            onClick={async () => {
              if (confirm("Supprimer ce client et toutes ses données ?")) {
                await supprimerClient(client.id);
              }
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-border transition-colors"
          >
            🗑️ Supprimer
          </button>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setEditOpen(false)}>
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-4">Modifier le client</h3>
            <form
              action={async (fd) => {
                await modifierClient(client.id, fd);
                setEditOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-muted">Nom</label>
                <input name="nom" defaultValue={client.nom}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted">Courriel</label>
                  <input name="email" defaultValue={client.email}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-xs text-muted">Téléphone</label>
                  <input name="telephone" defaultValue={client.telephone}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted">Notes</label>
                <textarea name="notes" defaultValue={client.notes} rows={3}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent resize-none" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm">
                  Sauvegarder
                </button>
                <button type="button" onClick={() => setEditOpen(false)} className="text-muted text-sm px-4 py-2">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
