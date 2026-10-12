"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

// ── CLIENTS ──────────────────────────────────────────────────────────────────

export async function creerClient(formData: FormData) {
  const nom = formData.get("nom") as string;
  const email = (formData.get("email") as string) || "";
  const telephone = (formData.get("telephone") as string) || "";
  const notes = (formData.get("notes") as string) || "";

  const { data, error } = await supabase
    .from("ac3d_clients")
    .insert({ nom, email, telephone, notes })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
  redirect(`/clients/${data.id}`);
}

export async function modifierClient(id: number, formData: FormData) {
  const nom = formData.get("nom") as string;
  const email = (formData.get("email") as string) || "";
  const telephone = (formData.get("telephone") as string) || "";
  const notes = (formData.get("notes") as string) || "";

  await supabase.from("ac3d_clients").update({ nom, email, telephone, notes }).eq("id", id);
  revalidatePath(`/clients/${id}`);
  revalidatePath("/clients");
}

export async function supprimerClient(id: number) {
  await supabase.from("ac3d_clients").delete().eq("id", id);
  revalidatePath("/clients");
  redirect("/clients");
}

// ── COMMANDES ────────────────────────────────────────────────────────────────

export async function creerCommande(formData: FormData) {
  const titre = formData.get("titre") as string;
  const client_id = formData.get("client_id") ? Number(formData.get("client_id")) : null;
  const notes = (formData.get("notes") as string) || "";

  const { data, error } = await supabase
    .from("ac3d_commandes")
    .insert({ titre, client_id, notes })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/commandes");
  redirect(`/commandes/${data.id}`);
}

export async function modifierStatutCommande(id: number, statut: string) {
  await supabase.from("ac3d_commandes").update({ statut }).eq("id", id);
  revalidatePath(`/commandes/${id}`);
  revalidatePath("/commandes");
}

export async function modifierCommande(id: number, formData: FormData) {
  const titre = formData.get("titre") as string;
  const client_id = formData.get("client_id") ? Number(formData.get("client_id")) : null;
  const notes = (formData.get("notes") as string) || "";

  await supabase.from("ac3d_commandes").update({ titre, client_id, notes }).eq("id", id);
  revalidatePath(`/commandes/${id}`);
  revalidatePath("/commandes");
}

export async function supprimerCommande(id: number) {
  await supabase.from("ac3d_commandes").delete().eq("id", id);
  revalidatePath("/commandes");
  redirect("/commandes");
}

// ── ITEMS ────────────────────────────────────────────────────────────────────

export async function ajouterItem(commande_id: number, formData: FormData) {
  const nom_piece = formData.get("nom_piece") as string;
  const grammes = Number(formData.get("grammes")) || 0;
  const temps_heures = Number(formData.get("temps_heures")) || 0;
  const temps_minutes = Number(formData.get("temps_minutes")) || 0;
  const taux_horaire = Number(formData.get("taux_horaire")) || 2;
  const prix = Number(formData.get("prix")) || 0;
  const notes = (formData.get("notes") as string) || "";

  await supabase.from("ac3d_items").insert({
    commande_id,
    nom_piece,
    grammes,
    temps_heures,
    temps_minutes,
    taux_horaire,
    prix,
    prix_original: prix,
    notes,
  });

  revalidatePath(`/commandes/${commande_id}`);
}

export async function modifierItem(id: number, commande_id: number, formData: FormData) {
  const nom_piece = formData.get("nom_piece") as string;
  const grammes = Number(formData.get("grammes")) || 0;
  const temps_heures = Number(formData.get("temps_heures")) || 0;
  const temps_minutes = Number(formData.get("temps_minutes")) || 0;
  const taux_horaire = Number(formData.get("taux_horaire")) || 2;
  const prix = Number(formData.get("prix")) || 0;
  const notes = (formData.get("notes") as string) || "";

  await supabase.from("ac3d_items").update({
    nom_piece,
    grammes,
    temps_heures,
    temps_minutes,
    taux_horaire,
    prix,
    notes,
  }).eq("id", id);

  revalidatePath(`/commandes/${commande_id}`);
}

export async function modifierStatutItem(id: number, commande_id: number, statut: string) {
  await supabase.from("ac3d_items").update({ statut }).eq("id", id);
  revalidatePath(`/commandes/${commande_id}`);
}

export async function supprimerItem(id: number, commande_id: number) {
  await supabase.from("ac3d_items").delete().eq("id", id);
  revalidatePath(`/commandes/${commande_id}`);
}

// ── PAIEMENTS ────────────────────────────────────────────────────────────────

export async function ajouterPaiement(commande_id: number, formData: FormData) {
  const montant = Number(formData.get("montant"));
  const note = (formData.get("note") as string) || "";

  await supabase.from("ac3d_paiements").insert({ commande_id, montant, note });

  const { data: paiements } = await supabase
    .from("ac3d_paiements")
    .select("montant")
    .eq("commande_id", commande_id);

  const total = (paiements || []).reduce((sum, p) => sum + p.montant, 0);
  await supabase.from("ac3d_commandes").update({ montant_recu: total }).eq("id", commande_id);

  revalidatePath(`/commandes/${commande_id}`);
}

export async function supprimerPaiement(id: number, commande_id: number) {
  await supabase.from("ac3d_paiements").delete().eq("id", id);

  const { data: paiements } = await supabase
    .from("ac3d_paiements")
    .select("montant")
    .eq("commande_id", commande_id);

  const total = (paiements || []).reduce((sum, p) => sum + p.montant, 0);
  await supabase.from("ac3d_commandes").update({ montant_recu: total }).eq("id", commande_id);

  revalidatePath(`/commandes/${commande_id}`);
}

// ── FOURNITURES ──────────────────────────────────────────────────────────────

export async function ajouterFourniture(formData: FormData) {
  const description = formData.get("description") as string;
  const fournisseur = (formData.get("fournisseur") as string) || "";
  const montant = Number(formData.get("montant")) || 0;
  const client_id = formData.get("client_id") ? Number(formData.get("client_id")) : null;
  const commande_id = formData.get("commande_id") ? Number(formData.get("commande_id")) : null;
  const est_facture = formData.get("est_facture") === "true";
  const date_achat = (formData.get("date_achat") as string) || new Date().toISOString().split("T")[0];
  const notes = (formData.get("notes") as string) || "";

  await supabase.from("ac3d_fournitures").insert({
    description,
    fournisseur,
    montant,
    client_id,
    commande_id,
    est_facture,
    date_achat,
    notes,
  });

  revalidatePath("/fournitures");
  if (commande_id) revalidatePath(`/commandes/${commande_id}`);
  if (client_id) revalidatePath(`/clients/${client_id}`);
}

export async function toggleFourniturefacturee(id: number, estFacture: boolean) {
  await supabase.from("ac3d_fournitures").update({ est_facture: !estFacture }).eq("id", id);
  revalidatePath("/fournitures");
}

export async function supprimerFourniture(id: number) {
  await supabase.from("ac3d_fournitures").delete().eq("id", id);
  revalidatePath("/fournitures");
}

// ── SUIVI CLIENT ──────────────────────────────────────────────────────────────

export async function genererLienSuivi(commandeId: number): Promise<string> {
  const token = crypto.randomUUID();
  await supabase.from("ac3d_commandes").update({ suivi_token: token }).eq("id", commandeId);
  revalidatePath(`/commandes/${commandeId}`);
  return token;
}
