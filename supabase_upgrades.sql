ALTER TABLE profiles ADD COLUMN IF NOT EXISTS animation_style text DEFAULT 'fade';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS animation_speed text DEFAULT 'normal';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_effect text DEFAULT 'mesh-gradient';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS layout_variant text DEFAULT 'classic';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_font text DEFAULT 'Plus Jakarta Sans';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experiences jsonb DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS testimonials jsonb DEFAULT '[]'::jsonb;

-- ============================================================
-- PHASE 3 UPGRADES: GUESTBOOK & INTERACTIVE PARAMETERS
-- ============================================================

-- Table for the portfolio guestbook
CREATE TABLE IF NOT EXISTS public.guestbook (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    visitor_name text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for the guestbook table
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read guestbook entries (public read access)
DROP POLICY IF EXISTS "Public guestbook entries are viewable by everyone" ON public.guestbook;
CREATE POLICY "Public guestbook entries are viewable by everyone"
  ON public.guestbook FOR SELECT USING (true);

-- Allow anyone to insert guestbook entries (public write access)
DROP POLICY IF EXISTS "Anyone can insert guestbook entries" ON public.guestbook;
CREATE POLICY "Anyone can insert guestbook entries"
  ON public.guestbook FOR INSERT WITH CHECK (true);

-- Enable realtime functionality for the guestbook table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
          AND schemaname = 'public' 
          AND tablename = 'guestbook'
    ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook';
    END IF;
END
$$;

-- Add new architectural control options to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_username text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_terminal_toggle boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sound_effects_enabled boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_terminal_welcome text DEFAULT 'Type "help" to view available commands...';

-- ============================================================
-- EXTRA ADVANCED UPGRADES: BLOG & POSTS SYSTEM
-- ============================================================

-- Table for blog posts
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    summary text DEFAULT '',
    published_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for the posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view published blog posts
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;
CREATE POLICY "Public posts are viewable by everyone"
  ON public.posts FOR SELECT USING (true);

-- Allow authenticated owners to fully manage their own posts
DROP POLICY IF EXISTS "Users can manage their own posts" ON public.posts;
CREATE POLICY "Users can manage their own posts"
  ON public.posts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = posts.profile_id AND profiles.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = posts.profile_id AND profiles.user_id = auth.uid())
  );


