const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [target, replacement] of replacements) {
    if (!content.includes(target)) {
      console.warn(`[WARN] Target not found in ${path.basename(filePath)}:\n${target.slice(0, 80)}...`);
    } else {
      content = content.replace(target, replacement);
    }
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[SUCCESS] Updated ${path.basename(filePath)}`);
  } else {
    console.log(`[NO CHANGE] ${path.basename(filePath)}`);
  }
}

// ==========================================
// 1. ProjectShowcase.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/ProjectShowcase.tsx'), [
  [
    `className="glass-input !pl-10 !py-2 text-xs bg-zinc-950/40 border border-zinc-850 focus:border-zinc-700"`,
    `className="glass-input !pl-10 !py-2 text-xs bg-[#ffffff] border border-[#d8e7f0] focus:border-[#1da1f2] text-[#0f1419] placeholder-[#536471]"`
  ],
  [
    `<Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-zinc-550" />`,
    `<Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-[#536471]" />`
  ],
  [
    `isActive
                      ? 'bg-sky-500 border-sky-400/30 text-white shadow-sm shadow-sky-500/25'
                      : 'border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white bg-zinc-950/20'`,
    `isActive
                      ? 'bg-[#137cc2] border-[#137cc2] text-white shadow-sm shadow-[#137cc2]/20'
                      : 'border-[#d8e7f0] hover:border-[#1da1f2] text-[#536471] hover:text-[#0f1419] bg-[#ffffff] hover:bg-[#E3ECF6]'`
  ],
  [
    `className="glass-card group overflow-hidden flex flex-col h-full bg-[#17181c]/60 border border-white/5"`,
    `className="glass-card group overflow-hidden flex flex-col h-full bg-[#ebf3f3] border border-[#d8e7f0] hover:bg-[#ffffff] hover:border-[#1da1f2]"`
  ],
  [
    `<div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />`,
    `<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />`
  ],
  [
    `<h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">`,
    `<h3 className="text-lg font-bold text-[#0f1419] mb-2 group-hover:text-[#137cc2] transition-colors">`
  ],
  [
    `<p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">`,
    `<p className="text-[#536471] text-xs leading-relaxed mb-4 flex-1">`
  ],
  [
    `className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-950/80 text-zinc-550 border border-zinc-900"`,
    `className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-[#E3ECF6] text-[#137cc2] border border-[#d8e7f0]"`
  ],
  [
    `<div className="flex gap-4 mt-auto border-t border-white/5 pt-4">`,
    `<div className="flex gap-4 mt-auto border-t border-[#d8e7f0] pt-4">`
  ],
  [
    `className="flex items-center gap-1.5 text-xs font-semibold text-slate-450 hover:text-white transition-colors duration-300"`,
    `className="flex items-center gap-1.5 text-xs font-semibold text-[#536471] hover:text-[#0f1419] transition-colors duration-300"`
  ],
  [
    `<div className="text-center p-16 border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20">
            <p className="text-zinc-500 text-sm">
              No featured projects found matching &quot;<span className="text-white">{searchQuery || selectedTag}</span>&quot;.
            </p>
          </div>`,
    `<div className="text-center p-16 border border-dashed border-[#d8e7f0] rounded-2xl bg-[#ebf3f3]">
            <p className="text-[#536471] text-sm">
              No featured projects found matching &quot;<span className="text-[#0f1419] font-semibold">{searchQuery || selectedTag}</span>&quot;.
            </p>
          </div>`
  ]
]);

