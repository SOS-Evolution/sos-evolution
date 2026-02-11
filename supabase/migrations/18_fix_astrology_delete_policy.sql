-- =============================================
-- 18: ADD DELETE POLICY FOR ASTROLOGY INTERPRETATIONS
-- =============================================
-- CRITICAL FIX: The original migration (16) only created SELECT and INSERT policies.
-- Without a DELETE policy, the profile API cannot clear old interpretations 
-- when a user changes their birth data, causing stale interpretations to persist.

CREATE POLICY "Users can delete their own astrology interpretations"
    ON public.astrology_interpretations FOR DELETE
    USING (auth.uid() = user_id);

-- Also add UPDATE policy for completeness
CREATE POLICY "Users can update their own astrology interpretations"
    ON public.astrology_interpretations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
