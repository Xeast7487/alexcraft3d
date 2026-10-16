import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import CommandeRow from "./CommandeRow";

export const dynamic = "force-dynamic";

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: { statut?: string };
}) {
  const statut = searchParams.statut;
  const user = await getCurrentUser();

  let commandesQuery = supabase
    .from("ac3d_commandes")
    .select("*")
    .eq("utilisateur", user)
    .order("created_at", { ascending: false });

  if (statut && statut !== "tous") {
    commandesQuery = commandesQuery.eq("statut", statut);
  }

  const [{ data: commandes }, { data: clients }, { data: items }] = await Promise.all([
    commandesQuery,
    supabase.from("ac3d_clients").select("id, nom").eq("utilisateur", user).order("nom"),
    supabase.from("ac3d_items").select("commande_id, prix"),
  ]);

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

      <div className="flex gap-2 flex-wrap">
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
            const commandeItems = (items || []).filter((i) => i.commande_id === c.id);
            const commandeClient = (clients || []).find((cl) => cl.id === c.client_id) || null;
            return (
              <CommandeRow
                key={c.id}
                commande={{ ...c, ac3d_items: commandeItems, ac3d_clients: commandeClient }}
                clients={clients || []}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
