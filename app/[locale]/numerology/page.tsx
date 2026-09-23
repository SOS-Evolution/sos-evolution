import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { ArrowLeft, Hash, Calendar, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import NumerologyResult from "@/components/numerology/NumerologyResult";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function NumerologyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations("NumerologyPage");
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        redirect({ href: "/login", locale });
        return null;
    }

    // Fetch profile data on server to avoid client-side delay
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, birth_date")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">
            {/* Background elements unique to Numerology */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-amber-500/10 rounded-full blur-[130px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[55%] bg-purple-600/15 rounded-full blur-[120px] animate-float" />
                <div className="absolute top-[40%] right-[10%] w-[25%] h-[35%] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
                {/* Header Section */}
                <AnimatedSection>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass hover:bg-white/10"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </Button>
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        {t("title")}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                                    {t.rich("map_vibrational", {
                                        name: profile?.full_name || "Ti",
                                        span: (chunks) => <span className="text-amber-400">{chunks}</span>
                                    })}
                                </h1>
                                <p className="text-slate-400 text-xs sm:text-sm flex items-center gap-2 mt-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{profile?.birth_date || "Fecha no registrada"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Main Component */}
                <NumerologyResult initialProfile={profile} />

                {/* Info Footer */}
                <AnimatedSection delay={0.6}>
                    <div className="mt-16 text-center max-w-2xl mx-auto border-t border-white/5 pt-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-amber-400">
                            <Hash className="w-6 h-6" />
                        </div>
                        <h3 className="text-slate-200 font-serif text-xl mb-3">{t("about_title")}</h3>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                            {t("about_desc")}
                        </p>
                    </div>
                </AnimatedSection>
            </main>
        </div>
    );
}
