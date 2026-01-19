import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MissionsPanel from "@/components/dashboard/MissionsPanel";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MissionsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">
            {/* Fondo animado */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-purple-900/15 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[10%] right-[10%] w-[20%] h-[20%] bg-indigo-900/15 rounded-full blur-[80px] animate-pulse delay-1000" />
            </div>

            <main className="max-w-4xl mx-auto p-6 relative z-10">
                <AnimatedSection>
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-400 hover:text-white p-2">
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif text-white flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                                Misiones y Recompensas
                            </h1>
                            <p className="text-slate-400 text-sm">Completa desafíos para ganar créditos y evolucionar.</p>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                    <MissionsPanel />
                </AnimatedSection>
            </main>
        </div>
    );
}
