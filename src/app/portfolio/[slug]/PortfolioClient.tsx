'use client';

import type { Profile } from '@/types/database.types';
import BackgroundBlobs from '@/components/portfolio/BackgroundBlobs';
import HeroSection from '@/components/portfolio/HeroSection';
import SkillsGrid from '@/components/portfolio/SkillsGrid';
import ProjectShowcase from '@/components/portfolio/ProjectShowcase';
import SocialLinks from '@/components/portfolio/SocialLinks';
import Footer from '@/components/portfolio/Footer';

interface PortfolioClientProps {
  profile: Profile;
}

export default function PortfolioClient({ profile }: PortfolioClientProps) {
  const themeColor = profile.theme_color || '#6366f1';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <BackgroundBlobs themeColor={themeColor} />

      {/* Content */}
      <main className="relative z-10">
        <HeroSection profile={profile} />
        <SkillsGrid skills={profile.skills || []} themeColor={themeColor} />
        <ProjectShowcase projects={profile.projects || []} themeColor={themeColor} />
        <SocialLinks links={profile.social_links || []} themeColor={themeColor} />
        <Footer name={profile.full_name} themeColor={themeColor} />
      </main>
    </div>
  );
}
