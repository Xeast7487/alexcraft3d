import { supabase } from "@/lib/supabase";
import DevisCard from "./DevisCard";

export const dynamic = "force-dynamic";

export default async function DevisPage() {
  const { data: devis } = await supabase
    .from("ac3d_devis")
    .select("*")
    .order("created_at", { ascending: false });

  const liste = devis || [];
  const nouveaux = liste.filter((d) => d.statut === "nouveau").length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Devis</h1>
          {nouveaux > 0 && (
            <p className="text-sm text-accent mt-0.5">
              {nouveaux} nouvelle{nouveaux > 1 ? "s" : ""} demande{nouveaux > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {liste.length === 0 ? (
        <div className="text-center py-20 text-muted">Aucune demande de devis pour l&apos;instant.</div>
      ) : (
        <div className="space-y-3">
          {liste.map((d) => <DevisCard key={d.id} devis={d} />)}
        </div>
      )}
    </div>
  );
}
