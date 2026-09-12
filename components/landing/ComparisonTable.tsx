"use client";

import { Check, X, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import StarBorder from "./StarBorder";

export default function ComparisonTable() {
    const t = useTranslations("Landing.comparison");

    const rows = [
        {
            title: t("row1_title"),
            trad: t("row1_trad"),
            sos: t("row1_sos")
        },
        {
            title: t("row2_title"),
            trad: t("row2_trad"),
            sos: t("row2_sos")
        },
        {
            title: t("row3_title"),
            trad: t("row3_trad"),
            sos: t("row3_sos")
        },
        {
            title: t("row4_title"),
            trad: t("row4_trad"),
            sos: t("row4_sos")
        },
        {
            title: t("row5_title"),
            trad: t("row5_trad"),
            sos: t("row5_sos")
        }
    ];

    return (
        <section className="py-24 px-6 max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-widest uppercase mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                    <span>{t("tag")}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
                    {t("title")}
                </h2>
                <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed">
                    {t("subtitle")}
                </p>
                <StarBorder variant="purple" className="max-w-xs mx-auto mt-4" />
            </div>

            {/* Comparison Box */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#1c0f2e]/80 via-[#140a22]/90 to-[#0c0515]/95 backdrop-blur-xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
                {/* Header Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 bg-black/40 text-sm md:text-base font-semibold">
                    <div className="md:col-span-4 p-5 md:p-6 text-slate-400 flex items-center">
                        <span>Dimensión de Valor</span>
                    </div>
                    <div className="md:col-span-4 p-5 md:p-6 text-slate-400 border-t md:border-t-0 md:border-l border-white/10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <span>{t("col_traditional")}</span>
                    </div>
                    <div className="md:col-span-4 p-5 md:p-6 text-amber-300 bg-amber-400/5 border-t md:border-t-0 md:border-l border-white/10 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="font-bold">{t("col_sos")}</span>
                    </div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                    {rows.map((row, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-12 text-sm hover:bg-white/[0.02] transition-colors">
                            {/* Feature Name */}
                            <div className="md:col-span-4 p-5 md:p-6 font-medium text-white flex items-center">
                                <span>{row.title}</span>
                            </div>

                            {/* Traditional */}
                            <div className="md:col-span-4 p-5 md:p-6 text-slate-400 border-t md:border-t-0 md:border-l border-white/5 flex items-start gap-3 bg-black/10">
                                <X className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                                <span className="font-light leading-relaxed">{row.trad}</span>
                            </div>

                            {/* SOS Evolution */}
                            <div className="md:col-span-4 p-5 md:p-6 text-slate-200 border-t md:border-t-0 md:border-l border-white/5 flex items-start gap-3 bg-amber-400/[0.03]">
                                <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <span className="font-light leading-relaxed text-amber-100/90">{row.sos}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
