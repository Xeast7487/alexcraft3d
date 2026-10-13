import { formatMontant, formatDate, totalCommande } from "@/lib/utils";
import Printer3DIcon from "@/components/Printer3DIcon";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function supaFetch(path: string) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    cache: "no-store",
  });
  return res.json();
}

const t = {
  fr: {
    tracking: "SUIVI DE COMMANDE",
    order: "COMMANDE",
    createdOn: "Créée le",
    done: "Commande complétée",
    printing: "En cours d'impression",
    waiting: "En attente",
    progress: "Progression",
    pieces: (n: number) => `${n} PIÈCE${n > 1 ? "S" : ""}`,
    statusLabel: { a_imprimer: "En attente", en_cours: "En cours", livre: "Livré" },
    financial: "RÉSUMÉ FINANCIER",
    total: "Total",
    received: "Reçu",
    balance: "Solde dû",
    paid: "Payé ✓",
    notes: "NOTES",
    footer: "Des questions ? Écris-nous à",
  },
  en: {
    tracking: "ORDER TRACKING",
    order: "ORDER",
    createdOn: "Created on",
    done: "Order completed",
    printing: "Currently printing",
    waiting: "Waiting to print",
    progress: "Progress",
    pieces: (n: number) => `${n} ITEM${n > 1 ? "S" : ""}`,
    statusLabel: { a_imprimer: "Pending", en_cours: "Printing", livre: "Delivered" },
    financial: "FINANCIAL SUMMARY",
    total: "Total",
    received: "Received",
    balance: "Balance due",
    paid: "Paid ✓",
    notes: "NOTES",
    footer: "Questions? Email us at",
  },
} as const;

type Lang = keyof typeof t;

