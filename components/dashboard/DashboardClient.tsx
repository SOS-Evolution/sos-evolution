"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import {
    Trophy,
    Sparkles,
    LogOut,
    Check,
    X,
    Shield,
    Star,
    BookOpen,
    Clock,
    Settings,
    User,
    Compass,
    History,
    HelpCircle,
    Palette,
    Sparkle,
    LayoutDashboard,
    ChevronRight,
    Hash,
    Layers,
    ArrowRight,
    Lock,
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { unlockFeature } from "@/app/[locale]/dashboard/actions";
import { getReadingTypes } from "@/app/admin/settings/actions";
import { Card } from "@/components/ui/card";
import UserProfile from "@/components/dashboard/UserProfile";
import AnimatedSection from "@/components/landing/AnimatedSection";
import CreditsDisplay from "@/components/dashboard/CreditsDisplay";
import CardStats from "@/components/dashboard/CardStats";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import { useTranslations } from 'next-intl';
import { getLifePathNumber, getZodiacSign, getNumerologyDetails } from "@/lib/soul-math";
import InsufficientAuraModal from "@/components/dashboard/InsufficientAuraModal";
import DailyHoroscopeCard from "@/components/astrology/DailyHoroscopeCard";

interface DashboardClientProps {
    profile: any;
    stats: any;
    user: any;
}

import TransactionModal from "@/components/dashboard/TransactionModal";

import { useRouter } from "next/navigation";

