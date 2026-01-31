import { updatePassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export default function ResetPasswordPage({
    searchParams,
}: {
    searchParams: { error?: string; message?: string }
}) {
    return (
        <div className="flex h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-8 border border-white/10 backdrop-blur-xl">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                        <Lock className="h-6 w-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Restablecer Contraseña
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Ingresa tu nueva contraseña a continuación.
                    </p>
                </div>

                <form action={updatePassword} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Nueva Contraseña
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Nueva contraseña"
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirmar Contraseña
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="Confirmar nueva contraseña"
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                                minLength={6}
                            />
                        </div>
                    </div>

                    {searchParams.error && (
                        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
                            {searchParams.error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/20"
                    >
                        Actualizar Contraseña
                    </Button>
                </form>
            </div>
        </div>
    );
}
