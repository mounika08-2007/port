import { createServerClient } from '@/lib/supabase';
import type { Profile } from '@/types/database.types';
import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from('profiles')
    .select('full_name, professional_title, bio')
    .eq('slug', slug)
    .single();

  if (!data) {
    return { title: 'Portfolio Not Found' };
  }

  return {
    title: `${data.full_name} — ${data.professional_title}`,
    description: data.bio?.slice(0, 160) || `${data.full_name}'s professional portfolio`,
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, skills(*), projects(*), social_links(*)')
    .eq('slug', slug)
    .single();

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card-static p-12">
          <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
          <p className="text-slate-400 text-lg mb-6">
            Portfolio not found for <span className="text-white font-medium">&quot;{slug}&quot;</span>
          </p>
          <a
            href="/"
            className="btn-primary inline-flex"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return <PortfolioClient profile={profile as Profile} />;
}
