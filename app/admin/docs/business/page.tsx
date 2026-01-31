"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, DollarSign, Repeat, HeartHandshake, ArrowLeft } from "lucide-react";
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
            </div>
        </div>
    );
}
