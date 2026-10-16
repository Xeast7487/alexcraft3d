import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, contact, message } = await req.json();

  if (!name || !contact || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 });
  }

  const payload = {
    embeds: [
      {
        title: "📩 Nouveau message — Site 2F3D",
        color: 0xf26217,
        fields: [
          { name: "👤 Prénom", value: name, inline: true },
          { name: "📬 Contact", value: contact, inline: true },
          { name: "💬 Message", value: message, inline: false },
        ],
        footer: { text: "2f3d.ca · info@2f3d.ca" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const discordRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!discordRes.ok) {
    return NextResponse.json({ error: "Erreur Discord" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
