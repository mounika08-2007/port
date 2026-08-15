'use client';

import MeshGradient from './effects/MeshGradient';
import ParticleBackground from './effects/ParticleBackground';
import MatrixRain from './effects/MatrixRain';
import AuroraBackground from './effects/AuroraBackground';
import CyberGrid from './effects/CyberGrid';

interface BackgroundSwitcherProps {
  effect?: 'mesh-gradient' | 'particles' | 'matrix' | 'aurora' | 'cyber-grid' | 'none';
  themeColor: string;
}

export default function BackgroundSwitcher({ effect = 'mesh-gradient', themeColor }: BackgroundSwitcherProps) {
  switch (effect) {
    case 'particles':
      return <ParticleBackground themeColor={themeColor} />;
    case 'matrix':
      return <MatrixRain themeColor={themeColor} />;
    case 'aurora':
      return <AuroraBackground themeColor={themeColor} />;
    case 'cyber-grid':
      return <CyberGrid themeColor={themeColor} />;
    case 'none':
      return <div className="fixed inset-0 bg-[#050508] -z-10" />;
    case 'mesh-gradient':
    default:
      return <MeshGradient themeColor={themeColor} />;
  }
}
