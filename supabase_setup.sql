-- ============================================================
-- TEAM PORTFOLIO ECOSYSTEM - SUPABASE SETUP (v2)
-- ============================================================
-- Run this in your Supabase SQL Editor.
-- If you ran the v1 script before, drop the old tables first:
--   DROP TABLE IF EXISTS public.social_links CASCADE;
--   DROP TABLE IF EXISTS public.projects CASCADE;
--   DROP TABLE IF EXISTS public.skills CASCADE;
--   DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. PROFILES TABLE
-- user_id is nullable so seed profiles can exist without auth accounts.
-- When a user signs up, they can claim a profile by updating user_id.
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  full_name text NOT NULL DEFAULT '',
  professional_title text DEFAULT '',
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  resume_url text DEFAULT '',
  theme_color text DEFAULT '#6366f1',
  created_at timestamptz DEFAULT now()
);

-- 2. SKILLS TABLE
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  category text DEFAULT 'General'
);

-- 3. PROJECTS TABLE
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  live_link text DEFAULT '',
  github_link text DEFAULT '',
  display_order integer DEFAULT 0
);

-- 4. SOCIAL LINKS TABLE
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform text NOT NULL DEFAULT '',
  url text DEFAULT ''
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- PROFILES: anyone can read, authenticated user can manage their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = user_id);

-- SKILLS: public read, owner manages via profile link
CREATE POLICY "Public skills are viewable by everyone"
  ON public.skills FOR SELECT USING (true);

CREATE POLICY "Users can manage their own skills"
  ON public.skills FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = skills.profile_id AND profiles.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = skills.profile_id AND profiles.user_id = auth.uid())
  );

-- PROJECTS: public read, owner manages via profile link
CREATE POLICY "Public projects are viewable by everyone"
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Users can manage their own projects"
  ON public.projects FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = projects.profile_id AND profiles.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = projects.profile_id AND profiles.user_id = auth.uid())
  );

-- SOCIAL LINKS: public read, owner manages via profile link
CREATE POLICY "Public social links are viewable by everyone"
  ON public.social_links FOR SELECT USING (true);

CREATE POLICY "Users can manage their own social links"
  ON public.social_links FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = social_links.profile_id AND profiles.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = social_links.profile_id AND profiles.user_id = auth.uid())
  );

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users can upload assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated users can update assets" ON storage.objects;
CREATE POLICY "Authenticated users can update assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated users can delete assets" ON storage.objects;
CREATE POLICY "Authenticated users can delete assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Public read access for assets" ON storage.objects;
CREATE POLICY "Public read access for assets"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'portfolio-assets');

-- ============================================================
-- SEED DATA: Three Team Members
-- ============================================================

-- MEHARAJ
INSERT INTO public.profiles (slug, full_name, professional_title, bio, theme_color)
VALUES (
  'meharaj',
  'Meharaj',
  'Full-Stack Developer',
  'Passionate full-stack developer with a keen eye for building scalable web applications. I love turning complex problems into elegant, user-friendly solutions. Experienced in modern JavaScript frameworks, cloud infrastructure, and agile development practices.',
  '#6366f1'
);

-- MOUNIKA
INSERT INTO public.profiles (slug, full_name, professional_title, bio, theme_color)
VALUES (
  'mounika',
  'Mounika',
  'UI/UX Designer & Frontend Developer',
  'Creative designer and frontend developer who bridges the gap between aesthetics and functionality. I specialize in crafting pixel-perfect interfaces, building design systems, and creating seamless user experiences that delight and engage.',
  '#ec4899'
);

-- BHARGAV
INSERT INTO public.profiles (slug, full_name, professional_title, bio, theme_color)
VALUES (
  'bhargav',
  'Bhargav',
  'Backend Engineer & DevOps Specialist',
  'Results-driven backend engineer with deep expertise in distributed systems, database optimization, and cloud-native architectures. I build robust APIs and automated CI/CD pipelines that power high-performance applications at scale.',
  '#10b981'
);

-- ============================================================
-- SEED: Skills for each member
-- ============================================================

-- Meharaj Skills
INSERT INTO public.skills (profile_id, skill_name, category) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'React', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Next.js', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'TypeScript', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Tailwind CSS', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Node.js', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Express', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'PostgreSQL', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'MongoDB', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Git', 'Tools'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Docker', 'Tools'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'AWS', 'Tools'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Figma', 'Design');

