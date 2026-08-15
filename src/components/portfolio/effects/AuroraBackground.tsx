'use client';

import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  themeColor: string;
}

export default function AuroraBackground({ themeColor }: AuroraBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-inherit">
      {/* Primary Blob */}
      <motion.div
        className="absolute rounded-full filter blur-[120px] opacity-25"
        style={{
          width: 'min(90vw, 900px)',
          height: 'min(50vw, 500px)',
          background: `radial-gradient(circle, ${themeColor} 0%, transparent 80%)`,
          top: '-15%',
          left: '10%',
        }}
        animate={{
          x: ['0px', '50px', '-30px', '0px'],
          y: ['0px', '25px', '40px', '0px'],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary Accent Blob */}
      <motion.div
        className="absolute rounded-full filter blur-[130px] opacity-20"
        style={{
          width: 'min(80vw, 800px)',
          height: 'min(45vw, 450px)',
          background: `radial-gradient(circle, #3b82f6 0%, transparent 80%)`,
          top: '-10%',
          right: '5%',
        }}
        animate={{
          x: ['0px', '-40px', '30px', '0px'],
          y: ['0px', '40px', '-20px', '0px'],
          scale: [1, 0.95, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Center glowing bar */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[70%] h-[200px] opacity-15 filter blur-[70px]"
        style={{
          background: `linear-gradient(90deg, ${themeColor}, #8b5cf6, #3b82f6)`,
        }}
      />
    </div>
  );
}
