"use client";

import { useState, useTransition } from "react";
import { ajouterItem, modifierItem, supprimerItem, modifierStatutItem, demarrerImpression, arreterImpression } from "@/app/actions";
import { Item } from "@/lib/supabase";
import { formatMontant, formatTemps, statutColor, statutLabel, calculerPrix } from "@/lib/utils";

const STATUTS = ["a_imprimer", "en_cours", "complete", "livre"] as const;
type Statut = typeof STATUTS[number];

function ItemRow({ item, commandeId, onEdit, onDelete }: {
  item: Item;
  commandeId: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [statut, setStatut] = useState<Statut>(item.statut as Statut);
  const [toggling, setToggling] = useState(false);
  const [printing, startPrint] = useTransition();

  async function cycleStatut() {
    if (toggling) return;
    setToggling(true);
    const idx = STATUTS.indexOf(statut);
    const next = STATUTS[(idx + 1) % STATUTS.length];
    setStatut(next);
    await modifierStatutItem(item.id, commandeId, next);
    setToggling(false);
  }

  return (
    <div className="p-3 bg-bg rounded-lg border border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-white">{item.nom_piece}</p>
            <button
              onClick={cycleStatut}
              disabled={toggling}
              className={`text-xs px-1.5 py-0.5 rounded-full border transition-all hover:opacity-80 active:scale-95 ${statutColor(statut)} ${toggling ? "opacity-50" : ""}`}
              title="Cliquer pour changer le statut"
            >
              {statutLabel(statut)}
            </button>
            {item.en_impression && (
              <span className="text-xs text-[#f26217] font-medium animate-pulse">
                ● {item.progression}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {item.grammes > 0 && `${item.grammes}g`}
            {item.grammes > 0 && (item.temps_heures > 0 || item.temps_minutes > 0) && " · "}
            {formatTemps(item.temps_heures, item.temps_minutes)}
            {item.taux_horaire !== 2 && ` @ ${item.taux_horaire}$/h`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white">{formatMontant(item.prix)}</p>
          {item.en_impression ? (
            <button
              onClick={() => startPrint(() => arreterImpression(item.id, commandeId))}
              disabled={printing}
              className="text-xs text-orange-400 hover:text-orange-300 px-2 py-1 rounded hover:bg-border"
              title="Arrêter le suivi"
            >
              ⏹
            </button>
          ) : (
            <button
              onClick={() => startPrint(() => demarrerImpression(item.id, commandeId))}
              disabled={printing}
              className="text-xs text-muted hover:text-[#f26217] px-2 py-1 rounded hover:bg-border"
              title="Démarrer l'impression"
            >
              ▶
            </button>
          )}
          <div className="flex gap-1">
            <button onClick={onEdit} className="text-xs text-muted hover:text-white px-2 py-1 rounded hover:bg-border">✏️</button>
            <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-border">×</button>
          </div>
        </div>
      </div>
      {item.en_impression && (
        <div className="mt-2">
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f26217] rounded-full transition-all duration-500"
              style={{ width: `${item.progression}%` }}
            />
          </div>
          {item.temps_restant > 0 && (
            <p className="text-xs text-muted mt-1">
              ~{item.temps_restant < 60
                ? `${item.temps_restant} min restantes`
                : `${Math.floor(item.temps_restant / 60)}h${item.temps_restant % 60 > 0 ? ` ${item.temps_restant % 60}min` : ""} restantes`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ItemsSection({ items, commandeId }: { items: Item[]; commandeId: number }) {
  const [ajoutOpen, setAjoutOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [grammesPreview, setGrammesPreview] = useState(0);
  const [heuresPreview, setHeuresPreview] = useState(0);
  const [minutesPreview, setMinutesPreview] = useState(0);
  const [tauxPreview, setTauxPreview] = useState(2);

  const prixCalcule = calculerPrix(grammesPreview, heuresPreview, minutesPreview, tauxPreview);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white">Pièces / Items</h2>
        <button
          onClick={() => setAjoutOpen(true)}
          className="text-xs bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          + Ajouter
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted text-sm">Aucune pièce ajoutée.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              commandeId={commandeId}
              onEdit={() => setEditItem(item)}
              onDelete={async () => {
                if (confirm("Supprimer cette pièce ?")) {
                  await supprimerItem(item.id, commandeId);
                }
              }}
            />
          ))}
        </div>
      )}

      {(ajoutOpen || editItem) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => { setAjoutOpen(false); setEditItem(null); }}>
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-4">{editItem ? "Modifier la pièce" : "Ajouter une pièce"}</h3>
            <ItemForm
              commandeId={commandeId}
              item={editItem}
              onClose={() => { setAjoutOpen(false); setEditItem(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ItemForm({ commandeId, item, onClose }: { commandeId: number; item: Item | null; onClose: () => void }) {
  const [grammes, setGrammes] = useState(item?.grammes ?? 0);
  const [heures, setHeures] = useState(item?.temps_heures ?? 0);
  const [minutes, setMinutes] = useState(item?.temps_minutes ?? 0);
  const [taux, setTaux] = useState(item?.taux_horaire ?? 2);
  const [prixManuel, setPrixManuel] = useState(item?.prix ?? 0);

  const prixCalc = calculerPrix(grammes, heures, minutes, taux);

  return (
    <form
      action={async (fd) => {
        fd.set("prix", String(prixManuel || prixCalc));
        if (item) {
          await modifierItem(item.id, commandeId, fd);
        } else {
          await ajouterItem(commandeId, fd);
        }
        onClose();
      }}
      className="space-y-3"
    >
      <div>
        <label className="text-xs text-muted">Nom de la pièce *</label>
        <input name="nom_piece" defaultValue={item?.nom_piece} required
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted">Grammes (g)</label>
          <input name="grammes" type="number" step="0.1" min="0" value={grammes}
            onChange={(e) => setGrammes(Number(e.target.value))}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-xs text-muted">Taux $/h</label>
          <input name="taux_horaire" type="number" step="0.5" min="0" value={taux}
            onChange={(e) => setTaux(Number(e.target.value))}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted">Temps (heures)</label>
          <input name="temps_heures" type="number" min="0" value={heures}
            onChange={(e) => setHeures(Number(e.target.value))}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-xs text-muted">Temps (minutes)</label>
          <input name="temps_minutes" type="number" min="0" max="59" value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
        </div>
      </div>
      <div className="bg-bg border border-border rounded-lg p-3">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Prix calculé automatiquement</span>
          <span className="text-white font-medium">{formatMontant(prixCalc)}</span>
        </div>
        <div>
          <label className="text-xs text-muted">Prix final (modifiable)</label>
          <input name="prix" type="number" step="0.01" min="0" value={prixManuel || prixCalc}
            onChange={(e) => setPrixManuel(Number(e.target.value))}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted">Notes</label>
        <input name="notes" defaultValue={item?.notes}
          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent" />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm">
          {item ? "Sauvegarder" : "Ajouter"}
        </button>
        <button type="button" onClick={onClose} className="text-muted text-sm px-4 py-2">Annuler</button>
      </div>
    </form>
  );
}