// ==========================================
// 2. SkillsQuiz.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/SkillsQuiz.tsx'), [
  [
    `<p className="text-xs text-slate-500 max-w-md mx-auto">`,
    `<p className="text-xs text-[#536471] max-w-md mx-auto">`
  ],
  [
    `className="glass-card-static p-6 md:p-8 border border-white/5 bg-zinc-950/40 relative overflow-hidden"`,
    `className="glass-card-static p-6 md:p-8 border border-[#d8e7f0] bg-[#ebf3f3] relative overflow-hidden shadow-xs"`
  ],
  [
    `<div className="flex justify-between items-center text-xs text-slate-500 font-mono">`,
    `<div className="flex justify-between items-center text-xs text-[#536471] font-mono">`
  ],
  [
    `<div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">`,
    `<div className="w-full bg-[#d8e7f0] h-1.5 rounded-full overflow-hidden">`
  ],
  [
    `<h3 className="text-lg font-bold text-white tracking-tight">{currentQ.questionText}</h3>`,
    `<h3 className="text-lg font-bold text-[#0f1419] tracking-tight">{currentQ.questionText}</h3>`
  ],
  [
    `let btnStyle = 'border-zinc-850 bg-zinc-950 hover:border-zinc-700 text-zinc-400';`,
    `let btnStyle = 'border-[#d8e7f0] bg-[#ffffff] hover:border-[#1da1f2] hover:bg-[#E3ECF6] text-[#0f1419] shadow-xs';`
  ],
  [
    `btnStyle = 'border-zinc-900 bg-zinc-950/20 text-zinc-600 opacity-60';`,
    `btnStyle = 'border-[#e1e8ed] bg-[#f7f8f8] text-[#8d9eb1] opacity-60';`
  ],
  [
    `<h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>`,
    `<h3 className="text-2xl font-bold text-[#0f1419]">Quiz Completed!</h3>`
  ],
  [
    `<p className="text-xs text-slate-400">`,
    `<p className="text-xs text-[#536471]">`
  ],
  [
    `<div className="text-zinc-400 text-sm max-w-sm mx-auto italic">`,
    `<div className="text-[#536471] text-sm max-w-sm mx-auto italic">`
  ],
  [
    `<button onClick={handleRestart} className="btn-ghost flex items-center gap-1.5 border-zinc-800">`,
    `<button onClick={handleRestart} className="btn-ghost flex items-center gap-1.5 border-[#d8e7f0] text-[#0f1419] bg-[#ffffff] hover:bg-[#E3ECF6]">`
  ]
]);

// ==========================================
// 3. BlogSection.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/BlogSection.tsx'), [
  [
    `className="glass-card-static p-6 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 flex flex-col justify-between cursor-pointer group"`,
    `className="glass-card-static p-6 border border-[#d8e7f0] hover:border-[#1da1f2] bg-[#ebf3f3] hover:bg-[#ffffff] transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xs"`
  ],
  [
    `className="flex items-center justify-between text-[10px] text-zinc-550 font-mono"`,
    `className="flex items-center justify-between text-[10px] text-[#536471] font-mono"`
  ],
  [
    `className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850"`,
    `className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#E3ECF6] border border-[#d8e7f0] text-[#137cc2]"`
  ],
  [
    `<h3 className="text-base md:text-lg font-bold text-white leading-tight group-hover:text-sky-400 transition-colors">`,
    `<h3 className="text-base md:text-lg font-bold text-[#0f1419] leading-tight group-hover:text-[#137cc2] transition-colors">`
  ],
  [
    `<p className="text-zinc-400 text-xs md:text-sm leading-relaxed line-clamp-3">`,
    `<p className="text-[#536471] text-xs md:text-sm leading-relaxed line-clamp-3">`
  ],
  [
    `className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#000]/60 backdrop-blur-sm"`,
    `className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm"`
  ],
  [
    `className="bg-zinc-950 border border-zinc-850 w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl"`,
    `className="bg-[#ffffff] border border-[#d8e7f0] w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl"`
  ],
  [
    `className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-900 bg-zinc-900/30"`,
    `className="flex items-center justify-between px-6 py-4.5 border-b border-[#d8e7f0] bg-[#ebf3f3]"`
  ],
  [
    `className="text-[10px] text-zinc-550 font-mono flex items-center gap-1"`,
    `className="text-[10px] text-[#536471] font-mono flex items-center gap-1"`
  ],
  [
    `<h3 className="text-base md:text-lg font-bold text-white truncate mt-1">{activePost.title}</h3>`,
    `<h3 className="text-base md:text-lg font-bold text-[#0f1419] truncate mt-1">{activePost.title}</h3>`
  ],
  [
    `className="p-1.5 rounded-lg text-zinc-550 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"`,
    `className="p-1.5 rounded-lg text-[#536471] hover:text-[#0f1419] hover:bg-[#E3ECF6] transition-all cursor-pointer"`
  ],
  [
    `className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-zinc-950/80 font-sans"`,
    `className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#ffffff] font-sans"`
  ],
  [
    `className="text-zinc-400 text-xs md:text-sm italic leading-relaxed border-b border-zinc-900 pb-5 mb-5 pl-3 border-l-2 border-zinc-700"`,
    `className="text-[#536471] text-xs md:text-sm italic leading-relaxed border-b border-[#d8e7f0] pb-5 mb-5 pl-3 border-l-4 border-[#137cc2] bg-[#f7f8f8] py-2 rounded-r-lg"`
  ],
  [
    `className="text-2xl font-extrabold text-white mt-6 mb-3 border-b border-zinc-900 pb-2"`,
    `className="text-2xl font-extrabold text-[#0f1419] mt-6 mb-3 border-b border-[#d8e7f0] pb-2"`
  ],
  [
    `className="text-xl font-bold text-white mt-5 mb-2.5"`,
    `className="text-xl font-bold text-[#0f1419] mt-5 mb-2.5"`
  ],
  [
    `className="text-lg font-bold text-white mt-4 mb-2"`,
    `className="text-lg font-bold text-[#0f1419] mt-4 mb-2"`
  ],
  [
    `className="text-base font-bold text-white mt-3.5 mb-1.5"`,
    `className="text-base font-bold text-[#0f1419] mt-3.5 mb-1.5"`
  ],
  [
    `className="list-disc ml-5 text-zinc-350 text-xs md:text-sm leading-relaxed mb-1.5"`,
    `className="list-disc ml-5 text-[#0f1419] text-xs md:text-sm leading-relaxed mb-1.5"`
  ],
  [
    `className="border-l-4 border-sky-500 pl-4 py-1.5 my-3 bg-zinc-900/40 text-zinc-400 italic text-xs rounded-r-lg"`,
    `className="border-l-4 border-[#137cc2] pl-4 py-1.5 my-3 bg-[#f7f8f8] text-[#536471] italic text-xs rounded-r-lg"`
  ],
  [
    `className="text-zinc-350 text-xs md:text-sm leading-relaxed mb-3.5"`,
    `className="text-[#0f1419] text-xs md:text-sm leading-relaxed mb-3.5"`
  ]
]);

