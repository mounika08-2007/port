'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/types/database.types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  themeColor: string;
}

export default function TestimonialsSection({ testimonials, themeColor }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative z-10 px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
            Peer Recommendations
          </h2>
          <div
            className="w-16 h-1 rounded-full"
            style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
          />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 md:p-8 flex flex-col justify-between relative group"
            >
              {/* Quote Icon Background */}
              <div className="absolute right-6 top-6 opacity-[0.04] text-white pointer-events-none group-hover:scale-110 transition-transform duration-300">
                <Quote size={80} />
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <p className="text-slate-300 text-[0.95rem] leading-relaxed italic relative z-10">
                  &ldquo;{t.review_text}&rdquo;
                </p>
              </div>

              {/* Reviewer Meta */}
              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.reviewer_name}
                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}aa, #8b5cf6aa)`,
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {t.reviewer_name
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-white font-semibold text-sm">{t.reviewer_name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.designation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
