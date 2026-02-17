import { useTranslations } from 'next-intl';
import MissionsPanel from '@/components/dashboard/MissionsPanel';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function MissionsPage() {
    const t = useTranslations('Dashboard');

    return (
        <div className="min-h-screen text-slate-100 pb-20 pt-24 max-w-4xl mx-auto px-6">
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white">
                            {t('missions')}
                        </h1>
                        <p className="text-slate-400">
                            {t('missions_desc', { defaultMessage: 'Completa desafíos para ganar AURA y desbloquear tu potencial.' })}
                        </p>
                    </div>
                </div>
            </div>

            <MissionsPanel />
        </div>
    );
}
