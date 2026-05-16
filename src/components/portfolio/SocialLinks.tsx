'use client';

import { motion } from 'framer-motion';
import { Code2, Briefcase, MessageCircle, Globe, Mail, Play, Camera, Link2 } from 'lucide-react';
import type { SocialLink } from '@/types/database.types';

interface SocialLinksProps {
  links: SocialLink[];
  themeColor: string;
}

const platformIcons: Record<string, React.ElementType> = {
  github: Code2,
  linkedin: Briefcase,
  twitter: MessageCircle,
  x: MessageCircle,
  website: Globe,
  email: Mail,
  youtube: Play,
  instagram: Camera,
  dribbble: Globe,
  behance: Globe,
  medium: Link2,
  'dev.to': Code2,
};

export default function SocialLinks({ links, themeColor }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            Let&apos;s Connect
          </h2>
          <div
            className="w-16 h-1 rounded-full mx-auto"
            style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {links.map((link) => {
            const Icon = platformIcons[link.platform.toLowerCase()] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-3 glass-card-static hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/5"
                style={{
                  borderRadius: '0.85rem',
                }}
              >
                <Icon
                  size={20}
                  className="transition-colors duration-300"
                  style={{ color: themeColor }}
                />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {link.platform}
                </span>
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
