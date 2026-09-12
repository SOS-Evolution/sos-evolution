"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Sparkles, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function OracleQuestionBar() {
    const t = useTranslations("Landing.question_bar");
    const router = useRouter();
    const [question, setQuestion] = useState("");

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = question.trim();
        if (!trimmed) {
            router.push("/tarot");
            return;
        }
        router.push({
            pathname: "/tarot",
            query: {
                modalidad: "general",
                pregunta: trimmed
            }
        });
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setQuestion(suggestion);
        router.push({
            pathname: "/tarot",
            query: {
                modalidad: "general",
                pregunta: suggestion
            }
        });
    };

    const suggestions = [
        t("s1"),
        t("s2"),
        t("s3"),
        t("s4")
    ];

    return (
        <section className="w-full max-w-4xl mx-auto my-16 px-4">
            <div className="relative rounded-3xl p-8 md:p-10 bg-gradient-to-b from-[#25153d]/80 via-[#180e27]/90 to-[#10071c]/90 border border-amber-400/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(210,161,125,0.15)] overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-3">
                        <Compass className="w-3.5 h-3.5 text-amber-300" />
                        <span>Vidente & Oráculo IA</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide mb-2">
                        {t("title")}
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base font-light">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6">
                    <div className="relative flex items-center rounded-2xl bg-black/40 border border-white/15 focus-within:border-amber-400/70 focus-within:shadow-[0_0_25px_rgba(210,161,125,0.3)] transition-all p-2">
                        <Sparkles className="w-5 h-5 text-amber-400/80 ml-3 mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={t("placeholder")}
                            className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm md:text-base px-2 py-2.5 focus:outline-none font-light"
                        />
                        <Button
                            type="submit"
                            className="h-11 px-5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] flex-shrink-0 transition-all group"
                        >
                            <span className="hidden sm:inline">{t("button")}</span>
                            <ArrowRight className="w-4 h-4 sm:ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </form>

                {/* Suggestions chips */}
                <div className="max-w-2xl mx-auto">
                    <span className="block text-center text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">
                        {t("suggestions_label")}
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map((sug, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleSelectSuggestion(sug)}
                                className="text-xs px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/30 text-slate-300 hover:text-amber-200 transition-all text-left flex items-center gap-1.5 font-light"
                            >
                                <span className="text-amber-400/60">✦</span>
                                <span>{sug}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
