"use client";

import { useTransition } from "react";
import { modifierStatutDevis, supprimerDevis, convertirDevisEnCommande } from "@/app/actions";

const STATUTS: Record<string, { label: string; color: string }> = {
  nouveau:  { label: "Nouveau",  color: "bg-[#f26217]/10 text-[#f26217]" },
  en_etude: { label: "En étude", color: "bg-blue-500/10 text-blue-400" },
  envoye:   { label: "Envoyé",   color: "bg-purple-500/10 text-purple-400" },
  accepte:  { label: "Accepté",  color: "bg-green-500/10 text-green-400" },
  refuse:   { label: "Refusé",   color: "bg-red-500/10 text-red-400" },
};

export default function DevisCard({ devis: d }: { devis: Record<string, any> }) {
  const [pending, startTransition] = useTransition();
  const statut = STATUTS[d.statut] ?? STATUTS.nouveau;
  const date = new Date(d.created_at).toLocaleDateString("fr-CA", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className={`bg-surface border border-border rounded-xl p-5 transition-opacity ${pending ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <span className="font-semibold text-white text-sm">{d.nom}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statut.color}`}>{statut.label}</span>
            <span className="text-xs text-muted">{date}</span>
          </div>
          <p className="text-sm text-[#d1d5db] mb-2">{d.description}</p>
          <div className="flex gap-4 flex-wrap text-xs text-muted">
            <span>{d.email}</span>
            {d.telephone && <span>{d.telephone}</span>}
            {d.quantite > 1 && <span>Qté : {d.quantite}</span>}
            {d.couleur && <span>Couleur : {d.couleur}</span>}
            {d.delai && <span>Délai : {d.delai}</span>}
          </div>
          {d.notes && <p className="text-xs text-muted mt-1.5 italic">{d.notes}</p>}
          {d.fichier_url && (
            <a
              href={d.fichier_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs text-accent hover:underline"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Télécharger fichier STL
            </a>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0 min-w-[140px]">
          <button
            onClick={() => startTransition(() => convertirDevisEnCommande(d.id))}
            className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            Créer commande
          </button>

          <select
            value={d.statut}
            onChange={(e) => startTransition(() => modifierStatutDevis(d.id, e.target.value))}
            className="bg-border border border-border text-white text-xs rounded-lg px-2 py-2 focus:outline-none cursor-pointer"
          >
            {Object.entries(STATUTS).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <button
            onClick={() => {
              if (confirm("Supprimer cette demande ?")) {
                startTransition(() => supprimerDevis(d.id));
              }
            }}
            className="text-muted hover:text-red-400 text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
