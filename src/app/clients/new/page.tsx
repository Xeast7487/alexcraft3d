import { creerClient } from "@/app/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NouveauClientPage() {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/clients" className="text-muted text-sm hover:text-white">← Retour</Link>
        <h1 className="text-2xl font-bold text-white mt-2">Nouveau client</h1>
      </div>

      <form action={creerClient} className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Nom *</label>
          <input
            name="nom"
            required
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
            placeholder="Jean Tremblay"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">Courriel</label>
            <input
              name="email"
              type="email"
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
              placeholder="jean@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Téléphone</label>
            <input
              name="telephone"
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
              placeholder="514-555-0100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent resize-none"
            placeholder="Informations supplémentaires..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Créer le client
          </button>
          <Link
            href="/clients"
            className="px-5 py-2 text-sm text-muted hover:text-white border border-border rounded-lg transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
