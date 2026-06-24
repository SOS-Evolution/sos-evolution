"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { useTranslations } from "next-intl";

export default function SuccessPage() {
    const t = useTranslations("SuccessPage");

    return (
        <div className="min-h-screen text-slate-100 flex items-center justify-center relative overflow-hidden px-4">
            {/* Fondo animado */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <main className="w-full max-w-lg relative z-10 py-12">
                <AnimatedSection delay={0.1}>
                    <Card className="relative overflow-hidden bg-gradient-to-b from-purple-950/40 via-slate-900/80 to-slate-950/95 border-purple-500/20 border-2 p-8 md:p-10 flex flex-col items-center text-center shadow-2xl backdrop-blur-md rounded-3xl">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-purple-500/5 opacity-100 blur-xl pointer-events-none" />

                        {/* Success Icon Animation */}
                        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-bounce duration-1000">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-spin duration-3000" />
                        </div>

                        {/* Title & Subtitle */}
                        <h2 className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-2">
                            {t("title")}
                        </h2>
                        <h1 className="text-3xl font-serif text-white mb-4">
                            {t("subtitle")}
                        </h1>
                        
                        {/* Description */}
                        <p className="text-slate-300 text-sm max-w-sm leading-relaxed mb-8">
                            {t("description")}
                        </p>

                        {/* CTA Button */}
                        <Link href="/dashboard" className="w-full">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                                <span>{t("button")}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </Card>
                </AnimatedSection>
            </main>
        </div>
    );
}