export default async function SuiviPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { lang?: string };
}) {
  const hdrs = headers();

  // Determine language: URL param > Accept-Language header > default FR
  let lang: Lang = "fr";
  if (searchParams.lang === "en" || searchParams.lang === "fr") {
    lang = searchParams.lang;
  } else {
    const acceptLang = hdrs.get("accept-language") || "";
    if (acceptLang.toLowerCase().startsWith("en")) lang = "en";
  }
  const tx = t[lang];

  const commandes: any[] = await supaFetch(
    `ac3d_commandes?select=*&suivi_token=eq.${encodeURIComponent(params.token)}&limit=1`
  );
  const commande = commandes?.[0];
  if (!commande) notFound();

  const [items, clients]: [any[], any[]] = await Promise.all([
    supaFetch(`ac3d_items?select=*&commande_id=eq.${commande.id}&order=id`),
    commande.client_id
      ? supaFetch(`ac3d_clients?select=id,nom&id=eq.${commande.client_id}&limit=1`)
      : Promise.resolve([]),
  ]);

  const client = clients?.[0] || null;
  const total = totalCommande((items || []).map((i: any) => ({ ...i, prix: Number(i.prix) })));
  const restant = Math.max(0, total - commande.montant_recu);

  const itemList = items || [];
  const totalItems = itemList.length;
  const livreCount = itemList.filter((i) => i.statut === "livre").length;
  const enCoursCount = itemList.filter((i) => i.statut === "en_cours").length;
  const progressPct = totalItems > 0 ? Math.round((livreCount / totalItems) * 100) : 0;
  const allDone = totalItems > 0 && livreCount === totalItems;
  const isPrinting = enCoursCount > 0;

  const globalStatut = allDone ? "livre" : isPrinting ? "en_cours" : "a_imprimer";
  const globalLabel = allDone ? tx.done : isPrinting ? tx.printing : tx.waiting;
  const otherLang = lang === "fr" ? "en" : "fr";
  const otherLangLabel = lang === "fr" ? "EN" : "FR";

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.4), 0 0 20px rgba(99,102,241,0.1); }
          50%       { box-shadow: 0 0 16px rgba(99,102,241,0.8), 0 0 40px rgba(99,102,241,0.3); }
        }
        @keyframes printGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.1); }
          50%       { box-shadow: 0 0 20px rgba(59,130,246,0.9), 0 0 50px rgba(59,130,246,0.3); }
        }
        @keyframes nozzleDrip {
          0%   { transform: translateY(0) scaleY(1); }
          40%  { transform: translateY(4px) scaleY(1.3); }
          60%  { transform: translateY(6px) scaleY(0.8); }
          100% { transform: translateY(0) scaleY(1); }
        }
        @keyframes layerBuild {
          0%   { background-position: 0 100%; background-size: 100% 0%; }
          100% { background-position: 0 0%; background-size: 100% 100%; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: ${progressPct}%; }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0); opacity: 0.7; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
        .card-anim { animation: fadeInUp 0.5s ease both; }
        .glow-purple { animation: pulseGlow 2.5s ease-in-out infinite; }
        .glow-blue   { animation: printGlow 1.5s ease-in-out infinite; }
        .progress-bar { animation: progressFill 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s both; }
        .nozzle { animation: nozzleDrip 1.2s ease-in-out infinite; }
        .blink  { animation: blink 1s ease-in-out infinite; }
        .particle {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #6366f1;
          animation: floatUp 2s ease-out infinite;
        }
      `}</style>

      <div className="min-h-screen text-white" style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, #080a10 60%)",
        backgroundAttachment: "fixed",
      }}>
        {/* Grid background */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Header */}
        <div className="relative overflow-hidden" style={{
          background: "linear-gradient(135deg, #1a1040 0%, #0f0f1a 100%)",
          borderBottom: "1px solid rgba(99,102,241,0.3)",
        }}>
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          {/* Scan line animation on header */}
          {isPrinting && (
            <div className="absolute left-0 right-0 h-px" style={{
              background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)",
              animation: "scanLine 2s linear infinite",
            }} />
          )}
          <div className="relative max-w-lg mx-auto px-5 py-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center glow-purple"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "1px solid rgba(99,102,241,0.5)" }}>
                  <Printer3DIcon size={32} color="white" />
                </div>
                {isPrinting && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-900 blink" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-black text-xl tracking-wide" style={{ letterSpacing: "0.1em" }}>ALEXCRAFT3D</p>
                <p style={{ color: "rgba(99,102,241,0.8)", fontSize: "11px", letterSpacing: "0.2em" }}>{tx.tracking}</p>
              </div>
              {/* Lang toggle */}
              <a
                href={`?lang=${otherLang}`}
                className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  color: "#a5b4fc",
                  letterSpacing: "0.1em",
                }}
              >
                {otherLangLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="relative max-w-lg mx-auto px-4 py-6 space-y-4">

          {/* Status principal */}
          <div className="card-anim" style={{ animationDelay: "0ms" }}>
            <div className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: "rgba(15,17,30,0.8)",
                border: globalStatut === "livre"
                  ? "1px solid rgba(34,197,94,0.4)"
                  : globalStatut === "en_cours"
                  ? "1px solid rgba(59,130,246,0.4)"
                  : "1px solid rgba(99,102,241,0.3)",
                backdropFilter: "blur(10px)",
              }}>

              {/* Glow top border */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: globalStatut === "livre"
                  ? "linear-gradient(90deg, transparent, rgba(34,197,94,0.8), transparent)"
                  : globalStatut === "en_cours"
                  ? "linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)",
              }} />

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>{tx.order}</p>
                  <h1 className="text-xl font-bold mt-0.5">{commande.titre}</h1>
                  {client && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{client.nom}</p>}
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "2px" }}>
                    {formatDate(commande.created_at)}
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  globalStatut === "livre" ? "glow-blue" : globalStatut === "en_cours" ? "glow-blue" : ""
                }`} style={{
                  background: globalStatut === "livre"
                    ? "rgba(34,197,94,0.15)"
                    : globalStatut === "en_cours"
                    ? "rgba(59,130,246,0.15)"
                    : "rgba(99,102,241,0.15)",
                  border: globalStatut === "livre"
                    ? "1px solid rgba(34,197,94,0.5)"
                    : globalStatut === "en_cours"
                    ? "1px solid rgba(59,130,246,0.5)"
                    : "1px solid rgba(99,102,241,0.5)",
                  color: globalStatut === "livre" ? "#4ade80" : globalStatut === "en_cours" ? "#60a5fa" : "#a5b4fc",
                }}>
                  {globalStatut === "livre" ? <span>✅</span> : globalStatut === "en_cours" ? <Printer3DIcon size={13} color={globalStatut === "en_cours" ? "#60a5fa" : "#a5b4fc"} /> : <span>⏳</span>}
                  <span>{globalLabel}</span>
                </div>
              </div>

              {/* Progress bar */}
              {totalItems > 0 && (
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span>{tx.progress}</span>
                    <span style={{ color: "#a5b4fc", fontFamily: "monospace" }}>{livreCount}/{totalItems}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full progress-bar"
                      style={{
                        width: `${progressPct}%`,
                        background: allDone
                          ? "linear-gradient(90deg, #22c55e, #4ade80)"
                          : "linear-gradient(90deg, #6366f1, #818cf8)",
                        boxShadow: allDone
                          ? "0 0 10px rgba(34,197,94,0.6)"
                          : "0 0 10px rgba(99,102,241,0.6)",
                      }}
                    />
                  </div>
                  <p className="text-right mt-1" style={{ fontSize: "11px", color: "#a5b4fc", fontFamily: "monospace" }}>
                    {progressPct}% complété
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          {itemList.length > 0 && (
            <div className="card-anim" style={{ animationDelay: "100ms" }}>
              <div className="rounded-2xl overflow-hidden" style={{
                background: "rgba(15,17,30,0.8)",
                border: "1px solid rgba(99,102,241,0.2)",
                backdropFilter: "blur(10px)",
              }}>
                <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <p style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>
                    {tx.pieces(totalItems)}
                  </p>
                </div>
                <div className="p-3 space-y-2">
                  {itemList.map((item, idx) => {
                    const isLivre = item.statut === "livre";
                    const isEnCours = item.statut === "en_cours";
                    return (
                      <div
                        key={item.id}
                        className={`relative rounded-xl p-4 overflow-hidden card-anim ${isEnCours ? "glow-blue" : ""}`}
                        style={{
                          animationDelay: `${150 + idx * 60}ms`,
                          background: isLivre
                            ? "rgba(34,197,94,0.05)"
                            : isEnCours
                            ? "rgba(59,130,246,0.08)"
                            : "rgba(255,255,255,0.03)",
                          border: isLivre
                            ? "1px solid rgba(34,197,94,0.25)"
                            : isEnCours
                            ? "1px solid rgba(59,130,246,0.35)"
                            : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {/* Scan line for en cours */}
                        {isEnCours && (
                          <div className="absolute left-0 right-0 h-px pointer-events-none" style={{
                            background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)",
                            animation: "scanLine 1.5s linear infinite",
                          }} />
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
                              style={{
                                background: isLivre
                                  ? "rgba(34,197,94,0.15)"
                                  : isEnCours
                                  ? "rgba(59,130,246,0.15)"
                                  : "rgba(255,255,255,0.05)",
                              }}>
                              {isLivre ? "✅" : isEnCours ? <span className="nozzle inline-flex"><Printer3DIcon size={16} color="#60a5fa" /></span> : "⏳"}
                            </div>
                            <span className="text-sm font-medium">{item.nom_piece}</span>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                            background: isLivre
                              ? "rgba(34,197,94,0.15)"
                              : isEnCours
                              ? "rgba(59,130,246,0.15)"
                              : "rgba(99,102,241,0.1)",
                            color: isLivre ? "#4ade80" : isEnCours ? "#60a5fa" : "#a5b4fc",
                            border: isLivre
                              ? "1px solid rgba(34,197,94,0.3)"
                              : isEnCours
                              ? "1px solid rgba(59,130,246,0.3)"
                              : "1px solid rgba(99,102,241,0.2)",
                          }}>
                            {tx.statusLabel[item.statut as keyof typeof tx.statusLabel] ?? item.statut}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Financier */}
          <div className="card-anim" style={{ animationDelay: "200ms" }}>
            <div className="rounded-2xl p-5" style={{
              background: "rgba(15,17,30,0.8)",
              border: "1px solid rgba(99,102,241,0.2)",
              backdropFilter: "blur(10px)",
            }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>
                {tx.financial}
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{tx.total}</span>
                  <span className="font-bold" style={{ fontFamily: "monospace", fontSize: "16px" }}>{formatMontant(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{tx.received}</span>
                  <span className="font-bold" style={{ fontFamily: "monospace", fontSize: "16px", color: "#4ade80" }}>
                    {formatMontant(commande.montant_recu)}
                  </span>
                </div>
                <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>{tx.balance}</span>
                  {restant > 0 ? (
                    <span className="font-black text-lg" style={{ fontFamily: "monospace", color: "#f97316" }}>
                      {formatMontant(restant)}
                    </span>
                  ) : (
                    <span className="font-black text-lg" style={{ fontFamily: "monospace", color: "#4ade80" }}>
                      {tx.paid}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {commande.notes && (
            <div className="card-anim" style={{ animationDelay: "280ms" }}>
              <div className="rounded-2xl p-5" style={{
                background: "rgba(15,17,30,0.8)",
                border: "1px solid rgba(99,102,241,0.15)",
                backdropFilter: "blur(10px)",
              }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>{tx.notes}</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6 }}>{commande.notes}</p>
              </div>
            </div>
          )}

          <p className="text-center pb-6 card-anim" style={{
            fontSize: "12px",
            color: "rgba(99,102,241,0.5)",
            letterSpacing: "0.1em",
            animationDelay: "350ms",
          }}>
            {tx.footer} nstudio259@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}
