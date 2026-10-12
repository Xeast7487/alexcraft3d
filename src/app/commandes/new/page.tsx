import { supabase } from "@/lib/supabase";
import { creerCommande } from "@/app/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NouvelleCommandePage() {
  const { data: clients } = await supabase
    .from("ac3d_clients")
    .select("id, nom")
    .order("nom");

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/commandes" className="text-muted text-sm hover:text-white">← Retour</Link>
        <h1 className="text-2xl font-bold text-white mt-2">Nouvelle commande</h1>
      </div>

      <form action={creerCommande} className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Titre de la commande *</label>
          <input
            name="titre"
            required
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
            placeholder="ex: Pièces moteur BMW"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Client</label>
          <select
            name="client_id"
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
          >
            <option value="">— Sans client —</option>
            {(clients || []).map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent resize-none"
            placeholder="Notes internes, délais, spécifications..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Créer la commande
          </button>
          <Link
            href="/commandes"
            className="px-5 py-2 text-sm text-muted hover:text-white border border-border rounded-lg transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
