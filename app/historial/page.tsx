import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, ScrollText, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/landing/AnimatedSection";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";

export default async function HistoryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: lecturas } = await supabase
        .from('lecturas')
        .select('*')
        .order('created_at', { ascending: false });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">

            {/* Fondo animado */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/15 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-indigo-900/15 rounded-full blur-[80px] animate-float-delayed" />
            </div>

            <main className="max-w-5xl mx-auto p-6 relative z-10">

                {/* HEADER */}
                <AnimatedSection>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 border-b border-white/10 pb-8 mt-4 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-600/20 rounded-xl">
                                    <BookOpen className="w-6 h-6 text-purple-400" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
                                    Diario del <span className="text-gradient-purple">Alma</span>
                                </h1>
                            </div>
                            <p className="text-slate-400">Tu registro akásico de evolución personal.</p>
                        </div>

                        <Link href="/lectura">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/30 px-6 py-5 rounded-xl font-medium group">
                                Nueva Consulta
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </AnimatedSection>

                {/* LISTA DE LECTURAS */}
                {(!lecturas || lecturas.length === 0) ? (
                    <AnimatedSection>
                        <div className="text-center py-24 glass rounded-3xl">
                            <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                            <h3 className="text-2xl text-slate-300 font-serif mb-3">Tu diario está esperando</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Aún no has realizado ninguna consulta al oráculo. Comienza tu viaje de autodescubrimiento.</p>
                            <Link href="/lectura">
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-5 rounded-xl">
                                    Iniciar primera lectura
                                </Button>
                            </Link>
                        </div>
                    </AnimatedSection>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {lecturas.map((item, index) => (
                            <AnimatedSection key={item.id} delay={index * 0.1}>
                                <GlowingBorderCard>
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white font-serif tracking-wide">{item.card_name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(item.created_at)}
                                                </div>
                                            </div>
                                            <div className="p-2 bg-purple-900/30 rounded-xl">
                                                <Sparkles className="w-4 h-4 text-purple-400" />
                                            </div>
                                        </div>

                                        {/* Keywords */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {item.keywords?.map((k: string, i: number) => (
                                                <span key={i} className="text-[10px] uppercase tracking-wider bg-purple-950/50 text-purple-300 px-2 py-1 rounded-lg border border-purple-500/20">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-slate-300 line-clamp-3 mb-5 font-light leading-relaxed">
                                            "{item.description}"
                                        </p>

                                        {/* Mission */}
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[10px] text-purple-400 font-bold mb-2 uppercase flex items-center gap-1">
                                                ⚡ Misión Evolutiva
                                            </p>
                                            <p className="text-xs text-slate-400 italic bg-purple-900/20 p-3 rounded-lg border-l-2 border-purple-500/50">
                                                {item.action}
                                            </p>
                                        </div>
                                    </div>
                                </GlowingBorderCard>
                            </AnimatedSection>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}