import { createServerClient } from '@/lib/supabase';
import type { Profile } from '@/types/database.types';
import LandingClient from './LandingClient';

export default async function HomePage() {
  const supabase = createServerClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('slug, full_name, professional_title, avatar_url, theme_color, bio')
    .order('created_at', { ascending: true });

  return <LandingClient profiles={(profiles as Profile[]) || []} />;
}
