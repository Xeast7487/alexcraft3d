import { supabase } from "@/lib/supabase";
import { formatMontant } from "@/lib/utils";
import AddFournitureForm from "./AddFournitureForm";
import FournitureRow from "./FournitureRow";

export const dynamic = "force-dynamic";

export default async function FournituresPage() {
  const [{ data: fournitures }, { data: clients }, { data: commandes }] = await Promise.all([
    supabase
      .from("ac3d_fournitures")
      .select("*, ac3d_clients(nom), ac3d_commandes(titre)")
      .order("date_achat", { ascending: false }),
    supabase.from("ac3d_clients").select("id, nom").order("nom"),
    supabase.from("ac3d_commandes").select("id, titre").order("titre"),
  ]);

  const total = (fournitures || []).reduce((sum, f) => sum + f.montant, 0);
  const nonfacture = (fournitures || []).filter((f) => !f.est_facture).reduce((sum, f) => sum + f.montant, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Fournitures</h1>
        <p className="text-muted text-sm mt-1">Achats sur carte — tracking des remboursements</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Total acheté</p>
          <p className="text-xl font-bold text-white mt-1">{formatMontant(total)}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">À rembourser</p>
          <p className="text-xl font-bold text-status-print mt-1">{formatMontant(nonfacture)}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted">Remboursé</p>
          <p className="text-xl font-bold text-status-livre mt-1">{formatMontant(total - nonfacture)}</p>
        </div>
      </div>

      <AddFournitureForm clients={clients || []} commandes={commandes || []} />

      <div className="space-y-2">
        {(fournitures || []).length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-muted">Aucune fourniture enregistrée.</p>
          </div>
        ) : (
          (fournitures || []).map((f) => (
            <FournitureRow key={f.id} fourniture={f} />
          ))
        )}
      </div>
    </div>
  );
}