export default function DashboardClient({ profile: initialProfile, stats, user }: DashboardClientProps) {
    const t = useTranslations('Dashboard');
    const tz = useTranslations('Zodiac');
    const tn = useTranslations('Numerology');
    const router = useRouter();
    const [profile, setProfile] = useState(initialProfile);
    const [isEditingManual, setIsEditingManual] = useState(false);
    const [readingCosts, setReadingCosts] = useState<{ [key: string]: number }>({});
    const [balance, setBalance] = useState<number>(0);
    const [insufficientAuraModalOpen, setInsufficientAuraModalOpen] = useState(false);
    const [neededAmount, setNeededAmount] = useState(50);

    useEffect(() => {
        async function loadCosts() {
            try {
                const costs = await getReadingTypes();
                const costMap = costs.reduce((acc: any, curr: any) => {
                    acc[curr.code] = curr.credit_cost;
                    return acc;
                }, {});
                setReadingCosts(costMap);
            } catch (err) {
                console.error("Error loading costs:", err);
            }
        }
        loadCosts();

        // Fetch initial balance
        fetch('/api/credits')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data.balance === 'number') {
                    setBalance(data.balance);
                }
            })
            .catch(err => console.error("Error fetching credits:", err));

        // Sync balance updates
        const handleUpdate = (e: any) => {
            if (e.detail?.newBalance !== undefined) {
                setBalance(e.detail.newBalance);
            }
        };
        window.addEventListener('credits-updated', handleUpdate);
        return () => window.removeEventListener('credits-updated', handleUpdate);
    }, []);

    // Transaction Modal State
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [transactionLoading, setTransactionLoading] = useState(false);

    const unlockedFeatures = profile?.unlocked_features || [];

    // Verificamos si el perfil está completo
    const isComplete = profile?.full_name && profile?.birth_date && profile?.gender;

    // Mostrar modal si no está completo O si el usuario hizo clic en editar
    const showModal = !isComplete || isEditingManual;

    // Cálculos Astrológicos dinámicos
    let zodiacSign = "---";
    let lifePathNum = 0;
    let lifePathWord = "---";

    if (profile?.birth_date) {
        const [y, m, d] = profile.birth_date.split('-').map(Number);
        zodiacSign = getZodiacSign(d, m);
        lifePathNum = getLifePathNumber(profile.birth_date);
        if (lifePathNum > 0) {
            lifePathWord = tn(`${lifePathNum}.powerWord`);
        }
    }

    // ABRIR MODAL DE CONFIRMACIÓN
    const handleUnlockClick = (feature: string) => {
        setSelectedFeature(feature);
        setTransactionModalOpen(true);
    };

    // EJECUTAR DESBLOQUEO (CONFIRMADO)
    const handleConfirmUnlock = async () => {
        if (!selectedFeature) return;

        setTransactionLoading(true);
        try {
            const result = await unlockFeature(selectedFeature);
            if (result.success) {
                toast.success(t('transaction.success', {
                    feature: selectedFeature === 'astrology' ? t('astrology.title') : t('numerology.title')
                }));
                setProfile((prev: any) => ({
                    ...prev,
                    unlocked_features: [...(prev.unlocked_features || []), selectedFeature]
                }));
                // Dispatch event to update CreditsDisplay
                window.dispatchEvent(new CustomEvent('credits-updated', {
                    detail: { newBalance: result.newBalance }
                }));
                setTransactionModalOpen(false);
            } else {
                if (result.error && result.error.includes("Insufficient credits")) {
                    setNeededAmount(readingCosts[`unlock_${selectedFeature}`] ?? 50);
                    setInsufficientAuraModalOpen(true);
                    setTransactionModalOpen(false);
                } else {
                    toast.error(result.error || "Error");
                }
            }
        } catch (err) {
            toast.error("Error al procesar el pago");
        } finally {
            setTransactionLoading(false);
        }
    };

    const FeatureCard = ({ feature, href, color, icon, title, description, badge }: any) => {
        const isUnlocked = unlockedFeatures.includes(feature);

        // Ya no usamos el estado local 'unlocking' para el loader del botón de la tarjeta
        // porque el loader ahora está en el modal.

        const content = (
            <GlowingBorderCard className="h-full overflow-hidden relative group" glowColor={color}>
                {/* Contenido Principal (Ahora siempre visible para mostrar el "sample") */}
                <div className={`flex h-full min-h-[140px] transition-all duration-300 ${!isUnlocked ? 'opacity-80' : ''}`}>
                    {/* Sector Izquierdo: Icono */}
                    <div className={`w-1/3 bg-${color}-500/10 border-r border-${color}-500/20 flex items-center justify-center group-hover:bg-${color}-500/20 transition-colors relative`}>
                        <div className={`absolute inset-0 bg-${color}-500/5 group-hover:bg-${color}-500/10 blur-xl transition-colors`} />
                        {icon}
                    </div>

                    {/* Sector Derecho: Contenido */}
                    <div className="flex-1 p-6 pr-10 pt-4 pb-8 flex flex-col justify-start relative">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400/50 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all duration-300">
                            {isUnlocked ? (
                                <ChevronRight className="w-8 h-8" strokeWidth={2.5} />
                            ) : (
                                <Lock className="w-5 h-5 text-slate-500" strokeWidth={2} />
                            )}
                        </div>
                        <h3 className={`text-xs font-bold text-${color}-300 uppercase tracking-widest mb-1.5 flex items-center gap-2`}>
                            {title}
                        </h3>
                        <div className="text-xl font-serif font-bold text-white group-hover:text-indigo-200 transition-colors truncate">
                            {badge}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Overlay de Sombra y Botón de Desbloqueo */}
                {!isUnlocked && (
                    <>
                        <div className="absolute inset-0 bg-slate-950/10 pointer-events-none z-10" />
                        <div className="absolute bottom-3 right-3 z-20 flex items-center justify-end">
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleUnlockClick(feature);
                                }}
                                variant="secondary"
                                className="bg-purple-600 hover:bg-purple-500 text-white border-none shadow-2xl h-8 px-3 font-bold rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <Sparkle className="w-3 h-3" />
                                <span className="text-[10px] uppercase tracking-wider">{t('unlock_button')}</span>
                                <span className="text-[9px] opacity-70 bg-black/20 px-1 py-0.5 rounded ml-1 font-mono">
                                    {readingCosts[`unlock_${feature}`] ?? 50} AURA
                                </span>
                            </Button>
                        </div>
                    </>
                )}
            </GlowingBorderCard>
        );

        if (isUnlocked) {
            return <Link href={href} className="block group h-full">{content}</Link>;
        }
        return (
            <div
                className="block h-full cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]"
                onClick={() => handleUnlockClick(feature)}
            >
                {content}
            </div>
        );
    };

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">
            {/* Overlay de Bloqueo si no está completo */}
            {!isComplete && (
                <div className="fixed inset-0 z-[90] bg-slate-950/40 backdrop-blur-[2px]" />
            )}

            {showModal && (
                <OnboardingModal
                    initialData={profile}
                    isEdit={isEditingManual}
                    astrologyUnlockCost={readingCosts['unlock_astrology'] ?? 50}
                    onComplete={(updatedProfile) => {
                        setProfile(updatedProfile);
                        setIsEditingManual(false);
                        // Force hard reload to clear all caches (server + client + interpretations)
                        // location.reload() ensures browser doesn't serve cached pages
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }}
                    onClose={isComplete ? () => setIsEditingManual(false) : undefined}
                />
            )}

            {/* MODAL DE TRANSACCIÓN */}
            <TransactionModal
                isOpen={transactionModalOpen}
                onClose={() => setTransactionModalOpen(false)}
                onConfirm={handleConfirmUnlock}
                title={t('transaction.title')}
                description={t('transaction.description', {
                    feature: selectedFeature === 'astrology' ? t('astrology.title') : t('numerology.title')
                })}
                cost={50}
                loading={transactionLoading}
                confirmText={t('transaction.confirm')}
                cancelText={t('transaction.cancel')}
            />

            <InsufficientAuraModal
                isOpen={insufficientAuraModalOpen}
                onClose={() => setInsufficientAuraModalOpen(false)}
                requiredAmount={neededAmount}
                currentBalance={balance}
            />

            {/* Fondo animado */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] bg-indigo-900/10 rounded-full blur-[80px] animate-pulse delay-1000" />
            </div>

            <main className="max-w-6xl mx-auto p-6 relative z-10 space-y-4">

                {/* FILA 1: NUEVA DISTRIBUCIÓN */}
                <AnimatedSection delay={0.1}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* COLUMNA IZQUIERDA (2/3): Saldo + Misiones + Identidad */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CreditsDisplay />

                                <Link href="/missions" className="block group h-full">
                                    <Card className="h-full bg-gradient-to-br from-amber-950/80 to-slate-900 border-yellow-500/20 p-4 relative overflow-hidden group transition-all hover:border-yellow-500/40">
                                        <div className="absolute top-1/2 -translate-y-1/2 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110 group-hover:rotate-12 duration-500">
                                            <Trophy className="w-16 h-16 text-yellow-500" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-1 text-yellow-500/80">
                                                <Trophy className="w-3.5 h-3.5" />
                                                <span className="text-[10px] uppercase tracking-wider font-bold">{t('rewards')}</span>
                                            </div>

                                            <div className="text-3xl font-serif font-bold text-white group-hover:text-yellow-101 transition-colors">
                                                {t('missions')}
                                            </div>

                                            <div className="mt-4 flex items-center gap-1.5 text-yellow-500/60 group-hover:text-yellow-500/80 transition-colors">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                <span className="text-[10px] uppercase tracking-wider font-bold">{t('gain_aura')}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                            <UserProfile
                                user={user}
                                profile={profile}
                                onEdit={() => setIsEditingManual(true)}
                                className="flex-1"
                            />
                        </div>

                        {/* COLUMNA DERECHA (1/3): Afinididad de Arcano (Altura Completa) */}
                        <div className="lg:col-span-1">
                            <CardStats stats={stats} className="h-full" />
                        </div>

                    </div>
                </AnimatedSection>

                {/* SECCIÓN: HORÓSCOPO DIARIO */}
                <AnimatedSection delay={0.2}>
                    <DailyHoroscopeCard />
                </AnimatedSection>

                {/* SECCIÓN: PANEL DE CONTROL */}
                <div className="flex flex-col">
                    <AnimatedSection delay={0.25}>
                        <div className="flex items-center gap-4 py-2 opacity-80">
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1" />
                            <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">{t('control_panel')}</span>
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1" />
                        </div>
                    </AnimatedSection>

                    <div className="space-y-6 mt-2">
                        {/* FILA 2: ASTRO + NUMEROLOGIA */}
                        <AnimatedSection delay={0.3}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ASTROLOGÍA */}
                                <FeatureCard
                                    feature="astrology"
                                    href="/astrology"
                                    color="purple"
                                    title={t('astrology.title')}
                                    badge={zodiacSign !== "---" ? tz(zodiacSign) : t('astrology.unknown')}
                                    description={zodiacSign !== "---" ? t('astrology.essence') : t('astrology.setup')}
                                    icon={zodiacSign !== "---" ? (
                                        <span className="text-5xl md:text-6xl text-indigo-400 font-serif relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 select-none">
                                            {{
                                                "Aries": "♈", "Tauro": "♉", "Géminis": "♊", "Cáncer": "♋",
                                                "Leo": "♌", "Virgo": "♍", "Libra": "♎", "Escorpio": "♏",
                                                "Sagitario": "♐", "Capricornio": "♑", "Acuario": "♒", "Piscis": "♓"
                                            }[zodiacSign] || <Star className="w-10 h-10" />}
                                        </span>
                                    ) : (
                                        <Star className="w-10 h-10 text-indigo-400 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                                    )}
                                />

                                {/* NUMEROLOGÍA */}
                                <FeatureCard
                                    feature="numerology"
                                    href="/numerology"
                                    color="pink"
                                    title={t('numerology.title')}
                                    badge={lifePathNum > 0 ? t('numerology.path', { count: lifePathNum }) : t('numerology.calculate')}
                                    description={lifePathNum > 0 ? lifePathWord : t('numerology.discovery')}
                                    icon={lifePathNum > 0 ? (
                                        <span className="text-5xl md:text-6xl font-bold text-pink-400 relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 select-none font-serif">
                                            {lifePathNum}
                                        </span>
                                    ) : (
                                        <Hash className="w-10 h-10 text-pink-400 relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500" />
                                    )}
                                />
                            </div>
                        </AnimatedSection>

                        {/* FILA 3: LECTURA y DIARIO */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <AnimatedSection delay={0.4}>
                                <GlowingBorderCard className="h-full" glowColor="purple">
                                    <div className="p-8 flex flex-col h-full min-h-[220px]">
                                        <div className="flex-grow mb-6">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/30">
                                                    <Layers className="w-6 h-6 text-white" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-white">{t('tarot.title')}</h2>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed pl-[4rem]">
                                                {t('tarot.desc')}
                                            </p>
                                        </div>
                                        <div className="mt-auto">
                                            <Link href="/tarot" className="block w-full">
                                                <Button className="w-full bg-white text-purple-950 hover:bg-purple-50 font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] group">
                                                    {t('tarot.button')}
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </GlowingBorderCard>
                            </AnimatedSection>

                            <AnimatedSection delay={0.5}>
                                <GlowingBorderCard className="h-full" glowColor="cyan">
                                    <div className="p-8 flex flex-col h-full min-h-[220px]">
                                        <div className="flex-grow mb-6">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center border border-slate-600">
                                                    <BookOpen className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-white">{t('journal.title')}</h2>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed pl-[4rem]">
                                                {t('journal.desc')}
                                            </p>
                                        </div>
                                        <div className="mt-auto">
                                            <Link href="/historial" className="block w-full">
                                                <Button className="w-full bg-slate-800 text-white hover:bg-slate-700 font-bold py-4 rounded-xl shadow-lg border border-slate-600 transition-all hover:scale-[1.02] group">
                                                    {t('journal.button')}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </GlowingBorderCard>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
