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
                        <h4 className="text-lg font-bold text-white mb-2">1. Modelo Freemium (Acquisition)</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• Lectura semanal gratuita.</li>
                            <li>• Perfil numerológico básico.</li>
                            <li>• Desbloqueo mediante mecánicas de gamificación (Viral Loops).</li>
                        </ul>
                    </Card>

                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">2. Microtransacciones</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• Tiradas específicas (Amor, Trabajo).</li>
                            <li>• Lecturas "Guía Maestro/Dragón".</li>
                            <li>• Visualización de destino (Imagen IA).</li>
                            <li>• Moneda virtual (Créditos).</li>
                        </ul>
                    </Card>

                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Repeat className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">3. Suscripción (~$10/mo)</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• Tiradas ilimitadas (uso razonable).</li>
                            <li>• Estadísticas avanzadas y patrones.</li>
                            <li>• Dashboard evolutivo completo.</li>
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
            </div>
        </div>
    );
}
