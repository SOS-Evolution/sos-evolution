"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Coins, ArrowRight, X } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface InsufficientAuraModalProps {
    isOpen: boolean;
    onClose: () => void;
    requiredAmount?: number;
    currentBalance?: number;
}

export default function InsufficientAuraModal({
    isOpen,
    onClose,
    requiredAmount = 50,
    currentBalance = 0
}: InsufficientAuraModalProps) {
    const t = useTranslations('Dashboard.insufficient_aura_modal');
    const router = useRouter();

    const handleGetAura = () => {
        router.push('/purchase');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-slate-950/90 backdrop-blur-2xl border-purple-500/20 shadow-2xl shadow-purple-900/20 text-slate-100 p-0 overflow-visible gap-0 z-[10000]" showCloseButton={false}>
                {/* Manual Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[10001] text-slate-500 hover:text-white transition-colors p-1"
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">{t('later_button')}</span>
                </button>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="p-8 pb-4 relative z-10">
                    <div className="flex flex-col items-center text-center gap-6">
                        {/* Icon Container */}
                        <div className="w-20 h-20 rounded-3xl bg-slate-900/50 border border-purple-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)] relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 animate-pulse" />
                            <div className="relative">
                                <Coins className="w-10 h-10 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-bounce" />
                            </div>
                        </div>

                        <DialogHeader className="space-y-3">
                            <DialogTitle className="text-3xl font-serif text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                                {t('title')}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 text-sm leading-relaxed max-w-[300px] mx-auto">
                                {t('description')}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                {/* Balance Comparison */}
                <div className="px-8 pb-8 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 flex flex-col items-center gap-1 transition-all hover:border-purple-500/20">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t('balance_label')}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-mono font-bold text-slate-300">{currentBalance}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Aura</span>
                            </div>
                        </div>
                        <div className="bg-purple-900/10 rounded-2xl border border-purple-500/10 p-4 flex flex-col items-center gap-1 transition-all hover:border-purple-500/30">
                            <span className="text-[10px] text-purple-400/70 uppercase tracking-widest font-bold">{t('required_label')}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-mono font-bold text-purple-300">{requiredAmount}</span>
                                <span className="text-[10px] text-purple-500/70 font-bold uppercase">Aura</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 pt-0 relative z-10 flex flex-col gap-3">
                    <Button
                        onClick={handleGetAura}
                        className="w-full h-14 bg-purple-600 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] animate-gradient-x hover:scale-[1.02] active:scale-[0.98] text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all duration-300 font-bold tracking-wide rounded-2xl group border border-white/20"
                    >
                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        <span className="relative z-10">{t('get_aura_button')}</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full h-10 text-slate-400 hover:text-white hover:bg-white/5 font-medium transition-all"
                    >
                        {t('later_button')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
