import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: Request, { params }: { params: { code: string } }) {
    try {
        const supabase = await createClient();
        const { code } = params;
        const body = await req.json();
        const { template, description, language } = body;

        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Admin check
        const { data: is_admin } = await supabase.rpc('is_admin', { user_id: user.id });
        if (!is_admin) {
            return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
        }

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
