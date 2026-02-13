"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function toggleLocale() {
        const nextLocale = locale === 'en' ? 'es' : 'en';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={toggleLocale}
                disabled={isPending}
                className={cn(
                    "relative group h-9 px-3 rounded-xl border border-white/10 hover:border-purple-500/30 bg-white/5 hover:bg-white/10 transition-all",
                    isPending && "opacity-50 cursor-not-allowed"
                )}
            >
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                    <div className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-tighter">
                        <span className={cn(
                            "transition-colors",
                            locale === 'en' ? "text-white" : "text-slate-500"
                        )}>EN</span>
                        <span className="text-slate-700">/</span>
                        <span className={cn(
                            "transition-colors",
                            locale === 'es' ? "text-white" : "text-slate-500"
                        )}>ES</span>
                    </div>
                </div>

                {/* Indicador de carga sutil */}
                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                        <div className="w-3 h-3 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                )}
            </Button>
        </div>
    );
}