// ==========================================
// 4. GuestbookSection.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/GuestbookSection.tsx'), [
  [
    `<h3 className="text-white font-semibold text-sm">Sign the Guestbook</h3>`,
    `<h3 className="text-[#0f1419] font-semibold text-sm">Sign the Guestbook</h3>`
  ],
  [
    `<p className="text-xs text-slate-500">`,
    `<p className="text-xs text-[#536471]">`
  ],
  [
    `<label className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">Your Name</label>`,
    `<label className="text-[10px] text-[#536471] uppercase font-bold tracking-wider">Your Name</label>`
  ],
  [
    `<User className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-650" />`,
    `<User className="absolute left-3.5 top-2.5 w-4 h-4 text-[#536471]" />`
  ],
  [
    `className="glass-input !pl-10 !py-2 text-sm bg-zinc-950/80 border border-zinc-850"`,
    `className="glass-input !pl-10 !py-2 text-sm bg-[#ffffff] border border-[#d8e7f0] text-[#0f1419]"`
  ],
  [
    `<label className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">Message</label>`,
    `<label className="text-[10px] text-[#536471] uppercase font-bold tracking-wider">Message</label>`
  ],
  [
    `className="glass-input mt-1 !py-2 text-sm bg-zinc-950/80 border border-zinc-850"`,
    `className="glass-input mt-1 !py-2 text-sm bg-[#ffffff] border border-[#d8e7f0] text-[#0f1419]"`
  ],
  [
    `className="glass-card-static p-4.5 space-y-2 border border-white/5 bg-zinc-950/40 relative group"`,
    `className="glass-card-static p-4.5 space-y-2 border border-[#d8e7f0] bg-[#ffffff] relative group shadow-xs"`
  ],
  [
    `<div className="flex items-center justify-between border-b border-white/5 pb-2">`,
    `<div className="flex items-center justify-between border-b border-[#d8e7f0] pb-2">`
  ],
  [
    `<span className="font-semibold text-white text-xs truncate max-w-[140px]">`,
    `<span className="font-semibold text-[#0f1419] text-xs truncate max-w-[140px]">`
  ],
  [
    `<span className="text-[9px] text-zinc-550 flex items-center gap-1 font-mono uppercase tracking-wider shrink-0">`,
    `<span className="text-[9px] text-[#536471] flex items-center gap-1 font-mono uppercase tracking-wider shrink-0">`
  ],
  [
    `<p className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words pl-1">`,
    `<p className="text-[#0f1419] text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words pl-1">`
  ],
  [
    `<div className="p-12 border border-dashed border-zinc-850 rounded-xl text-center text-zinc-650 text-xs">`,
    `<div className="p-12 border border-dashed border-[#d8e7f0] rounded-xl text-center text-[#536471] text-xs bg-[#ebf3f3]">`
  ]
]);

