"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function DevisForm() {
  const [step, setStep] = useState<"form" | "sending" | "done">("form");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStep("sending");

    const fd = new FormData(e.currentTarget);
    const nom = fd.get("nom") as string;
    const email = fd.get("email") as string;
    const description = fd.get("description") as string;

    if (!nom || !email || !description) {
      setError("Veuillez remplir les champs obligatoires.");
      setStep("form");
      return;
    }

    let fichier_url = "";
    const file = fileRef.current?.files?.[0];
    if (file) {
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("devis-files")
        .upload(safeName, file);
      if (uploadError) {
        setError("Erreur lors de l'upload du fichier. Réessayez.");
        setStep("form");
        return;
      }
      const { data } = supabase.storage.from("devis-files").getPublicUrl(safeName);
      fichier_url = data.publicUrl;
    }

    const res = await fetch("/api/devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom,
        email,
        telephone: fd.get("telephone") as string,
        description,
        quantite: Number(fd.get("quantite")) || 1,
        couleur: fd.get("couleur") as string,
        delai: fd.get("delai") as string,
        notes: fd.get("notes") as string,
        fichier_url,
      }),
    });

    if (!res.ok) {
      setError("Une erreur est survenue. Réessayez.");
      setStep("form");
      return;
    }

    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-[#f26217]/10 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f26217" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Demande envoyée !</h3>
        <p className="text-[#6e6e73] text-sm max-w-xs mx-auto">
          On vous revient sous peu avec une soumission. Un email de confirmation vous a été envoyé.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
            Nom <span className="text-[#f26217]">*</span>
          </label>
          <input
            name="nom"
            type="text"
            required
            placeholder="Jean Tremblay"
            className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:border-[#f26217] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
            Email <span className="text-[#f26217]">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="jean@exemple.com"
            className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:border-[#f26217] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Téléphone</label>
          <input
            name="telephone"
            type="tel"
            placeholder="418 555-0000"
            className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:border-[#f26217] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Quantité</label>
          <input
            name="quantite"
            type="number"
            min="1"
            defaultValue="1"
            className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1d1d1f] focus:outline-none focus:border-[#f26217] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
          Description de la pièce <span className="text-[#f26217]">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Décrivez la pièce à imprimer, ses dimensions approximatives, son utilisation..."
          className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:border-[#f26217] transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Couleur souhaitée</label>
          <input
            name="couleur"
            type="text"
            placeholder="Noir, blanc, rouge..."
            className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:border-[#f26217] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Délai souhaité</label>
          <input
            name="delai"
            type="text"
            placeholder="Dans 2 semaines, pas pressé..."
            className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:border-[#f26217] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Fichier STL / 3MF</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="w-full bg-[#f5f5f7] border-2 border-dashed border-[#d1d1d6] hover:border-[#f26217] rounded-xl px-4 py-5 text-sm text-center cursor-pointer transition-colors group"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".stl,.3mf"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
          {fileName ? (
            <span className="text-[#1d1d1f] font-medium">{fileName}</span>
          ) : (
            <span className="text-[#aeaeb2] group-hover:text-[#6e6e73]">
              Cliquez pour joindre un fichier <span className="font-medium">.stl</span> ou <span className="font-medium">.3mf</span>
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Notes additionnelles</label>
        <textarea
          name="notes"
          rows={2}
          placeholder="Toute autre information utile..."
          className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-4 py-3 text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:border-[#f26217] transition-colors resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={step === "sending"}
        className="w-full bg-[#f26217] hover:bg-[#d45510] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
      >
        {step === "sending" ? "Envoi en cours..." : "Envoyer ma demande →"}
      </button>
    </form>
  );
}
