import ResetPasswordForm from "./ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Suspense fallback={<div className="text-white">Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
