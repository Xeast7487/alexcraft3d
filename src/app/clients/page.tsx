import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const { data: clients } = await supabase
    .from("ac3d_clients")
    .select("*, ac3d_commandes(id, statut)")
    .order("nom");

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-muted text-sm mt-1">{clients?.length ?? 0} client(s)</p>
        </div>
        <Link
          href="/clients/new"
          className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nouveau client
        </Link>
      </div>

      <div className="space-y-2">
        {(clients || []).length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-muted">Aucun client enregistré.</p>
            <Link href="/clients/new" className="text-accent text-sm mt-2 inline-block hover:underline">
              Ajouter le premier client →
            </Link>
          </div>
        ) : (
          (clients || []).map((c) => {
            const actives = (c.ac3d_commandes || []).filter((cmd: { statut: string }) => cmd.statut !== "livre").length;
            const total = (c.ac3d_commandes || []).length;
            return (
              <Link
                key={c.id}
                href={`/clients/${c.id}`}
                className="flex items-center justify-between bg-surface border border-border hover:border-gray-500 rounded-xl p-4 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{c.nom}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {c.email && <span className="text-xs text-muted">{c.email}</span>}
                    {c.telephone && <span className="text-xs text-muted">{c.telephone}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{total} commande{total !== 1 ? "s" : ""}</p>
                  {actives > 0 && (
                    <p className="text-xs text-status-cours">{actives} en cours</p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
