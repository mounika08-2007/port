'use client';

import { motion } from 'framer-motion';

interface MeshGradientProps {
  themeColor: string;
}

export default function MeshGradient({ themeColor }: MeshGradientProps) {
  // Derive secondary glowing colors based on theme color
  const secondaryColor = '#8b5cf6'; // Violet/purple accent
  const accentColor = '#3b82f6'; // Blue accent

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050508]">
      {/* Primary Blob */}
      <motion.div
        className="absolute rounded-full filter blur-[100px] opacity-35"
        style={{
          width: 'min(70vw, 700px)',
          height: 'min(70vw, 700px)',
          background: `radial-gradient(circle, ${themeColor}60 0%, transparent 70%)`,
        }}
        animate={{
          x: ['-10%', '30%', '-5%'],
          y: ['-20%', '10%', '-15%'],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary Blob */}
      <motion.div
        className="absolute rounded-full filter blur-[120px] opacity-30"
        style={{
          width: 'min(65vw, 600px)',
          height: 'min(65vw, 600px)',
          background: `radial-gradient(circle, ${secondaryColor}50 0%, transparent 70%)`,
          bottom: '-10%',
          left: '-10%',
        }}
        animate={{
          x: ['0px', '-40px', '50px', '0px'],
          y: ['0px', '60px', '-30px', '0px'],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Tertiary Accent Blob */}
      <motion.div
        className="absolute rounded-full filter blur-[80px] opacity-25"
        style={{
          width: 'min(50vw, 450px)',
          height: 'min(50vw, 450px)',
          background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
          top: '40%',
          right: '15%',
        }}
        animate={{
          x: ['0px', '60px', '-30px', '0px'],
          y: ['0px', '-80px', '40px', '0px'],
          scale: [1, 1.1, 0.85, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Dynamic Background Noise overlay to look extra premium */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
