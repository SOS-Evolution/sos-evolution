import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
//import AppNavbar from "@/components/AppNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, ScrollText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
    // 1. Verificación de Usuario y Conexión a DB
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 2. Obtener lecturas (Ordenadas por fecha descendente)
    const { data: lecturas } = await supabase
        .from('lecturas')
        .select('*')
        .order('created_at', { ascending: false });

    // Función auxiliar para formatear fecha (dentro del componente server)
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">

            <main className="max-w-4xl mx-auto p-6">

                {/* HEADER DE LA SECCIÓN */}
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6 mt-4">
                    <div>
                        <h1 className="text-3xl font-serif text-purple-300 tracking-widest flex items-center gap-3">
                            <ScrollText className="w-8 h-8" />
                            DIARIO DEL ALMA
                        </h1>
                        <p className="text-slate-400 mt-2">Tu registro akásico de evolución personal.</p>
                    </div>

                    {/* Botón para nueva lectura si el historial está vacío o lleno */}
                    <Link href="/lectura">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20">
                            Nueva Consulta <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* LISTA DE LECTURAS */}
                {(!lecturas || lecturas.length === 0) ? (
                    // ESTADO VACÍO
                    <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                        <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl text-slate-300 font-serif mb-2">Tu diario está esperando</h3>
                        <p className="text-slate-500 mb-6">Aún no has realizado ninguna consulta al oráculo.</p>
                        <Link href="/lectura">
                            <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-900/20">
                                Iniciar primera lectura
                            </Button>
                        </Link>
                    </div>
                ) : (
                    // GRID DE TARJETAS
                    <div className="grid gap-6 md:grid-cols-2">
                        {lecturas.map((item) => (
                            <Card key={item.id} className="bg-slate-900/60 border-purple-500/20 p-6 hover:bg-slate-900/90 transition-all hover:border-purple-500/40 group relative overflow-hidden flex flex-col">

                                {/* Decoración de fondo */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all pointer-events-none"></div>

                                {/* Encabezado Carta */}
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-white font-serif tracking-wide">{item.card_name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(item.created_at)}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-purple-900/20 rounded-full">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                    </div>
                                </div>

                                {/* Palabras Clave */}
                                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                                    {item.keywords?.map((k: string, i: number) => (
                                        <span key={i} className="text-[10px] uppercase tracking-wider bg-slate-800 text-purple-200 px-2 py-1 rounded border border-purple-500/10">
                                            {k}
                                        </span>
                                    ))}
                                </div>

                                {/* Descripción */}
                                <p className="text-sm text-slate-300 line-clamp-4 mb-6 font-light leading-relaxed flex-grow">
                                    "{item.description}"
                                </p>

                                {/* Footer Misión */}
                                <div className="pt-4 border-t border-white/5 relative z-10 mt-auto">
                                    <p className="text-[10px] text-purple-400 font-bold mb-1 uppercase flex items-center gap-1">
                                        ⚡ Misión Evolutiva
                                    </p>
                                    <p className="text-xs text-slate-400 italic bg-purple-900/10 p-2 rounded border-l-2 border-purple-500/50">
                                        {item.action}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}