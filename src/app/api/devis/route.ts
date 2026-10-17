import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { nom, email, telephone, description, quantite, couleur, delai, notes, fichier_url } = await req.json();

  if (!nom || !email || !description) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const { error } = await supabase.from("ac3d_devis").insert({
    nom, email,
    telephone: telephone || "",
    description,
    quantite: quantite || 1,
    couleur: couleur || "",
    delai: delai || "",
    notes: notes || "",
    fichier_url: fichier_url || "",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    const fields: { name: string; value: string; inline: boolean }[] = [
      { name: "👤 Nom", value: nom, inline: true },
      { name: "📬 Email", value: email, inline: true },
      { name: "📝 Description", value: description, inline: false },
    ];
    if (telephone) fields.push({ name: "📞 Téléphone", value: telephone, inline: true });
    if (quantite > 1) fields.push({ name: "🔢 Quantité", value: String(quantite), inline: true });
    if (couleur) fields.push({ name: "🎨 Couleur", value: couleur, inline: true });
    if (delai) fields.push({ name: "⏱️ Délai souhaité", value: delai, inline: true });
    if (fichier_url) fields.push({ name: "📎 Fichier STL", value: `[Télécharger](${fichier_url})`, inline: false });

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "📐 Nouvelle demande de soumission — 2F3D",
          color: 0xf26217,
          fields,
          footer: { text: "2f3d.ca · info@2f3d.ca" },
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "2F3D <info@2f3d.ca>",
      to: email,
      subject: "Votre demande de soumission reçue — 2F3D",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0f0f13;color:#e5e7eb;padding:32px;border-radius:12px">
          <span style="font-size:22px;font-weight:700;color:#fdba74">2F3D</span>
          <p style="margin:20px 0 8px">Bonjour ${nom},</p>
          <p style="margin:0 0 16px;color:#d1d5db">Nous avons bien reçu votre demande de soumission. Nous vous reviendrons sous peu avec un prix.</p>
          <div style="background:#1a1a1a;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Votre demande</p>
            <p style="margin:0;font-size:14px">${description}</p>
          </div>
          <hr style="border:none;border-top:1px solid #27272a;margin:24px 0">
          <p style="font-size:12px;color:#71717a;margin:0">2F3D · info@2f3d.ca</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
