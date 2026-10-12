import { supabase } from "@/lib/supabase";
import { formatMontant, formatTemps, totalCommande } from "@/lib/utils";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function SoumissionPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const [{ data: commande }, { data: items }, { data: clients }] = await Promise.all([
    supabase.from("ac3d_commandes").select("*").eq("id", id).single(),
    supabase.from("ac3d_items").select("*").eq("commande_id", id).order("id"),
    supabase.from("ac3d_clients").select("*"),
  ]);

  if (!commande) notFound();

  const client = (clients || []).find((c) => c.id === commande.client_id) || null;

  const total = totalCommande(items || []);
  const tps = total * 0.05;
  const tvq = total * 0.09975;
  const totalTaxes = total + tps + tvq;
  const dateStr = new Date().toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="no-print fixed top-4 right-4 flex gap-2">
        <PrintButton />
        <a
          href={`/commandes/${id}`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg"
        >
          ← Retour
        </a>
      </div>

      <div className="max-w-2xl mx-auto p-12">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🖨️ AlexCraft3D</h1>
            <p className="text-gray-500 text-sm mt-1">Impression 3D sur mesure</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">SOUMISSION</p>
            <p className="text-gray-500 text-sm">#{String(id).padStart(4, "0")}</p>
            <p className="text-gray-500 text-sm">{dateStr}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">De</p>
            <p className="font-semibold">AlexCraft3D</p>
            <p className="text-gray-600 text-sm">alexcraft3d@gmail.com</p>
          </div>
          {client && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Pour</p>
              <p className="font-semibold">{client.nom}</p>
              {client.email && (
                <p className="text-gray-600 text-sm">{client.email}</p>
              )}
              {client.telephone && (
                <p className="text-gray-600 text-sm">{client.telephone}</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Commande</p>
          <p className="font-semibold text-gray-900">{commande.titre}</p>
          {commande.notes && <p className="text-sm text-gray-500 mt-1">{commande.notes}</p>}
        </div>

        <table className="w-full mt-6 mb-8">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Description</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Grammes</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Temps</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Prix</th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-3">
                  <p className="font-medium text-gray-900">{item.nom_piece}</p>
                  {item.notes && <p className="text-xs text-gray-500">{item.notes}</p>}
                </td>
                <td className="py-3 text-right text-sm text-gray-600">
                  {item.grammes > 0 ? `${item.grammes}g` : "—"}
                </td>
                <td className="py-3 text-right text-sm text-gray-600">
                  {formatTemps(item.temps_heures, item.temps_minutes)}
                </td>
                <td className="py-3 text-right font-medium">{formatMontant(item.prix)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{formatMontant(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TPS (5%)</span>
              <span>{formatMontant(tps)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVQ (9.975%)</span>
              <span>{formatMontant(tvq)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t-2 border-gray-900 pt-2 mt-2">
              <span>Total</span>
              <span>{formatMontant(totalTaxes)}</span>
            </div>
            {commande.montant_recu > 0 && (
              <>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Reçu</span>
                  <span>− {formatMontant(commande.montant_recu)}</span>
                </div>
                <div className="flex justify-between font-bold text-orange-600 border-t border-gray-200 pt-2">
                  <span>Solde dû</span>
                  <span>{formatMontant(Math.max(0, totalTaxes - commande.montant_recu))}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          <p>Merci pour votre confiance ! 🖨️</p>
          <p className="mt-1">alexcraft3d@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