// ==========================================
// 5. StatsDisplay.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/StatsDisplay.tsx'), [
  [
    `className="glass-card-static p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 bg-zinc-950/40"`,
    `className="glass-card-static p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#d8e7f0] bg-[#ebf3f3] shadow-xs"`
  ],
  [
    `<h3 className="text-white font-bold text-lg flex items-center justify-center md:justify-start gap-2">`,
    `<h3 className="text-[#0f1419] font-bold text-lg flex items-center justify-center md:justify-start gap-2">`
  ],
  [
    `<p className="text-xs text-slate-500 max-w-lg">`,
    `<p className="text-xs text-[#536471] max-w-lg">`
  ],
  [
    `className="btn-ghost shrink-0 flex items-center gap-2 border-zinc-800 hover:bg-zinc-900"`,
    `className="btn-ghost shrink-0 flex items-center gap-2 border-[#d8e7f0] hover:bg-[#E3ECF6] text-[#0f1419]"`
  ],
  [
    `className="glass-card-static p-6 md:p-8 border border-white/5 hover:border-white/10 bg-zinc-950/40 relative overflow-hidden transition-all duration-300 group"`,
    `className="glass-card-static p-6 md:p-8 border border-[#d8e7f0] hover:border-[#1da1f2] bg-[#ebf3f3] relative overflow-hidden transition-all duration-300 group shadow-xs"`
  ],
  [
    `<div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0 bg-zinc-900">`,
    `<div className="w-16 h-16 rounded-full overflow-hidden border border-[#d8e7f0] shrink-0 bg-[#ffffff]">`
  ],
  [
    `<h3 className="text-white font-bold text-lg leading-tight">{stats.name || stats.login}</h3>`,
    `<h3 className="text-[#0f1419] font-bold text-lg leading-tight">{stats.name || stats.login}</h3>`
  ],
  [
    `className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-850"`,
    `className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#E3ECF6] text-[#137cc2] border border-[#d8e7f0]"`
  ],
  [
    `<p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">`,
    `<p className="text-xs text-[#536471] mt-1 max-w-sm leading-relaxed">`
  ],
  [
    `<div className="grid grid-cols-2 md:flex items-center gap-5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-900">`,
    `<div className="grid grid-cols-2 md:flex items-center gap-5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#d8e7f0]">`
  ],
  [
    `<div className="flex items-center gap-3 p-3.5 border border-zinc-900/60 bg-zinc-950/50 rounded-xl md:min-w-[125px]">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <FolderGit2 size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Repos</span>
                    <h4 className="text-base md:text-lg text-white font-extrabold leading-none mt-1 font-mono">
                      {stats.public_repos}
                    </h4>
                  </div>
                </div>`,
    `<div className="flex items-center gap-3 p-3.5 border border-[#d8e7f0] bg-[#ffffff] rounded-xl md:min-w-[125px] shadow-xs">
                  <div className="p-2 rounded-lg bg-[#E3ECF6] text-[#137cc2]">
                    <FolderGit2 size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#536471] uppercase font-mono font-bold tracking-wider">Repos</span>
                    <h4 className="text-base md:text-lg text-[#0f1419] font-extrabold leading-none mt-1 font-mono">
                      {stats.public_repos}
                    </h4>
                  </div>
                </div>`
  ],
  [
    `<div className="flex items-center gap-3 p-3.5 border border-zinc-900/60 bg-zinc-950/50 rounded-xl md:min-w-[125px]">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Users2 size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Followers</span>
                    <h4 className="text-base md:text-lg text-white font-extrabold leading-none mt-1 font-mono">
                      {stats.followers}
                    </h4>
                  </div>
                </div>`,
    `<div className="flex items-center gap-3 p-3.5 border border-[#d8e7f0] bg-[#ffffff] rounded-xl md:min-w-[125px] shadow-xs">
                  <div className="p-2 rounded-lg bg-[#E3ECF6] text-[#00b87a]">
                    <Users2 size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#536471] uppercase font-mono font-bold tracking-wider">Followers</span>
                    <h4 className="text-base md:text-lg text-[#0f1419] font-extrabold leading-none mt-1 font-mono">
                      {stats.followers}
                    </h4>
                  </div>
                </div>`
  ],
  [
    `className="col-span-2 md:col-span-1 p-3.5 border hover:border-zinc-700 bg-sky-500/10 hover:bg-sky-500/15 text-sky-400 hover:text-white border-sky-500/20 rounded-xl flex items-center justify-center gap-2.5 transition-all text-sm font-semibold h-[60px]"`,
    `className="col-span-2 md:col-span-1 p-3.5 border border-[#d8e7f0] hover:border-[#1da1f2] bg-[#E3ECF6] hover:bg-[#137cc2] text-[#137cc2] hover:text-white rounded-xl flex items-center justify-center gap-2.5 transition-all text-sm font-semibold h-[60px] shadow-xs"`
  ]
]);

