ALTER TABLE profiles ADD COLUMN IF NOT EXISTS animation_style text DEFAULT 'fade';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS animation_speed text DEFAULT 'normal';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_effect text DEFAULT 'mesh-gradient';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS layout_variant text DEFAULT 'classic';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_font text DEFAULT 'Plus Jakarta Sans';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experiences jsonb DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS testimonials jsonb DEFAULT '[]'::jsonb;
