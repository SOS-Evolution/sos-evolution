"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Star, Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/landing/AnimatedSection";

export default function BaseContentDocsPage() {
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
                        <h2 className="text-xs font-bold text-pink-400 uppercase tracking-[0.3em] mb-1">Conocimiento Central</h2>
                        <h1 className="text-4xl font-serif text-white">Contenido <span className="text-pink-400">Base</span></h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Definiciones semánticas y estructuras de conocimiento que alimentan la IA.
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            <div className="space-y-12">
                {/* 1. Estructura de Carta Natal (Sistema SOS Evolution) */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Compass className="w-6 h-6 text-pink-400" />
                        <h2 className="text-2xl font-bold text-white">Estructura de Carta Natal (Sistema SOS)</h2>
                    </div>

                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        Definición semántica de las 12 casas astrológicas. Estas definiciones son utilizadas por el motor de inferencia
                        para contextualizar los tránsitos y posiciones planetarias en relación con el desarrollo evolutivo del usuario.
                    </p>

                    <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/50">
                        <Table>
                            <TableHeader className="bg-slate-900">
                                <TableRow className="border-slate-800 hover:bg-slate-900">
                                    <TableHead className="text-pink-400 font-bold w-[80px]">Casa</TableHead>
                                    <TableHead className="text-slate-200 font-bold w-[150px]">Esencia</TableHead>
                                    <TableHead className="text-slate-400">Descripción Arquetípica</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { h: "I", e: "Identidad", d: "Tu “yo” visible: presencia, cuerpo, temperamento inmediato, cómo arrancas cosas y cómo te leen a primera vista. También describe tu estilo de acción y la manera instintiva de enfrentarte al mundo." },
                                    { h: "II", e: "Valor", d: "Recursos propios: dinero ganado, posesiones, talentos prácticos, seguridad material y autoestima (lo que valoras y lo que crees que vales). Habla de tu relación con el confort y la estabilidad." },
                                    { h: "III", e: "Mente", d: "Comunicación cotidiana: cómo piensas, aprendes y conectas; estudios básicos, escritura, conversaciones, redes cercanas. Incluye hermanos, vecinos, entorno próximo y viajes cortos." },
                                    { h: "IV", e: "Raíces", d: "Hogar y base emocional: familia, crianza, pertenencia, intimidad, vida privada. También muestra qué necesitas para sentirte “en casa” y cómo construyes tu refugio." },
                                    { h: "V", e: "Expresión", d: "Creatividad y disfrute: juego, placer, romance, hobbies, escenarios donde “brillas”. Se asocia a hijos/proyectos-creación y a la forma en que expresas tu individualidad con espontaneidad." },
                                    { h: "VI", e: "Rutina", d: "Vida diaria: hábitos, orden, salud, cuerpo en modo mantenimiento, trabajo cotidiano y servicio. Habla de cómo mejoras habilidades, cómo sostienes sistemas y cómo te organizas para funcionar." },
                                    { h: "VII", e: "Vínculo", d: "Relaciones uno a uno: pareja, socios, acuerdos, cooperación y negociación. También señala patrones de “el otro” (lo que buscas, lo que toleras y lo que aprendes a través del espejo relacional)." },
                                    { h: "VIII", e: "Transformación", d: "Fusión y profundidad: intimidad, sexualidad, confianza, crisis que cambian, duelos y renacimientos. Incluye recursos compartidos (deudas, herencias, inversiones) y dinámicas de poder/control." },
                                    { h: "IX", e: "Expansión", d: "Sentido y horizonte: filosofía, creencias, fe, ética, visión de vida. Se relaciona con estudios superiores, viajes largos y todo lo que amplía tu marco mental y cultural." },
                                    { h: "X", e: "Vocación", d: "Rol público: carrera, metas, reputación, logros, dirección de vida. Muestra cómo quieres “ser alguien” hacia afuera, tu relación con autoridad/responsabilidad y el tipo de legado profesional." },
                                    { h: "XI", e: "Comunidad", d: "Redes y futuro: amistades, grupos, comunidades, causas, colaboración. Habla de proyectos a largo plazo, innovación, aspiraciones y el lugar que ocupas en lo colectivo." },
                                    { h: "XII", e: "Inconsciente", d: "Lo invisible: mundo interno, retiro, espiritualidad, sueños, patrones inconscientes y cierres de ciclo. También cubre lo que haces “tras bambalinas”, procesos de sanación y necesidades de descanso/aislamiento." },
                                ].map((row) => (
                                    <TableRow key={row.h} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <TableCell className="font-bold text-slate-300 font-serif text-lg">{row.h}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-pink-300 border-pink-500/30 bg-pink-900/10">
                                                {row.e}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm leading-relaxed">{row.d}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>

                {/* 2. Próximas Adiciones */}
                <Card className="p-6 bg-slate-900 shadow-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-12 h-12 text-slate-700 mb-4" />
                    <h3 className="text-lg font-bold text-slate-300 mb-2">Más contenido próximamente</h3>
                    <p className="text-sm text-slate-500 max-w-md">
                        En esta sección se documentarán las estructuras de los mazos de Tarot, correspondencias de colores y simbología base del sistema.
                    </p>
                </Card>
            </div>
        </div>
    );
}
