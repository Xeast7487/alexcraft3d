export function formatMontant(montant: number): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(montant);
}

export function formatTemps(heures: number, minutes: number): string {
  if (heures === 0 && minutes === 0) return "—";
  const parts = [];
  if (heures > 0) parts.push(`${heures}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  return parts.join(" ");
}

export function calculerPrix(grammes: number, heures: number, minutes: number, tauxHoraire: number): number {
  const coutFilament = grammes * 0.03;
  const coutTemps = (heures + minutes / 60) * tauxHoraire;
  return Math.round((coutFilament + coutTemps) * 100) / 100;
}

export function totalCommande(items: { prix: number }[]): number {
  return items.reduce((sum, item) => sum + item.prix, 0);
}

export function statutLabel(statut: string): string {
  switch (statut) {
    case "a_imprimer": return "À imprimer";
    case "en_cours": return "En cours";
    case "livre": return "Livré";
    default: return statut;
  }
}

export function statutColor(statut: string): string {
  switch (statut) {
    case "a_imprimer": return "text-status-print bg-orange-950/40 border-orange-800/50";
    case "en_cours": return "text-status-cours bg-blue-950/40 border-blue-800/50";
    case "livre": return "text-status-livre bg-green-950/40 border-green-800/50";
    default: return "text-muted";
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
