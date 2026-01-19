-- =============================================
-- 03: CREATE MISSIONS SYSTEM
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- Tabla de definición de misiones
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    reward_credits INTEGER NOT NULL DEFAULT 0,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('manual', 'auto_profile', 'auto_reading', 'auto_streak')),
    trigger_config JSONB DEFAULT '{}'::jsonb,
    icon TEXT DEFAULT '🎯',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de progreso de misiones por usuario
CREATE TABLE IF NOT EXISTS public.user_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    target INTEGER DEFAULT 1,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, mission_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_missions_code ON public.missions(code);
CREATE INDEX IF NOT EXISTS idx_missions_active ON public.missions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_missions_user ON public.user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_completed ON public.user_missions(completed);

-- Habilitar RLS
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

-- Políticas para missions (lectura pública)
CREATE POLICY "Anyone can view active missions"
    ON public.missions FOR SELECT
    USING (is_active = TRUE);

-- Políticas para user_missions
CREATE POLICY "Users can view own missions"
    ON public.user_missions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missions"
    ON public.user_missions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
    ON public.user_missions FOR UPDATE
    USING (auth.uid() = user_id);

-- Función para completar una misión y dar recompensa
CREATE OR REPLACE FUNCTION public.complete_mission(
    p_user_id UUID,
    p_mission_code TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_mission RECORD;
    v_user_mission RECORD;
    v_new_balance INTEGER;
BEGIN
    -- Buscar la misión
    SELECT * INTO v_mission FROM public.missions WHERE code = p_mission_code AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Mission not found');
    END IF;
    
    -- Buscar o crear el registro de usuario-misión
    SELECT * INTO v_user_mission 
    FROM public.user_missions 
    WHERE user_id = p_user_id AND mission_id = v_mission.id;
    
    IF v_user_mission.completed THEN
        RETURN jsonb_build_object('success', false, 'error', 'Mission already completed');
    END IF;
    
    -- Si no existe, crear el registro
    IF NOT FOUND THEN
        INSERT INTO public.user_missions (user_id, mission_id, progress, target, completed, completed_at)
        VALUES (p_user_id, v_mission.id, 1, 1, TRUE, NOW());
    ELSE
        -- Actualizar como completada
        UPDATE public.user_missions 
        SET completed = TRUE, completed_at = NOW(), progress = target
        WHERE id = v_user_mission.id;
    END IF;
    
    -- Dar créditos
    SELECT public.add_credits(
        p_user_id,
        v_mission.reward_credits,
        'mission',
        'Misión completada: ' || v_mission.title,
        v_mission.id
    ) INTO v_new_balance;
    
    RETURN jsonb_build_object(
        'success', true,
        'mission', v_mission.title,
        'reward', v_mission.reward_credits,
        'new_balance', v_new_balance
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar misiones iniciales
INSERT INTO public.missions (code, title, description, reward_credits, trigger_type, icon, sort_order) VALUES
    ('complete_profile', 'Completa tu Identidad', 'Ingresa tu nombre, fecha y lugar de nacimiento', 50, 'auto_profile', '👤', 1),
    ('first_reading', 'Primera Revelación', 'Realiza tu primera lectura de tarot', 25, 'auto_reading', '🔮', 2),
    ('five_readings', 'Buscador del Destino', 'Completa 5 lecturas de tarot', 100, 'auto_reading', '⭐', 3),
    ('daily_streak_3', 'Constancia Mística', 'Consulta el oráculo 3 días seguidos', 75, 'auto_streak', '🔥', 4),
    ('explore_love', 'Sendero del Corazón', 'Realiza una lectura de amor', 30, 'auto_reading', '💜', 5),
    ('explore_career', 'Sendero del Propósito', 'Realiza una lectura profesional', 30, 'auto_reading', '💼', 6)
ON CONFLICT (code) DO NOTHING;

-- Función para inicializar misiones al crear perfil
CREATE OR REPLACE FUNCTION public.init_user_missions()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_missions (user_id, mission_id, progress, target)
    SELECT NEW.id, m.id, 0, 
        CASE 
            WHEN m.code = 'five_readings' THEN 5
            WHEN m.code = 'daily_streak_3' THEN 3
            ELSE 1
        END
    FROM public.missions m
    WHERE m.is_active = TRUE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_missions ON public.profiles;
CREATE TRIGGER on_profile_created_missions
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.init_user_missions();

-- Comentarios
COMMENT ON TABLE public.missions IS 'Definición de misiones gamificadas';
COMMENT ON TABLE public.user_missions IS 'Progreso de misiones por usuario';
COMMENT ON FUNCTION public.complete_mission IS 'Completa una misión y otorga la recompensa en créditos';
