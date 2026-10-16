import Image from "next/image";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

export const metadata = {
  title: "2F3D — Les Deux Frères de l'Impression 3D",
  description: "Alex et Vincent partagent leur passion pour l'impression 3D avec la Bambu Lab.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d0b09] text-[#f0ede8]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(13,11,9,0.92)] backdrop-blur-md border-b border-[rgba(242,98,23,0.15)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/2f3d-logo.jpg" alt="2F3D" width={38} height={38} className="rounded-full object-cover" />
            <span className="font-black text-2xl tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              <span className="text-white">2F</span><span className="text-[#f26217]">3D</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#presentation" className="text-sm font-medium text-[#8a8078] hover:text-white transition-colors hidden sm:block">Qui sommes-nous</a>
            <a href="#partage" className="text-sm font-medium text-[#8a8078] hover:text-white transition-colors hidden sm:block">Ce qu&apos;on partage</a>
            <a href="https://www.facebook.com/share/1DTXK3AwBV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
              className="bg-[#1877f2] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1664d8] transition-colors">
              Facebook
            </a>
            <Link href="/commandes" className="text-xs text-[#4a4440] hover:text-[#8a8078] transition-colors hidden sm:block">Admin</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/2f3d-banner.jpg" alt="2F3D" fill className="object-cover object-top brightness-[0.3] saturate-75" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,11,9,0.2)] via-[rgba(13,11,9,0.1)] to-[#0d0b09]" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 pt-24 pb-16">
          <Image src="/2f3d-logo.jpg" alt="2F3D" width={180} height={180} className="rounded-full border-2 border-[rgba(242,98,23,0.6)] shadow-[0_0_60px_rgba(242,98,23,0.3)]" />
          <p className="text-sm font-bold tracking-[4px] uppercase text-[#8a8078]">Les Deux Frères de l&apos;Impression 3D</p>
          <div className="flex gap-3 flex-wrap justify-center mt-2">
            <a href="https://www.facebook.com/share/1DTXK3AwBV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877f2] text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(24,119,242,0.35)] transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Page Facebook
            </a>
            <a href="#presentation" className="inline-flex items-center gap-2 border border-[#2e2a26] text-[#f0ede8] font-semibold px-6 py-3 rounded-xl hover:border-[#f26217] hover:text-[#f26217] transition-colors">
              Découvrir
            </a>
          </div>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="py-24" id="presentation">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-3">Qui sommes-nous ?</h2>
            <div className="w-12 h-1 bg-[#f26217] rounded mx-auto mb-4" />
            <p className="text-[#8a8078] max-w-md mx-auto">Deux frères, une passion, deux machines. On imprime, on teste, on partage.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vincent */}
            <div className="bg-[#1e1b18] border border-[#2e2a26] rounded-2xl p-8 hover:border-[rgba(242,98,23,0.4)] transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#f26217] to-[#d45510] rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-5">V</div>
              <h3 className="text-xl font-bold mb-2">Vincent</h3>
              <div className="flex gap-2 flex-wrap mb-3">
                <span className="bg-[rgba(242,98,23,0.12)] border border-[rgba(242,98,23,0.25)] text-[#f26217] text-xs font-semibold px-3 py-1 rounded-full">Bambu Lab A1</span>
                <span className="bg-[rgba(242,98,23,0.12)] border border-[rgba(242,98,23,0.25)] text-[#f26217] text-xs font-semibold px-3 py-1 rounded-full">AMS Lite</span>
              </div>
              <p className="text-[#8a8078] text-sm leading-relaxed">Passionné de création fonctionnelle et de gadgets pratiques. Spécialisé dans les pièces mécaniques et les projets du quotidien.</p>
            </div>
            {/* Alex */}
            <div className="bg-[#1e1b18] border border-[#2e2a26] rounded-2xl p-8 hover:border-[rgba(242,98,23,0.4)] transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-[#f26217] to-[#d45510] rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-5">A</div>
              <h3 className="text-xl font-bold mb-2">Alex</h3>
              <div className="flex gap-2 flex-wrap mb-3">
                <span className="bg-[rgba(242,98,23,0.12)] border border-[rgba(242,98,23,0.25)] text-[#f26217] text-xs font-semibold px-3 py-1 rounded-full">Bambu Lab P2S</span>
                <span className="bg-[rgba(242,98,23,0.12)] border border-[rgba(242,98,23,0.25)] text-[#f26217] text-xs font-semibold px-3 py-1 rounded-full">AMS Pro 2</span>
              </div>
              <p className="text-[#8a8078] text-sm leading-relaxed">Accro aux prints multicolores et aux modèles techniques. Stream ses impressions en direct et partage ses réglages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CE QU'ON PARTAGE */}
      <section className="py-24 bg-[#141210]" id="partage">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-3">Ce qu&apos;on partage</h2>
            <div className="w-12 h-1 bg-[#f26217] rounded mx-auto mb-4" />
            <p className="text-[#8a8078] max-w-md mx-auto">Que tu démarres ou que tu sois déjà avancé, il y a quelque chose pour toi.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🤝", title: "Entraide", sub: "Questions & Réponses", desc: "Un problème avec ton imprimante ? On est là pour aider." },
              { icon: "💡", title: "Idées", sub: "Projets & Inspiration", desc: "Des modèles à imprimer, des idées créatives et des projets originaux." },
              { icon: "⚙️", title: "Conseils", sub: "Réglages & Astuces", desc: "Les bons réglages de slicer, les profils testés, les trucs qui fonctionnent." },
              { icon: "🛒", title: "Bons Plans", sub: "Matériel & Accessoires", desc: "Les meilleurs achats, les filaments qui valent la peine." },
            ].map((f) => (
              <div key={f.title} className="bg-[#1e1b18] border border-[#2e2a26] rounded-2xl p-6 hover:border-[rgba(242,98,23,0.35)] hover:-translate-y-1 transition-all">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-base mb-1">{f.title}</h3>
                <p className="text-[#f26217] text-xs font-semibold uppercase tracking-wide mb-2">{f.sub}</p>
                <p className="text-[#8a8078] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Image src="/2f3d-logo.jpg" alt="2F3D" width={100} height={100} className="rounded-full border-2 border-[rgba(242,98,23,0.4)] mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-4">Rejoins la communauté</h2>
          <p className="text-[#8a8078] max-w-md mx-auto mb-8">Suis-nous sur Facebook pour ne rien manquer — nos créations, nos conseils, et nos lives d&apos;impression.</p>
          <a href="https://www.facebook.com/share/1DTXK3AwBV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#1877f2] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(24,119,242,0.35)] transition-all">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Page Facebook 2F3D
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080706] border-t border-[#2e2a26] py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl"><span className="text-white">2F</span><span className="text-[#f26217]">3D</span></span>
            <span className="text-xs text-[#8a8078]">Les Deux Frères de l&apos;Impression 3D</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.facebook.com/share/1DTXK3AwBV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-sm text-[#8a8078] hover:text-white transition-colors">Facebook</a>
            <Link href="/commandes" className="text-xs text-[#4a4440] hover:text-[#8a8078] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

      <ChatWidget />

    </div>
  );
}
