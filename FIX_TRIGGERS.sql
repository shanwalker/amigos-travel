-- ============================================================================
-- FIX: CLEAN UP DUPLICATE TRIGGERS
-- ============================================================================
-- This script drops any legacy or duplicate triggers on auth.users that might 
-- be conflicting with our new setup and causing "Database error" on signup.

-- 1. Drop potential specific legacy triggers known to cause conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;

-- 2. Drop legacy functions if they exist (to avoid confusion)
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Re-create the CORRECT triggers (safely)

-- Function A: Handle Profile Creation
CREATE OR REPLACE FUNCTION handle_new_user_profile() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name) 
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email, 
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_profile 
AFTER INSERT ON auth.users 
FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- Function B: Handle Role Assignment
CREATE OR REPLACE FUNCTION handle_new_user_role() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (NEW.id, 'user') 
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_role 
AFTER INSERT ON auth.users 
FOR EACH ROW EXECUTE FUNCTION handle_new_user_role();

-- 4. Verification
SELECT 'Triggers cleaned and recreated successfully.' as message;
