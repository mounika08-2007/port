'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Calendar, Trash2 } from 'lucide-react';
import { playSound } from '@/utils/sound';
import type { GuestbookEntry } from '@/types/database.types';

interface GuestbookSectionProps {
  profileId: string;
  themeColor: string;
  soundEnabled: boolean;
}

export default function GuestbookSection({ profileId, themeColor, soundEnabled }: GuestbookSectionProps) {
  const supabase = createClient();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [visitorName, setVisitorName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial guestbook messages
  useEffect(() => {
    async function fetchEntries() {
      try {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (err) {
        console.error('Error fetching guestbook entries:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [profileId, supabase]);

  // Subscribe to real-time additions
  useEffect(() => {
    const channel = supabase
      .channel(`guestbook-realtime-${profileId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guestbook',
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          const newEntry = payload.new as GuestbookEntry;
          setEntries((prev) => {
            // Check for duplicate to prevent issues when posting client-side
            if (prev.some((e) => e.id === newEntry.id)) return prev;
            return [newEntry, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, supabase]);

  // Submit visitor entry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !message.trim()) {
      playSound('error', soundEnabled);
      alert('Please fill in both Name and Message fields.');
      return;
    }

    setSubmitting(true);
    playSound('click', soundEnabled);

    try {
      const { data, error } = await supabase
        .from('guestbook')
        .insert([
          {
            profile_id: profileId,
            visitor_name: visitorName.trim(),
            message: message.trim(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Reset form
      setVisitorName('');
      setMessage('');
      playSound('success', soundEnabled);

      if (data) {
        setEntries((prev) => {
          if (prev.some((e) => e.id === data.id)) return prev;
          return [data as GuestbookEntry, ...prev];
        });
      }
    } catch (err: any) {
      playSound('error', soundEnabled);
      console.error('Error signing guestbook:', err);
      alert(`Failed to post message: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3 flex items-center justify-center md:justify-start gap-2.5">
            <MessageSquare className="w-8 h-8 shrink-0" style={{ color: themeColor }} />
            Visitor Guestbook
          </h2>
          <div
            className="w-16 h-1 rounded-full mx-auto md:mx-0"
            style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
          />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-5 items-start">
          {/* Guestbook signing form */}
          <div className="md:col-span-2 glass-card-static p-6 space-y-4">
            <h3 className="text-white font-semibold text-sm">Sign the Guestbook</h3>
            <p className="text-xs text-slate-500">
              Leave a public message or quick feedback here! It will broadcast to everyone on this page.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">Your Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-650" />
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="glass-input !pl-10 !py-2 text-sm bg-zinc-950/80 border border-zinc-850"
                    placeholder="e.g. Alice"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="glass-input mt-1 !py-2 text-sm bg-zinc-950/80 border border-zinc-850"
                  placeholder="Say hello..."
                  rows={3}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)`,
                }}
              >
                {submitting ? (
                  <div className="loading-spinner !w-4 !h-4" />
                ) : (
                  <>
                    <Send size={14} />
                    Submit Entry
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of entries */}
          <div className="md:col-span-3 space-y-4 h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="loading-spinner !w-7 !h-7" />
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {entries.map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx < 5 ? idx * 0.05 : 0 }}
                    className="glass-card-static p-4.5 space-y-2 border border-white/5 bg-zinc-950/40 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)`,
                          }}
                        >
                          {entry.visitor_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-white text-xs truncate max-w-[140px]">
                          {entry.visitor_name}
                        </span>
                      </div>

                      <span className="text-[9px] text-zinc-550 flex items-center gap-1 font-mono uppercase tracking-wider shrink-0">
                        <Calendar size={10} />
                        {new Date(entry.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words pl-1">
                      {entry.message}
                    </p>
                  </motion.div>
                ))}

                {entries.length === 0 && (
                  <div className="p-12 border border-dashed border-zinc-850 rounded-xl text-center text-zinc-650 text-xs">
                    Be the first to sign the guestbook! Leave a friendly note.
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