// ==========================================
// 6. HeroSection.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/HeroSection.tsx'), [
  [
    `className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/20"`,
    `className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#d8e7f0] shadow-md bg-[#ffffff]"`
  ],
  [
    `className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"`,
    `className="text-[#536471] text-lg max-w-2xl mx-auto mb-10 leading-relaxed"`
  ],
  [
    `className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"`,
    `className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-[#0f1419] border border-[#d8e7f0] bg-[#ffffff] hover:bg-[#E3ECF6] hover:border-[#1da1f2] transition-all duration-300 hover:scale-105 shadow-xs"`
  ]
]);

// ==========================================
// 7. ExperienceTimeline.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/ExperienceTimeline.tsx'), [
  [
    `<div className="relative border-l border-white/10 pl-6 md:pl-8 ml-4 md:ml-6 space-y-12">`,
    `<div className="relative border-l-2 border-[#d8e7f0] pl-6 md:pl-8 ml-4 md:ml-6 space-y-12">`
  ],
  [
    `className="absolute -left-[39px] md:-left-[47px] top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#050508] flex items-center justify-center text-white"`,
    `className="absolute -left-[39px] md:-left-[47px] top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#ffffff] flex items-center justify-center text-white"`
  ],
  [
    `<div className="glass-card-static p-6 md:p-8 hover:border-white/15 hover:bg-white/5 transition-all duration-300">`,
    `<div className="glass-card-static p-6 md:p-8 hover:border-[#1da1f2] hover:bg-[#ffffff] transition-all duration-300 bg-[#ebf3f3] border border-[#d8e7f0] shadow-xs">`
  ],
  [
    `<h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>`,
    `<h3 className="text-xl font-bold text-[#0f1419] tracking-tight">{exp.role}</h3>`
  ],
  [
    `className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 self-start md:self-center"`,
    `className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E3ECF6] border border-[#d8e7f0] text-[#137cc2] self-start md:self-center"`
  ],
  [
    `<ul className="space-y-3.5 text-slate-400 text-sm md:text-[0.925rem] leading-relaxed">`,
    `<ul className="space-y-3.5 text-[#536471] text-sm md:text-[0.925rem] leading-relaxed">`
  ]
]);

// ==========================================
// 8. SkillsGrid.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/SkillsGrid.tsx'), [
  [
    `color: '#e2e8f0',`,
    `color: '#0f1419',`
  ],
  [
    `background: \`\${themeColor}10\`,`,
    `background: '#E3ECF6',`
  ],
  [
    `borderColor: \`\${themeColor}30\`,`,
    `borderColor: '#d8e7f0',`
  ]
]);

// ==========================================
// 9. TestimonialsSection.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/TestimonialsSection.tsx'), [
  [
    `<p className="text-slate-300 text-[0.95rem] leading-relaxed italic relative z-10">`,
    `<p className="text-[#0f1419] text-[0.95rem] leading-relaxed italic relative z-10">`
  ],
  [
    `<div className="flex items-center gap-4 border-t border-white/5 pt-4">`,
    `<div className="flex items-center gap-4 border-t border-[#d8e7f0] pt-4">`
  ],
  [
    `className="w-11 h-11 rounded-full object-cover border border-white/10"`,
    `className="w-11 h-11 rounded-full object-cover border border-[#d8e7f0]"`
  ],
  [
    `<h4 className="text-white font-semibold text-sm">{t.reviewer_name}</h4>`,
    `<h4 className="text-[#0f1419] font-semibold text-sm">{t.reviewer_name}</h4>`
  ],
  [
    `<p className="text-xs text-slate-500 mt-0.5">{t.designation}</p>`,
    `<p className="text-xs text-[#536471] mt-0.5">{t.designation}</p>`
  ]
]);

