import { createServerClient } from '@/lib/supabase';
import { getFullProfileBySlug } from '@/lib/portfolioService';
import type { Profile } from '@/types/database.types';
import type { Metadata } from 'next';
import Link from 'next/link';
import StudentStarterTheme from '@/components/themes/StudentStarterTheme';
import DeveloperProTheme from '@/components/themes/DeveloperProTheme';
import ProfessionalEliteTheme from '@/components/themes/ProfessionalEliteTheme';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const profile = await getFullProfileBySlug(supabase, slug);

  if (!profile) {
    return { title: 'Portfolio Not Found | Persona Flow' };
  }

  return {
    title: `${profile.full_name} — ${profile.headline || profile.professional_title || 'Portfolio'}`,
    description: profile.bio?.slice(0, 160) || `${profile.full_name}'s professional portfolio on Persona Flow`,
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  const profile = await getFullProfileBySlug(supabase, slug);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center p-10 rounded-3xl border border-[#d8e7f0] max-w-md shadow-xs">
          <h1 className="text-5xl font-black text-[#0f1419] mb-3">404</h1>
          <p className="text-[#536471] text-sm mb-6">
            No portfolio found for <strong className="text-[#0f1419]">&quot;{slug}&quot;</strong>
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#137cc2] text-white text-xs font-bold inline-block"
          >
            Back to Persona Flow
          </Link>
        </div>
      </div>
    );
  }

  // Publication Gate: unpublished portfolios are private
  if (profile.is_published === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center p-10 rounded-3xl border border-[#d8e7f0] max-w-md shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center mx-auto text-xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-[#0f1419]">Portfolio In Draft Mode</h2>
          <p className="text-xs text-[#536471] leading-relaxed">
            This portfolio is currently in private draft mode and has not yet been published by its creator.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#0f1419] text-white text-xs font-bold inline-block"
          >
            Visit Persona Flow
          </Link>
        </div>
      </div>
    );
  }

  // Route to the appropriate theme engine
  const theme = profile.active_theme_pack || 'student-starter';

  if (theme === 'student-starter') {
    return <StudentStarterTheme profile={profile as Profile} />;
  }

  if (theme === 'developer-pro') {
    return <DeveloperProTheme profile={profile as Profile} />;
  }

  if (theme === 'professional-elite') {
    return <ProfessionalEliteTheme profile={profile as Profile} />;
  }

  // Default fallback
  return <DeveloperProTheme profile={profile as Profile} />;
}
