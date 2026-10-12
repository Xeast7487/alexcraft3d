import { supabase } from "@/lib/supabase";
import { formatMontant, statutColor, statutLabel, formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientActions from "./ClientActions";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const [{ data: client }, { data: commandes }, { data: fournitures }] = await Promise.all([
    supabase.from("ac3d_clients").select("*").eq("id", id).single(),
    supabase
      .from("ac3d_commandes")
      .select("*, ac3d_items(prix)")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("ac3d_fournitures").select("*").eq("client_id", id).order("date_achat", { ascending: false }),
  ]);

  if (!client) notFound();

  const totalCA = (commandes || []).reduce((sum, c) => {
    const itemsTotal = (c.ac3d_items || []).reduce((s: number, i: { prix: number }) => s + i.prix, 0);
    return sum + itemsTotal;
  }, 0);
  const totalRecu = (commandes || []).reduce((sum, c) => sum + c.montant_recu, 0);
  const solde = totalCA - totalRecu;

  const fournituresnonfacturees = (fournitures || [])
    .filter((f) => !f.est_facture)
    .reduce((sum, f) => sum + f.montant, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/clients" className="text-muted text-sm hover:text-white">← Clients</Link>
          <h1 className="text-2xl font-bold text-white mt-1">{client.nom}</h1>
          <div className="flex items-center gap-3 mt-1">
            {client.email && <span className="text-sm text-muted">{client.email}</span>}
            {client.telephone && <span className="text-sm text-muted">{client.telephone}</span>}
          </div>
        </div>
        <ClientActions client={client} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Total des commandes</p>
          <p className="text-xl font-bold text-white mt-1">{formatMontant(totalCA)}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Reçu</p>
          <p className="text-xl font-bold text-status-livre mt-1">{formatMontant(totalRecu)}</p>
        </div>
        <div className={`border rounded-xl p-4 ${solde > 0 ? "bg-orange-950/20 border-orange-800/40" : "bg-surface border-border"}`}>
          <p className="text-xs text-muted">Solde dû</p>
          <p className={`text-xl font-bold mt-1 ${solde > 0 ? "text-status-print" : "text-muted"}`}>
            {solde > 0 ? formatMontant(solde) : "Payé ✓"}
          </p>
        </div>
      </div>

      {client.notes && (
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted mb-1">Notes</p>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Commandes ({commandes?.length ?? 0})</h2>
          <Link
            href={`/commandes/new`}
            className="text-xs bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            + Nouvelle commande
          </Link>
        </div>
        {(commandes || []).length === 0 ? (
          <p className="text-muted text-sm">Aucune commande.</p>
        ) : (
          <div className="space-y-2">
            {(commandes || []).map((c) => {
              const itemsTotal = (c.ac3d_items || []).reduce((s: number, i: { prix: number }) => s + i.prix, 0);
              return (
                <Link
                  key={c.id}
                  href={`/commandes/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-border transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{c.titre}</p>
                    <p className="text-xs text-muted">{formatDate(c.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white">{formatMontant(itemsTotal)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statutColor(c.statut)}`}>
                      {statutLabel(c.statut)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {fournitures && fournitures.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Fournitures achetées pour ce client</h2>
            {fournituresnonfacturees > 0 && (
              <span className="text-xs text-status-print">{formatMontant(fournituresnonfacturees)} à rembourser</span>
            )}
          </div>
          <div className="space-y-2">
            {fournitures.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border/50">
                <div>
                  <p className="text-sm text-white">{f.description}</p>
                  <p className="text-xs text-muted">{f.fournisseur} · {f.date_achat}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{formatMontant(f.montant)}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border ${f.est_facture ? "text-status-livre bg-green-950/40 border-green-800/50" : "text-muted border-border"}`}>
                    {f.est_facture ? "Remboursé" : "À rembourser"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
