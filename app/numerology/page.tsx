import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { ArrowLeft, Hash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NumerologyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">
            <main className="max-w-4xl mx-auto p-6 relative z-10">
                <AnimatedSection>
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-400 hover:text-white p-2">
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-serif text-white">Numerología Álmica</h1>
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                    <div className="glass p-12 text-center rounded-3xl">
                        <Hash className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif text-slate-200 mb-2">Próximamente</h2>
                        <p className="text-slate-400">Los números sagrados están calculando tu destino.</p>
                    </div>
                </AnimatedSection>
            </main>
        </div>
    );
}
