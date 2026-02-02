"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Calendar, ArrowLeft, Sparkles, Zap, CreditCard, Check } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/landing/AnimatedSection";

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
    const pricingTiers: PricingTier[] = [
        {
            id: "aprendiz",
            name: "Pack Aprendiz",
            price: "$4.99",
            credits: 500,
            emoji: "🥉",
            features: [
                "500 Créditos místicos",
                "Ideal para 2-3 tiradas específicas",
                "Acceso a todas las lecturas básicas",
                "Validez permanente"
            ],
            gradient: "from-slate-900 via-slate-800 to-slate-900",
            borderColor: "border-slate-700",
            glowColor: "slate",
            icon: <Coins className="w-4 h-4 text-amber-500/80" />
        },
        {
            id: "mistico",
            name: "Pack Místico",
            price: "$14.99",
            credits: 1800,
            emoji: "🥈",
            badge: {
                text: "POPULAR",
                color: "bg-emerald-500"
            },
            features: [
                "1,800 Créditos místicos",
                "+20% Bonus incluido",
                "Para usuarios recurrentes",
                "Mejor relación calidad-precio",
                "Acceso a lecturas profundas"
            ],
            gradient: "from-emerald-950 via-emerald-900 to-slate-900",
            borderColor: "border-emerald-500/50",
            glowColor: "emerald",
            icon: <Sparkles className="w-4 h-4 text-emerald-400" />
        },
        {
            id: "oraculo",
            name: "Pack Oráculo",
            price: "$39.99",
            credits: 5000,
            emoji: "🥇",
            features: [
                "5,000 Créditos místicos",
                "+40% Bonus incluido",
                "Perfecto para power users",
                "Lecturas zodiacales ilimitadas",
                "Máximo ahorro por crédito"
            ],
            gradient: "from-amber-950 via-amber-900 to-slate-900",
            borderColor: "border-amber-500/50",
            glowColor: "amber",
            icon: <Zap className="w-4 h-4 text-amber-400" />
        },
        {
            id: "temporada",
            name: "Pase Temporada",
            price: "$11.11",
            duration: "30 días",
            emoji: "👑",
            badge: {
                text: "PREMIUM",
                color: "bg-purple-500"
            },
            features: [
                "Acceso premium 30 días",
                "Pack de créditos incluido",
                "Skins de cartas exclusivos",
                "IA avanzada para profundización",
                "Sin renovación automática"
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
                            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-1">Tienda Mística</h2>
                            <h1 className="text-4xl font-serif text-white">Paquetes de <span className="text-purple-400">Créditos</span></h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Elige el paquete perfecto para tu viaje espiritual
                            </p>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                                            <Coins className={`w-4 h-4 text-${tier.glowColor}-400`} />
                                            <span>{tier.credits.toLocaleString()} Créditos</span>
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
                                    Comprar Ahora
                                </Button>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>

                {/* Payment Methods Info */}
                <AnimatedSection delay={0.5}>
                    <Card className="bg-slate-900/50 border-slate-800 p-8 backdrop-blur-sm">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Métodos de Pago Seguros</h3>
                            <p className="text-slate-400 text-sm">
                                Procesamos tus pagos de forma segura con tecnología encriptada
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-8 flex-wrap">
                            <div className="flex items-center gap-2 text-slate-400">
                                <CreditCard className="w-5 h-5" />
                                <span className="text-sm font-medium">Tarjetas de crédito/débito</span>
                            </div>
                            <div className="px-4 py-2 bg-yellow-400 rounded-lg">
                                <span className="text-sm font-bold text-slate-900">PayPal</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-500">
                                🔒 Pagos seguros procesados por Stripe & PayPal
                            </p>
                        </div>
                    </Card>
                </AnimatedSection>

                {/* FAQ Section */}
                <AnimatedSection delay={0.6}>
                    <div className="mt-12 text-center">
                        <h3 className="text-lg font-bold text-white mb-4">¿Tienes preguntas?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Los créditos no caducan y puedes usarlos cuando quieras. El Pase de Temporada no se renueva automáticamente.
                        </p>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                                Volver al Dashboard
                            </Button>
                        </Link>
                    </div>
                </AnimatedSection>
            </main>
        </div>
    );
}
