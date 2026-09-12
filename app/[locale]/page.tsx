import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Sparkles, Brain, Zap, Star, ArrowRight,
    Instagram, Twitter, Youtube, Linkedin, Shield, Clock, CheckCircle2
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

import AnimatedSection from "@/components/landing/AnimatedSection";
import StarBorder from "@/components/landing/StarBorder";
import InteractiveHeroOracle from "@/components/landing/InteractiveHeroOracle";
import OracleQuestionBar from "@/components/landing/OracleQuestionBar";
import PortalesGrid from "@/components/landing/PortalesGrid";
import ComparisonTable from "@/components/landing/ComparisonTable";

export const dynamic = "force-dynamic";

interface HomeProps {
    params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
    const { locale } = await params;
    const t = await getTranslations("Landing");
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    const isEs = locale === "es";

    return (
        <div className="min-h-screen text-slate-200 font-sans overflow-x-hidden bg-[#0d0714] selection:bg-amber-400/30 selection:text-white">

            {/* ===== LUXURY COSMIC BACKGROUND ===== */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Midnight purple & gold radial nebulas */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(147,51,234,0.18)_0%,transparent_65%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(210,161,125,0.08)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_70%,rgba(99,102,241,0.12)_0%,transparent_60%)]" />

                {/* Floating ambient orbs */}
                <div className="absolute top-[8%] left-[8%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] animate-float" />
                <div className="absolute bottom-[15%] right-[8%] w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[130px] animate-float-delayed" />
                <div className="absolute top-[45%] left-[45%] w-[350px] h-[350px] bg-violet-900/10 rounded-full blur-[110px] animate-float" />
            </div>

            <main className="relative z-10">

                {/* ===== HERO SECTION ===== */}
                <section className="min-h-[88vh] flex flex-col items-center justify-center px-6 pt-12 pb-16 text-center">

                    {/* Celestial Badge */}
                    <div className="animate-fade-in-up mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-purple-950/60 text-amber-300 text-xs font-semibold tracking-widest uppercase backdrop-blur-md shadow-[0_0_20px_rgba(210,161,125,0.25)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                            {t("hero.beta")}
                        </span>
                    </div>

                    {/* Logo Mark with Subtle Halo */}
                    <div className="animate-fade-in-up mb-6" style={{ animationDelay: "0.1s" }}>
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse" />
                            <Image
                                src="/logo.svg"
                                alt="SOS Evolution Emblem"
                                width={110}
                                height={110}
                                priority
                                className="w-20 h-20 md:w-24 md:h-24 mx-auto drop-shadow-[0_0_35px_rgba(230,190,138,0.6)] animate-breathe relative z-10"
                            />
                        </div>
                    </div>

