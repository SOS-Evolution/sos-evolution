-- =============================================
-- 38: FIX DAILY STREAK AND LOGIN REWARDS
-- Prevents duplicate daily reward exploits
-- =============================================

-- Ensure updated_at column exists in user_missions
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_missions' AND column_name='updated_at') THEN 
        ALTER TABLE public.user_missions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); 
    END IF; 
END $$;

-- Fix check_daily_streak function
CREATE OR REPLACE FUNCTION public.check_daily_streak(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_streak_mission_id UUID;
    v_login_mission_id UUID;
    v_user_mission RECORD;
    v_current_streak INTEGER := 1;
    v_streak_reward INTEGER := 75;
    v_daily_reward INTEGER := 50;
    v_now TIMESTAMPTZ := NOW();
    v_last_checkin_date DATE;
    v_today DATE := CURRENT_DATE;
BEGIN
    -- 1. Obtener misiones: racha de 3 días y login diario
    SELECT id, reward_credits INTO v_streak_mission_id, v_streak_reward 
    FROM public.missions WHERE code = 'daily_streak_3';

    SELECT id, reward_credits INTO v_login_mission_id, v_daily_reward
    FROM public.missions WHERE code = 'daily_login';

    IF v_streak_mission_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Mission daily_streak_3 not found');
    END IF;

    IF v_daily_reward IS NULL THEN
        v_daily_reward := 50;
    END IF;

    -- 2. Buscar estado actual de la misión de racha para este usuario
    SELECT * INTO v_user_mission 
    FROM public.user_missions 
    WHERE user_id = p_user_id AND mission_id = v_streak_mission_id;

    -- 3. Verificar si ya se cobró hoy
    IF FOUND AND v_user_mission.id IS NOT NULL THEN
        v_last_checkin_date := v_user_mission.updated_at::DATE;

        -- Si la última actualización fue hoy, ya cobró la recompensa de hoy
        IF v_last_checkin_date = v_today THEN
             RETURN jsonb_build_object(
                 'success', true, 
                 'rewarded', false, 
                 'message', 'Already checked in today',
                 'streak', COALESCE(v_user_mission.progress, 1)
             );
        END IF;

        -- Calcular racha: Si fue ayer, incrementa. Si no, reinicia a 1.
        IF v_last_checkin_date = (v_today - 1) THEN
            v_current_streak := COALESCE(v_user_mission.progress, 0) + 1;
        ELSE
            v_current_streak := 1;
        END IF;

        -- Actualizar registro existente
        UPDATE public.user_missions 
        SET progress = v_current_streak, 
            updated_at = v_now,
            completed = (v_current_streak >= 3), 
            completed_at = CASE WHEN v_current_streak >= 3 THEN v_now ELSE completed_at END
        WHERE id = v_user_mission.id;

    ELSE
        -- Primera vez: Insertar nuevo registro
        v_current_streak := 1;

        INSERT INTO public.user_missions (user_id, mission_id, progress, target, completed, completed_at, updated_at)
        VALUES (p_user_id, v_streak_mission_id, v_current_streak, 3, FALSE, NULL, v_now)
        ON CONFLICT (user_id, mission_id) DO UPDATE
        SET progress = v_current_streak,
            updated_at = v_now;
    END IF;

    -- 4. Dar Recompensas
    IF v_current_streak >= 3 AND (v_current_streak % 3) = 0 THEN
         -- Recompensa por hito de racha (cada 3 días) + bono diario
         PERFORM public.add_credits(p_user_id, v_streak_reward, 'mission', 'Racha de 3 días', v_streak_mission_id);
         PERFORM public.add_credits(p_user_id, v_daily_reward, 'bonus', 'Bono diario por ingresar', v_login_mission_id);

         RETURN jsonb_build_object(
            'success', true, 
            'rewarded', true, 
            'credits', v_streak_reward + v_daily_reward, 
            'streak', v_current_streak,
            'is_milestone', true
         );
    ELSE
         -- Solo bono diario base
         PERFORM public.add_credits(p_user_id, v_daily_reward, 'bonus', 'Bono diario por ingresar', v_login_mission_id);

         RETURN jsonb_build_object(
            'success', true, 
            'rewarded', true, 
            'credits', v_daily_reward, 
            'streak', v_current_streak,
            'is_milestone', false
         );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
