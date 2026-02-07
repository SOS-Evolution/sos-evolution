import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLifePathNumber, getZodiacSign } from '@/lib/soul-math';
import type { Profile, ProfileUpdate } from '@/types';

// GET /api/profile - Obtener perfil del usuario actual
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            // Si no existe el perfil, crearlo
            if (error.code === 'PGRST116') {
                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert({ id: user.id, full_name: user.user_metadata?.full_name || '' })
                    .select()
                    .single();

                if (insertError) {
                    console.error('Error creating profile:', insertError);
                    return NextResponse.json({ error: 'Error al crear perfil' }, { status: 500 });
                }

                return NextResponse.json(newProfile);
            }

            console.error('Error fetching profile:', error);
            return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// PUT /api/profile - Actualizar perfil
export async function PUT(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const body: ProfileUpdate = await req.json();

        // Calcular life_path_number y zodiac_sign si hay birth_date
        let updates: ProfileUpdate = { ...body };

        if (body.birth_date) {
            const date = new Date(body.birth_date);
            updates.life_path_number = getLifePathNumber(body.birth_date);
            updates.zodiac_sign = getZodiacSign(date.getDate(), date.getMonth() + 1);
            updates.astrology_chart = null; // Invalidate cache
        }

        // Ensure new fields are included in updates if provided
        if (body.display_name) updates.display_name = body.display_name;
        if (body.birth_time) updates.birth_time = body.birth_time;
        if (body.latitude !== undefined) updates.latitude = body.latitude;
        if (body.longitude !== undefined) updates.longitude = body.longitude;
        if (body.gender !== undefined) updates.gender = body.gender;

        const { data: profile, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', JSON.stringify(error, null, 2));
            // Devolvemos el mensaje de error específico si es posible para depurar
            return NextResponse.json({
                error: 'Error al actualizar perfil',
                details: error.message,
                hint: 'Asegúrate de haber ejecutado las migraciones de base de datos.'
            }, { status: 500 });
        }

        // Invalidate old interpretations if birth data changed
        if (body.birth_date || body.birth_place || body.birth_time || body.latitude) {
            const { error: deleteError } = await supabase
                .from('astrology_interpretations')
                .delete()
                .eq('user_id', user.id);

            if (deleteError) console.error("Error clearing old interpretations:", deleteError);
        }

        // Verificar si se debe completar la misión de perfil
        if (profile.full_name && profile.birth_date && profile.birth_place) {
            await checkProfileMission(supabase, user.id);
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// Función auxiliar para verificar misión de perfil completo
async function checkProfileMission(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
    try {
        // Verificar si la misión ya está completada
        const { data: userMission } = await supabase
            .from('user_missions')
            .select('*, mission:missions(*)')
            .eq('user_id', userId)
            .eq('mission.code', 'complete_profile')
            .single();

        if (userMission && !userMission.completed) {
            // Completar la misión usando la función de la BD
            await supabase.rpc('complete_mission', {
                p_user_id: userId,
                p_mission_code: 'complete_profile'
            });
        }
    } catch (error) {
        console.error('Error checking profile mission:', error);
    }
}
