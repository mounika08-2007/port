-- ============================================================
-- PERSONA FLOW — DATABASE MIGRATION SCRIPT
-- Project: Persona Flow Portfolio-as-a-Service Platform
-- Target: AICTE Expo Presentation & Production Deployment
-- ============================================================
-- Run this complete script in your Supabase SQL Editor.
-- It safely adds new columns and tables using IF NOT EXISTS.
-- It preserves all existing profiles, projects, skills, and social links.

-- ============================================================
-- 1. EXTEND PROFILES TABLE
-- ============================================================
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS career_stage text DEFAULT 'first-year',
  ADD COLUMN IF NOT EXISTS headline text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location text DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS active_theme_pack text DEFAULT 'student-starter',
  ADD COLUMN IF NOT EXISTS experiences jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS published_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Ensure valid career_stage check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_career_stage_check'
  ) THEN
    ALTER TABLE public.profiles 
      ADD CONSTRAINT profiles_career_stage_check 
      CHECK (career_stage IN ('first-year', 'second-year', 'third-year', 'fourth-year', 'job-seeker', 'professional', 'hr-recruiter'));
  END IF;
END $$;

-- Update existing seed profiles to be published with appropriate theme packs
UPDATE public.profiles 
SET 
  is_published = true,
  active_theme_pack = COALESCE(active_theme_pack, 'developer-pro')
WHERE is_published IS NULL OR active_theme_pack IS NULL;

-- ============================================================
-- 2. EXTEND PROJECTS TABLE WITH STRUCTURED CASE STUDY FIELDS
-- ============================================================
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS problem text DEFAULT '',
  ADD COLUMN IF NOT EXISTS solution text DEFAULT '',
  ADD COLUMN IF NOT EXISTS tech_stack text DEFAULT '',
  ADD COLUMN IF NOT EXISTS contribution text DEFAULT '';

-- ============================================================
-- 3. CREATE EDUCATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution text NOT NULL DEFAULT '',
  degree text NOT NULL DEFAULT '',
  field_of_study text DEFAULT '',
  start_year text DEFAULT '',
  end_year text DEFAULT '',
  grade_cgpa text DEFAULT '',
  achievements text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 4. CREATE CERTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  issuer text NOT NULL DEFAULT '',
  issue_date text DEFAULT '',
  expiry_date text DEFAULT '',
  credential_id text DEFAULT '',
  credential_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 5. CREATE THEME PACKS CATALOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.theme_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text DEFAULT '',
  listed_price integer NOT NULL DEFAULT 199, -- listed price in INR
  currency text DEFAULT 'INR',
  is_active boolean DEFAULT true,
  thumbnail_url text DEFAULT '',
  recommended_for text[] DEFAULT ARRAY[]::text[],
  features jsonb DEFAULT '[]'::jsonb,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 6. CREATE USER ENTITLEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_slug text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  is_demo boolean NOT NULL DEFAULT true,
  listed_price_inr integer NOT NULL DEFAULT 199,
  amount_paid_inr integer NOT NULL DEFAULT 0,
  transaction_ref text NOT NULL,
  notes text DEFAULT 'Persona Flow Plan Activation',
  activated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 7. CREATE PLATFORM ADMINISTRATORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.platform_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'superadmin',
  created_at timestamptz DEFAULT now()
);

-- Automatically register current authenticated users as platform admins if table empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.platform_admins LIMIT 1) THEN
    INSERT INTO public.platform_admins (user_id, role)
    SELECT id, 'superadmin' FROM auth.users LIMIT 1
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END $$;

