
-- ============================================================================
-- MASTER DATABASE SETUP SCRIPT (NEW PROJECT)
-- ============================================================================
-- Run this ENTIRE script in the Supabase SQL Editor of your new project.
-- It recreates all tables, security policies, functions, and triggers.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER ROLES (RBAC)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own roles" ON user_roles;
CREATE POLICY "Users can read own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
CREATE POLICY "Admins can manage all roles" ON user_roles FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  travel_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 4. TRIPS (Core Table)
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  short_description TEXT,
  location TEXT,
  cover_image TEXT,
  price NUMERIC,
  duration_days INTEGER,
  start_date DATE,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published trips" ON trips;
CREATE POLICY "Public can view published trips" ON trips FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins can manage all trips" ON trips;
CREATE POLICY "Admins can manage all trips" ON trips FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 5. TRIP DETAILS (Images, Itinerary, Dates, Pricing)
CREATE TABLE IF NOT EXISTS trip_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE trip_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view trip images" ON trip_images;
CREATE POLICY "Public can view trip images" ON trip_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage trip images" ON trip_images;
CREATE POLICY "Admins can manage trip images" ON trip_images FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS itinerary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  gradient TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view itinerary items" ON itinerary_items;
CREATE POLICY "Public can view itinerary items" ON itinerary_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage itinerary items" ON itinerary_items;
CREATE POLICY "Admins can manage itinerary items" ON itinerary_items FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS trip_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  spots_total INTEGER DEFAULT 20,
  spots_booked INTEGER DEFAULT 0,
  price_modifier NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE trip_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view trip dates" ON trip_dates;
CREATE POLICY "Public can view trip dates" ON trip_dates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage trip dates" ON trip_dates;
CREATE POLICY "Admins can manage trip dates" ON trip_dates FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS trip_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  is_percentage BOOLEAN DEFAULT true,
  conditions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE trip_pricing ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view trip pricing" ON trip_pricing;
CREATE POLICY "Public can view trip pricing" ON trip_pricing FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage trip pricing" ON trip_pricing;
CREATE POLICY "Admins can manage trip pricing" ON trip_pricing FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 6. BOOKINGS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trip_date_id UUID REFERENCES trip_dates(id) ON DELETE SET NULL,
  guest_count INTEGER DEFAULT 1,
  total_amount NUMERIC NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  special_requests TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all bookings" ON bookings;
CREATE POLICY "Admins can manage all bookings" ON bookings FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own transactions" ON payment_transactions;
CREATE POLICY "Users can view own transactions" ON payment_transactions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all transactions" ON payment_transactions;
CREATE POLICY "Admins can manage all transactions" ON payment_transactions FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 7. REQUESTS (Surprise, Custom)
CREATE TABLE IF NOT EXISTS surprise_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  budget NUMERIC,
  duration_days INTEGER,
  interests TEXT,
  preferred_climate TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE surprise_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own surprise requests" ON surprise_requests;
CREATE POLICY "Users can view own surprise requests" ON surprise_requests FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all surprise requests" ON surprise_requests;
CREATE POLICY "Admins can view all surprise requests" ON surprise_requests FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS custom_trip_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT,
  budget NUMERIC,
  duration_days INTEGER,
  travel_style TEXT,
  must_have_experiences TEXT,
  things_to_avoid TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE custom_trip_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own custom trip requests" ON custom_trip_requests;
CREATE POLICY "Users can view own custom trip requests" ON custom_trip_requests FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all custom trip requests" ON custom_trip_requests;
CREATE POLICY "Admins can view all custom trip requests" ON custom_trip_requests FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 8. CONTENT (Testimonials, Blog)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_image TEXT,
  quote TEXT NOT NULL,
  highlight_word TEXT,
  rating INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active testimonials" ON testimonials;
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT USING (status = 'active');
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  category TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
CREATE POLICY "Public can view published posts" ON blog_posts FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins can manage posts" ON blog_posts;
CREATE POLICY "Admins can manage posts" ON blog_posts FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 9. QUIZ
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,
  personality TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  travel_dates JSONB,
  duration TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  travel_style TEXT,
  result_type TEXT,
  matched_trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own quiz responses" ON quiz_responses;
CREATE POLICY "Users can view own quiz responses" ON quiz_responses FOR SELECT USING (auth.uid() = user_id OR email = auth.email());
DROP POLICY IF EXISTS "Admins can view all quiz responses" ON quiz_responses;
CREATE POLICY "Admins can view all quiz responses" ON quiz_responses FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 10. FUNCTIONS & TRIGGERS used above
-- 10. FUNCTIONS & TRIGGERS used above
CREATE OR REPLACE FUNCTION handle_new_user_profile() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name) VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

CREATE OR REPLACE FUNCTION handle_new_user_role() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user_role();

-- ============================================================================
-- SEED DATA (Optional)
-- ============================================================================

-- Seed Trips
INSERT INTO trips (title, slug, description, price, duration_days, location, status, featured) VALUES
('Bali Adventure', 'bali-adventure', 'Experience the magic of Bali with our curated 7-day tour.', 1200, 7, 'Bali, Indonesia', 'published', true),
('Tokyo Explorer', 'tokyo-explorer', 'Discover the vibrant culture and technology of Tokyo.', 2500, 10, 'Tokyo, Japan', 'published', true),
('Swiss Alps Escape', 'swiss-alps', 'Relax in the breathtaking Swiss Alps.', 3200, 5, 'Interlaken, Switzerland', 'draft', false)
ON CONFLICT (slug) DO NOTHING;

-- Seed Testimonials
INSERT INTO testimonials (author_name, quote, rating, status) VALUES
('Sarah J.', 'Best trip of my life! Travel Amigo handled everything perfectly.', 5, 'active'),
('Mike T.', 'Highly recommended for solo travelers.', 5, 'active');

-- ============================================================================
-- END OF SETUP
-- ============================================================================
