import React from 'react';
import PacksClient from './PacksClient';
import { fetchThemePacks } from '@/lib/themePacks';

export const metadata = {
  title: 'Portfolio Theme Packs | Persona Flow',
  description:
    'Select your portfolio theme pack and unlock your personalized digital portfolio with Persona Flow.',
};

export default async function PacksPage() {
  const packs = await fetchThemePacks();

  return <PacksClient initialPacks={packs} />;
}
