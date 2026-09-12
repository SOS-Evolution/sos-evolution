"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Sparkles, ArrowRight, Heart, Calendar, Compass, Star, Hash, Flame } from "lucide-react";
import { useTranslations } from "next-intl";
import StarBorder from "./StarBorder";

interface PortalItem {
    id: string;
    title: string;
    description: string;
    badge: string;
    badgeColor: "gold" | "rose" | "purple" | "blue" | "amber" | "cyan";
    icon: React.ElementType;
    cta: string;
    href: "/tarot" | "/astrology" | "/numerology";
    cardImage?: string;
    deckColor: string;
}

export default function PortalesGrid() {
    const t = useTranslations("Landing.portals");

    const portals: PortalItem[] = [
        {
            id: "daily",
            title: t("p1_title"),
            description: t("p1_desc"),
            badge: t("badge_free"),
            badgeColor: "gold",
            icon: Calendar,
            cta: t("p1_cta"),
            href: "/tarot",
            cardImage: "/assets/tarot/arcano-19.jpg", // El Sol
            deckColor: "from-amber-500/20 via-purple-900/40 to-slate-950"
        },
        {
            id: "love",
            title: t("p2_title"),
            description: t("p2_desc"),
            badge: t("badge_popular"),
            badgeColor: "rose",
            icon: Heart,
            cta: t("p2_cta"),
            href: "/tarot",
            cardImage: "/assets/tarot/arcano-6.jpg", // Los Enamorados
            deckColor: "from-rose-500/20 via-purple-900/40 to-slate-950"
        },
        {
            id: "temporal",
            title: t("p3_title"),
            description: t("p3_desc"),
            badge: t("badge_classic"),
            badgeColor: "purple",
            icon: Sparkles,
            cta: t("p3_cta"),
            href: "/tarot",
            cardImage: "/assets/tarot/arcano-10.jpg", // La Rueda de la Fortuna
            deckColor: "from-purple-500/20 via-indigo-900/40 to-slate-950"
        },
        {
            id: "cross",
            title: t("p4_title"),
            description: t("p4_desc"),
            badge: t("badge_deep"),
            badgeColor: "blue",
            icon: Compass,
            cta: t("p4_cta"),
            href: "/tarot",
            cardImage: "/assets/tarot/arcano-1.jpg", // El Mago
            deckColor: "from-blue-500/20 via-violet-900/40 to-slate-950"
        },
        {
            id: "astrology",
            title: t("p5_title"),
            description: t("p5_desc"),
            badge: t("badge_precision"),
            badgeColor: "amber",
            icon: Star,
            cta: t("p5_cta"),
            href: "/astrology",
            cardImage: "/assets/tarot/arcano-17.jpg", // La Estrella
            deckColor: "from-amber-400/20 via-orange-950/40 to-slate-950"
        },
        {
            id: "numerology",
            title: t("p6_title"),
            description: t("p6_desc"),
            badge: t("badge_frequency"),
            badgeColor: "cyan",
            icon: Hash,
            cta: t("p6_cta"),
            href: "/numerology",
            cardImage: "/assets/tarot/arcano-21.jpg", // El Mundo
            deckColor: "from-cyan-500/20 via-teal-950/40 to-slate-950"
        }
    ];

    const getBadgeStyle = (color: PortalItem["badgeColor"]) => {
        switch (color) {
            case "gold":
                return "bg-amber-400/10 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]";
            case "rose":
                return "bg-rose-500/10 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]";
            case "purple":
                return "bg-purple-500/10 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]";
            case "blue":
                return "bg-sky-500/10 text-sky-300 border-sky-500/40 shadow-[0_0_10px_rgba(14,165,233,0.3)]";
            case "amber":
                return "bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]";
            case "cyan":
                return "bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]";
        }
    };

    return (
        <section id="portales" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(210,161,125,0.2)]">
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t("tag")}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
                    {t("title")}
                </h2>
                <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed">
                    {t("subtitle")}
                </p>
                <StarBorder variant="gold" className="max-w-xs mx-auto mt-4" />
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portals.map((portal, idx) => {
                    const Icon = portal.icon;
                    return (
                        <motion.div
                            key={portal.id}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <Link href={portal.href} className="block h-full">
                                <div className="h-full flex flex-col justify-between rounded-3xl p-7 bg-gradient-to-b from-[#25153d]/70 via-[#180e28]/85 to-[#0e0618]/95 border border-white/10 group-hover:border-amber-400/50 backdrop-blur-xl transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(210,161,125,0.25)] group-hover:-translate-y-1.5 overflow-hidden">
                                    {/* Ambient card top glow */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 group-hover:bg-amber-500/15 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />

                                    <div>
                                        {/* Top Row: Badge & Icon */}
                                        <div className="flex items-center justify-between mb-6">
                                            <span className={`text-[11px] px-3 py-1 rounded-full border font-semibold tracking-wider uppercase ${getBadgeStyle(portal.badgeColor)}`}>
                                                {portal.badge}
                                            </span>
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:bg-amber-400/10 group-hover:border-amber-400/30 transition-all duration-300">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                        </div>

                                        {/* Visual Card Preview / Stacking Animation */}
                                        <div className="relative h-44 w-full mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-black/40 to-black/70 border border-white/5 p-3">
                                            {/* Stacked background cards */}
                                            <div className="absolute w-24 h-36 rounded-lg bg-gradient-to-b from-[#2a1744] to-[#120720] border border-amber-400/20 -rotate-6 translate-x-[-12px] translate-y-1 opacity-60 group-hover:-rotate-12 group-hover:translate-x-[-20px] transition-all duration-500 shadow-md" />
                                            <div className="absolute w-24 h-36 rounded-lg bg-gradient-to-b from-[#2a1744] to-[#120720] border border-amber-400/20 rotate-6 translate-x-[12px] translate-y-1 opacity-60 group-hover:rotate-12 group-hover:translate-x-[20px] transition-all duration-500 shadow-md" />

                                            {/* Main featured front card */}
                                            <div className="relative z-10 w-24 h-36 rounded-lg overflow-hidden border border-amber-400/60 shadow-[0_0_20px_rgba(210,161,125,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(210,161,125,0.5)] transition-all duration-500">
                                                {portal.cardImage ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={portal.cardImage}
                                                        alt={portal.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                        <Sparkles className="w-8 h-8 text-amber-300" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            </div>
                                        </div>

                                        {/* Title and Description */}
                                        <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                                            {portal.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed font-light mb-6">
                                            {portal.description}
                                        </p>
                                    </div>

                                    {/* Bottom CTA Row */}
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-amber-300 group-hover:text-amber-200 text-sm font-semibold transition-colors">
                                        <span>{portal.cta}</span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-400/20 border border-white/10 group-hover:border-amber-400/40 flex items-center justify-center transition-all">
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
