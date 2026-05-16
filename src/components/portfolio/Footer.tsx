'use client';

import { motion } from 'framer-motion';

interface FooterProps {
  name: string;
  themeColor: string;
}

export default function Footer({ name, themeColor }: FooterProps) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative z-10 px-6 py-10 border-t border-white/5"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()}{' '}
          <span style={{ color: themeColor }} className="font-medium">
            {name}
          </span>
          . Built with the Team Portfolio Ecosystem.
        </p>
      </div>
    </motion.footer>
  );
}
