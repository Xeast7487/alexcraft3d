"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
    >
      🖨️ Imprimer / PDF
    </button>
  );
}
