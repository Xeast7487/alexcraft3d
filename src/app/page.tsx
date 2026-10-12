import { supabase } from "@/lib/supabase";
import { formatMontant, statutColor, statutLabel } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [{ data: commandes }, { data: clients }, { data: items }, { data: fournitures }] =
    await Promise.all([
      supabase.from("ac3d_commandes").select("*, ac3d_clients(nom)").order("created_at", { ascending: false }),
      supabase.from("ac3d_clients").select("id"),
      supabase.from("ac3d_items").select("prix, statut"),
      supabase.from("ac3d_fournitures").select("montant, est_facture"),
    ]);

  const totalCA = (commandes || []).reduce((sum, c) => {
    const itemsTotaux = (items || []).filter(() => true); // all items across commandes
    return sum;
  }, 0);

  const allItems = items || [];
  const totalPrix = allItems.reduce((sum, i) => sum + i.prix, 0);
  const totalRecu = (commandes || []).reduce((sum, c) => sum + c.montant_recu, 0);
  const enAttente = totalPrix - totalRecu;

  const commandesActives = (commandes || []).filter((c) => c.statut !== "livre");
  const commandesLivrees = (commandes || []).filter((c) => c.statut === "livre");

  const fournituresTotales = (fournitures || []).reduce((sum, f) => sum + f.montant, 0);
  const fournituresnonfacturees = (fournitures || [])
    .filter((f) => !f.est_facture)
    .reduce((sum, f) => sum + f.montant, 0);

  const recentCommandes = (commandes || []).slice(0, 5);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
        <p className="text-muted text-sm mt-1">Vue d'ensemble de ton activité</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Clients" value={String(clients?.length ?? 0)} icon="👤" />
        <StatCard label="Commandes actives" value={String(commandesActives.length)} icon="🔄" />
        <StatCard label="À recevoir" value={formatMontant(Math.max(0, enAttente))} icon="💰" highlight />
        <StatCard label="Fournitures non facturées" value={formatMontant(fournituresnonfacturees)} icon="🛒" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Commandes récentes</h2>
            <Link href="/commandes/new" className="text-xs bg-accent hover:bg-accent-hover text-white px-3 py-1 rounded-lg transition-colors">
              + Nouvelle
            </Link>
          </div>
          {recentCommandes.length === 0 ? (
            <p className="text-muted text-sm">Aucune commande.</p>
          ) : (
            <div className="space-y-2">
              {recentCommandes.map((c) => (
                <Link
                  key={c.id}
                  href={`/commandes/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-border transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{c.titre}</p>
                    {c.ac3d_clients && (
                      <p className="text-xs text-muted">{c.ac3d_clients.nom}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statutColor(c.statut)}`}>
                    {statutLabel(c.statut)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-white mb-4">Résumé financier</h2>
          <div className="space-y-3">
            <FinRow label="Valeur totale des commandes" value={formatMontant(totalPrix)} />
            <FinRow label="Montant reçu" value={formatMontant(totalRecu)} color="text-status-livre" />
            <FinRow label="Solde à recevoir" value={formatMontant(Math.max(0, enAttente))} color="text-status-print" />
            <div className="border-t border-border pt-3">
              <FinRow label="Fournitures commandées" value={formatMontant(fournituresTotales)} />
              <FinRow label="Non facturées au client" value={formatMontant(fournituresnonfacturees)} color="text-status-cours" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight }: { label: string; value: string; icon: string; highlight?: boolean }) {
  return (
    <div className={`bg-surface border rounded-xl p-4 ${highlight ? "border-accent/50" : "border-border"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs text-muted">{label}</p>
      </div>
      <p className={`text-xl font-bold ${highlight ? "text-accent" : "text-white"}`}>{value}</p>
    </div>
  );
}

function FinRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className={`font-medium ${color || "text-white"}`}>{value}</span>
    </div>
  );
}
