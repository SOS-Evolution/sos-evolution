import { Users, Sparkle, BookOpen, TrendingUp } from "lucide-react";

export default function AdminLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div>
                <div className="h-8 w-48 bg-slate-800 rounded-lg mb-2" />
                <div className="h-4 w-64 bg-slate-800/50 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-800 rounded" />
                            <div className="h-8 w-16 bg-slate-800 rounded" />
                        </div>
                        <div className="h-12 w-12 rounded-full bg-slate-800" />
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-5 w-5 bg-slate-800 rounded" />
                        <div className="h-6 w-40 bg-slate-800 rounded" />
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-lg border border-transparent">
                                <div className="mt-1 p-2 h-8 w-8 bg-slate-800 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="h-4 w-32 bg-slate-800 rounded" />
                                        <div className="h-4 w-16 bg-slate-800 rounded-full" />
                                    </div>
                                    <div className="h-3 w-48 bg-slate-800/50 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