-- ============================================================
-- 8. SEED DEFAULT THEME PACKS
-- ============================================================
INSERT INTO public.theme_packs (slug, name, tagline, listed_price, currency, is_active, recommended_for, features, display_order)
VALUES
  (
    'student-starter',
    'Student Starter Pack',
    'Tailored for 1st & 2nd year engineering students highlighting academic milestones, coursework, lab skills, and foundational mini-projects.',
    199,
    'INR',
    true,
    ARRAY['first-year', 'second-year'],
    '[
      "Academic Credentials & CGPA Highlights",
      "Coursework & Foundational Skills Showcase",
      "Club, Hackathon & Volunteering Timeline",
      "Problem-Solution Mini-Project Cards",
      "Clean Light Sky Vivid Academic Theme",
      "Direct Resume PDF Viewer & Download",
      "Custom Public URL (/portfolio/your-name)"
    ]'::jsonb,
    1
  ),
  (
    'developer-pro',
    'Developer Pro Pack',
    'Engineered for 3rd & 4th year tech students and active job seekers with interactive CLI terminal, live GitHub metrics, and case studies.',
    399,
    'INR',
    true,
    ARRAY['third-year', 'fourth-year', 'job-seeker'],
    '[
      "Everything in Student Starter Pack",
      "Interactive CLI Terminal & Command Shell",
      "AI Portfolio Assistant with Smart Chat",
      "GitHub Live API & Repo Metric Widgets",
      "Detailed Case Studies (Problem, Solution, Architecture)",
      "Vibe Controls & Background FX Engine",
      "Direct Resume Download & Social Integrations"
    ]'::jsonb,
    2
  ),
  (
    'professional-elite',
    'Professional Elite Pack',
    'Designed for experienced engineers, team leads, and HR/recruitment professionals requiring executive credibility and leadership impact.',
    599,
    'INR',
    true,
    ARRAY['professional', 'hr-recruiter'],
    '[
      "Everything in Developer Pro Pack",
      "Executive Career Timeline & Milestone Tracker",
      "Leadership Impact & Architecture Case Studies",
      "Peer & Client Recommendations / Testimonials",
      "Technical Articles & Thought Leadership Blog Section",
      "Recruiter-First Quick Contact & Booking Widget",
      "Priority Public Slug & Custom Meta Tags"
    ]'::jsonb,
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  listed_price = EXCLUDED.listed_price,
  features = EXCLUDED.features,
  recommended_for = EXCLUDED.recommended_for,
  updated_at = now();

-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

-- THEME PACKS
DROP POLICY IF EXISTS "Theme packs are viewable by everyone" ON public.theme_packs;
CREATE POLICY "Theme packs are viewable by everyone"
  ON public.theme_packs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Platform admins can update theme packs" ON public.theme_packs;
CREATE POLICY "Platform admins can update theme packs"
  ON public.theme_packs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.platform_admins WHERE platform_admins.user_id = auth.uid())
    OR auth.role() = 'authenticated'
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.platform_admins WHERE platform_admins.user_id = auth.uid())
    OR auth.role() = 'authenticated'
  );

-- USER ENTITLEMENTS
DROP POLICY IF EXISTS "Users can read own entitlements" ON public.user_entitlements;
CREATE POLICY "Users can read own entitlements"
  ON public.user_entitlements FOR SELECT
  USING (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE platform_admins.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert demo entitlements for themselves" ON public.user_entitlements;
CREATE POLICY "Users can insert demo entitlements for themselves"
  ON public.user_entitlements FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own entitlements" ON public.user_entitlements;
CREATE POLICY "Users can update own entitlements"
  ON public.user_entitlements FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.platform_admins WHERE platform_admins.user_id = auth.uid()));

-- EDUCATION
DROP POLICY IF EXISTS "Owner can manage education" ON public.education;
CREATE POLICY "Owner can manage education"
  ON public.education FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.user_id = auth.uid())
    OR auth.role() = 'authenticated'
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.user_id = auth.uid())
    OR auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Public can view education of published profiles" ON public.education;
CREATE POLICY "Public can view education of published profiles"
  ON public.education FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.is_published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = education.profile_id AND profiles.user_id = auth.uid())
  );

-- CERTIFICATIONS
DROP POLICY IF EXISTS "Owner can manage certifications" ON public.certifications;
CREATE POLICY "Owner can manage certifications"
  ON public.certifications FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = certifications.profile_id AND profiles.user_id = auth.uid())
    OR auth.role() = 'authenticated'
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = certifications.profile_id AND profiles.user_id = auth.uid())
    OR auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Public can view certifications of published profiles" ON public.certifications;
CREATE POLICY "Public can view certifications of published profiles"
  ON public.certifications FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = certifications.profile_id AND profiles.is_published = true)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = certifications.profile_id AND profiles.user_id = auth.uid())
  );

-- PROFILES & PROJECTS EXTENDED POLICIES
DROP POLICY IF EXISTS "Public can view published profiles" ON public.profiles;
CREATE POLICY "Public can view published profiles"
  ON public.profiles FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

-- STORAGE BUCKET POLICIES FOR PORTFOLIO-ASSETS
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
CREATE POLICY "Public can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated users can upload portfolio assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated users can update their portfolio assets" ON storage.objects;
CREATE POLICY "Authenticated users can update their portfolio assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');
