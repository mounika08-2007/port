'use client';

import { motion } from 'framer-motion';
import type { Skill } from '@/types/database.types';

interface SkillsGridProps {
  skills: Skill[];
  themeColor: string;
}

export default function SkillsGrid({ skills, themeColor }: SkillsGridProps) {
  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            Skills & Expertise
          </h2>
          <div
            className="w-16 h-1 rounded-full"
            style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <motion.div
              key={category}
              variants={itemVariants}
              className="glass-card-static p-6"
            >
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: themeColor }}
              >
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {grouped[category].map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 text-sm rounded-lg border transition-all duration-300 hover:scale-105 cursor-default"
                    style={{
                      borderColor: `${themeColor}30`,
                      background: `${themeColor}10`,
                      color: '#e2e8f0',
                    }}
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
