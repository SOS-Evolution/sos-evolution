'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Edit, Save, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemPrompt {
    code: string;
    description: string;
    template: string;
    required_variables: string[];
    group: string;
    language: string;
    updated_at: string;
}

export default function PromptsAdminPage() {
    const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
    const [templateValue, setTemplateValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const fetchPrompts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/prompts');
            if (!res.ok) throw new Error('Failed to fetch prompts');
            const data = await res.json();
            setPrompts(data);
        } catch (error) {
            toast.error("Error cargando prompts");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    const handleEdit = (prompt: SystemPrompt) => {
        setEditingPrompt(prompt);
        setTemplateValue(prompt.template);
    };

    const handleSave = async () => {
        if (!editingPrompt) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/prompts/${editingPrompt.code}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template: templateValue,
                    description: editingPrompt.description,
                    language: editingPrompt.language
                })
            });

            if (!res.ok) throw new Error('Failed to update prompt');

            toast.success("Prompt actualizado correctamente");
            setEditingPrompt(null);
            fetchPrompts(); // Refresh list
        } catch (error) {
            toast.error("Error guardando el prompt");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">Gestión de Prompts del Sistema</h1>
                <Button
                    onClick={fetchPrompts}
                    disabled={loading}
                    className="bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 hover:text-purple-300 transition-colors"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Recargar Datos
                </Button>
            </div>

            <Card className="bg-black/60 border-purple-500/20 backdrop-blur-md shadow-2xl">
                <CardHeader className="border-b border-purple-500/10">
                    <CardTitle className="text-purple-100 uppercase tracking-widest text-sm font-serif">Listado de Configuración ({prompts.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-purple-500/10 h-16">
                                    <TableHead className="text-purple-400 pl-6 uppercase text-[10px] tracking-widest">Código</TableHead>
                                    <TableHead className="text-purple-400 uppercase text-[10px] tracking-widest">Grupo</TableHead>
                                    <TableHead className="text-purple-400 uppercase text-[10px] tracking-widest text-center">Idioma</TableHead>
                                    <TableHead className="text-purple-400 uppercase text-[10px] tracking-widest">Descripción Completa</TableHead>
                                    <TableHead className="text-purple-400 uppercase text-[10px] tracking-widest">Variables</TableHead>
                                    <TableHead className="text-right text-purple-400 pr-6 uppercase text-[10px] tracking-widest">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prompts.map((prompt) => (
                                    <TableRow key={prompt.code} className="hover:bg-white/5 border-purple-500/5 transition-colors group">
                                        <TableCell className="font-mono text-[11px] text-purple-300 pl-6 py-6 align-top">
                                            {prompt.code}
                                        </TableCell>
                                        <TableCell className="py-6 align-top">
                                            <span className="px-2 py-1 rounded bg-purple-950/40 text-[10px] text-purple-200 border border-purple-500/20 uppercase">
                                                {prompt.group}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-6 align-top text-center">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-[10px] border uppercase font-bold",
                                                prompt.language === 'es' ? "bg-red-900/20 text-red-300 border-red-500/30" :
                                                    prompt.language === 'en' ? "bg-blue-900/20 text-blue-300 border-blue-500/30" :
                                                        "bg-slate-900/40 text-slate-300 border-slate-700"
                                            )}>
                                                {prompt.language}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-200 text-sm leading-relaxed py-6 align-top min-w-[300px]">
                                            {prompt.description}
                                        </TableCell>
                                        <TableCell className="py-6 align-top">
                                            <div className="flex flex-wrap gap-1.5">
                                                {prompt.required_variables?.map(v => (
                                                    <code key={v} className="text-[10px] bg-slate-900/60 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
                                                        {v}
                                                    </code>
                                                ))}
                                                {(!prompt.required_variables || prompt.required_variables.length === 0) && (
                                                    <span className="text-[10px] text-slate-600 italic">Ninguna</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-6 align-top">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(prompt)}
                                                className="bg-purple-900/40 border border-purple-500/50 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-400 transition-all scale-100 group-hover:scale-110 shadow-sm"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!editingPrompt} onOpenChange={(open) => !open && setEditingPrompt(null)}>
                <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col bg-slate-950 border border-purple-500/30 text-white shadow-2xl overflow-hidden">
                    <DialogHeader className="border-b border-purple-500/20 pb-4">
                        <DialogTitle className="text-xl font-serif text-purple-100">
                            Editor de Prompt: <span className="font-mono text-purple-400">{editingPrompt?.code}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-purple-400 uppercase tracking-widest">Descripción</label>
                                <Input
                                    value={editingPrompt?.description || ''}
                                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, description: e.target.value } : null)}
                                    className="bg-slate-900 border-slate-800 text-white focus:ring-1 focus:ring-purple-500 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-purple-400 uppercase tracking-widest">Idioma</label>
                                <select
                                    className="w-full bg-slate-900 border-slate-800 text-white h-11 rounded-md px-3 focus:ring-1 focus:ring-purple-500 text-sm outline-none"
                                    value={editingPrompt?.language || 'multi'}
                                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, language: e.target.value } : null)}
                                >
                                    <option value="es">Español (es)</option>
                                    <option value="en">Inglés (en)</option>
                                    <option value="multi">Multilenguaje / Variable (multi)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col min-h-[400px]">
                            <label className="text-xs font-bold text-purple-400 uppercase tracking-widest flex justify-between">
                                Template de Prompt IA
                                <span className="text-slate-500 font-normal lowercase tracking-normal">Formato soportado: {`{{variable}}`}</span>
                            </label>
                            <Textarea
                                value={templateValue}
                                onChange={(e) => setTemplateValue(e.target.value)}
                                className="font-mono text-sm bg-slate-900 border-slate-800 text-slate-200 resize-none flex-1 focus:ring-1 focus:ring-purple-500 leading-relaxed p-4"
                                placeholder="Escribe el prompt aquí..."
                            />
                            <div className="bg-purple-950/20 border border-purple-500/20 p-3 rounded-md mt-2">
                                <p className="text-[11px] text-purple-300 font-bold mb-1 uppercase tracking-wider">Variables Dinámicas Disponibles:</p>
                                <div className="flex flex-wrap gap-2">
                                    {editingPrompt?.required_variables.map(v => (
                                        <code key={v} className="bg-black/40 px-2 py-0.5 rounded text-purple-400 text-xs border border-purple-500/20">
                                            {`{{${v}}}`}
                                        </code>
                                    ))}
                                    {(!editingPrompt?.required_variables || editingPrompt?.required_variables.length === 0) && (
                                        <span className="text-xs text-slate-500 italic">No requiere variables</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t border-purple-500/20 pt-4 px-4 bg-slate-900/50">
                        <Button
                            variant="ghost"
                            onClick={() => setEditingPrompt(null)}
                            className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 mx-2"
                        >
                            Descartar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-purple-600 hover:bg-purple-700 text-white min-w-[150px] shadow-lg shadow-purple-900/20 border border-purple-500/50"
                        >
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Actualizar Prompt
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
