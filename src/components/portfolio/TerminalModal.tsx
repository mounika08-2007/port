'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Minimize2, Maximize2, Terminal as TerminalIcon } from 'lucide-react';
import { playSound } from '@/utils/sound';
import type { Profile } from '@/types/database.types';

interface TerminalModalProps {
  profile: Profile;
  onClose: () => void;
}

interface HistoryItem {
  type: 'input' | 'output';
  text: string;
  node?: React.ReactNode;
}

export default function TerminalModal({ profile, onClose }: TerminalModalProps) {
  const themeColor = profile.theme_color || '#6366f1';
  const soundEnabled = profile.sound_effects_enabled ?? false;

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize terminal welcome message
  useEffect(() => {
    const welcome = profile.custom_terminal_welcome || 'Type "help" to view available commands...';
    setHistory([
      {
        type: 'output',
        text: `Welcome to ${profile.full_name}'s Portfolio Shell [v1.0.0]\nSystem: Next.js + Supabase Realtime Ecosystem\n\n${welcome}`,
      },
    ]);
  }, [profile]);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom of history
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Sound play wrapper
  const triggerKeySound = () => {
    playSound('keypress', soundEnabled);
  };

  const getSkillsAscii = () => {
    const skills = profile.skills || [];
    if (skills.length === 0) return 'No skills database records found.';

    // Group skills by category
    const groups: Record<string, string[]> = {};
    skills.forEach((s) => {
      const cat = s.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s.skill_name);
    });

    let ascii = '.\n';
    const categories = Object.keys(groups);
    categories.forEach((cat, catIdx) => {
      const isLastCat = catIdx === categories.length - 1;
      ascii += `${isLastCat ? '└──' : '├──'} ${cat}\n`;

      const items = groups[cat];
      items.forEach((item, itemIdx) => {
        const isLastItem = itemIdx === items.length - 1;
        ascii += `${isLastCat ? ' ' : '│'}   ${isLastItem ? '└──' : '├──'} ${item}\n`;
      });
    });
    return ascii;
  };

  const handleCommand = (cmdText: string) => {
    const cleanCmd = cmdText.trim().toLowerCase();
    const newHistory = [...history, { type: 'input' as const, text: `$ ${cmdText}` }];

    if (cleanCmd === '') {
      setHistory(newHistory);
      return;
    }

    playSound('click', soundEnabled);

    switch (cleanCmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `Available commands:\n  about    - Displays bio and profile summary\n  skills   - Renders technical skillset as an ASCII tree grid\n  projects - Renders active portfolio project links\n  contact  - Outputs networking and social handle connections\n  clear    - Flushes terminal shell logs\n  exit     - Closes terminal emulator`,
        });
        break;

      case 'about':
        newHistory.push({
          type: 'output',
          text: `Name: ${profile.full_name}\nRole: ${profile.professional_title}\nBio: ${profile.bio || 'No bio compiled.'}`,
        });
        break;

      case 'skills':
        newHistory.push({
          type: 'output',
          text: getSkillsAscii(),
        });
        break;

      case 'projects':
        const projects = profile.projects || [];
        if (projects.length === 0) {
          newHistory.push({ type: 'output', text: 'No archived projects found.' });
        } else {
          newHistory.push({
            type: 'output',
            text: 'Loading projects database nodes:\n',
            node: (
              <div className="space-y-3 mt-1 pl-2">
                {projects.map((p, idx) => (
                  <div key={p.id} className="border-l border-zinc-800 pl-3">
                    <span className="text-zinc-500 font-mono">[{idx + 1}]</span>{' '}
                    <span className="font-bold text-white">{p.title}</span>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{p.description}</p>
                    <div className="flex gap-4 mt-1 text-[10px]">
                      {p.live_link && (
                        <a
                          href={p.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:underline flex items-center gap-1"
                        >
                          🔗 Live Demo
                        </a>
                      )}
                      {p.github_link && (
                        <a
                          href={p.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          💻 GitHub Repository
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ),
          });
        }
        break;

      case 'contact':
        const links = profile.social_links || [];
        newHistory.push({
          type: 'output',
          text: 'Social Network links:\n',
          node: (
            <div className="space-y-1.5 pl-2">
              {links.map((link) => (
                <div key={link.id} className="text-xs">
                  <span className="text-zinc-400 capitalize">{link.platform}:</span>{' '}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
              ))}
              {profile.resume_url && (
                <div className="text-xs">
                  <span className="text-zinc-400">Resume:</span>{' '}
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    Download Resume PDF
                  </a>
                </div>
              )}
            </div>
          ),
        });
        break;

      case 'clear':
        setHistory([
          {
            type: 'output',
            text: `Welcome to ${profile.full_name}'s Portfolio Shell [v1.0.0]\nSystem: Next.js + Supabase Realtime Ecosystem\n\nType "help" to view available commands...`,
          },
        ]);
        setInput('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        playSound('error', soundEnabled);
        newHistory.push({
          type: 'output',
          text: `Command not recognized: "${cmdText}". Type "help" for a list of valid commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#000]/60 backdrop-blur-sm">
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`bg-zinc-950 border border-zinc-800 flex flex-col overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${
          isFullscreen ? 'w-full h-full max-w-none' : 'w-full max-w-3xl h-[65vh]'
        }`}
        style={{
          boxShadow: `0 20px 50px -15px ${themeColor}15`,
        }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-900/30 font-mono select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon size={14} className="text-zinc-400" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              bash // {profile.slug}_portfolio_terminal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                setIsFullscreen(!isFullscreen);
              }}
              className="p-1 rounded text-zinc-550 hover:text-white hover:bg-zinc-900 transition-all"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-550 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Close Terminal"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Terminal Screen */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex-1 overflow-y-auto p-5 font-mono text-sm leading-relaxed text-zinc-300 space-y-4"
        >
          {history.map((item, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {item.type === 'input' ? (
                <span className="text-white font-bold">{item.text}</span>
              ) : (
                <div className="text-zinc-400">
                  {item.text}
                  {item.node}
                </div>
              )}
            </div>
          ))}

          {/* Dummy element to auto-scroll */}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 border-t border-zinc-900 px-5 py-3.5 bg-zinc-950 font-mono text-sm">
          <span className="text-purple-400 font-bold select-none shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              triggerKeySound();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(input);
              }
            }}
            className="flex-1 bg-transparent text-white border-none outline-none focus:ring-0 p-0 font-mono caret-purple-500"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Type a command (e.g. 'help')"
          />
        </div>
      </motion.div>
    </div>
  );
}