// ==========================================
// 10. SocialLinks.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/SocialLinks.tsx'), [
  [
    `className="group flex items-center gap-3 px-5 py-3 glass-card-static hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/5"`,
    `className="group flex items-center gap-3 px-5 py-3 glass-card-static hover:border-[#1da1f2] transition-all duration-300 hover:scale-105 hover:bg-[#ffffff] border-[#d8e7f0] bg-[#ebf3f3] shadow-xs"`
  ],
  [
    `<span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">`,
    `<span className="text-sm font-medium text-[#0f1419] group-hover:text-[#137cc2] transition-colors">`
  ]
]);

// ==========================================
// 11. Footer.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/Footer.tsx'), [
  [
    `className="relative z-10 px-6 py-10 border-t border-white/5"`,
    `className="relative z-10 px-6 py-10 border-t border-[#d8e7f0]"`
  ],
  [
    `<p className="text-slate-500 text-sm">`,
    `<p className="text-[#536471] text-sm">`
  ]
]);

// ==========================================
// 12. MatrixRain.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/components/portfolio/effects/MatrixRain.tsx'), [
  [
    `ctx.fillStyle = 'rgba(9, 9, 11, 0.06)'; // Creates trailing effect seamlessly`,
    `ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'; // Light mode trailing background`
  ],
  [
    `ctx.fillStyle = \`rgba(\${rgbString}, 0.35)\`; // Dynamic theme matrix dimming`,
    `ctx.fillStyle = \`rgba(\${rgbString}, 0.45)\`; // Sky vivid matrix glyphs`
  ]
]);

// ==========================================
// 13. LandingClient.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/app/LandingClient.tsx'), [
  [
    `className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-sky-500/20 text-sm text-slate-400 mb-8"`,
    `className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E3ECF6] border border-[#d8e7f0] text-sm text-[#137cc2] mb-8"`
  ],
  [
    `<p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">`,
    `<p className="text-lg md:text-xl text-[#536471] max-w-xl mx-auto leading-relaxed">`
  ],
  [
    `className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/15"`,
    `className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#d8e7f0] bg-[#ffffff]"`
  ],
  [
    `<h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors">`,
    `<h3 className="text-xl font-bold text-[#0f1419] mb-1 group-hover:text-[#137cc2] transition-colors">`
  ],
  [
    `<p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-5">`,
    `<p className="text-[#536471] text-sm leading-relaxed line-clamp-2 mb-5">`
  ],
  [
    `<h3 className="text-xl font-semibold text-slate-400 mb-2">No team members yet</h3>`,
    `<h3 className="text-xl font-semibold text-[#0f1419] mb-2">No team members yet</h3>`
  ],
  [
    `<p className="text-slate-500 mb-6">`,
    `<p className="text-[#536471] mb-6">`
  ],
  [
    `className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-300"`,
    `className="text-[#536471] hover:text-[#137cc2] text-sm font-semibold transition-colors duration-300"`
  ]
]);

// ==========================================
// 14. admin/layout.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/app/admin/layout.tsx'), [
  [
    `<div className="min-h-screen flex bg-[#000000]">`,
    `<div className="min-h-screen flex bg-[#f7f8f8] text-[#0f1419]">`
  ],
  [
    `border-r border-white/5 bg-[#17181c]/80 backdrop-blur-xl flex flex-col`,
    `border-r border-[#e1e8ed] bg-[#ffffff] flex flex-col shadow-xs`
  ],
  [
    `<div className="flex items-center justify-between p-5 border-b border-white/5">`,
    `<div className="flex items-center justify-between p-5 border-b border-[#e1e8ed]">`
  ],
  [
    `<span className="text-sm font-bold text-white tracking-wide">ADMIN</span>`,
    `<span className="text-sm font-bold text-[#0f1419] tracking-wide">ADMIN</span>`
  ],
  [
    `className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all"`,
    `className="p-2 rounded-lg hover:bg-[#E3ECF6] text-[#536471] hover:text-[#0f1419] transition-all"`
  ],
  [
    `<div className="p-3 border-t border-white/5">`,
    `<div className="p-3 border-t border-[#e1e8ed]">`
  ]
]);

