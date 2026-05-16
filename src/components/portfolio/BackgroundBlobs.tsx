'use client';

import { motion } from 'framer-motion';

interface BackgroundBlobsProps {
  themeColor: string;
}

export default function BackgroundBlobs({ themeColor }: BackgroundBlobsProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary theme-colored blob */}
      <motion.div
        className="blob blob-1"
        style={{
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${themeColor}40 0%, transparent 70%)`,
          top: '-10%',
          right: '-5%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      />

      {/* Secondary purple blob */}
      <motion.div
        className="blob blob-2"
        style={{
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, #8b5cf640 0%, transparent 70%)`,
          bottom: '10%',
          left: '-10%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Small accent blob */}
      <motion.div
        className="blob blob-3"
        style={{
          width: '350px',
          height: '350px',
          background: `radial-gradient(circle, ${themeColor}30 0%, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2, delay: 1 }}
      />

      {/* Subtle blue blob */}
      <motion.div
        className="blob blob-1"
        style={{
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, #3b82f620 0%, transparent 70%)`,
          top: '60%',
          right: '20%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2, delay: 1.5 }}
      />
    </div>
  );
}
