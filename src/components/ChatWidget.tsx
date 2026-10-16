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
      {/* Floating button */}
      <button
        onClick={() => { setOpen(!open); setStatus("idle"); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-[0_4px_24px_rgba(242,98,23,0.45)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #f26217, #d45510)" }}
        aria-label="Nous contacter"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: "#1e1b18", border: "1px solid #2e2a26" }}>
          {/* Header */}
          <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #f26217, #d45510)" }}>
            <p className="font-bold text-white text-sm">Contactez-nous 💬</p>
            <p className="text-orange-100 text-xs mt-0.5">On répond rapidement !</p>
          </div>

          {/* Body */}
          <div className="p-5">
            {status === "sent" ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-3">✅</div>
                <p className="font-bold text-white text-sm mb-1">Message envoyé !</p>
                <p className="text-[#8a8078] text-xs">On vous répond dès que possible.</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-xs text-[#f26217] hover:underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Votre prénom *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#141210] border border-[#2e2a26] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4a4440] focus:outline-none focus:border-[#f26217] transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Email ou téléphone *"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="w-full bg-[#141210] border border-[#2e2a26] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4a4440] focus:outline-none focus:border-[#f26217] transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Votre message *"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-[#141210] border border-[#2e2a26] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4a4440] focus:outline-none focus:border-[#f26217] transition-colors resize-none"
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-400 text-xs">Erreur lors de l&apos;envoi. Réessayez.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full text-white font-semibold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #f26217, #d45510)" }}
                >
                  {status === "sending" ? "Envoi..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
