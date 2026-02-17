-- =============================================
-- 34: MISSIONS UPDATES & DAILY REWARDS
-- =============================================

-- 1. Asegurar que los admins puedan actualizar misiones
DROP POLICY IF EXISTS "Admins can update missions" ON public.missions;

CREATE POLICY "Admins can update missions"
    ON public.missions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 2. Función para loguear visita diaria y gestionar racha
CREATE OR REPLACE FUNCTION public.check_daily_streak(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_mission_id UUID;
    v_user_mission RECORD;
    v_current_streak INTEGER;
    v_reward_credits INTEGER;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    -- 1. Obtener ID de la misión de racha
    SELECT id, reward_credits INTO v_mission_id, v_reward_credits 
    FROM public.missions WHERE code = 'daily_streak_3';

    IF v_mission_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Mission daily_streak_3 not found');
    END IF;

    -- 2. Buscar estado actual de la misión para este usuario
    SELECT * INTO v_user_mission 
    FROM public.user_missions 
    WHERE user_id = p_user_id AND mission_id = v_mission_id;

    -- 3. Verificar si ya se cobró hoy (comparación directa de fechas)
    IF v_user_mission IS NOT NULL THEN
        -- Comparar directamente las fechas (CURRENT_DATE usa la misma zona del servidor)
        IF v_user_mission.updated_at::DATE = CURRENT_DATE THEN
             RETURN jsonb_build_object(
                 'success', true, 
                 'rewarded', false, 
                 'message', 'Already checked in today'
             );
        END IF;

        -- Calcular racha: Si fue ayer, incrementa. Si no, reinicia a 1.
        IF v_user_mission.updated_at::DATE = (CURRENT_DATE - 1) THEN
            v_current_streak := v_user_mission.progress + 1;
        ELSE
            v_current_streak := 1;
        END IF;
    ELSE
        -- Primera vez
        v_current_streak := 1;
    END IF;

    -- 4. Actualizar o Insertar el registro de misión
    IF v_user_mission IS NULL THEN
        INSERT INTO public.user_missions (user_id, mission_id, progress, target, completed, completed_at, updated_at)
        VALUES (p_user_id, v_mission_id, v_current_streak, 3, FALSE, NULL, v_now);
    ELSE
        UPDATE public.user_missions 
        SET progress = v_current_streak, 
            updated_at = v_now,
            completed = (v_current_streak >= 3), 
            completed_at = CASE WHEN v_current_streak >= 3 THEN v_now ELSE completed_at END
        WHERE id = v_user_mission.id;
    END IF;

    -- 5. Dar Recompensas
    
    -- Si es hito de racha (cada 3 días)
    IF v_current_streak >= 3 AND (v_current_streak % 3) = 0 THEN
         PERFORM public.add_credits(p_user_id, v_reward_credits, 'mission', 'Racha de 3 días', v_mission_id);
         PERFORM public.add_credits(p_user_id, 5, 'bonus', 'Bono diario por ingresar');

         RETURN jsonb_build_object(
            'success', true, 
            'rewarded', true, 
            'credits', v_reward_credits + 5, 
            'streak', v_current_streak,
            'is_milestone', true
         );
    ELSE
         -- Solo bono diario base
         PERFORM public.add_credits(p_user_id, 5, 'bonus', 'Bono diario por ingresar');

         RETURN jsonb_build_object(
            'success', true, 
            'rewarded', true, 
            'credits', 5, 
            'streak', v_current_streak,
            'is_milestone', false
         );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Asegurar que updated_at existe en user_missions
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_missions' AND column_name='updated_at') THEN 
        ALTER TABLE public.user_missions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); 
    END IF; 
END $$;
