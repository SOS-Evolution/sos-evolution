"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Star, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import AuraActionButton from "@/components/ui/AuraActionButton";

interface DailyHoroscopeData {
    headline: string;
    message: string;
    power_action: string;
    lucky_color: string;
    lucky_number: number;
    creditsUsed?: number;
    newBalance?: number;
    alreadyExists?: boolean;
}

export default function DailyHoroscopeCard() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DailyHoroscopeData | null>(null);
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'es';
    const t = useTranslations('Dashboard.DailyHoroscope');

    // Check if we already have it in local state/cache or just let the user trigger it?
    // Let's load it automatically if it exists, or show a "Reveal" button.
    // For V1, we show a "Reveal My Daily Guide" button to be explicit about action/cost.

    useEffect(() => {
        const checkExisting = async () => {
            try {
                // Don't set loading true here to avoid flashing spinner if not found
                // Or maybe small loading state?
                const res = await fetch(`/api/astrology/daily?locale=${locale}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setData(data);
                    }
                }
            } catch (e) {
                console.error("Error fetching daily horoscope:", e);
            }
        };

        checkExisting();
    }, [locale]);

    const handleReveal = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/astrology/daily', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locale })
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 402) {
                    toast.error(t('insufficient_aura'), {
                        description: t('insufficient_aura_desc')
                    });
                    // Open credits modal (optional)
                    return;
                }
                throw new Error(result.error || t('error_desc'));
            }

            setData(result);
            if (result.creditsUsed && result.creditsUsed > 0) {
                toast.success(t('revealed'), {
                    description: t('revealed_desc', { cost: result.creditsUsed })
                });
                // TODO: Update global balance context if available
                router.refresh();
            } else if (result.alreadyExists) {
                toast.info(t('recovered'), {
                    description: t('recovered_desc')
                });
            }

        } catch (error: any) {
            toast.error(t('error_title'), {
                description: error.message || t('error_desc')
            });
        } finally {
            setLoading(false);
        }
    };

    if (data) {
        return (
            <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 pointer-events-none" />
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-serif text-purple-200 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-yellow-500" />
                        {t('title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
                        <h3 className="font-bold text-lg text-purple-100 mb-2">{data.headline}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{data.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                            <span className="text-xs text-blue-300 uppercase font-bold tracking-wider">{t('power_action')}</span>
                            <p className="text-sm text-blue-100 mt-1">{data.power_action}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-slate-800/50 p-2 rounded flex items-center justify-between">
                                <span className="text-xs text-gray-400">{t('color')}</span>
                                <span className="text-xs font-bold" style={{ color: data.lucky_color }}>{data.lucky_color}</span>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded flex items-center justify-between">
                                <span className="text-xs text-gray-400">{t('number')}</span>
                                <span className="text-xs font-bold text-white">{data.lucky_number}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-dashed border-purple-500/30 bg-black/20 text-white relative overflow-hidden group hover:border-purple-500/60 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse" />
                    <Sparkles className="w-10 h-10 text-purple-300 relative z-10" />
                </div>

                <div className="text-center space-y-1">
                    <h3 className="text-lg font-medium text-purple-100">{t('subtitle')}</h3>
                    <p className="text-xs text-gray-400 max-w-[250px] mx-auto">
                        {t('description')}
                    </p>
                </div>

                <AuraActionButton
                    onClick={handleReveal}
                    loading={loading}
                    cost={10}
                    label={t('reveal_button')}
                    icon={<Sparkles className="w-4 h-4 text-yellow-400" />}
                    className="min-w-[160px]"
                />
            </CardContent>
        </Card>
    );
}
