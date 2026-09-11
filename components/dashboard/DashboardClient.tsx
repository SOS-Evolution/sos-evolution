"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { unlockFeature } from "@/app/[locale]/dashboard/actions";
import { getReadingTypes } from "@/app/admin/settings/actions";
import CelestialHero from "@/components/dashboard/CelestialHero";
import CosmicEnergyBar from "@/components/dashboard/CosmicEnergyBar";
import RitualPortals from "@/components/dashboard/RitualPortals";
import DailyHoroscopeCard from "@/components/astrology/DailyHoroscopeCard";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import TransactionModal from "@/components/dashboard/TransactionModal";
import InsufficientAuraModal from "@/components/dashboard/InsufficientAuraModal";
import RewardPopup from "@/components/dashboard/RewardPopup";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { useTranslations } from "next-intl";
import { getLifePathNumber, getZodiacSign } from "@/lib/soul-math";
import type { Profile, CardStat, ReadingType } from "@/types";
import type { User } from "@supabase/supabase-js";
import { Sun } from "lucide-react";

interface DashboardClientProps {
    profile: Profile | null;
    stats: CardStat | null;
    user: User | null;
}

export default function DashboardClient({
    profile: initialProfile,
    stats,
    user
}: DashboardClientProps) {
    const t = useTranslations("Dashboard");
    const [profile, setProfile] = useState(initialProfile);
    const [isEditingManual, setIsEditingManual] = useState(false);
    const [readingCosts, setReadingCosts] = useState<{ [key: string]: number }>({});
    const [balance, setBalance] = useState<number | null>(null);
    const [insufficientAuraModalOpen, setInsufficientAuraModalOpen] = useState(false);
    const [neededAmount, setNeededAmount] = useState(50);

    // Reward Popup State
    const [rewardPopup, setRewardPopup] = useState({
        isOpen: false,
        title: "",
        description: "",
        credits: 0,
        icon: "🎉"
    });

    useEffect(() => {
        async function loadCosts() {
            try {
                const costs = await getReadingTypes();
                const costMap = costs.reduce((acc: Record<string, number>, curr: ReadingType) => {
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
        fetch("/api/credits")
            .then((res) => res.json())
            .then((data) => {
                if (data && typeof data.balance === "number") {
                    setBalance(data.balance);
                }
            })
            .catch((err) => console.error("Error fetching credits:", err));

        // Check for Daily Rewards (only if profile is complete)
        const profileComplete =
            initialProfile?.full_name &&
            initialProfile?.birth_date &&
            initialProfile?.gender;
        const todayStr = new Date().toISOString().split("T")[0];
        const dailyCheckKey = `daily_reward_checked_${todayStr}`;
        const alreadyChecked =
            typeof window !== "undefined"
                ? localStorage.getItem(dailyCheckKey)
                : null;

        if (profileComplete && !alreadyChecked) {
            localStorage.setItem(dailyCheckKey, "true");

            fetch("/api/missions/daily", { method: "POST" })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.rewarded) {
                        fetch("/api/credits")
                            .then((r) => r.json())
                            .then((creditData) => {
                                if (
                                    creditData &&
                                    typeof creditData.balance === "number"
                                ) {
                                    setBalance(creditData.balance);
                                    window.dispatchEvent(
                                        new CustomEvent("credits-updated", {
                                            detail: {
                                                newBalance: creditData.balance
                                            }
                                        })
                                    );
                                }
                            });

                        setRewardPopup({
                            isOpen: true,
                            title: data.is_milestone
                                ? "¡Racha de 3 Días!"
                                : "Recompensa Diaria",
                            description: data.is_milestone
                                ? "Tu constancia ha sido recompensada por el cosmos."
                                : "Gracias por volver a conectar con tu esencia hoy.",
                            credits: data.credits,
                            icon: data.is_milestone ? "🔥" : "✨"
                        });
                    }
                })
                .catch((err) => {
                    localStorage.removeItem(dailyCheckKey);
                    console.error("Error checking daily reward:", err);
                });
        }

        // Global event listener for rewards
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleReward = (e: any) => {
            if (e.detail) {
                setRewardPopup({
                    isOpen: true,
                    title: e.detail.title || "¡Misión Completada!",
                    description:
                        e.detail.description ||
                        "Has desbloqueado un nuevo logro en tu camino.",
                    credits: e.detail.credits || 0,
                    icon: e.detail.icon || "🎯"
                });
                if (e.detail.newBalance) {
                    setBalance(e.detail.newBalance);
                } else if (e.detail.credits) {
                    setBalance((prev) => (prev ?? 0) + e.detail.credits);
                }
            }
        };
        window.addEventListener("mission-completed", handleReward);

        // Sync balance updates
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleUpdate = (e: any) => {
            if (e.detail?.newBalance !== undefined) {
                setBalance(e.detail.newBalance);
            }
        };
        window.addEventListener("credits-updated", handleUpdate);

        return () => {
            window.removeEventListener("credits-updated", handleUpdate);
            window.removeEventListener("mission-completed", handleReward);
        };
    }, [initialProfile]);

    // Transaction Modal State
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [transactionLoading, setTransactionLoading] = useState(false);

    const unlockedFeatures = profile?.unlocked_features || [];
    const isComplete = Boolean(
        profile?.full_name && profile?.birth_date && profile?.gender
    );
    const showModal = !isComplete || isEditingManual;

    // Calculations
    let zodiacSign = "---";
    let lifePathNum = 0;

    if (profile?.birth_date) {
        const [, m, d] = profile.birth_date.split("-").map(Number);
        zodiacSign = getZodiacSign(d, m);
        lifePathNum = getLifePathNumber(profile.birth_date);
    }

    const handleUnlockClick = (feature: string) => {
        setSelectedFeature(feature);
        setTransactionModalOpen(true);
    };

    const handleConfirmUnlock = async () => {
        if (!selectedFeature) return;

        setTransactionLoading(true);
        try {
            const result = await unlockFeature(selectedFeature);
            if (result.success) {
                toast.success(
                    t("transaction.success", {
                        feature:
                            selectedFeature === "astrology"
                                ? t("astrology.title")
                                : t("numerology.title")
                    })
                );
                setProfile((prev: Profile | null) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        unlocked_features: [
                            ...(prev.unlocked_features || []),
                            selectedFeature
                        ]
                    };
                });
                window.dispatchEvent(
                    new CustomEvent("credits-updated", {
                        detail: { newBalance: result.newBalance }
                    })
                );
                setTransactionModalOpen(false);
            } else {
                if (
                    result.error &&
                    result.error.includes("Insufficient credits")
                ) {
                    setNeededAmount(
                        readingCosts[`unlock_${selectedFeature}`] ?? 50
                    );
                    setInsufficientAuraModalOpen(true);
                    setTransactionModalOpen(false);
                } else {
                    toast.error(result.error || "Error");
                }
            }
        } catch {
            toast.error("Error al procesar el pago");
        } finally {
            setTransactionLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-slate-100 pb-24 relative overflow-hidden">
            {/* Background Celestial Mist and Orbs (Tarotoo style deep purple & gold) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute top-[30%] left-[-10%] w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[130px] animate-pulse delay-1000" />
                <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-indigo-900/15 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
            </div>

            {/* Overlay if profile is not completed */}
            {!isComplete && (
                <div className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-[3px]" />
            )}

            {/* Onboarding / Edit Profile Modal */}
            {showModal && (
                <OnboardingModal
                    initialData={profile}
                    isEdit={isEditingManual}
                    astrologyUnlockCost={readingCosts["unlock_astrology"] ?? 50}
                    onComplete={(updatedProfile) => {
                        setProfile(updatedProfile);
                        setIsEditingManual(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }}
                    onClose={
                        isComplete ? () => setIsEditingManual(false) : undefined
                    }
                />
            )}

            {/* Transaction Confirmation Modal */}
            <TransactionModal
                isOpen={transactionModalOpen}
                onClose={() => setTransactionModalOpen(false)}
                onConfirm={handleConfirmUnlock}
                title={t("transaction.title")}
                description={t("transaction.description", {
                    feature:
                        selectedFeature === "astrology"
                            ? t("astrology.title")
                            : t("numerology.title")
                })}
                cost={readingCosts[`unlock_${selectedFeature}`] ?? 50}
                loading={transactionLoading}
                confirmText={t("transaction.confirm")}
                cancelText={t("transaction.cancel")}
            />

            {/* Insufficient Aura Modal */}
            <InsufficientAuraModal
                isOpen={insufficientAuraModalOpen}
                onClose={() => setInsufficientAuraModalOpen(false)}
                requiredAmount={neededAmount}
                currentBalance={balance ?? 0}
            />

            {/* Daily Reward / Milestone Popup */}
            <RewardPopup
                isOpen={rewardPopup.isOpen}
                onClose={() =>
                    setRewardPopup((prev) => ({ ...prev, isOpen: false }))
                }
                title={rewardPopup.title}
                description={rewardPopup.description}
                credits={rewardPopup.credits}
                icon={rewardPopup.icon}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10 space-y-8">
                {/* 1. HERO CELESTIAL & COORDENADAS NATALES */}
                <AnimatedSection delay={0.1}>
                    <CelestialHero
                        profile={profile}
                        fullName={
                            profile?.full_name ||
                            user?.user_metadata?.full_name
                        }
                        onEditProfile={() => setIsEditingManual(true)}
                    />
                </AnimatedSection>

                {/* 2. BARRA DE ENERGÍA SAGRADA & ARCANO GUARDIÁN */}
                <AnimatedSection delay={0.2}>
                    <CosmicEnergyBar balance={balance} stats={stats} />
                </AnimatedSection>

                {/* 3. WIDGET DE HORÓSCOPO EVOLUTIVO DIARIO */}
                <AnimatedSection delay={0.25}>
                    <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-[#1c112e]/90 via-[#130b20]/95 to-[#1c112e]/90 p-5 md:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
                            <Sun className="w-4 h-4 text-amber-400" />
                            <span>Mensaje Evolutivo del Día</span>
                        </div>
                        <DailyHoroscopeCard />
                    </div>
                </AnimatedSection>

                {/* 4. LOS PORTALES DEL ORÁCULO & BÓVEDAS RITUALES */}
                <AnimatedSection delay={0.3}>
                    <RitualPortals
                        unlockedFeatures={unlockedFeatures}
                        readingCosts={readingCosts}
                        onUnlockClick={handleUnlockClick}
                        userZodiac={zodiacSign}
                        lifePathNum={lifePathNum}
                    />
                </AnimatedSection>
            </main>
        </div>
    );
}
