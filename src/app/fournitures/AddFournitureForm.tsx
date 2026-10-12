"use client";

import { useState } from "react";
import { ajouterFourniture } from "@/app/actions";

type Client = { id: number; nom: string };
type Commande = { id: number; titre: string };

export default function AddFournitureForm({ clients, commandes }: { clients: Client[]; commandes: Commande[] }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        + Ajouter une fourniture
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        await ajouterFourniture(fd);
        setOpen(false);
      }}
      className="bg-surface border border-border rounded-xl p-5 space-y-4"
    >
      <h3 className="font-semibold text-white">Nouvelle fourniture</h3>
      <div>
        <label className="text-xs text-muted">Description *</label>
        <input name="description" required
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
          placeholder="ex: Filament PLA bleu 1kg" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted">Fournisseur</label>
          <input name="fournisseur"
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
            placeholder="Amazon, Bambu..." />
        </div>
        <div>
          <label className="text-xs text-muted">Montant ($)</label>
          <input name="montant" type="number" step="0.01" min="0"
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
            placeholder="0.00" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted">Client</label>
          <select name="client_id"
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent">
            <option value="">— Aucun —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted">Commande</label>
          <select name="commande_id"
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent">
            <option value="">— Aucune —</option>
            {commandes.map((c) => <option key={c.id} value={c.id}>{c.titre}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted">Date d'achat</label>
          <input name="date_achat" type="date" defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input type="checkbox" name="est_facture" value="true" id="est_facture_main" className="rounded" />
          <label htmlFor="est_facture_main" className="text-sm text-muted">Déjà remboursé</label>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm">
          Ajouter
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-muted text-sm px-4 py-2">Annuler</button>
      </div>
    </form>
  );
}