                    {/* Grand Editorial Headline */}
                    <h1 className="animate-fade-in-up max-w-4xl mx-auto mb-5" style={{ animationDelay: "0.2s" }}>
                        <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15]">
                            {t("hero.title_line1")}{" "}
                            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.4)]">
                                {t("hero.title_highlight")}
                            </span>
                            <br className="hidden sm:inline" />{" "}
                            {t("hero.title_line2")}
                        </span>
                    </h1>

                    {/* Subheadline / Motto */}
                    <div className="animate-fade-in-up mb-5" style={{ animationDelay: "0.3s" }}>
                        <p className="text-sm sm:text-base md:text-lg font-medium text-purple-300/90 tracking-[0.2em] uppercase font-sans">
                            {t("hero.subtitle")}
                        </p>
                    </div>

                    {/* Description */}
                    <p className="animate-fade-in-up text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed mb-8 font-light" style={{ animationDelay: "0.4s" }}>
                        {t("hero.description")}
                    </p>

                    {/* CTAs */}
                    <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" style={{ animationDelay: "0.5s" }}>
                        <Link href={user ? "/dashboard" : "/login"}>
                            <Button className="h-14 px-9 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:brightness-110 text-base font-bold rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.45)] hover:shadow-[0_0_50px_rgba(245,158,11,0.65)] hover:scale-[1.02] transition-all duration-300 group">
                                <Sparkles className="mr-2 w-5 h-5 text-slate-950" />
                                {user ? t("hero.cta_access") : t("hero.cta_start")}
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <a href="#portales">
                            <Button variant="ghost" className="h-14 px-8 text-slate-200 hover:text-white border border-white/15 hover:border-amber-400/40 hover:bg-white/5 rounded-2xl text-base backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                {t("hero.cta_portals")}
                            </Button>
                        </a>
                    </div>

                    {/* Trust Indicators Pill Row */}
                    <div className="animate-fade-in-up flex items-center justify-center gap-6 md:gap-8 flex-wrap text-slate-400 text-xs md:text-sm font-light mb-8" style={{ animationDelay: "0.6s" }}>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{t("hero.trust_free")}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:inline-block" />
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-400" />
                            <span>{t("hero.trust_private")}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:inline-block" />
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400" />
                            <span>{t("hero.trust_astro")}</span>
                        </div>
                    </div>

                    {/* ===== INTERACTIVE HERO ORACLE (THE SHOWSTOPPER) ===== */}
                    <div className="w-full mt-4">
                        <InteractiveHeroOracle locale={locale} />
                    </div>
                </section>

                {/* ===== DIVIDER / AUTHORITY STRIP ===== */}
                <div className="border-y border-white/10 bg-[#12081d]/80 backdrop-blur-md py-6">
                    <div className="max-w-6xl mx-auto px-6 flex justify-center items-center gap-8 md:gap-14 flex-wrap">
                        {[
                            { icon: Brain, label: t("authority.jung") },
                            { icon: Star, label: t("authority.arquetipos") },
                            { icon: Zap, label: t("authority.ia") },
                            { icon: Sparkles, label: t("authority.astronomy") },
                            { icon: Shield, label: t("authority.privacy") },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2 text-slate-400 hover:text-amber-200 transition-colors">
                                <Icon className="w-4 h-4 text-amber-400/80" />
                                <span className="text-xs font-semibold tracking-[0.18em] uppercase">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== QUESTION CAPSULE (VIDENTE IA) ===== */}
                <OracleQuestionBar />

                {/* ===== PORTALES ORACULARES (THE TAROTOO-INSPIRED GRID) ===== */}
                <PortalesGrid />

                {/* ===== COMPARISON MATRIX ===== */}
                <ComparisonTable />

                {/* ===== PROTOCOL IN 3 STEPS ===== */}
                <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
                    <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase block mb-3">
                            {isEs ? "El Protocolo Sagrado" : "The Sacred Protocol"}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
                            {t.rich("protocol.title", {
                                purple: (chunks) => (
                                    <span className="bg-gradient-to-r from-purple-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
                                        {chunks}
                                    </span>
                                )
                            })}
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed">
                            {t("protocol.subtitle")}
                        </p>
                        <StarBorder variant="gold" className="max-w-xs mx-auto mt-4" />
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line for Desktop */}
                        <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

                        {[
                            {
                                num: "01",
                                title: t("protocol.step1_title"),
                                desc: t("protocol.step1_desc"),
                                icon: "🧬"
                            },
                            {
                                num: "02",
                                title: t("protocol.step2_title"),
                                desc: t("protocol.step2_desc"),
                                icon: "🔮"
                            },
                            {
                                num: "03",
                                title: t("protocol.step3_title"),
                                desc: t("protocol.step3_desc"),
                                icon: "📖"
                            }
                        ].map((step, idx) => (
                            <AnimatedSection key={idx} delay={idx * 0.15} direction="up">
                                <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#211235]/70 via-[#150a23]/85 to-[#0e0517]/95 border border-white/10 hover:border-amber-400/40 transition-all duration-300 backdrop-blur-xl text-center group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                    {/* Number Pill */}
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/40 border border-amber-400/30 text-2xl mb-6 relative group-hover:scale-110 group-hover:border-amber-400/70 transition-all duration-300">
                                        <span>{step.icon}</span>
                                        <span className="absolute -top-2 -right-2 text-[10px] font-black text-amber-300 tracking-widest bg-purple-950 border border-amber-400/40 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                            {step.num}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-light">
                                        {step.desc}
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </section>

                {/* ===== SEEKERS TESTIMONIALS ===== */}
                <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
                    <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase block mb-3">
                            {t("testimonials.tag")}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight mb-4">
                            {t("testimonials.title")}
                        </h2>
                        <StarBorder variant="gold" className="max-w-xs mx-auto mt-4" />
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                quote: t("testimonials.t1_quote"),
                                author: t("testimonials.t1_author"),
                                role: t("testimonials.t1_role")
                            },
                            {
                                quote: t("testimonials.t2_quote"),
                                author: t("testimonials.t2_author"),
                                role: t("testimonials.t2_role")
                            },
                            {
                                quote: t("testimonials.t3_quote"),
                                author: t("testimonials.t3_author"),
                                role: t("testimonials.t3_role")
                            }
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={i * 0.1} direction="up">
                                <div className="h-full flex flex-col justify-between p-7 rounded-3xl bg-gradient-to-b from-[#211235]/60 via-[#150a23]/75 to-[#0e0517]/90 border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                                    <div>
                                        <div className="flex gap-1 text-amber-400 text-xs mb-4">
                                            {"★★★★★"}
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed font-light italic mb-6">
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <div className="text-white font-serif font-semibold text-sm">
                                            {item.author}
                                        </div>
                                        <div className="text-purple-400 text-xs font-light">
                                            {item.role}
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </section>

                {/* ===== FAQ ACCORDION ===== */}
                <section id="faq" className="py-24 px-6 max-w-4xl mx-auto scroll-mt-20">
                    <AnimatedSection className="text-center mb-16">
                        <span className="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase block mb-3">FAQ</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
                            {t.rich("faq.title", {
                                purple: (chunks) => (
                                    <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                                        {chunks}
                                    </span>
                                )
                            })}
                        </h2>
                        <StarBorder variant="gold" className="max-w-xs mx-auto mt-4" />
                    </AnimatedSection>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((num) => (
                            <AnimatedSection key={num} delay={num * 0.08}>
                                <details className="group rounded-2xl border border-white/10 bg-[#1a0f2b]/70 hover:border-amber-400/30 overflow-hidden backdrop-blur-xl transition-colors">
                                    <summary className="flex justify-between items-center px-6 py-5 cursor-pointer font-serif font-medium text-slate-200 list-none hover:text-white transition-colors text-base md:text-lg">
                                        <span>{t(`faq.q${num}`)}</span>
                                        <div className="w-6 h-6 rounded-full border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0 ml-4 group-open:rotate-45 transition-transform duration-300 text-sm font-light">
                                            +
                                        </div>
                                    </summary>
                                    <p className="text-slate-300 px-6 pb-6 text-sm leading-relaxed font-light border-t border-white/5 pt-4">
                                        {t(`faq.a${num}`)}
                                    </p>
                                </details>
                            </AnimatedSection>
                        ))}
                    </div>
                </section>

                {/* ===== GRAND FINAL CTA ===== */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                        <AnimatedSection>
                            <div className="relative rounded-3xl overflow-hidden border border-amber-400/40 p-10 md:p-16 text-center shadow-[0_0_60px_rgba(210,161,125,0.25)]">
                                {/* Ambient cosmic background */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#2b1647] via-[#1a0e2a] to-[#0c0515]" />
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.2)_0%,transparent_70%)]" />

                                <div className="relative z-10">
                                    <Image
                                        src="/logo.svg"
                                        alt="SOS Evolution"
                                        width={72}
                                        height={72}
                                        className="w-16 h-16 mx-auto mb-6 drop-shadow-[0_0_35px_rgba(245,158,11,0.6)] animate-breathe"
                                    />

                                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight leading-tight">
                                        {t("final_cta.title")}
                                    </h2>

                                    <p className="text-slate-300 mb-8 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
                                        {t("final_cta.subtitle")}
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                        <Link href={user ? "/tarot" : "/login"}>
                                            <Button className="h-14 px-10 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold hover:brightness-110 text-base rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:scale-[1.02] transition-all duration-300 group">
                                                {t("final_cta.button")}
                                                <Sparkles className="ml-2 w-5 h-5 text-slate-950" />
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="flex items-center justify-center gap-6 flex-wrap text-slate-400 text-xs md:text-sm font-light">
                                        <span className="flex items-center gap-1.5">
                                            <Shield className="w-4 h-4 text-emerald-400" />
                                            {t("final_cta.free")}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-amber-400" />
                                            {t("final_cta.immediate")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

            </main>

            {/* ===== LUXURY FOOTER ===== */}
            <footer className="border-t border-white/10 bg-[#0a0410]/90 backdrop-blur-md py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-14">
                        {/* Brand Column */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    src="/logo.svg"
                                    alt="SOS Evolution"
                                    width={36}
                                    height={36}
                                    className="w-9 h-9 drop-shadow-[0_0_12px_rgba(230,190,138,0.7)]"
                                />
                                <div className="flex flex-col leading-none">
                                    <span className="text-xs font-black tracking-[0.3em] text-white uppercase font-sans">SOS</span>
                                    <span className="text-[10px] font-semibold tracking-[0.4em] text-amber-400 uppercase font-sans">Evolution</span>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed font-light">
                                {isEs
                                    ? "Soul Operating System — Santuario digital de bienestar espiritual y autodescubrimiento que fusiona arquetipos ancestrales con Inteligencia Artificial."
                                    : "Soul Operating System — Digital sanctuary for spiritual wellness and self-discovery, merging ancestral archetypes with Artificial Intelligence."
                                }
                            </p>
                            <div className="flex gap-2.5">
                                {[Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        aria-label="Social Link"
                                        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 hover:border-amber-400/30 transition-all duration-300"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div>
                            <h4 className="text-white text-sm font-serif font-bold mb-4 tracking-wider uppercase">{isEs ? "Portales Sagrados" : "Sacred Portals"}</h4>
                            <ul className="space-y-2.5 text-sm text-slate-400 font-light">
                                <li><Link href="/tarot" className="hover:text-amber-200 transition-colors">{isEs ? "Oráculo del Tarot" : "Tarot Oracle"}</Link></li>
                                <li><Link href="/astrology" className="hover:text-amber-200 transition-colors">{isEs ? "Carta Astral" : "Birth Chart"}</Link></li>
                                <li><Link href="/numerology" className="hover:text-amber-200 transition-colors">{isEs ? "Mapa Vibracional" : "Vibrational Map"}</Link></li>
                                <li><Link href="/historial" className="hover:text-amber-200 transition-colors">{isEs ? "Diario del Alma" : "Soul Journal"}</Link></li>
                                <li><Link href="/purchase" className="hover:text-amber-200 transition-colors">{isEs ? "Canalizar Aura" : "Aura Shop"}</Link></li>
                            </ul>
                        </div>

                        {/* Legal & Philosophy */}
                        <div>
                            <h4 className="text-white text-sm font-serif font-bold mb-4 tracking-wider uppercase">Santuario</h4>
                            <ul className="space-y-2.5 text-sm text-slate-400 font-light">
                                <li><a href="#how-it-works" className="hover:text-amber-200 transition-colors">{isEs ? "El Protocolo" : "The Protocol"}</a></li>
                                <li><a href="#faq" className="hover:text-amber-200 transition-colors">FAQ</a></li>
                                <li><a href="#" className="hover:text-amber-200 transition-colors">{isEs ? "Privacidad y RLS" : "Privacy & RLS"}</a></li>
                                <li><a href="#" className="hover:text-amber-200 transition-colors">{isEs ? "Términos Sagrados" : "Terms of Service"}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs font-light">
                        <p>
                            © 2026 SOS Evolution (Soul Operating System). {isEs ? "Todos los derechos reservados." : "All rights reserved."}
                        </p>
                        <p className="flex items-center gap-1.5">
                            <span>{isEs ? "Creado con devoción cósmica" : "Crafted with cosmic devotion"}</span>
                            <span className="text-amber-400">✦</span>
                            <span>{isEs ? "para buscadores del alma" : "for soul seekers"}</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}