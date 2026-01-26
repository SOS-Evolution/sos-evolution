"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Database, Server, Cpu, Globe, Lock, ArrowLeft,
    FolderTree, Network, ShieldCheck, Box, MessageSquare,
    GitBranch, Layers
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/landing/AnimatedSection";

export default function ArchitectureDocsPage() {
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
                        <h2 className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] mb-1">Estructura Técnica</h2>
                        <h1 className="text-4xl font-serif text-white">Arquitectura del <span className="text-blue-400">Sistema</span></h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Especificaciones técnicas, flujo de datos y modelo de infraestructura.
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            <div className="space-y-16">

                {/* 1. Core Stack */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Layers className="w-6 h-6 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">Stack Tecnológico</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {[
                            { label: "Frontend", val: "Next.js 15", icon: Globe, color: "text-blue-400" },
                            { label: "Backend", val: "Supabase DB", icon: Server, color: "text-purple-400" },
                            { label: "Auth", val: "Supabase Auth", icon: ShieldCheck, color: "text-emerald-400" },
                            { label: "Intelligence", val: "Gemini 2.5", icon: Cpu, color: "text-amber-400" },
                            { label: "Hosting", val: "Vercel", icon: Globe, color: "text-white" },
                            { label: "Domain/DNS", val: "Cloudflare", icon: ShieldCheck, color: "text-orange-400" },
                            { label: "Email (Admin)", val: "Zoho Mail", icon: MessageSquare, color: "text-blue-500" },
                            { label: "Email (Trans)", val: "Resend", icon: MessageSquare, color: "text-slate-200" },
                        ].map((item, i) => (
                            <Card key={i} className="p-4 bg-slate-900/50 border-slate-800 text-center hover:border-slate-700 transition-colors">
                                <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider leading-none mb-1">{item.label}</p>
                                <p className="text-[11px] font-bold text-white leading-tight">{item.val}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 2. Folder Structure */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <FolderTree className="w-6 h-6 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">Estructura de Carpetas</h3>
                    </div>
                    <Card className="p-6 bg-slate-900/50 border-slate-800 font-mono text-sm overflow-x-auto">
                        <div className="space-y-1 text-slate-300">
                            <p className="text-blue-400">/app <span className="text-slate-500 font-sans italic text-xs ml-2">// Next.js App Router (Páginas y API routes)</span></p>
                            <p className="ml-4">/admin <span className="text-slate-500 font-sans italic text-xs ml-2">// Backend Administrativo</span></p>
                            <p className="ml-4">/dashboard <span className="text-slate-500 font-sans italic text-xs ml-2">// Panel de Usuario B2C</span></p>
                            <p className="text-blue-400">/components <span className="text-slate-500 font-sans italic text-xs ml-2">// UI Components (Atomic Design)</span></p>
                            <p className="ml-4">/ui <span className="text-slate-500 font-sans italic text-xs ml-2">// Shadcn/ui & primitives</span></p>
                            <p className="ml-4">/features <span className="text-slate-500 font-sans italic text-xs ml-2">// Componentes con lógica de dominio (Tarot, Astral, etc.)</span></p>
                            <p className="text-blue-400">/lib <span className="text-slate-500 font-sans italic text-xs ml-2">// Core Utilities & API Clients</span></p>
                            <p className="ml-4 text-emerald-400">/supabase <span className="text-slate-500 font-sans italic text-xs ml-2">// Cliente Supabase y Server actions</span></p>
                            <p className="text-blue-400">/supabase <span className="text-slate-500 font-sans italic text-xs ml-2">// Infraestructura DB (Migrations & Seed)</span></p>
                            <p className="text-blue-400">/types <span className="text-slate-500 font-sans italic text-xs ml-2">// TypeScript Interfaces globales</span></p>
                        </div>
                    </Card>
                </section>

                {/* 3. Core Data Model */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="w-6 h-6 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">Modelo de Datos (Supabase)</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-5 bg-slate-900/50 border-slate-800">
                            <h4 className="text-sm font-bold text-purple-400 uppercase mb-4">Tablas Principales</h4>
                            <ul className="space-y-3">
                                <li className="flex justify-between items-center text-sm">
                                    <span className="text-slate-200">profiles</span>
                                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">UserData + Astro</Badge>
                                </li>
                                <li className="flex justify-between items-center text-sm">
                                    <span className="text-slate-200">lecturas</span>
                                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">Tarot Logs + JSON</Badge>
                                </li>
                                <li className="flex justify-between items-center text-sm">
                                    <span className="text-slate-200">credits</span>
                                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">Wallet / Ledger</Badge>
                                </li>
                                <li className="flex justify-between items-center text-sm">
                                    <span className="text-slate-200">missions</span>
                                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">Gamification Context</Badge>
                                </li>
                            </ul>
                        </Card>
                        <Card className="p-5 bg-slate-900/50 border-slate-800">
                            <h4 className="text-sm font-bold text-emerald-400 uppercase mb-4">Relaciones Clave</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                El sistema utiliza el UUID de <strong>Auth.Users</strong> como Primary Key foránea en todas las tablas principales,
                                garantizando una integridad referencial absoluta mediante Row Level Security (RLS).
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-emerald-500 font-bold">RLS: auth.uid() = user_id</span>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* 4. Reading Lifecycle Flow */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Network className="w-6 h-6 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">Ciclo de Vida de Lectura (Flux)</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { step: "01. Pre-Processing", desc: "Se extraen los datos del perfil (Astro + Numerología) y el historial previo para generar el contexto vectorial.", color: "border-purple-500/30" },
                            { step: "02. Archtype Mapping", desc: "La entrada del usuario y el mazo de tarot se mapean. Se eligen las variables aleatorias (cartas) controladas por el backend.", color: "border-indigo-500/30" },
                            { step: "03. AI Inference", desc: "Prompt Engineering dinámico enviado a Gemini 2.5 para generar una respuesta en formato JSON estructurado.", color: "border-blue-500/30" },
                            { step: "04. Post-Processing", desc: "Validación del JSON, actualización de créditos, registro de la lectura y triggers de gamificación.", color: "border-emerald-500/30" },
                        ].map((item, i) => (
                            <div key={i} className={`p-4 bg-slate-900/40 border-l-4 ${item.color} rounded-r-lg`}>
                                <h4 className="font-bold text-white text-sm mb-1">{item.step}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Dependencies */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Box className="w-6 h-6 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">Dependencias Core</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { name: "@google/generative-ai", desc: "SDK principal para comunicación fluida con Gemini 2.5." },
                            { name: "@supabase/supabase-js", desc: "Cliente para gestión de datos,Auth y Realtime." },
                            { name: "framer-motion", desc: "Motor de animaciones para la experiencia premium (Místico/Fluido)." },
                            { name: "lucide-react", desc: "Set de iconos vectoriales para toda la interfaz." },
                            { name: "class-variance-authority", desc: "Gestión sistemática de variantes CSS para componentes UI." },
                            { name: "tailwind-merge", desc: "Utilidad crítica para extender y sobreescribir estilos dinámicos." },
                        ].map((dep, i) => (
                            <Card key={i} className="p-4 bg-slate-900 border-slate-800">
                                <h4 className="text-[11px] font-mono text-blue-400 mb-1">{dep.name}</h4>
                                <p className="text-[10px] text-slate-500 leading-snug">{dep.desc}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 6. Security Protocol */}
                <section className="pb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-6 h-6 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">Protocolo de Seguridad</h3>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 rounded-2xl p-8 space-y-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-white font-bold text-sm mb-2">Autenticación</h4>
                                <p className="text-xs text-slate-500">JWT (JSON Web Tokens) gestionados por Supabase Auth con expiración de sesión controlada.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-2">Data Privacy</h4>
                                <p className="text-xs text-slate-500">RLS (Row Level Security) nivel PostgreSQL. Los datos nunca "viajan" a otros usuarios en la misma consulta.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-2">Admin Access</h4>
                                <p className="text-xs text-slate-500">Middleware de Next.js que valida el rol del usuario en la tabla de perfiles antes de exponer la ruta /admin.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
