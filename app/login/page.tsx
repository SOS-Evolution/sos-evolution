"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Lock, Mail, Loader2 } from "lucide-react";
import { login, signup } from "./actions"; // Importamos las acciones nuevas
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const errorMsg = searchParams.get("error");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);

    // Un pequeño truco para mostrar "cargando" mientras el servidor procesa
    const handleSubmit = (e: React.FormEvent) => {
        setLoading(true);
        // El formulario se enviará naturalmente a las Server Actions
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-purple-500/20 p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-full bg-purple-900/30 mb-4 text-purple-400">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-serif text-white tracking-widest">
                        {isSignUp ? "ÚNETE AL VIAJE" : "ACCESO AL ALMA"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">
                        SOS Evolution v1.0
                    </p>
                </div>

                {/* MENSAJE DE ERROR SI EXISTE */}
                {errorMsg && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-md text-sm text-center mb-6">
                        ⚠️ {errorMsg}
                    </div>
                )}

                {/* FORMULARIO CONECTADO A SERVER ACTIONS */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <Input
                                name="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:ring-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:ring-purple-500"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {/* Botones Mágicos: Usan 'formAction' para elegir qué función ejecutar */}
                    <Button
                        formAction={isSignUp ? signup : login}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Crear Cuenta" : "Entrar")}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-500">
                        {isSignUp ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-2 text-purple-400 hover:text-purple-300 font-medium underline-offset-4 hover:underline"
                    >
                        {isSignUp ? "Inicia Sesión" : "Regístrate"}
                    </button>
                </div>
            </Card>
        </div>
    );
}