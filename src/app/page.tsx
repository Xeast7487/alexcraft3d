import Image from "next/image";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

export const metadata = {
  title: "2F3D — Les Deux Frères de l'Impression 3D",
  description: "Alex et Vincent partagent leur passion pour l'impression 3D avec la Bambu Lab.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(255,255,255,0.88)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.07)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/2f3d-logo.jpg" alt="2F3D" width={28} height={28} className="rounded-full object-cover" />
            <span className="font-black text-lg tracking-tight">
              <span className="text-[#1d1d1f]">2F</span><span className="text-[#f26217]">3D</span>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#presentation" className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors hidden sm:block">Qui sommes-nous</a>
            <a href="#partage" className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors hidden sm:block">Ce qu&apos;on partage</a>
            <a
              href="https://www.facebook.com/share/1DTXK3AwBV/?mibextid=wwXIfr"
              target="_blank" rel="noopener noreferrer"
              className="bg-[#f26217] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#d45510] transition-colors"
            >
              Facebook
            </a>
            <Link href="/commandes" className="text-xs text-[#6e6e73] hover:text-[#1d1d1f] transition-colors border border-[rgba(0,0,0,0.12)] rounded-full px-3 py-1.5">Admin</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <Image src="/2f3d-logo.jpg" alt="2F3D" width={64} height={64} className="rounded-full object-cover mb-8" />
        <p className="text-xs font-bold tracking-[4px] uppercase text-[#f26217] mb-6">
          Les Deux Frères de l&apos;Impression 3D
        </p>
        <h1 className="text-6xl sm:text-7xl md:text-[88px] font-black text-[#1d1d1f] leading-[0.92] tracking-tight mb-8 max-w-3xl">
          On imprime.<br />On partage.<br />
          <span className="text-[#f26217]">On inspire.</span>
        </h1>
        <p className="text-lg text-[#6e6e73] max-w-sm mb-10 leading-relaxed">
          Deux frères, deux Bambu Lab, une passion partagée pour l&apos;impression 3D.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <a
            href="https://www.facebook.com/share/1DTXK3AwBV/?mibextid=wwXIfr"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#f26217] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#d45510] transition-colors text-sm"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Rejoindre sur Facebook
          </a>
          <a
            href="#presentation"
            className="inline-flex items-center gap-2 text-[#1d1d1f] font-semibold px-6 py-3 rounded-full border border-[rgba(0,0,0,0.15)] hover:border-[rgba(0,0,0,0.3)] transition-colors text-sm"
          >
            Découvrir
          </a>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6"><div className="h-px bg-[rgba(0,0,0,0.07)]" /></div>

      {/* BROTHERS */}
      <section className="py-32" id="presentation">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[4px] uppercase text-[#f26217] mb-20">Qui sommes-nous</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <p className="text-xs text-[#c7c7cc] mb-3 font-medium tracking-widest">01</p>
              <h2 className="text-7xl font-black text-[#1d1d1f] mb-4 tracking-tight">Vincent</h2>
              <div className="w-10 h-[3px] bg-[#f26217] rounded mb-7" />
              <div className="flex gap-2 flex-wrap mb-6">
                <span className="text-xs font-medium border border-[rgba(0,0,0,0.13)] rounded-full px-3 py-1 text-[#6e6e73]">Bambu Lab A1</span>
                <span className="text-xs font-medium border border-[rgba(0,0,0,0.13)] rounded-full px-3 py-1 text-[#6e6e73]">AMS Lite</span>
              </div>
              <p className="text-[#6e6e73] leading-relaxed text-[15px]">
                Passionné de création fonctionnelle et de gadgets pratiques. Spécialisé dans les pièces mécaniques et les projets du quotidien.
              </p>
            </div>
            <div>
              <p className="text-xs text-[#c7c7cc] mb-3 font-medium tracking-widest">02</p>
              <h2 className="text-7xl font-black text-[#1d1d1f] mb-4 tracking-tight">Alex</h2>
              <div className="w-10 h-[3px] bg-[#f26217] rounded mb-7" />
              <div className="flex gap-2 flex-wrap mb-6">
                <span className="text-xs font-medium border border-[rgba(0,0,0,0.13)] rounded-full px-3 py-1 text-[#6e6e73]">Bambu Lab P2S</span>
                <span className="text-xs font-medium border border-[rgba(0,0,0,0.13)] rounded-full px-3 py-1 text-[#6e6e73]">AMS Pro 2</span>
              </div>
              <p className="text-[#6e6e73] leading-relaxed text-[15px]">
                Accro aux prints multicolores et aux modèles techniques. Stream ses impressions en direct et partage ses réglages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6"><div className="h-px bg-[rgba(0,0,0,0.07)]" /></div>

      {/* FEATURES */}
      <section className="py-32" id="partage">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold tracking-[4px] uppercase text-[#f26217] mb-5">Ce qu&apos;on partage</p>
          <h2 className="text-5xl sm:text-6xl font-black text-[#1d1d1f] mb-20 max-w-xl leading-tight tracking-tight">
            Tout ce dont t&apos;as besoin pour progresser.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(0,0,0,0.07)]">
            {[
              { n: "01", title: "Entraide", desc: "Un problème avec ton imprimante ? On est là. Questions, réponses, dépannage en temps réel." },
              { n: "02", title: "Idées & Projets", desc: "Des modèles à imprimer, des idées créatives et des projets originaux chaque semaine." },
              { n: "03", title: "Réglages & Astuces", desc: "Les bons réglages de slicer, les profils testés, les trucs qui fonctionnent vraiment." },
              { n: "04", title: "Bons Plans", desc: "Les meilleurs achats, les filaments qui valent la peine, les deals à ne pas manquer." },
            ].map((f) => (
              <div key={f.n} className="bg-white p-10 hover:bg-[#f5f5f7] transition-colors">
                <p className="text-xs text-[#c7c7cc] mb-5 font-medium tracking-widest">{f.n}</p>
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-3">{f.title}</h3>
                <p className="text-[#6e6e73] leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-[4px] uppercase text-[#f26217] mb-6">Rejoins-nous</p>
          <h2 className="text-5xl sm:text-6xl font-black text-[#1d1d1f] mb-5 leading-tight tracking-tight">
            La communauté<br />t&apos;attend.
          </h2>
          <p className="text-lg text-[#6e6e73] mb-10 max-w-sm mx-auto leading-relaxed">
            Suis-nous sur Facebook pour nos créations, conseils et lives d&apos;impression.
          </p>
          <a
            href="https://www.facebook.com/share/1DTXK3AwBV/?mibextid=wwXIfr"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#f26217] text-white font-semibold px-8 py-3.5 rounded-full text-base hover:bg-[#d45510] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Page Facebook 2F3D
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(0,0,0,0.07)] py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Image src="/2f3d-logo.jpg" alt="2F3D" width={22} height={22} className="rounded-full object-cover" />
            <span className="font-black text-sm">
              <span className="text-[#1d1d1f]">2F</span><span className="text-[#f26217]">3D</span>
            </span>
            <span className="text-xs text-[#c7c7cc]">Les Deux Frères de l&apos;Impression 3D</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.facebook.com/share/1DTXK3AwBV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
              className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">Facebook</a>
            <Link href="/commandes" className="text-xs text-[#c7c7cc] hover:text-[#6e6e73] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

      <ChatWidget />

    </div>
  );
}
