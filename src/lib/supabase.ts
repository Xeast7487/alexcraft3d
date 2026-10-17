import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Client = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  notes: string;
  created_at: string;
};

export type Commande = {
  id: number;
  client_id: number | null;
  titre: string;
  statut: "a_imprimer" | "en_cours" | "complete" | "livre";
  montant_recu: number;
  notes: string;
  suivi_token: string | null;
  created_at: string;
  updated_at: string;
  ac3d_clients?: Client;
};

export type Item = {
  id: number;
  commande_id: number;
  nom_piece: string;
  grammes: number;
  temps_heures: number;
  temps_minutes: number;
  taux_horaire: number;
  prix: number;
  prix_original: number | null;
  statut: "a_imprimer" | "en_cours" | "complete" | "livre";
  notes: string;
  progression: number;
  temps_restant: number;
  en_impression: boolean;
};

export type Paiement = {
  id: number;
  commande_id: number;
  montant: number;
  note: string;
  created_at: string;
};

export type Fourniture = {
  id: number;
  client_id: number | null;
  commande_id: number | null;
  description: string;
  fournisseur: string;
  montant: number;
  est_facture: boolean;
  date_achat: string;
  notes: string;
  created_at: string;
  ac3d_clients?: Client;
  ac3d_commandes?: Commande;
};