// ==========================================
// 15. admin/page.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/app/admin/page.tsx'), [
  [
    `<p className="text-slate-500 text-sm mt-1">`,
    `<p className="text-[#536471] text-sm mt-1">`
  ],
  [
    `className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-white/5"`,
    `className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#d8e7f0] bg-[#ebf3f3]"`
  ],
  [
    `<p className="text-slate-650 text-xs mt-2.5">JPG, PNG or WebP. Max 2MB.</p>`,
    `<p className="text-[#536471] text-xs mt-2.5">JPG, PNG or WebP. Max 2MB.</p>`
  ],
  [
    `<label htmlFor="slug" className="block text-sm font-medium text-slate-400 mb-2">`,
    `<label htmlFor="slug" className="block text-sm font-semibold text-[#0f1419] mb-2">`
  ],
  [
    `<p className="text-slate-600 text-xs mt-1">`,
    `<p className="text-[#536471] text-xs mt-1">`
  ],
  [
    `<label htmlFor="fullName" className="block text-sm font-medium text-slate-400 mb-2">`,
    `<label htmlFor="fullName" className="block text-sm font-semibold text-[#0f1419] mb-2">`
  ],
  [
    `<label\n              htmlFor="profTitle"\n              className="block text-sm font-medium text-slate-400 mb-2"\n            >`,
    `<label\n              htmlFor="profTitle"\n              className="block text-sm font-semibold text-[#0f1419] mb-2"\n            >`
  ],
  [
    `<label\n              htmlFor="themeColor"\n              className="block text-sm font-medium text-slate-400 mb-2"\n            >`,
    `<label\n              htmlFor="themeColor"\n              className="block text-sm font-semibold text-[#0f1419] mb-2"\n            >`
  ],
  [
    `className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"`,
    `className="w-10 h-10 rounded-lg border border-[#d8e7f0] cursor-pointer bg-transparent"`
  ],
  [
    `<label htmlFor="resumeUrl" className="block text-sm font-medium text-slate-400 mb-2">`,
    `<label htmlFor="resumeUrl" className="block text-sm font-semibold text-[#0f1419] mb-2">`
  ],
  [
    `<label htmlFor="bio" className="block text-sm font-medium text-slate-400 mb-2">`,
    `<label htmlFor="bio" className="block text-sm font-semibold text-[#0f1419] mb-2">`
  ]
]);

// ==========================================
// 16. admin/projects/page.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/app/admin/projects/page.tsx'), [
  [
    `<p className="text-slate-500 text-sm mt-1">`,
    `<p className="text-[#536471] text-sm mt-1">`
  ],
  [
    `<p className="text-slate-400">`,
    `<p className="text-[#536471]">`
  ],
  [
    `<div className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 bg-white/5 relative group">`,
    `<div className="w-24 h-24 rounded-lg overflow-hidden border border-[#d8e7f0] bg-[#ffffff] relative group">`
  ],
  [
    `<h3 className="text-lg font-semibold text-slate-400 mt-4 mb-2">`,
    `<h3 className="text-lg font-semibold text-[#0f1419] mt-4 mb-2">`
  ],
  [
    `<p className="text-slate-500 text-sm mb-4">`,
    `<p className="text-[#536471] text-sm mb-4">`
  ],
  [
    `className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto"`,
    `className="w-16 h-16 rounded-2xl bg-[#ebf3f3] border border-[#d8e7f0] flex items-center justify-center mx-auto"`
  ]
]);

