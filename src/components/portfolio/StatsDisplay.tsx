'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Users2, Star, Link, ExternalLink, Award } from 'lucide-react';
import GithubIcon from './icons/GithubIcon';
import { playSound } from '@/utils/sound';

interface StatsDisplayProps {
  githubUsername: string;
  themeColor: string;
  soundEnabled: boolean;
}

interface GitHubStats {
  name: string;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
  company: string;
}

export default function StatsDisplay({ githubUsername, themeColor, soundEnabled }: StatsDisplayProps) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!githubUsername) return;

    async function fetchGitHubStats() {
      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername.trim()}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setStats(data);
        setError(false);
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubStats();
  }, [githubUsername]);

  const handleStatsClick = () => {
    playSound('click', soundEnabled);
  };

  if (!githubUsername) return null;

  return (
    <section id="stats" className="relative z-10 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3 flex items-center justify-center md:justify-start gap-2.5">
            <GithubIcon className="w-8 h-8 shrink-0" style={{ color: themeColor }} />
            GitHub Integrations
          </h2>
          <div
            className="w-16 h-1 rounded-full mx-auto md:mx-0"
            style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }}
          />
        </motion.div>

        {loading ? (
          <div className="glass-card-static p-10 flex items-center justify-center border border-white/5">
            <div className="loading-spinner !w-6 !h-6" />
          </div>
        ) : error || !stats ? (
          /* Graceful Fallback if api limit exceeded or error */
          <div className="glass-card-static p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 bg-zinc-950/40">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-white font-bold text-lg flex items-center justify-center md:justify-start gap-2">
                <GithubIcon size={20} className="text-zinc-500" />
                @{githubUsername} GitHub Profile
              </h3>
              <p className="text-xs text-slate-500 max-w-lg">
                We couldn&apos;t load the live API statistics right now, but you can view the public developer source logs directly on GitHub.
              </p>
            </div>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleStatsClick}
              className="btn-ghost shrink-0 flex items-center gap-2 border-zinc-800 hover:bg-zinc-900"
            >
              <ExternalLink size={14} />
              Open github.com
            </a>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="glass-card-static p-6 md:p-8 border border-white/5 hover:border-white/10 bg-zinc-950/40 relative overflow-hidden transition-all duration-300 group"
          >
            {/* Background glowing gradient */}
            <div
              className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full blur-[100px] opacity-[0.07] pointer-events-none transition-all duration-500 group-hover:opacity-[0.12]"
              style={{ backgroundColor: themeColor }}
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
              {/* Profile Card */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0 bg-zinc-900">
                  <img src={stats.avatar_url} alt={stats.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-lg leading-tight">{stats.name || stats.login}</h3>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-850">
                      @{stats.login}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                    {stats.bio || 'Developer profile synced with GitHub API.'}
                  </p>
                </div>
              </div>

              {/* Stats dashboard panel */}
              <div className="grid grid-cols-2 md:flex items-center gap-5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-900">
                
                {/* Repositories */}
                <div className="flex items-center gap-3 p-3.5 border border-zinc-900/60 bg-zinc-950/50 rounded-xl md:min-w-[125px]">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FolderGit2 size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Repos</span>
                    <h4 className="text-base md:text-lg text-white font-extrabold leading-none mt-1 font-mono">
                      {stats.public_repos}
                    </h4>
                  </div>
                </div>

                {/* Followers */}
                <div className="flex items-center gap-3 p-3.5 border border-zinc-900/60 bg-zinc-950/50 rounded-xl md:min-w-[125px]">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Users2 size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Followers</span>
                    <h4 className="text-base md:text-lg text-white font-extrabold leading-none mt-1 font-mono">
                      {stats.followers}
                    </h4>
                  </div>
                </div>

                {/* Stars/Action */}
                <a
                  href={stats.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleStatsClick}
                  className="col-span-2 md:col-span-1 p-3.5 border hover:border-zinc-700 bg-purple-500/10 hover:bg-purple-500/15 text-purple-400 hover:text-white rounded-xl flex items-center justify-center gap-2.5 transition-all text-sm font-semibold h-[60px]"
                >
                  <ExternalLink size={15} />
                  GitHub Log
                </a>

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
