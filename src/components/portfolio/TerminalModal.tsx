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
  const themeColor = !profile.theme_color || profile.theme_color === '#6366f1' ? '#1c9cf0' : profile.theme_color;
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
                  <div key={p.id} className="border-l-2 border-[#137cc2] pl-3 bg-[#ffffff] p-2.5 rounded-r-lg my-2 border border-[#d8e7f0] shadow-xs">
                    <span className="text-[#137cc2] font-mono font-bold">[{idx + 1}]</span>{' '}
                    <span className="font-bold text-[#0f1419]">{p.title}</span>
                    <p className="text-xs text-[#536471] mt-0.5 leading-relaxed">{p.description}</p>
                    <div className="flex gap-4 mt-1 text-[10px]">
                      {p.live_link && (
                        <a
                          href={p.live_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:underline flex items-center gap-1"
                        >
                          🔗 Live Demo
                        </a>
                      )}
                      {p.github_link && (
                        <a
                          href={p.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:underline flex items-center gap-1"
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
                    className="text-sky-400 hover:underline"
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
                    className="text-sky-400 hover:underline"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`bg-[#ffffff] border border-[#d8e7f0] flex flex-col overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${
          isFullscreen ? 'w-full h-full max-w-none' : 'w-full max-w-3xl h-[65vh]'
        }`}
        style={{
          boxShadow: `0 20px 50px -15px rgba(19, 124, 194, 0.2)`,
        }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#d8e7f0] bg-[#ebf3f3] font-mono select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon size={14} className="text-[#137cc2]" />
            <span className="text-xs text-[#0f1419] font-bold uppercase tracking-wider">
              bash // {profile.slug}_portfolio_terminal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                setIsFullscreen(!isFullscreen);
              }}
              className="p-1 rounded text-[#536471] hover:text-[#0f1419] hover:bg-[#E3ECF6] transition-all"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#536471] hover:text-red-500 hover:bg-red-500/10 transition-all"
              title="Close Terminal"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Terminal Screen */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex-1 overflow-y-auto p-5 font-mono text-sm leading-relaxed text-[#0f1419] bg-[#f7f8f8] space-y-4"
        >
          {history.map((item, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {item.type === 'input' ? (
                <span className="text-[#137cc2] font-bold">{item.text}</span>
              ) : (
                <div className="text-[#536471]">
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
        <div className="flex items-center gap-2 border-t border-[#d8e7f0] px-5 py-3.5 bg-[#ffffff] font-mono text-sm">
          <span className="font-bold select-none shrink-0" style={{ color: themeColor }}>$</span>
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
            className="flex-1 bg-transparent text-[#0f1419] border-none outline-none focus:ring-0 p-0 font-mono placeholder-[#8d9eb1] caret-[#137cc2]"
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