// ==========================================
// 17. admin/skills/page.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/app/admin/skills/page.tsx'), [
  [
    `<p className="text-slate-500 text-sm mt-1">`,
    `<p className="text-[#536471] text-sm mt-1">`
  ],
  [
    `<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">`,
    `<h3 className="text-sm font-semibold text-[#0f1419] uppercase tracking-wider mb-4">`
  ],
  [
    `<option key={cat} value={cat} className="bg-[#17181c]">`,
    `<option key={cat} value={cat} className="bg-[#ffffff] text-[#0f1419]">`
  ],
  [
    `className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-red-400/30 transition-all duration-200"`,
    `className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E3ECF6] border border-[#d8e7f0] hover:border-red-400/30 transition-all duration-200"`
  ],
  [
    `<span className="text-sm text-slate-300">{skill.skill_name}</span>`,
    `<span className="text-sm text-[#0f1419] font-medium">{skill.skill_name}</span>`
  ],
  [
    `className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4"`,
    `className="w-16 h-16 rounded-2xl bg-[#ebf3f3] border border-[#d8e7f0] flex items-center justify-center mx-auto mb-4"`
  ],
  [
    `<h3 className="text-lg font-semibold text-slate-400 mb-2">No skills yet</h3>`,
    `<h3 className="text-lg font-semibold text-[#0f1419] mb-2">No skills yet</h3>`
  ],
  [
    `<p className="text-slate-500 text-sm">`,
    `<p className="text-[#536471] text-sm">`
  ]
]);

// ==========================================
// 18. admin/social/page.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/app/admin/social/page.tsx'), [
  [
    `<p className="text-slate-500 text-sm mt-1">`,
    `<p className="text-[#536471] text-sm mt-1">`
  ],
  [
    `<h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">`,
    `<h3 className="text-sm font-semibold text-[#0f1419] uppercase tracking-wider mb-4">`
  ],
  [
    `<option key={p} value={p} className="bg-[#17181c]">`,
    `<option key={p} value={p} className="bg-[#ffffff] text-[#0f1419]">`
  ],
  [
    `<p className="text-sm font-semibold text-white">{link.platform}</p>`,
    `<p className="text-sm font-semibold text-[#0f1419]">{link.platform}</p>`
  ],
  [
    `<p className="text-xs text-slate-500 truncate">{link.url}</p>`,
    `<p className="text-xs text-[#536471] truncate">{link.url}</p>`
  ],
  [
    `className="btn-ghost !px-3 text-slate-400 hover:text-white"`,
    `className="btn-ghost !px-3 text-[#536471] hover:text-[#137cc2]"`
  ],
  [
    `className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4"`,
    `className="w-16 h-16 rounded-2xl bg-[#ebf3f3] border border-[#d8e7f0] flex items-center justify-center mx-auto mb-4"`
  ],
  [
    `<h3 className="text-lg font-semibold text-slate-400 mb-2">`,
    `<h3 className="text-lg font-semibold text-[#0f1419] mb-2">`
  ],
  [
    `<p className="text-slate-500 text-sm">`,
    `<p className="text-[#536471] text-sm">`
  ]
]);

// ==========================================
// 19. admin/login/page.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/app/admin/login/page.tsx'), [
  [
    `className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 mb-6"`,
    `className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E3ECF6] border border-[#d8e7f0] text-sm text-[#137cc2] mb-6"`
  ],
  [
    `<p className="text-slate-500">Sign in to manage your portfolio</p>`,
    `<p className="text-[#536471]">Sign in to manage your portfolio</p>`
  ],
  [
    `<label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">`,
    `<label htmlFor="email" className="block text-sm font-semibold text-[#0f1419] mb-2">`
  ],
  [
    `<label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-2">`,
    `<label htmlFor="password" className="block text-sm font-semibold text-[#0f1419] mb-2">`
  ],
  [
    `<p className="text-slate-500 text-sm">`,
    `<p className="text-[#536471] text-sm">`
  ]
]);

// ==========================================
// 20. admin/signup/page.tsx
// ==========================================
replaceInFile(path.join(__dirname, '../src/app/admin/signup/page.tsx'), [
  [
    `className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 mb-6"`,
    `className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E3ECF6] border border-[#d8e7f0] text-sm text-[#137cc2] mb-6"`
  ],
  [
    `<p className="text-slate-500">`,
    `<p className="text-[#536471]">`
  ],
  [
    `className="block text-sm font-medium text-slate-400 mb-2"`,
    `className="block text-sm font-semibold text-[#0f1419] mb-2"`
  ],
  [
    `<p className="text-slate-600 text-xs mt-1">`,
    `<p className="text-[#536471] text-xs mt-1">`
  ],
  [
    `<p className="text-slate-500 text-sm">`,
    `<p className="text-[#536471] text-sm">`
  ],
  [
    `className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-400 text-sm transition-colors"`,
    `className="inline-flex items-center gap-1.5 text-[#536471] hover:text-[#137cc2] text-sm font-semibold transition-colors"`
  ]
]);

console.log('Component replacement batch 1 complete.');
