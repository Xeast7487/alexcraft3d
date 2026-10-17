"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Resend } from "resend";

async function getUser(): Promise<string> {
  const store = await cookies();
  return store.get("ac3d_auth")?.value ?? "alex";
}

const STATUT_LABEL: Record<string, string> = {
  a_imprimer: "À imprimer",
  en_cours: "En cours d'impression",
  complete: "Complété",
  livre: "Livré",
};

async function envoyerEmailStatut({
  clientEmail,
  clientNom,
  commandeTitre,
  nouveauStatut,
  suiviToken,
  itemNom,
}: {
  clientEmail: string;
  clientNom: string;
  commandeTitre: string;
  nouveauStatut: string;
  suiviToken: string | null;
  itemNom?: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const label = STATUT_LABEL[nouveauStatut] ?? nouveauStatut;
  const suiviUrl = suiviToken
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://2f3d.ca"}/suivi/${suiviToken}`
    : null;

  const sujet = itemNom
    ? `Mise à jour — ${itemNom} (${commandeTitre})`
    : `Mise à jour de votre commande — ${commandeTitre}`;

  const contenu = itemNom
    ? `Bonjour ${clientNom},\n\nLa pièce <strong>${itemNom}</strong> de votre commande <strong>${commandeTitre}</strong> est maintenant : <strong>${label}</strong>.`
    : `Bonjour ${clientNom},\n\nVotre commande <strong>${commandeTitre}</strong> est maintenant : <strong>${label}</strong>.`;

  await resend.emails.send({
    from: "2F3D <info@2f3d.ca>",
    to: clientEmail,
    subject: sujet,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f0f13;color:#e5e7eb;padding:32px;border-radius:12px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
          <span style="font-size:22px;font-weight:700;color:#a5b4fc">2F3D</span>
        </div>
        <p style="margin:0 0 16px">${contenu}</p>
        ${suiviUrl ? `<a href="${suiviUrl}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;margin-top:8px">Voir le suivi en ligne →</a>` : ""}
        <hr style="border:none;border-top:1px solid #27272a;margin:24px 0">
        <p style="font-size:12px;color:#71717a;margin:0">2F3D · info@2f3d.ca</p>
      </div>
    `,
  });
}

// ── CLIENTS ──────────────────────────────────────────────────────────────────

export async function creerClient(formData: FormData) {
  const utilisateur = await getUser();
  const nom = formData.get("nom") as string;
  const email = (formData.get("email") as string) || "";
  const telephone = (formData.get("telephone") as string) || "";
  const notes = (formData.get("notes") as string) || "";

  const { data, error } = await supabase
    .from("ac3d_clients")
    .insert({ nom, email, telephone, notes, utilisateur })
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
  const utilisateur = await getUser();
  const titre = formData.get("titre") as string;
  const client_id = formData.get("client_id") ? Number(formData.get("client_id")) : null;
  const notes = (formData.get("notes") as string) || "";

  const { data, error } = await supabase
    .from("ac3d_commandes")
    .insert({ titre, client_id, notes, utilisateur })
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

  const { data: commande } = await supabase
    .from("ac3d_commandes")
    .select("titre, client_id, suivi_token")
    .eq("id", id)
    .single();

  if (commande?.client_id) {
    const { data: client } = await supabase
      .from("ac3d_clients")
      .select("nom, email")
      .eq("id", commande.client_id)
      .single();

    if (client?.email) {
      await envoyerEmailStatut({
        clientEmail: client.email,
        clientNom: client.nom,
        commandeTitre: commande.titre,
        nouveauStatut: statut,
        suiviToken: commande.suivi_token,
      });
    }
  }
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

  const { data: item } = await supabase
    .from("ac3d_items")
    .select("nom_piece")
    .eq("id", id)
    .single();

  const { data: commande } = await supabase
    .from("ac3d_commandes")
    .select("titre, client_id, suivi_token")
    .eq("id", commande_id)
    .single();

  if (commande?.client_id && item) {
    const { data: client } = await supabase
      .from("ac3d_clients")
      .select("nom, email")
      .eq("id", commande.client_id)
      .single();

    if (client?.email) {
      await envoyerEmailStatut({
        clientEmail: client.email,
        clientNom: client.nom,
        commandeTitre: commande.titre,
        nouveauStatut: statut,
        suiviToken: commande.suivi_token,
        itemNom: item.nom_piece,
      });
    }
  }
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
  const utilisateur = await getUser();
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
    utilisateur,
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
