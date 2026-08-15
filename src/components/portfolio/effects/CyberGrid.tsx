'use client';

import { motion } from 'framer-motion';

interface CyberGridProps {
  themeColor: string;
}

export default function CyberGrid({ themeColor }: CyberGridProps) {
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-inherit"
      style={{
        backgroundImage: `
          linear-gradient(to right, ${themeColor}08 1.5px, transparent 1.5px),
          linear-gradient(to bottom, ${themeColor}08 1.5px, transparent 1.5px)
        `,
        backgroundSize: '45px 45px',
      }}
    >
      {/* Moving horizontal scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] opacity-25"
        style={{
          background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)`,
        }}
        animate={{
          top: ['0%', '100%']
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Cyber ambient grid vignette overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(5, 5, 8, 0.45) 80%)'
        }}
      />
    </div>
  );
}
