"use client";

import { motion } from "framer-motion";
import { BookOpen, Lightbulb, TrendingUp, Layers, ArrowRight, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/landing/AnimatedSection";

const docSections = [
    {
        title: "Visión & Filosofía",
        description: "El alma del proyecto: Arquetipos, Viaje del Héroe y fundamentos teóricos.",
        href: "/admin/docs/vision",
        icon: BookOpen,
        color: "from-purple-500 to-indigo-500",
    },
    {
        title: "Arquitectura Técnica",
        description: "Stack tecnológico, modelos de datos, flujos de IA y estructura astrológica.",
        href: "/admin/docs/architecture",
        icon: Layers,
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "Contenido Base",
        description: "Definiciones semánticas de astrología, tarot y conocimiento del sistema.",
        href: "/admin/docs/content",
        icon: Star,
        color: "from-pink-500 to-rose-500",
    },
    {
        title: "Modelo de Negocio",
        description: "Estrategia de monetización, LTV, marketing y plan de crecimiento.",
        href: "/admin/docs/business",
        icon: TrendingUp,
        color: "from-emerald-500 to-teal-500",
    },
    {
        title: "Planificación del Sistema",
        description: "Gestión técnica de hitos, requerimientos y evolución del proyecto.",
        href: "/admin/docs/ideas",
        icon: Lightbulb,
        color: "from-amber-500 to-orange-500",
    },
];

export default function DocsPage() {
    return (
        <div className="space-y-12">
            <AnimatedSection>
                <div className="flex items-center gap-6">
                    <Link href="/admin">
                        <Button variant="ghost" className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass shrink-0">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Centro de Control</h2>
                        <h1 className="text-4xl font-serif text-white">Documentación del <span className="text-purple-400">Sistema</span></h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Base de conocimiento centralizada y evolutiva para SOS Evolution.
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {docSections.map((section, index) => (
                    <Link key={section.href} href={section.href}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all hover:bg-slate-800/50 group h-full flex flex-col cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} bg-opacity-10`}>
                                        <section.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                                    {section.description}
                                </p>

                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full w-0 group-hover:w-full transition-all duration-500 ease-out bg-gradient-to-r ${section.color}`} />
                                </div>
                            </Card>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
