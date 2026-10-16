"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, message }),
    });

    if (res.ok) {
      setStatus("sent");
      setName("");
      setContact("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        onClick={() => { setOpen(!open); setStatus("idle"); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(242,98,23,0.35)]"
        style={{ background: "#f26217" }}
        aria-label="Nous contacter"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden"
          style={{ background: "white", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
        >
          <div className="px-5 py-4 border-b border-[rgba(0,0,0,0.07)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#f26217" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <p className="font-bold text-[#1d1d1f] text-sm">Contactez-nous</p>
                <p className="text-[#6e6e73] text-xs">On répond rapidement</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {status === "sent" ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f26217" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="font-bold text-[#1d1d1f] text-sm mb-1">Message envoyé !</p>
                <p className="text-[#6e6e73] text-xs">On vous répond dès que possible.</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-xs text-[#f26217] hover:underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Votre prénom *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-3 py-2.5 text-[#1d1d1f] text-sm placeholder-[#c7c7cc] focus:outline-none focus:border-[#f26217] focus:bg-white transition-all"
                />
                <input
                  type="text"
                  placeholder="Email ou téléphone *"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-3 py-2.5 text-[#1d1d1f] text-sm placeholder-[#c7c7cc] focus:outline-none focus:border-[#f26217] focus:bg-white transition-all"
                />
                <textarea
                  placeholder="Votre message *"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-3 py-2.5 text-[#1d1d1f] text-sm placeholder-[#c7c7cc] focus:outline-none focus:border-[#f26217] focus:bg-white transition-all resize-none"
                />
                {status === "error" && (
                  <p className="text-red-500 text-xs">Erreur lors de l&apos;envoi. Réessayez.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full text-white font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 hover:opacity-90"
                  style={{ background: "#f26217" }}
                >
                  {status === "sending" ? "Envoi..." : "Envoyer"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
