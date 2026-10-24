import { supabase } from "@/lib/supabase";
import { formatMontant, formatTemps, statutColor, statutLabel, formatDate, totalCommande } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommandeActions from "./CommandeActions";
import ItemsSection from "./ItemsSection";
import PaiementsSection from "./PaiementsSection";
import FournituresSection from "./FournituresSection";

export const dynamic = "force-dynamic";

export default async function CommandeDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const [{ data: commande }, { data: items }, { data: paiements }, { data: fournitures }, { data: clients }] =
    await Promise.all([
      supabase.from("ac3d_commandes").select("*").eq("id", id).single(),
      supabase.from("ac3d_items").select("*").eq("commande_id", id).order("id"),
      supabase.from("ac3d_paiements").select("*").eq("commande_id", id).order("created_at"),
      supabase.from("ac3d_fournitures").select("*").eq("commande_id", id).order("date_achat", { ascending: false }),
      supabase.from("ac3d_clients").select("id, nom, email, telephone").order("nom"),
    ]);

  if (!commande) notFound();

  const client = (clients || []).find((c) => c.id === commande.client_id) || null;

  const total = totalCommande(items || []);
  const totalFournitures = (fournitures || []).reduce((sum, f) => sum + (f.montant || 0), 0);
  const profit = total - totalFournitures;
  const restant = total - commande.montant_recu;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <Link href="/commandes" className="text-muted text-sm hover:text-white">← Commandes</Link>
          <h1 className="text-2xl font-bold text-white mt-1">{commande.titre}</h1>
          {client && (
            <Link href={`/clients/${client.id}`} className="text-sm text-accent hover:underline">
              {client.nom}
            </Link>
          )}
          <p className="text-xs text-muted mt-0.5">Créée le {formatDate(commande.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full border ${statutColor(commande.statut)}`}>
            {statutLabel(commande.statut)}
          </span>
          <Link
            href={`/commandes/${id}/soumission`}
            className="text-xs bg-surface border border-border hover:border-gray-500 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            📄 Soumission
          </Link>
          <CommandeActions commande={commande} clients={clients || []} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Total</p>
          <p className="text-xl font-bold text-white mt-1">{formatMontant(total)}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Reçu</p>
          <p className="text-xl font-bold text-status-livre mt-1">{formatMontant(commande.montant_recu)}</p>
        </div>
        <div className={`border rounded-xl p-4 ${restant > 0 ? "bg-orange-950/20 border-orange-800/40" : "bg-surface border-border"}`}>
          <p className="text-xs text-muted">Restant</p>
          <p className={`text-xl font-bold mt-1 ${restant > 0 ? "text-status-print" : "text-muted"}`}>
            {restant > 0 ? formatMontant(restant) : "Payé ✓"}
          </p>
        </div>
        <div className={`border rounded-xl p-4 ${totalFournitures === 0 ? "bg-surface border-border" : profit >= 0 ? "bg-green-950/20 border-green-800/40" : "bg-red-950/20 border-red-800/40"}`}>
          <p className="text-xs text-muted">Profit final</p>
          {totalFournitures === 0 ? (
            <p className="text-xl font-bold text-muted mt-1">—</p>
          ) : (
            <>
              <p className={`text-xl font-bold mt-1 ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatMontant(profit)}
              </p>
              <p className="text-xs text-muted mt-0.5">Fournitures : {formatMontant(totalFournitures)}</p>
            </>
          )}
        </div>
      </div>

      {commande.notes && (
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted mb-1">Notes</p>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{commande.notes}</p>
        </div>
      )}

      <ItemsSection items={items || []} commandeId={id} />
      <PaiementsSection paiements={paiements || []} commandeId={id} />
      <FournituresSection fournitures={fournitures || []} commandeId={id} clients={clients || []} />
    </div>
  );
}
