import { supabase } from "@/lib/supabase";
import { formatMontant, formatDate, statutLabel, totalCommande } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const statutIcon: Record<string, string> = {
  a_imprimer: "⏳",
  en_cours: "🖨️",
  livre: "✅",
};

const statutBg: Record<string, string> = {
  a_imprimer: "bg-orange-100 text-orange-700 border-orange-200",
  en_cours: "bg-blue-100 text-blue-700 border-blue-200",
  livre: "bg-green-100 text-green-700 border-green-200",
};

export default async function SuiviPage({ params }: { params: { token: string } }) {
  const { data: commande } = await supabase
    .from("ac3d_commandes")
    .select("*")
    .eq("suivi_token", params.token)
    .single();

  if (!commande) notFound();

  const [{ data: items }, { data: clients }] = await Promise.all([
    supabase.from("ac3d_items").select("*").eq("commande_id", commande.id).order("id"),
    supabase.from("ac3d_clients").select("id, nom").eq("id", commande.client_id),
  ]);

  const client = clients?.[0] || null;
  const total = totalCommande(items || []);
  const restant = Math.max(0, total - commande.montant_recu);

  const allLivre = (items || []).length > 0 && (items || []).every((i) => i.statut === "livre");
  const anyEnCours = (items || []).some((i) => i.statut === "en_cours");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-5">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <span className="text-3xl">🖨️</span>
          <div>
            <p className="font-bold text-lg">AlexCraft3D</p>
            <p className="text-indigo-200 text-sm">Suivi de commande</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Info commande */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs text-gray-400 mb-1">Commande</p>
          <h1 className="text-xl font-bold text-gray-900">{commande.titre}</h1>
          {client && <p className="text-sm text-gray-500 mt-0.5">{client.nom}</p>}
          <p className="text-xs text-gray-400 mt-1">Créée le {formatDate(commande.created_at)}</p>

          <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
            allLivre ? "bg-green-100 text-green-700 border-green-200" :
            anyEnCours ? "bg-blue-100 text-blue-700 border-blue-200" :
            "bg-orange-100 text-orange-700 border-orange-200"
          }`}>
            <span>{allLivre ? "✅" : anyEnCours ? "🖨️" : "⏳"}</span>
            <span>{allLivre ? "Commande complétée" : anyEnCours ? "En cours d'impression" : "En attente d'impression"}</span>
          </div>
        </div>

        {/* Items */}
        {(items || []).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Pièces ({items!.length})</p>
            <div className="space-y-2">
              {(items || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statutBg[item.statut]}`}>
                      {statutIcon[item.statut]} {statutLabel(item.statut)}
                    </span>
                    <span className="text-sm text-gray-800">{item.nom_piece}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Montants */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Résumé financier</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-semibold text-gray-900">{formatMontant(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reçu</span>
              <span className="font-semibold text-green-600">{formatMontant(commande.montant_recu)}</span>
            </div>
            {restant > 0 && (
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-700 font-medium">Solde dû</span>
                <span className="font-bold text-orange-600">{formatMontant(restant)}</span>
              </div>
            )}
            {restant === 0 && total > 0 && (
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-700 font-medium">Solde dû</span>
                <span className="font-bold text-green-600">Payé ✓</span>
              </div>
            )}
          </div>
        </div>

        {commande.notes && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{commande.notes}</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">nstudio259@gmail.com</p>
      </div>
    </div>
  );
}
