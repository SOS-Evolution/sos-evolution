import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/supabase/admin-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await params;
        const body = await req.json();
        const { template, description, language } = body;

        const { supabase, error: authResponse } = await getAdminUser();
        if (authResponse) return authResponse;

        if (!template) {
            return NextResponse.json({ error: 'Template content is required' }, { status: 400 });
        }

        const { data: updatedPrompt, error } = await supabase
            .from('system_prompts')
            .update({ template, description, language, updated_at: new Date() })
            .eq('code', code)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(updatedPrompt);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
