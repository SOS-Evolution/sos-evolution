"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, ArrowLeft, Zap, CreditCard, Check, Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { useTranslations } from 'next-intl';

interface PricingTier {
    id: string;
    name: string;
    price: string;
    credits?: number;
    duration?: string;
    emoji: string;
    badge?: {
        text: string;
        color: string;
    };
    features: string[];
    gradient: string;
    borderColor: string;
    glowColor: string;
    icon: React.ReactNode;
}

export default function PurchasePage() {
    const t = useTranslations('PurchasePage');

    const pricingTiers: PricingTier[] = [
        {
            id: "explorador",
            name: t('tiers.explorador.name'),
            price: "$1.99",
            credits: 150,
            emoji: "✨",
            badge: {
                text: t('tiers.explorador.badge'),
                color: "bg-blue-500"
            },
            features: [
                t('tiers.explorador.features.0'),
                t('tiers.explorador.features.1'),
                t('tiers.explorador.features.2'),
                t('tiers.explorador.features.3')
            ],
            gradient: "from-blue-950 via-slate-900 to-slate-900",
            borderColor: "border-blue-500/30",
            glowColor: "blue",
            icon: <Sparkles className="w-4 h-4 text-blue-400" />
        },
        {
            id: "iniciado",
            name: t('tiers.iniciado.name'),
            price: "$4.99",
            credits: 500,
            emoji: "🥉",
            features: [
                t('tiers.iniciado.features.0'),
                t('tiers.iniciado.features.1'),
                t('tiers.iniciado.features.2'),
                t('tiers.iniciado.features.3')
            ],
            gradient: "from-slate-900 via-slate-800 to-slate-900",
            borderColor: "border-slate-700",
            glowColor: "slate",
            icon: <Sparkles className="w-4 h-4 text-amber-500/80" />
        },
        {
            id: "adepto",
            name: t('tiers.adepto.name'),
            price: "$19.99",
            credits: 2500,
            emoji: "🥈",
            badge: {
                text: t('tiers.adepto.badge'),
                color: "bg-emerald-500"
            },
            features: [
                t('tiers.adepto.features.0'),
                t('tiers.adepto.features.1'),
                t('tiers.adepto.features.2'),
                t('tiers.adepto.features.3'),
                t('tiers.adepto.features.4')
            ],
            gradient: "from-emerald-950 via-emerald-900 to-slate-900",
            borderColor: "border-emerald-500/50",
            glowColor: "emerald",
            icon: <Sparkles className="w-4 h-4 text-emerald-400" />
        },
        {
            id: "maestro",
            name: t('tiers.maestro.name'),
            price: "$44.99",
            credits: 6500,
            emoji: "🥇",
            features: [
                t('tiers.maestro.features.0'),
                t('tiers.maestro.features.1'),
                t('tiers.maestro.features.2'),
                t('tiers.maestro.features.3'),
                t('tiers.maestro.features.4')
            ],
            gradient: "from-amber-950 via-amber-900 to-slate-900",
            borderColor: "border-amber-500/50",
            glowColor: "amber",
            icon: <Zap className="w-4 h-4 text-amber-400" />
        },
        {
            id: "avatar",
            name: t('tiers.avatar.name'),
            price: "$99.99",
            credits: 15000,
            emoji: "🌌",
            badge: {
                text: t('tiers.avatar.badge'),
                color: "bg-indigo-500"
            },
            features: [
                t('tiers.avatar.features.0'),
                t('tiers.avatar.features.1'),
                t('tiers.avatar.features.2'),
                t('tiers.avatar.features.3'),
                t('tiers.avatar.features.4')
            ],
            gradient: "from-indigo-950 via-indigo-900 to-slate-900",
            borderColor: "border-indigo-500/50",
            glowColor: "indigo",
            icon: <Star className="w-4 h-4 text-indigo-400" />
        },
        {
            id: "amuleto",
            name: t('tiers.amuleto.name'),
            price: "$11.11",
            duration: t('tiers.amuleto.duration'),
            emoji: "👑",
            badge: {
                text: t('tiers.amuleto.badge'),
                color: "bg-purple-500"
            },
            features: [
                t('tiers.amuleto.features.0'),
                t('tiers.amuleto.features.1'),
                t('tiers.amuleto.features.2'),
                t('tiers.amuleto.features.3'),
                t('tiers.amuleto.features.4')
            ],
            gradient: "from-purple-950 via-purple-900 to-slate-900",
            borderColor: "border-purple-500/50",
            glowColor: "purple",
            icon: <Calendar className="w-4 h-4 text-purple-400" />
        }
    ];

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">
            {/* Fondo animado */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[50%] left-[10%] w-[30%] h-[30%] bg-emerald-900/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute bottom-[20%] right-[30%] w-[25%] h-[25%] bg-amber-900/10 rounded-full blur-[80px] animate-pulse delay-500" />
            </div>

            <main className="max-w-7xl mx-auto p-6 relative z-10">
                {/* Header */}
                <AnimatedSection>
                    <div className="flex items-center gap-6 mb-12">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass shrink-0">
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-1">{t('title_shop')}</h2>
                            <h1 className="text-4xl font-serif text-white">{t.rich('title_main', {
                                purple: (chunks) => <span className="text-purple-400">{chunks}</span>
                            }) as any}</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {t('description')}
                            </p>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {pricingTiers.map((tier, index) => (
                        <AnimatedSection key={tier.id} delay={0.1 + index * 0.1}>
                            <Card
                                className={`relative overflow-hidden bg-gradient-to-b ${tier.gradient} ${tier.borderColor} border-2 p-6 flex flex-col h-full group hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl`}
                            >
                                {/* Badge */}
                                {tier.badge && (
                                    <div className={`absolute top-0 right-0 ${tier.badge.color} text-[10px] text-white font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-lg`}>
                                        {tier.badge.text}
                                    </div>
                                )}

                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-${tier.glowColor}-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />

                                {/* Icon + Emoji */}
                                <div className="relative z-10 flex flex-col items-center text-center mb-6">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${tier.glowColor}-900/30 to-${tier.glowColor}-900/10 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all group-hover:scale-110 duration-300`}>
                                        <span className="text-3xl">{tier.emoji}</span>
                                    </div>
                                    <h3 className={`text-lg font-bold text-white mb-1 group-hover:text-${tier.glowColor}-200 transition-colors`}>
                                        {tier.name}
                                    </h3>
                                </div>

                                {/* Price */}
                                <div className="relative z-10 text-center mb-6">
                                    <div className="text-4xl font-bold text-white mb-2 font-serif">
                                        {tier.price}
                                    </div>
                                    {tier.credits ? (
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                                            <Sparkles className={`w-4 h-4 text-${tier.glowColor}-400`} />
                                            <span>{tier.credits.toLocaleString()} {t('aura')}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            <span>{tier.duration}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Features */}
                                <div className="relative z-10 flex-grow mb-6">
                                    <ul className="space-y-3">
                                        {tier.features.map((feature, fIndex) => (
                                            <li key={fIndex} className="flex items-start gap-2 text-xs text-slate-300">
                                                <Check className={`w-4 h-4 text-${tier.glowColor}-400 shrink-0 mt-0.5`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    className={`relative z-10 w-full bg-gradient-to-r from-${tier.glowColor}-600 to-${tier.glowColor}-700 hover:from-${tier.glowColor}-500 hover:to-${tier.glowColor}-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all group-hover:shadow-xl`}
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    {t('buy_button')}
                                </Button>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>

                {/* Payment Methods Info */}
                <AnimatedSection delay={0.5}>
                    <Card className="bg-slate-900/50 border-slate-800 p-8 backdrop-blur-sm">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">{t('payment_methods_title')}</h3>
                            <p className="text-slate-400 text-sm">
                                {t('payment_methods_desc')}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-8 flex-wrap">
                            <div className="flex items-center gap-2 text-slate-400">
                                <CreditCard className="w-5 h-5" />
                                <span className="text-sm font-medium">{t('cards_label')}</span>
                            </div>
                            <div className="px-4 py-2 bg-yellow-400 rounded-lg">
                                <span className="text-sm font-bold text-slate-900">PayPal</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-500">
                                {t('lock_note')}
                            </p>
                        </div>
                    </Card>
                </AnimatedSection>

                {/* FAQ Section */}
                <AnimatedSection delay={0.6}>
                    <div className="mt-12 text-center">
                        <h3 className="text-lg font-bold text-white mb-4">{t('faq_title')}</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            {t('faq_desc')}
                        </p>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                                {t('back_to_dashboard')}
                            </Button>
                        </Link>
                    </div>
                </AnimatedSection>
            </main>
        </div>
    );
}
