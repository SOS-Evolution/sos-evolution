"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, User, Sparkles, Brain, BookMarked, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/landing/AnimatedSection";

export default function VisionDocsPage() {
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
                        <h2 className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-1">Documentación Core</h2>
                        <h1 className="text-4xl font-serif text-white">Visión y <span className="text-purple-400">Filosofía</span></h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Fundamentos conceptuales y técnicos de SOS Evolution.
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            <div className="space-y-12">


                {/* 1. Misión Core */}
                <Card className="p-8 bg-gradient-to-br from-purple-900/20 to-indigo-900/10 border-purple-500/20">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <Badge variant="outline" className="text-purple-300 border-purple-500/30 px-3 py-1">
                                Soul Operating System
                            </Badge>
                            <h3 className="text-2xl font-serif font-bold text-white">
                                The Evolution of the Spirit
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                SOS Evolution no es solo una app de tarot. Es una plataforma de autodescubrimiento evolutivo que utiliza la IA para encarnar el rol de un "Coach Espiritual Místico".
                                A diferencia de lecturas genéricas, construimos un <span className="text-purple-400 font-bold">Mapa Evolutivo del Alma</span> personalizado.
                            </p>
                        </div>
                        <div className="w-full md:w-1/3 p-6 bg-black/20 rounded-xl border border-white/5">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Propuesta de Valor</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    <span>Viaje del Héroe Gamificado</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <Brain className="w-4 h-4 text-cyan-500" />
                                    <span>Espejo del Alma (Perfil Profundo)</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <BookMarked className="w-4 h-4 text-emerald-500" />
                                    <span>Memoria Contextual Evolutiva</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* 2. Fundamentos Psicológicos */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-slate-900/50 border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Brain className="w-6 h-6 text-indigo-400" />
                            <h3 className="text-xl font-bold text-white">Psicología Junguiana</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Entendemos al ser humano como un "sistema operativo" que procesa arquetipos.
                            Utilizamos los conceptos de <strong>Carl Jung</strong> sobre el inconsciente colectivo y la sincronocidad para dar sentido a las lecturas.
                        </p>
                        <div className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-indigo-500">
                            <p className="text-xs text-slate-300 italic">
                                "Hasta que el inconsciente no se haga consciente, el subconsciente dirigirá tu vida y tú le llamarás destino."
                            </p>
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-900/50 border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                            <h3 className="text-xl font-bold text-white">El Viaje del Héroe</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Basado en el monomito de <strong>Joseph Campbell</strong>. Cada usuario es el protagonista de su propia epopeya.
                            Las lecturas no son eventos aislados, sino pasos en una narrativa continua de <em>Llamada → Iniciación → Retorno</em>.
                        </p>
                    </Card>
                </div>

                {/* 3. Fundamentos Teóricos y Referentes */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-400" />
                        Fundamentos Teóricos y Referentes
                    </h3>

                    <div className="space-y-8">

                        {/* Nivel 1: Fundamentos Psicológicos (Base Teórica) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">Nivel 1: Fundamentos Psicológicos (Base Teórica)</Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card className="p-5 bg-slate-900 border-slate-800 hover:border-indigo-500/30 group transition-all">
                                    <div className="mb-3">
                                        <h4 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">Carl Jung</h4>
                                        <p className="text-xs text-indigo-300 font-mono">Arquetipos & Inconsciente Colectivo</p>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                        "Hasta que el inconsciente no se haga consciente, el subconsciente dirigirá tu vida y tú le llamarás destino."
                                    </p>
                                    <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-500/10">
                                        <p className="text-xs text-indigo-200">
                                            <span className="font-bold">Aplicación Técnica:</span> Fundamenta el modelo de datos proyectivo, evitando algoritmos predictivos deterministas.
                                        </p>
                                    </div>
                                </Card>

                                <Card className="p-5 bg-slate-900 border-slate-800 hover:border-amber-500/30 group transition-all">
                                    <div className="mb-3">
                                        <h4 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">Joseph Campbell</h4>
                                        <p className="text-xs text-amber-300 font-mono">El Monomito (Hero's Journey)</p>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                        Describió el patrón narrativo universal de la transformación humana: Llamada, Iniciación y Retorno.
                                    </p>
                                    <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-500/10">
                                        <p className="text-xs text-amber-200">
                                            <span className="font-bold">Aplicación Técnica:</span> Estructura la lógica de gamificación. El usuario es la entidad "Héroe" y las lecturas son eventos de "Stage".
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Nivel 2: Metodología Operativa (Estructura) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-purple-400 border-purple-500/30">Nivel 2: Metodología Operativa (Estructura)</Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card className="p-5 bg-slate-900 border-slate-800 hover:border-purple-500/30 group transition-all">
                                    <div className="mb-3">
                                        <h4 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">Alejandro Jodorowsky</h4>
                                        <p className="text-xs text-purple-300 font-mono">Psicomagia & Tarot Restaurado</p>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                        Rescató el tarot como herramienta de sanación y autoconocimiento, alejándolo de la adivinación vulgar.
                                    </p>
                                    <div className="bg-purple-950/30 p-3 rounded-lg border border-purple-500/10">
                                        <p className="text-xs text-purple-200">
                                            <span className="font-bold">Aplicación Técnica:</span> Define la "Visión del Producto". El KPI final es el bienestar del usuario, no solo la retención.
                                        </p>
                                    </div>
                                </Card>

                                <Card className="p-5 bg-slate-900 border-slate-800 hover:border-pink-500/30 group transition-all">
                                    <div className="mb-3">
                                        <h4 className="font-bold text-lg text-white group-hover:text-pink-400 transition-colors">Marianne Costa</h4>
                                        <p className="text-xs text-pink-300 font-mono">Estructura & Pedagogía</p>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                        Dotó al tarot evolutivo de rigor académico y estructura lógica.
                                    </p>
                                    <div className="bg-pink-950/30 p-3 rounded-lg border border-pink-500/10">
                                        <p className="text-xs text-pink-200">
                                            <span className="font-bold">Aplicación Técnica:</span> Aporta la taxonomía de datos. Sistematiza las reglas de interpretación para el modelo de IA.
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Nivel 3: Identidad Visual y Validación Histórica */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">Nivel 3: Identidad Visual y Validación Histórica</Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card className="p-5 bg-slate-900 border-slate-800 hover:border-emerald-500/30 group transition-all">
                                    <div className="mb-3">
                                        <h4 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">Leonora Carrington</h4>
                                        <p className="text-xs text-emerald-300 font-mono">Surrealismo Místico</p>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                        Plasma el inconsciente en imágenes oníricas y sagradas, elevando el símbolo a arte.
                                    </p>
                                    <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/10">
                                        <p className="text-xs text-emerald-200">
                                            <span className="font-bold">Aplicación Técnica:</span> Define el Sistema de Diseño (UI/UX). Estética Premium/Surrealista para diferenciación de mercado.
                                        </p>
                                    </div>
                                </Card>

                                <Card className="p-5 bg-slate-900 border-slate-800 hover:border-cyan-500/30 group transition-all">
                                    <div className="mb-3">
                                        <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">Kim Arnold</h4>
                                        <p className="text-xs text-cyan-300 font-mono">Tradición & Historia</p>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                        Custodia la autenticidad histórica de los mazos de maestros y la tradición occidental.
                                    </p>
                                    <div className="bg-cyan-950/30 p-3 rounded-lg border border-cyan-500/10">
                                        <p className="text-xs text-cyan-200">
                                            <span className="font-bold">Aplicación Técnica:</span> Validación de Contenido. Asegura la integridad de la base de conocimiento utilizada.
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 4. Estructura de la Lectura */}
                <Card className="p-6 bg-slate-900/50 border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-6">Flujo del Proceso de Lectura</h3>
                    <div className="relative border-l-2 border-slate-800 ml-3 space-y-8 pl-8 py-2">

                        <div className="relative group">
                            <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-purple-500 group-hover:bg-purple-900 transition-colors flex items-center justify-center text-[10px] font-bold">1</span>
                            <h4 className="text-lg font-bold text-white mb-2">Fase 1: Análisis de Contexto (Input)</h4>
                            <p className="text-slate-400 text-sm">
                                Recolección de datos del perfil, historial y patrones para generar el contexto del prompt.
                            </p>
                        </div>

                        <div className="relative group">
                            <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-cyan-500 group-hover:bg-cyan-900 transition-colors flex items-center justify-center text-[10px] font-bold">2</span>
                            <h4 className="text-lg font-bold text-white mb-2">Fase 2: Procesamiento e Inferencia (Core)</h4>
                            <p className="text-slate-400 text-sm">
                                Selección de variables (cartas) y mapeo con arquetipos mediante IA Generativa.
                            </p>
                        </div>

                        <div className="relative group">
                            <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-emerald-500 group-hover:bg-emerald-900 transition-colors flex items-center justify-center text-[10px] font-bold">3</span>
                            <h4 className="text-lg font-bold text-white mb-2">Fase 3: Estructuración de Respuesta (Output)</h4>
                            <p className="text-slate-400 text-sm">
                                Generación de JSON estructurado, plan de acción y persistencia de datos.
                            </p>
                        </div>

                    </div>
                </Card>

            </div>
        </div>
    );
}
