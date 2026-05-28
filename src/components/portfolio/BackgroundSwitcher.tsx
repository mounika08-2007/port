'use client';

import MeshGradient from './effects/MeshGradient';
import ParticleBackground from './effects/ParticleBackground';
import MatrixRain from './effects/MatrixRain';

interface BackgroundSwitcherProps {
  effect?: 'mesh-gradient' | 'particles' | 'matrix' | 'none';
  themeColor: string;
}

export default function BackgroundSwitcher({ effect = 'mesh-gradient', themeColor }: BackgroundSwitcherProps) {
  switch (effect) {
    case 'particles':
      return <ParticleBackground themeColor={themeColor} />;
    case 'matrix':
      return <MatrixRain themeColor={themeColor} />;
    case 'none':
      return <div className="fixed inset-0 bg-[#050508] -z-10" />;
    case 'mesh-gradient':
    default:
      return <MeshGradient themeColor={themeColor} />;
  }
}