-- Mounika Skills
INSERT INTO public.skills (profile_id, skill_name, category) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Figma', 'Design'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Adobe XD', 'Design'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Illustrator', 'Design'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Prototyping', 'Design'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'React', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'HTML/CSS', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'JavaScript', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Tailwind CSS', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Framer Motion', 'Frontend'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Storybook', 'Tools'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Git', 'Tools'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'User Research', 'UX');

-- Bhargav Skills
INSERT INTO public.skills (profile_id, skill_name, category) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Python', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Node.js', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Go', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'PostgreSQL', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Redis', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'GraphQL', 'Backend'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Docker', 'DevOps'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Kubernetes', 'DevOps'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Terraform', 'DevOps'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'CI/CD', 'DevOps'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'AWS', 'Cloud'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'GCP', 'Cloud');

-- ============================================================
-- SEED: Projects for each member
-- ============================================================

-- Meharaj Projects
INSERT INTO public.projects (profile_id, title, description, live_link, github_link, display_order) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'),
   'E-Commerce Platform',
   'A full-featured e-commerce platform built with Next.js and Stripe integration. Includes product catalog, cart management, secure checkout, and an admin dashboard for inventory management.',
   'https://example.com', 'https://github.com', 0),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'),
   'Real-Time Chat Application',
   'A modern real-time messaging app using WebSockets, React, and Node.js. Features include group chats, file sharing, read receipts, and end-to-end encryption.',
   'https://example.com', 'https://github.com', 1),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'),
   'Task Management Dashboard',
   'A Kanban-style project management tool with drag-and-drop boards, team collaboration, due dates, and progress analytics built with React and Supabase.',
   'https://example.com', 'https://github.com', 2);

-- Mounika Projects
INSERT INTO public.projects (profile_id, title, description, live_link, github_link, display_order) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'),
   'Design System Library',
   'A comprehensive UI component library with 50+ reusable components, built with React and Storybook. Includes full design tokens, accessibility support, and interactive documentation.',
   'https://example.com', 'https://github.com', 0),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'),
   'Health & Wellness App',
   'A beautifully designed mobile-first wellness tracking app featuring habit logging, mood tracking, meditation timers, and personalized insights with smooth animations.',
   'https://example.com', 'https://github.com', 1),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'),
   'Portfolio Template Generator',
   'An interactive web tool that generates stunning portfolio websites from user input. Supports multiple themes, custom color schemes, and one-click deployment.',
   'https://example.com', 'https://github.com', 2);

-- Bhargav Projects
INSERT INTO public.projects (profile_id, title, description, live_link, github_link, display_order) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'),
   'Microservices API Gateway',
   'A high-performance API gateway handling 10K+ requests/second. Built with Go, featuring rate limiting, JWT authentication, request routing, and comprehensive monitoring dashboards.',
   'https://example.com', 'https://github.com', 0),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'),
   'Automated Deployment Pipeline',
   'A complete CI/CD pipeline using GitHub Actions, Docker, and Kubernetes. Automates testing, building, and deploying across staging and production environments with zero-downtime rollouts.',
   'https://example.com', 'https://github.com', 1),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'),
   'Data Analytics Engine',
   'A real-time data processing engine built with Python and Apache Kafka. Processes millions of events daily, powering live dashboards and generating automated business intelligence reports.',
   'https://example.com', 'https://github.com', 2);

-- ============================================================
-- SEED: Social links for each member
-- ============================================================

INSERT INTO public.social_links (profile_id, platform, url) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'GitHub', 'https://github.com/meharaj'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'LinkedIn', 'https://linkedin.com/in/meharaj'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Twitter', 'https://twitter.com/meharaj'),
  ((SELECT id FROM public.profiles WHERE slug = 'meharaj'), 'Email', 'mailto:meharaj@example.com');

INSERT INTO public.social_links (profile_id, platform, url) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'GitHub', 'https://github.com/mounika'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'LinkedIn', 'https://linkedin.com/in/mounika'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Instagram', 'https://instagram.com/mounika'),
  ((SELECT id FROM public.profiles WHERE slug = 'mounika'), 'Email', 'mailto:mounika@example.com');

INSERT INTO public.social_links (profile_id, platform, url) VALUES
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'GitHub', 'https://github.com/bhargav'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'LinkedIn', 'https://linkedin.com/in/bhargav'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Twitter', 'https://twitter.com/bhargav'),
  ((SELECT id FROM public.profiles WHERE slug = 'bhargav'), 'Email', 'mailto:bhargav@example.com');
