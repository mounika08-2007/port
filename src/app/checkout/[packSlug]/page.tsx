import React from 'react';
import CheckoutClient from './CheckoutClient';
import { fetchThemePackBySlug } from '@/lib/themePacks';

interface CheckoutPageProps {
  params: Promise<{
    packSlug: string;
  }>;
}

export async function generateMetadata({ params }: CheckoutPageProps) {
  const { packSlug } = await params;
  const pack = await fetchThemePackBySlug(packSlug);

  return {
    title: `Activate ${pack.name} | Persona Flow`,
    description: `Activate ${pack.name} on Persona Flow and generate your personalized portfolio.`,
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { packSlug } = await params;
  const pack = await fetchThemePackBySlug(packSlug);

  return <CheckoutClient pack={pack} />;
}
