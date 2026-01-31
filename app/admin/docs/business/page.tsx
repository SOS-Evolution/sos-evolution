"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, DollarSign, Repeat, HeartHandshake, ArrowLeft, Coins, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/landing/AnimatedSection";

export default function BusinessDocsPage() {
    return (
        <div className="max-w-5xl">
            <AnimatedSection>
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/admin/docs">
                        <Button variant="ghost" className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass shrink-0">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.3em] mb-1">Estrategia B2C</h2>
                        <h1 className="text-4xl font-serif text-white">Modelo de <span className="text-emerald-400">Negocio</span></h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Estrategia de crecimiento, monetización y retención.
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            <div className="space-y-12">


                {/* 1. Estrategia de Monetización */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Fuentes de Ingreso
                </h3>
                <div className="grid md:grid-cols-3 gap-6 mb-8">

                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">1. Freemium & Gamificación</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• <span className="text-emerald-400 font-medium">Ganar Créditos:</span> Invitar usuarios, compartir en RRSS (Earned Media).</li>
                            <li>• Lectura diaria/semanal gratuita.</li>
                            <li>• Acceso básico al mapa del alma.</li>
                        </ul>
                    </Card>

                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">2. Pack de Créditos</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• Compra de moneda virtual con dinero real.</li>
                            <li>• <span className="text-amber-400 text-xs uppercase bg-amber-400/10 px-1 rounded">Requiere Pasarela de Pago</span></li>
                            <li>• Desbloqueo de tiradas específicas.</li>
                            <li>• Visualización de destino (Imagen IA).</li>
                        </ul>
                    </Card>

                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Repeat className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">3. Pase de Temporada (30 días)</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• <span className="text-purple-400 font-medium">Acceso Premium:</span> Beneficios exclusivos.</li>
                            <li>• Pack de créditos + Skins de cartas únicos.</li>
                            <li>• <strong>Profundización en tiradas</strong> (IA avanzada).</li>
                            <li>• <span className="text-amber-400 text-xs uppercase bg-amber-400/10 px-1 rounded">Requiere Pasarela de Pago</span></li>
                        </ul>
                    </Card>
                </div>

                {/* 2. Marketing y Nichos */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            Nichos Objetivo
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                                <Badge variant="secondary" className="bg-pink-900/30 text-pink-300">Gen Z / Millennials</Badge>
                                <p className="text-sm text-slate-400">Uso no esotérico del tarot. Herramienta de introspección psicológica.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                                <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">Wellness & Growth</Badge>
                                <p className="text-sm text-slate-400">Buscadores de desarrollo personal, autoayuda y mindfulness.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                                <Badge variant="secondary" className="bg-indigo-900/30 text-indigo-300">Comunidades WitchTok</Badge>
                                <p className="text-sm text-slate-400">Consumo de contenido visual místico en TikTok/IG Reels.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <HeartHandshake className="w-5 h-5 text-red-400" />
                            Diferenciadores de Retención (LTV)
                        </h3>
                        <Card className="p-5 bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800">
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                                    <div>
                                        <p className="font-bold text-slate-200 text-sm">Memoria Contextual (Vector Search)</p>
                                        <p className="text-xs text-slate-500">
                                            Persistencia de Contexto: El sistema utiliza memoria vectorial para identificar patrones recurrentes en el historial del usuario.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2" />
                                    <div>
                                        <p className="font-bold text-slate-200 text-sm">Gamificación Estructural</p>
                                        <p className="text-xs text-slate-500">
                                            Progresión de Usuario: Sistema de niveles y recompensas basado en hitos de actividad (Achievement System).
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                                    <div>
                                        <p className="font-bold text-slate-200 text-sm">Registro de Actividad (Activity Log)</p>
                                        <p className="text-xs text-slate-500">
                                            Visualización cronológica de eventos y análisis de tendencias para fomentar el uso recurrente (Daily Active Users).
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
                {/* 3. Infraestructura y Pagos */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Infraestructura de Pagos & Confianza
                </h3>
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Estrategia Tecnológica */}
                    <Card className="p-6 bg-slate-900 border-slate-800">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Estrategia Técnica & Fiscal
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <h5 className="text-blue-200 font-medium mb-1">Base de Datos</h5>
                                <p className="text-sm text-slate-400">
                                    Implementar tablas robustas de <code className="text-blue-300">Transactions</code> (historial) y <code className="text-blue-300">User_Wallet</code> (créditos) para auditoría.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                    <h5 className="text-white text-sm font-bold mb-1">Opción A (Recomendada)</h5>
                                    <p className="text-xs text-slate-400">
                                        <strong>Lemon Squeezy</strong>: Resuelve Impuestos, Tarjetas y PayPal en una sola integración. Ideal para productos digitales globales.
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                    <h5 className="text-white text-sm font-bold mb-1">Opción B (Control)</h5>
                                    <p className="text-xs text-slate-400">
                                        <strong>Stripe + PayPal Std</strong>: Menor comisión pero requiere doble integración y gestión manual de impuestos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Psicología de Venta */}
                    <Card className="p-6 bg-slate-900 border-slate-800">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <HeartHandshake className="w-5 h-5 text-pink-400" />
                            Psicología de Venta
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-amber-500 font-bold">1</span>
                                </div>
                                <div>
                                    <h5 className="text-white font-medium">Pase "No Recurrente"</h5>
                                    <p className="text-sm text-slate-400">
                                        Vender el Pase como <strong>Producto de Temporada</strong> (ej: "Temporada de Eclipses") en lugar de suscripción automática. Elimina el miedo a "olvidar cancelar" y aumenta conversión.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-yellow-500 font-bold">2</span>
                                </div>
                                <div>
                                    <h5 className="text-white font-medium">Factor Confianza (PayPal)</h5>
                                    <p className="text-sm text-slate-400">
                                        En el nicho esotérico, el botón amarillo de <strong>PayPal</strong> es crítico. Reduce la fricción y el recelo de compartir datos bancarios en sitios nuevos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>
                {/* 4. Estrategia de Precios */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Precios Objetivo (Tier List)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* Pack Pequeño */}
                    <Card className="p-4 bg-slate-900 border-slate-800 flex flex-col items-center text-center group hover:border-slate-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                            <span className="text-lg">🥉</span>
                        </div>
                        <h4 className="text-slate-300 font-medium text-sm mb-1">Pack Aprendiz</h4>
                        <div className="text-2xl font-bold text-white mb-1">$4.99</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                            <Coins className="w-3.5 h-3.5 text-amber-500/80" />
                            <span>500 Créditos</span>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 w-full">
                            Ideal para 2-3 tiradas específicas.
                        </p>
                    </Card>

                    {/* Pack Medio */}
                    <Card className="p-4 bg-slate-900 border-slate-800 flex flex-col items-center text-center relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-[10px] text-black font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                            POPULAR
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:bg-emerald-900/50 transition-colors">
                            <span className="text-lg">🥈</span>
                        </div>
                        <h4 className="text-emerald-400 font-medium text-sm mb-1">Pack Místico</h4>
                        <div className="text-2xl font-bold text-white mb-1">$14.99</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                            <Coins className="w-3.5 h-3.5 text-amber-500/80" />
                            <span>1,800 Créditos</span>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 w-full">
                            +20% Bonus. Para usuarios recurrentes.
                        </p>
                    </Card>

                    {/* Pack Grande */}
                    <Card className="p-4 bg-slate-900 border-slate-800 flex flex-col items-center text-center group hover:border-amber-500/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center mb-3 group-hover:bg-amber-900/50 transition-colors">
                            <span className="text-lg">🥇</span>
                        </div>
                        <h4 className="text-amber-400 font-medium text-sm mb-1">Pack Oráculo</h4>
                        <div className="text-2xl font-bold text-white mb-1">$39.99</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                            <Coins className="w-3.5 h-3.5 text-amber-500" />
                            <span>5,000 Créditos</span>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 w-full">
                            +40% Bonus. Power users.
                        </p>
                    </Card>

                    {/* Suscripción */}
                    <Card className="p-4 bg-gradient-to-b from-purple-900/20 to-slate-900 border-purple-500/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500/60 transition-colors">
                        <div className="absolute top-0 right-0 bg-purple-500 text-[10px] text-white font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                            PREMIUM
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            <span className="text-lg">👑</span>
                        </div>
                        <h4 className="text-purple-300 font-medium text-sm mb-1 uppercase tracking-tight">Pase Temporada</h4>
                        <div className="text-2xl font-bold text-white mb-1">$11.11</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-3 uppercase font-medium">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            <span>30 Días</span>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-purple-500/20 pt-2 w-full">
                            Skins + Créditos Extra + AI Profunda.
                        </p>
                    </Card>

                </div>
            </div>
        </div>
    );
}
