"use client";

import { useState } from "react";
import { updatePassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const initialError = searchParams.get("error");
    // Mensaje de éxito si lo hubiera (ej. tras redirección)
    const successMessage = searchParams.get("message");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [clientError, setClientError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setClientError(null);

        // Validación personalizada para evitar popups del navegador
        if (!password || !confirmPassword) {
            setClientError("Por favor completa todos los campos.");
            return;
        }

        if (password.length < 6) {
            setClientError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setClientError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        const formData = new FormData(event.currentTarget);
        // Server Action
        await updatePassword(formData);
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
            {/* Contenedor con efecto de borde brillante similar al Login */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl p-8 md:p-10 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 mb-4 ring-1 ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                            <Lock className="w-8 h-8 text-purple-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2 font-serif">
                            Restablecer Contraseña
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Protege tu cuenta con una nueva clave secreta.
                        </p>
                    </div>

                    {/* Feedback Messages */}
                    {successMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 flex items-center gap-3 animate-in slide-in-from-top-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <p className="text-sm font-medium">{successMessage}</p>
                        </div>
                    )}

                    {(initialError || clientError) && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3 animate-shake">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-sm font-medium">{clientError || initialError}</p>
                        </div>
                    )}

                    {/* Form con noValidate para desactivar mensajes del navegador */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-serif font-medium text-slate-400 ml-1 tracking-wider uppercase">
                                Nueva Contraseña
                            </label>
                            <div className="relative group/input">
                                <Lock className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                                    password.length > 0 && password.length < 6 ? "text-red-400" :
                                        "text-slate-500 group-focus-within/input:text-purple-400"
                                )} />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={cn(
                                        "pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl transition-all",
                                        password.length > 0 && password.length < 6
                                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                                            : "focus:border-purple-500/50 focus:ring-purple-500/20"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {password.length > 0 && password.length < 6 && (
                                <p className="text-[11px] text-red-400 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                                    Mínimo 6 caracteres ({password.length}/6)
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-xs font-serif font-medium text-slate-400 ml-1 tracking-wider uppercase">
                                Confirmar Contraseña
                            </label>
                            <div className="relative group/input">
                                <Lock className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                                    confirmPassword && password !== confirmPassword ? "text-red-400" :
                                        confirmPassword && password === confirmPassword ? "text-green-400" :
                                            "text-slate-500 group-focus-within/input:text-purple-400"
                                )} />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={cn(
                                        "pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl transition-all",
                                        confirmPassword && password !== confirmPassword
                                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                                            : "focus:border-purple-500/50 focus:ring-purple-500/20"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {/* Instant Matching Feedback */}
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-[11px] text-red-400 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                                    Las contraseñas no coinciden
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || (password.length > 0 && password.length < 6) || (confirmPassword !== "" && password !== confirmPassword)}
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-purple-900/20 font-medium tracking-wide transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                "Actualizar Contraseña"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
