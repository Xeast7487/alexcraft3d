import { supabase } from "@/lib/supabase";
import { formatMontant, statutColor, statutLabel, formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: { statut?: string };
}) {
  const statut = searchParams.statut;

  let query = supabase
    .from("ac3d_commandes")
    .select("*, ac3d_clients(nom), ac3d_items(prix)")
    .order("created_at", { ascending: false });

  if (statut && statut !== "tous") {
    query = query.eq("statut", statut);
  }

  const { data: commandes } = await query;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Commandes</h1>
          <p className="text-muted text-sm mt-1">{commandes?.length ?? 0} commande(s)</p>
        </div>
        <Link
          href="/commandes/new"
          className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nouvelle commande
        </Link>
      </div>

      <div className="flex gap-2">
        {[
          { value: "tous", label: "Toutes" },
          { value: "a_imprimer", label: "À imprimer" },
          { value: "en_cours", label: "En cours" },
          { value: "livre", label: "Livrées" },
        ].map((f) => (
          <Link
            key={f.value}
            href={f.value === "tous" ? "/commandes" : `/commandes?statut=${f.value}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              (statut || "tous") === f.value
                ? "bg-accent border-accent text-white"
                : "border-border text-muted hover:text-white hover:border-gray-500"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {(commandes || []).length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-muted">Aucune commande trouvée.</p>
            <Link href="/commandes/new" className="text-accent text-sm mt-2 inline-block hover:underline">
              Créer la première commande →
            </Link>
          </div>
        ) : (
          (commandes || []).map((c) => {
            const total = (c.ac3d_items || []).reduce((sum: number, i: { prix: number }) => sum + i.prix, 0);
            const restant = total - c.montant_recu;
            return (
              <Link
                key={c.id}
                href={`/commandes/${c.id}`}
                className="flex items-center justify-between bg-surface border border-border hover:border-gray-500 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-white">{c.titre}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {c.ac3d_clients && (
                        <span className="text-xs text-muted">{c.ac3d_clients.nom}</span>
                      )}
                      <span className="text-xs text-muted">{formatDate(c.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{formatMontant(total)}</p>
                    {restant > 0 && (
                      <p className="text-xs text-status-print">−{formatMontant(restant)}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${statutColor(c.statut)}`}>
                    {statutLabel(c.statut)}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
