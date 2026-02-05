import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { ArrowLeft, Hash, Sparkles, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import NumerologyResult from "@/components/numerology/NumerologyResult";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function NumerologyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('NumerologyPage');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile data on server to avoid client-side delay
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, birth_date")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative">
            {/* Background elements unique to Numerology */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px] animate-float" />
            </div>

            <main className="max-w-6xl mx-auto p-6 relative z-10">
                {/* Header Section */}
                <AnimatedSection>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass">
                                    <ArrowLeft className="w-6 h-6" />
                                </Button>
                            </Link>
                            <div>
                                <h2 className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-1">{t('title')}</h2>
                                <h1 className="text-3xl font-serif text-white">
                                    {t.rich('map_vibrational', {
                                        name: profile?.full_name || "Ti",
                                        span: (chunks) => <span className="text-purple-400">{chunks}</span>
                                    })}
                                </h1>
                                <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {profile?.birth_date || "---"}
                                </p>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Main Component */}
                <NumerologyResult initialProfile={profile} />

                {/* Info Footer */}
                <AnimatedSection delay={0.8}>
                    <div className="mt-20 text-center max-w-2xl mx-auto border-t border-white/5 pt-12">
                        <Hash className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-slate-300 font-serif text-xl mb-4">{t('about_title')}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {t('about_desc')}
                        </p>
                    </div>
                </AnimatedSection>
            </main>
        </div>
    );
}
