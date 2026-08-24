import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Brain, Zap, Star, ArrowRight,
  Instagram, Twitter, Youtube, Linkedin, Shield, Clock, Infinity
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from 'next-intl/server';

import AnimatedSection from "@/components/landing/AnimatedSection";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";

export const dynamic = "force-dynamic";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const t = await getTranslations('Landing');
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const isEs = locale === 'es';

  return (
    <div className="min-h-screen text-slate-200 font-sans overflow-x-hidden bg-[#040714]">

      {/* ===== COSMIC BACKGROUND ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Stars effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(99,102,241,0.10)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(251,191,36,0.05)_0%,transparent_50%)]" />
        {/* Floating orbs */}
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-purple-900/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-indigo-900/15 rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute top-[50%] left-[40%] w-60 h-60 bg-violet-900/10 rounded-full blur-[80px] animate-float" />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="relative z-50 w-full border-b border-white/[0.06] bg-[#040714]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.svg"
              alt="SOS Evolution"
              width={32}
              height={32}
              className="w-8 h-8 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(167,139,250,1)] transition-all duration-300"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[11px] font-black tracking-[0.3em] text-white uppercase">SOS</span>
              <span className="text-[9px] font-medium tracking-[0.4em] text-purple-400 uppercase">Evolution</span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-sm text-slate-400 hover:text-white transition-colors tracking-wide">
              {isEs ? "Módulos" : "Modules"}
            </a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors tracking-wide">
              {isEs ? "¿Cómo funciona?" : "How it works"}
            </a>
            <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors tracking-wide">
              FAQ
            </a>
          </div>

          {/* CTA */}
          <Link href={user ? "/dashboard" : "/login"}>
            <Button className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 h-9 rounded-lg border border-violet-500/30 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all duration-300">
              {user ? (isEs ? "Mi Dashboard" : "My Dashboard") : (isEs ? "Comenzar Gratis" : "Start Free")}
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10">

        {/* ===== HERO ===== */}
        <section className="min-h-[92vh] flex flex-col items-center justify-center px-6 pt-12 pb-24 text-center">

          {/* Badge */}
          <div className="animate-fade-in-up mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
              {t('hero.beta')}
            </span>
          </div>

          {/* Logo mark - grande, sin fondo */}
          <div className="animate-fade-in-up mb-8" style={{ animationDelay: "0.1s" }}>
            <Image
              src="/logo.svg"
              alt="SOS Evolution Symbol"
              width={128}
              height={128}
              priority
              className="w-24 h-24 md:w-32 md:h-32 mx-auto drop-shadow-[0_0_40px_rgba(167,139,250,0.5)] animate-breathe"
            />
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up mb-4" style={{ animationDelay: "0.2s" }}>
            <span className="block text-[13vw] sm:text-[10vw] md:text-[8rem] lg:text-[9rem] font-black tracking-[-0.04em] leading-none bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl">
              S.O.S.
            </span>
          </h1>

          {/* Subheadline */}
          <div className="animate-fade-in-up mb-6" style={{ animationDelay: "0.3s" }}>
            <p className="text-xl md:text-3xl font-light text-slate-300 tracking-[0.15em] uppercase">
              <span className="text-violet-400 font-semibold">Soul</span>
              {" "}Operating{" "}
              <span className="text-violet-400 font-semibold">System</span>
            </p>
          </div>

          {/* Description */}
          <p className="animate-fade-in-up text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light" style={{ animationDelay: "0.4s" }}>
            {isEs
              ? <>La primera plataforma que une <strong className="text-white font-medium">Inteligencia Artificial</strong> con la sabiduría del <strong className="text-white font-medium">Tarot, Astrología y Numerología</strong> para guiarte en tu viaje de autodescubrimiento.</>
              : <>The first platform that merges <strong className="text-white font-medium">Artificial Intelligence</strong> with the wisdom of <strong className="text-white font-medium">Tarot, Astrology & Numerology</strong> to guide your journey of self-discovery.</>
            }
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center gap-4" style={{ animationDelay: "0.5s" }}>
            <Link href={user ? "/dashboard" : "/login"}>
              <Button className="h-14 px-10 bg-white text-slate-950 hover:bg-violet-50 text-base font-bold rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:scale-[1.02] transition-all duration-300 group">
                {user ? t('hero.cta_access') : t('hero.cta_start')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#modules">
              <Button variant="ghost" className="h-14 px-8 text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl text-base backdrop-blur-sm transition-all">
                {isEs ? "Ver los módulos" : "See the modules"}
              </Button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up mt-16 flex items-center gap-8 flex-wrap justify-center" style={{ animationDelay: "0.7s" }}>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Shield className="w-4 h-4 text-emerald-500" />
              {isEs ? "Datos 100% privados" : "100% private data"}
            </div>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock className="w-4 h-4 text-violet-400" />
              {isEs ? "Acceso inmediato" : "Instant access"}
            </div>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Infinity className="w-4 h-4 text-amber-400" />
              {isEs ? "Sin suscripción obligatoria" : "No forced subscription"}
            </div>
          </div>
        </section>

        {/* ===== DIVIDER / AUTHORITY STRIP ===== */}
        <div className="border-y border-white/[0.06] bg-white/[0.02] py-6">
          <div className="max-w-6xl mx-auto px-6 flex justify-center items-center gap-10 md:gap-20 flex-wrap">
            {[
              { icon: Brain, label: isEs ? "Psicología Junguiana" : "Jungian Psychology" },
              { icon: Star, label: isEs ? "Simbolismo Arquetípico" : "Archetypal Symbolism" },
              { icon: Zap, label: isEs ? "IA Generativa" : "Generative AI" },
              { icon: Sparkles, label: isEs ? "Tarot de Marsella" : "Tarot de Marseille" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-slate-600 hover:text-slate-400 transition-colors">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium tracking-[0.15em] uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MODULES ===== */}
        <section id="modules" className="py-32 px-6 max-w-6xl mx-auto scroll-mt-16">
          <AnimatedSection className="text-center mb-20">
            <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase block mb-4">
              {isEs ? "Los 3 Pilares" : "The 3 Pillars"}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              {isEs ? <>Tu portal al<br /><span className="text-gradient-purple">autoconocimiento</span></> : <>Your portal to<br /><span className="text-gradient-purple">self-knowledge</span></>}
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto font-light leading-relaxed">
              {isEs
                ? "Tres sistemas de sabiduría ancestral, amplificados con inteligencia artificial."
                : "Three ancestral wisdom systems, amplified with artificial intelligence."
              }
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {/* TAROT */}
            <AnimatedSection delay={0.1} direction="up">
              <GlowingBorderCard className="h-full" glowColor="purple">
                <div className="p-8 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">🃏</div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {isEs ? "Oráculo del Tarot" : "Tarot Oracle"}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-light">
                      {isEs
                        ? "Consulta al oráculo con tu pregunta o déjate guiar por la carta del día. La IA interpreta cada arcano según tu contexto único y el Viaje del Héroe."
                        : "Consult the oracle with your question or let the card of the day guide you. AI interprets each arcana through your unique context and the Hero's Journey."
                      }
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mb-6">
                      {(isEs ? ["1 carta", "3 cartas", "Oráculo diario"] : ["1 card", "3 cards", "Daily oracle"]).map(t => (
                        <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-violet-950/60 text-violet-300 border border-violet-500/20 font-medium">{t}</span>
                      ))}
                    </div>
                    <Link href="/tarot">
                      <Button variant="ghost" className="p-0 h-auto text-violet-400 hover:text-violet-300 text-sm font-semibold group">
                        {isEs ? "Consultar el Oráculo" : "Consult the Oracle"}
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlowingBorderCard>
            </AnimatedSection>

            {/* ASTROLOGY */}
            <AnimatedSection delay={0.2} direction="up">
              <GlowingBorderCard className="h-full" glowColor="gold">
                <div className="p-8 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">🔮</div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {isEs ? "Astrología Natal" : "Natal Astrology"}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-light">
                      {isEs
                        ? "Tu carta natal revela la posición exacta de los astros en el momento de tu nacimiento. Descubre tus casas, planetas y tránsitos que moldean tu esencia."
                        : "Your birth chart reveals the exact position of the stars at your birth moment. Discover your houses, planets and transits that shape your essence."
                      }
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mb-6">
                      {(isEs ? ["Carta natal", "Tránsitos", "Interpretación IA"] : ["Birth chart", "Transits", "AI interpretation"]).map(t => (
                        <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/20 font-medium">{t}</span>
                      ))}
                    </div>
                    <Link href="/astrology">
                      <Button variant="ghost" className="p-0 h-auto text-amber-400 hover:text-amber-300 text-sm font-semibold group">
                        {isEs ? "Ver mi Carta Astral" : "See my Birth Chart"}
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlowingBorderCard>
            </AnimatedSection>

            {/* NUMEROLOGY */}
            <AnimatedSection delay={0.3} direction="up">
              <GlowingBorderCard className="h-full" glowColor="cyan">
                <div className="p-8 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">🔢</div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {isEs ? "Numerología Pitagórica" : "Pythagorean Numerology"}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-light">
                      {isEs
                        ? "Cada letra de tu nombre vibra en una frecuencia única. El método pitagórico transforma tu identidad en un mapa numérico que revela tu Camino de Vida."
                        : "Each letter of your name vibrates at a unique frequency. The Pythagorean method transforms your identity into a numerical map revealing your Life Path."
                      }
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mb-6">
                      {(isEs ? ["Camino de vida", "Nº del alma", "Destino"] : ["Life path", "Soul number", "Destiny"]).map(t => (
                        <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 font-medium">{t}</span>
                      ))}
                    </div>
                    <Link href="/numerology">
                      <Button variant="ghost" className="p-0 h-auto text-cyan-400 hover:text-cyan-300 text-sm font-semibold group">
                        {isEs ? "Calcular mi Frecuencia" : "Calculate my Frequency"}
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlowingBorderCard>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="py-32 px-6 bg-white/[0.015] border-y border-white/[0.06] scroll-mt-16">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection className="text-center mb-20">
              <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase block mb-4">
                {isEs ? "El Protocolo" : "The Protocol"}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                {t.rich('protocol.title', {
                  purple: (chunks) => <span className="text-gradient-purple">{chunks}</span>
                })}
              </h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto font-light">
                {t('protocol.subtitle')}
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

              {[
                {
                  num: "01",
                  icon: "🧬",
                  title: t('protocol.step1_title'),
                  desc: t('protocol.step1_desc'),
                  color: "violet"
                },
                {
                  num: "02",
                  icon: "✨",
                  title: t('protocol.step2_title'),
                  desc: t('protocol.step2_desc'),
                  color: "purple"
                },
                {
                  num: "03",
                  icon: "📖",
                  title: t('protocol.step3_title'),
                  desc: t('protocol.step3_desc'),
                  color: "indigo"
                }
              ].map((step, i) => (
                <AnimatedSection key={i} delay={i * 0.15} direction="up">
                  <div className="relative text-center">
                    {/* Step number */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 mb-6 relative">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="absolute -top-2 -right-2 text-[10px] font-black text-violet-400 tracking-widest bg-slate-950 border border-violet-500/30 rounded-full w-6 h-6 flex items-center justify-center">{step.num}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">{step.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ===== VALUE PROPS ===== */}
        <section className="py-32 px-6 max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {isEs ? <>¿Por qué <span className="text-gradient-purple">SOS Evolution</span>?</> : <>Why <span className="text-gradient-purple">SOS Evolution</span>?</>}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🔒",
                title: isEs ? "Privacidad Total" : "Total Privacy",
                desc: isEs ? "Tu Diario del Alma usa seguridad a nivel de fila (RLS). Técnicamente imposible que alguien más vea tus lecturas." : "Your Soul Journal uses row-level security (RLS). Technically impossible for anyone else to see your readings."
              },
              {
                icon: "🧠",
                title: isEs ? "IA Contextual" : "Contextual AI",
                desc: isEs ? "La IA no da respuestas genéricas. Cada interpretación se calibra con tu perfil natal, numerológico y tu pregunta." : "The AI doesn't give generic answers. Each interpretation is calibrated with your natal profile, numerology and your question."
              },
              {
                icon: "⚡",
                title: isEs ? "Sin Fricciones" : "No Friction",
                desc: isEs ? "Registro en 30 segundos. Sin tarjeta de crédito. Los créditos de bienvenida se entregan inmediatamente." : "Register in 30 seconds. No credit card. Welcome credits delivered immediately."
              },
              {
                icon: "🌱",
                title: isEs ? "Progreso Real" : "Real Progress",
                desc: isEs ? "El Diario del Alma guarda cada lectura. Detecta patrones en el tiempo y completa Misiones Evolutivas." : "The Soul Journal saves every reading. Detect patterns over time and complete Evolutionary Missions."
              }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1} direction="up">
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/20 hover:bg-white/[0.05] transition-all duration-300 group">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-32 px-6 bg-white/[0.015] border-t border-white/[0.06] scroll-mt-16">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.3em] text-violet-400 uppercase block mb-4">FAQ</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {t.rich('faq.title', {
                  purple: (chunks) => <span className="text-gradient-purple">{chunks}</span>
                })}
              </h2>
            </AnimatedSection>

            <div className="space-y-3">
              {[1, 2, 3].map((num) => (
                <AnimatedSection key={num} delay={num * 0.1}>
                  <details className="group rounded-xl border border-white/[0.07] bg-white/[0.03] overflow-hidden hover:border-violet-500/20 transition-colors">
                    <summary className="flex justify-between items-center px-6 py-5 cursor-pointer font-medium text-slate-200 list-none hover:text-white transition-colors text-sm md:text-base">
                      {t(`faq.q${num}`)}
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-violet-400 flex-shrink-0 ml-4 group-open:rotate-45 transition-transform duration-300 text-lg font-light">
                        +
                      </div>
                    </summary>
                    <p className="text-slate-400 px-6 pb-6 text-sm leading-relaxed font-light border-t border-white/[0.05] pt-4">
                      {t(`faq.a${num}`)}
                    </p>
                  </details>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="relative rounded-3xl overflow-hidden border border-violet-500/20">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-[#040714] to-indigo-950/60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.2)_0%,transparent_70%)]" />

                <div className="relative z-10 px-8 md:px-20 py-20 text-center">
                  {/* Symbol */}
                  <Image
                    src="/logo.svg"
                    alt="SOS Evolution"
                    width={64}
                    height={64}
                    className="w-16 h-16 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(167,139,250,0.6)] animate-breathe"
                  />

                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                    {t.rich('final_cta.title', {
                      purple: (chunks) => <span className="text-gradient-purple">{chunks}</span>
                    })}
                  </h2>

                  <p className="text-slate-300 mb-10 text-lg font-light max-w-lg mx-auto">
                    {isEs
                      ? "Únete a la plataforma que combina lo antiguo y lo moderno para guiar tu evolución personal."
                      : "Join the platform that combines the ancient and the modern to guide your personal evolution."
                    }
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href={user ? "/tarot" : "/login"}>
                      <Button className="h-14 px-10 bg-white text-slate-950 hover:bg-violet-50 text-base font-bold rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 group">
                        {t('final_cta.button')}
                        <Sparkles className="ml-2 w-4 h-4 text-violet-600" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                    <span className="flex items-center gap-2 text-slate-400 text-sm">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      {t('final_cta.free')}
                    </span>
                    <span className="w-px h-4 bg-white/10" />
                    <span className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-3.5 h-3.5 text-violet-400" />
                      {t('final_cta.immediate')}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[0.06] bg-black/40 backdrop-blur-sm py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/logo.svg"
                  alt="SOS Evolution"
                  width={32}
                  height={32}
                  className="w-8 h-8 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-[11px] font-black tracking-[0.3em] text-white uppercase">SOS</span>
                  <span className="text-[9px] font-medium tracking-[0.4em] text-violet-400 uppercase">Evolution</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm max-w-xs mb-8 leading-relaxed font-light">
                {isEs
                  ? "Soul Operating System — Plataforma de bienestar espiritual que une IA con la sabiduría ancestral."
                  : "Soul Operating System — Spiritual wellness platform that unites AI with ancestral wisdom."
                }
              </p>
              <div className="flex gap-3">
                {[Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-5 tracking-wide">{isEs ? "Plataforma" : "Platform"}</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-light">
                <li><Link href="/login" className="hover:text-slate-300 transition-colors">{isEs ? "Iniciar Sesión" : "Sign In"}</Link></li>
                <li><Link href="/login" className="hover:text-slate-300 transition-colors">{isEs ? "Registrarse" : "Register"}</Link></li>
                <li><a href="#modules" className="hover:text-slate-300 transition-colors">{isEs ? "Módulos" : "Modules"}</a></li>
                <li><Link href="/purchase" className="hover:text-slate-300 transition-colors">{isEs ? "Tienda de Aura" : "Aura Shop"}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-5 tracking-wide">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-light">
                <li><a href="#" className="hover:text-slate-300 transition-colors">{isEs ? "Privacidad" : "Privacy"}</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">{isEs ? "Términos de Uso" : "Terms of Use"}</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">{isEs ? "Manifiesto" : "Manifesto"}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-700 text-xs">
              © 2026 SOS Evolution. {isEs ? "Todos los derechos reservados." : "All rights reserved."}
            </p>
            <p className="text-slate-700 text-xs">
              {isEs ? "Hecho con" : "Made with"} ✦ {isEs ? "para los buscadores del alma" : "for soul seekers"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}