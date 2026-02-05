"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import {
    getLifePathNumber,
    getExpressionNumber,
    getSoulUrgeNumber,
    getPersonalityNumber,
    getNumerologyDetails
} from "@/lib/soul-math";
import NumerologyCard from "./NumerologyCard";
import {
    User,
    Calendar,
    Sparkles,
    Heart,
    Shield,
    Map,
    Search,
    BrainCircuit,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "../landing/AnimatedSection";
import { useTranslations } from 'next-intl';

interface NumerologyResultProps {
    initialProfile?: {
        full_name: string | null;
        birth_date: string | null;
    } | null;
}

export default function NumerologyResult({ initialProfile }: NumerologyResultProps) {
    const t = useTranslations('NumerologyPage');
    const tn = useTranslations('Numerology');
    const [name, setName] = useState(initialProfile?.full_name || "");
    const [birthDate, setBirthDate] = useState(initialProfile?.birth_date || "");
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(!initialProfile);

    useEffect(() => {
        if (initialProfile?.full_name && initialProfile?.birth_date) {
            calculateResults(initialProfile.full_name, initialProfile.birth_date);
            setIsLoading(false);
            return;
        }

        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, birth_date")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    if (profile.full_name) setName(profile.full_name);
                    if (profile.birth_date) setBirthDate(profile.birth_date);

                    if (profile.full_name && profile.birth_date) {
                        calculateResults(profile.full_name, profile.birth_date);
                    }
                }
            }
            setIsLoading(false);
        }
        loadProfile();
    }, [initialProfile]);

    const calculateResults = (n: string, d: string) => {
        if (!n || !d) return;

        const lpNum = getLifePathNumber(d);
        const exNum = getExpressionNumber(n);
        const suNum = getSoulUrgeNumber(n);
        const peNum = getPersonalityNumber(n);

        // Helper to get localized details
        const getLocalizedDetails = (num: number) => ({
            number: num,
            title: tn(`${num}.title`),
            powerWord: tn(`${num}.powerWord`),
            essence: tn(`${num}.essence`),
            quote: tn(`${num}.quote`)
        });

        setResults({
            lifePath: getLocalizedDetails(lpNum),
            expression: getLocalizedDetails(exNum),
            soulUrge: getLocalizedDetails(suNum),
            personality: getLocalizedDetails(peNum)
        });
    };

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        calculateResults(name, birthDate);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Input Section */}
            {!results && (
                <AnimatedSection>
                    <div className="glass p-8 md:p-12 rounded-[2rem] border-white/10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full -mr-16 -mt-16" />

                        <div className="text-center mb-8">
                            <BrainCircuit className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                            <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">{t('input_title')}</h2>
                            <p className="text-slate-400">{t('input_desc')}</p>
                        </div>

                        <form onSubmit={handleCalculate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-slate-500 ml-1">{t('fullname_label')}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t('fullname_placeholder')}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-slate-500 ml-1">{t('birthdate_label')}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                                        style={{ colorScheme: 'dark' }}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-white text-purple-950 hover:bg-purple-50 h-14 rounded-2xl font-bold text-lg group"
                            >
                                {t('calculate_button')}
                                <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </form>
                    </div>
                </AnimatedSection>
            )}

            {/* Results Grid */}
            <AnimatePresence>
                {results && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">{t('results_title')}</h2>
                            <p className="text-slate-400 max-w-xl mx-auto">{t('results_desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <NumerologyCard
                                title={t('card_lifepath')}
                                details={results.lifePath}
                                icon={Map}
                                color="purple"
                                delay={0.1}
                            />
                            <NumerologyCard
                                title={t('card_destiny')}
                                details={results.expression}
                                icon={Sparkles}
                                color="indigo"
                                delay={0.2}
                            />
                            <NumerologyCard
                                title={t('card_soul')}
                                details={results.soulUrge}
                                icon={Heart}
                                color="cyan"
                                delay={0.3}
                            />
                            <NumerologyCard
                                title={t('card_personality')}
                                details={results.personality}
                                icon={Shield}
                                color="violet"
                                delay={0.4}
                            />
                        </div>

                        <AnimatedSection delay={0.6}>
                            <div className="glass p-8 rounded-3xl border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl -mr-32 -mt-32" />
                                <h3 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                                    <Search className="w-6 h-6 text-cyan-400" />
                                    {t('interpretation_title')}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-8 text-slate-300">
                                    <div className="space-y-4">
                                        <div className="leading-relaxed">
                                            {t.rich('interpretation_lifepath', {
                                                number: results.lifePath.number,
                                                strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>
                                            })}
                                        </div>
                                        <div className="leading-relaxed">
                                            {t.rich('interpretation_destiny', {
                                                number: results.expression.number,
                                                strong: (chunks) => <strong className="text-indigo-300">{chunks}</strong>
                                            })}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="leading-relaxed">
                                            {t.rich('interpretation_soul', {
                                                number: results.soulUrge.number,
                                                strong: (chunks) => <strong className="text-cyan-300">{chunks}</strong>
                                            })}
                                        </div>
                                        <div className="leading-relaxed">
                                            {t.rich('interpretation_personality', {
                                                number: results.personality.number,
                                                strong: (chunks) => <strong className="text-violet-300">{chunks}</strong>
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <p className="text-slate-500 text-sm italic">{t('footer_quote')}</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setResults(null)}
                                        className="border-white/10 hover:bg-white/5 text-slate-400"
                                    >
                                        {t('recalculate')}
                                    </Button>
                                </div>
                            </div>
                        </AnimatedSection>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
