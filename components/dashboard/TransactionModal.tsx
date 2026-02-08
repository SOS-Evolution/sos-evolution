"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    cost: number;
    loading?: boolean;
    icon?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
}

export default function TransactionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    cost,
    loading = false,
    icon,
    confirmText = "Confirmar",
    cancelText = "Cancelar"
}: TransactionModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
            <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-900/20 text-slate-100 p-0 overflow-hidden gap-0" showCloseButton={false}>
                {/* Manual Close Button to ensure it works and is visible over p-0/overflow-hidden */}
                {!loading && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-[60] text-slate-500 hover:text-white transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                        <span className="sr-only">Cerrar</span>
                    </button>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="p-6 pb-2 relative z-10">
                    <div className="flex flex-col items-center text-center gap-4">
                        {/* Icon Container */}
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)] relative group">
                            <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse" />
                            {icon || <Sparkle className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />}
                        </div>

                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-xl font-serif text-white tracking-wide">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                {/* Cost Display */}
                <div className="flex justify-center py-4 relative z-10">
                    <div className="flex flex-col items-center gap-1 bg-slate-950/40 px-6 py-2 rounded-xl border border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Costo de la Transacción</span>
                        <div className="flex items-center gap-2 text-amber-400 font-mono text-lg font-bold">
                            <Sparkle className="w-4 h-4 fill-amber-400/20" />
                            <span>{cost} AURA</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 bg-slate-950/30 gap-3 sm:gap-0 relative z-10">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 data-[state=open]:bg-white/5"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            "flex-1 bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 font-bold tracking-wide",
                            loading && "opacity-80"
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Procesando...
                            </>
                        ) : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
