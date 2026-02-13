"use client";

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const t = useTranslations('Auth');

    function switchLocale(nextLocale: string) {
        if (nextLocale === locale) return;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    className={cn(
                        "relative group h-9 px-3 rounded-xl border border-white/10 hover:border-purple-500/30 bg-white/5 hover:bg-white/10 transition-all",
                        isPending && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                        <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white/70">
                            {locale}
                        </span>
                    </div>

                    {/* Indicador de carga sutil */}
                    {isPending && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                            <div className="w-3 h-3 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-black/90 backdrop-blur-xl border-white/10">
                <DropdownMenuItem
                    onClick={() => switchLocale('es')}
                    className="focus:bg-white/10 focus:text-white cursor-pointer group flex items-center justify-between"
                >
                    <div className="flex items-center">
                        <span className="mr-2">🇪🇸</span>
                        <span>{t('language_es')}</span>
                    </div>
                    {locale === 'es' && <Check className="w-4 h-4 text-purple-400" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => switchLocale('en')}
                    className="focus:bg-white/10 focus:text-white cursor-pointer group flex items-center justify-between"
                >
                    <div className="flex items-center">
                        <span className="mr-2">🇺🇸</span>
                        <span>{t('language_en')}</span>
                    </div>
                    {locale === 'en' && <Check className="w-4 h-4 text-purple-400" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
