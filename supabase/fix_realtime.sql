-- ═══════════════════════════════════════════════════════════════
-- GOOBER AGENT - REALTIME CONFIGURATION
-- Run this AFTER schema.sql
-- ═══════════════════════════════════════════════════════════════

-- REPLICA IDENTITY (required for UPDATE/DELETE realtime)
ALTER TABLE public.tokens REPLICA IDENTITY FULL;
ALTER TABLE public.system_status REPLICA IDENTITY FULL;
ALTER TABLE public.trades REPLICA IDENTITY FULL;
ALTER TABLE public.positions REPLICA IDENTITY FULL;
ALTER TABLE public.goober_thoughts REPLICA IDENTITY FULL;
ALTER TABLE public.distributions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
DO $$
BEGIN
    -- Try to add each table, ignore if already exists
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.system_status;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.positions;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.goober_thoughts;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.distributions;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goober_thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (ignore errors)
DROP POLICY IF EXISTS "public_read_tokens" ON public.tokens;
DROP POLICY IF EXISTS "public_read_system_status" ON public.system_status;
DROP POLICY IF EXISTS "public_read_trades" ON public.trades;
DROP POLICY IF EXISTS "public_read_positions" ON public.positions;
DROP POLICY IF EXISTS "public_read_goober_thoughts" ON public.goober_thoughts;
DROP POLICY IF EXISTS "public_read_distributions" ON public.distributions;

DROP POLICY IF EXISTS "service_all_tokens" ON public.tokens;
DROP POLICY IF EXISTS "service_all_system_status" ON public.system_status;
DROP POLICY IF EXISTS "service_all_trades" ON public.trades;
DROP POLICY IF EXISTS "service_all_positions" ON public.positions;
DROP POLICY IF EXISTS "service_all_goober_thoughts" ON public.goober_thoughts;
DROP POLICY IF EXISTS "service_all_distributions" ON public.distributions;

-- Create read policies (public can read all)
CREATE POLICY "public_read_tokens" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "public_read_system_status" ON public.system_status FOR SELECT USING (true);
CREATE POLICY "public_read_trades" ON public.trades FOR SELECT USING (true);
CREATE POLICY "public_read_positions" ON public.positions FOR SELECT USING (true);
CREATE POLICY "public_read_goober_thoughts" ON public.goober_thoughts FOR SELECT USING (true);
CREATE POLICY "public_read_distributions" ON public.distributions FOR SELECT USING (true);

-- Service role can do everything (for the bot)
CREATE POLICY "service_all_tokens" ON public.tokens FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_system_status" ON public.system_status FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_trades" ON public.trades FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_positions" ON public.positions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_goober_thoughts" ON public.goober_thoughts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_distributions" ON public.distributions FOR ALL USING (auth.role() = 'service_role');
