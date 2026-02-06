import { redirect } from "next/navigation";

export default function RootPage() {
    // Redirigir por defecto a español si el middleware no captura la raíz
    // Esto es un fallback de seguridad para evitar el 404
    redirect("/es");
}
