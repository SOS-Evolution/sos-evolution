-- =============================================
-- 32: ALLOW READ ACCESS TO SYSTEM PROMPTS
-- =============================================

-- Problem: The 'system_prompts' table has RLS enabled, but only admins have a SELECT policy.
-- This prevents the API (running as an authenticated user) from fetching the prompt.

-- Solution: Allow all authenticated users (and potentially anon if needed for public tools, but better strict) 
-- to SELECT from system_prompts.

DROP POLICY IF EXISTS "Authenticated users can view prompts" ON public.system_prompts;

CREATE POLICY "Authenticated users can view prompts"
    ON public.system_prompts FOR SELECT
    USING (auth.role() = 'authenticated');
