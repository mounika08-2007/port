const fs = require('fs');
const path = require('path');

function normalizeAndReplace(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  let normalized = content.replace(/\r\n/g, '\n');
  let count = 0;

  for (const [target, replacement] of replacements) {
    const normTarget = target.replace(/\r\n/g, '\n');
    const normReplacement = replacement.replace(/\r\n/g, '\n');
    if (!normalized.includes(normTarget)) {
      console.warn(`[WARN] Not found in ${path.basename(filePath)}:\n${normTarget.slice(0, 80)}...`);
    } else {
      normalized = normalized.replaceAll(normTarget, normReplacement);
      count++;
    }
  }

  const finalContent = isCrlf ? normalized.replace(/\n/g, '\r\n') : normalized;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log(`[SUCCESS] Updated ${path.basename(filePath)} (${count} rules applied)`);
}

// ==========================================
// 1. Fix remaining items in ProjectShowcase.tsx
// ==========================================
normalizeAndReplace(path.join(__dirname, '../src/components/portfolio/ProjectShowcase.tsx'), [
  [
    `isActive
                      ? 'bg-sky-500 border-sky-400/30 text-white shadow-sm shadow-sky-500/25'
                      : 'border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white bg-zinc-950/20'`,
    `isActive
                      ? 'bg-[#137cc2] border-[#137cc2] text-white shadow-sm shadow-[#137cc2]/20'
                      : 'border-[#d8e7f0] hover:border-[#1da1f2] text-[#536471] hover:text-[#0f1419] bg-[#ffffff] hover:bg-[#E3ECF6]'`
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
// 2. Fix remaining labels in admin/page.tsx
// ==========================================
normalizeAndReplace(path.join(__dirname, '../src/app/admin/page.tsx'), [
  [
    `<label
              htmlFor="profTitle"
              className="block text-sm font-medium text-slate-400 mb-2"
            >`,
    `<label
              htmlFor="profTitle"
              className="block text-sm font-semibold text-[#0f1419] mb-2"
            >`
  ],
  [
    `<label
              htmlFor="themeColor"
              className="block text-sm font-medium text-slate-400 mb-2"
            >`,
    `<label
              htmlFor="themeColor"
              className="block text-sm font-semibold text-[#0f1419] mb-2"
            >`
  ]
]);

// ==========================================
// 3. VibeControlsContainer.tsx
// ==========================================
normalizeAndReplace(path.join(__dirname, '../src/components/admin/VibeControlsContainer.tsx'), [
  // Header
  [
    `<h2 className="text-xl font-bold text-white flex items-center gap-2">`,
    `<h2 className="text-xl font-bold text-[#0f1419] flex items-center gap-2">`
  ],
  [
    `<p className="text-xs text-slate-500">`,
    `<p className="text-xs text-[#536471]">`
  ],
  // Tabs bar
  [
    `<div className="flex border-b border-zinc-800 space-x-2 p-1 rounded-xl bg-zinc-900/50 max-w-md">`,
    `<div className="flex border border-[#d8e7f0] space-x-2 p-1 rounded-xl bg-[#ebf3f3] max-w-md">`
  ],
  [
    `activeTab === 'studio'
              ? 'bg-sky-500 text-white border border-sky-500/20 shadow-lg'
              : 'text-zinc-400 hover:text-white'`,
    `activeTab === 'studio'
              ? 'bg-[#137cc2] text-white shadow-sm font-bold'
              : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#ffffff]'`
  ],
  [
    `activeTab === 'sections'
              ? 'bg-sky-500 text-white border border-sky-500/20 shadow-lg'
              : 'text-zinc-400 hover:text-white'`,
    `activeTab === 'sections'
              ? 'bg-[#137cc2] text-white shadow-sm font-bold'
              : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#ffffff]'`
  ],
  [
    `activeTab === 'blog'
              ? 'bg-sky-500 text-white border border-sky-500/20 shadow-lg'
              : 'text-zinc-400 hover:text-white'`,
    `activeTab === 'blog'
              ? 'bg-[#137cc2] text-white shadow-sm font-bold'
              : 'text-[#536471] hover:text-[#0f1419] hover:bg-[#ffffff]'`
  ],
  // Studio section titles & helpers
  [
    `<h3 className="text-white font-semibold text-sm flex items-center gap-1.5">`,
    `<h3 className="text-[#0f1419] font-bold text-sm flex items-center gap-1.5">`
  ],
  [
    `text-zinc-500`,
    `text-[#536471]`
  ],
  // Animation style cards
  [
    `profile.animation_style === opt.id
                        ? 'border-sky-500 bg-sky-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'`,
    `profile.animation_style === opt.id
                        ? 'border-[#137cc2] bg-[#E3ECF6] text-[#137cc2] font-bold'
                        : 'border-[#d8e7f0] bg-[#ffffff] text-[#536471] hover:border-[#1da1f2] hover:bg-[#E3ECF6]'`
  ],
  [
    `<div className="text-xs font-semibold text-white">{opt.label}</div>`,
    `<div className="text-xs font-semibold text-[#0f1419]">{opt.label}</div>`
  ],
  // Animation speed
  [
    `<label className="text-xs font-semibold text-zinc-400">`,
    `<label className="text-xs font-semibold text-[#0f1419]">`
  ],
  [
    `<span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-900 text-sky-400">`,
    `<span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#E3ECF6] text-[#137cc2] border border-[#d8e7f0]">`
  ],
  [
    `profile.animation_speed === spd
                          ? 'border-sky-500 bg-sky-500/10 text-white'
                          : 'border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white'`,
    `profile.animation_speed === spd
                          ? 'border-[#137cc2] bg-[#137cc2] text-white'
                          : 'border-[#d8e7f0] bg-[#ffffff] text-[#536471] hover:bg-[#E3ECF6] hover:text-[#0f1419]'`
  ],
  // Ambient background cards
  [
    `profile.background_effect === opt.id
                        ? 'border-sky-500 bg-sky-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'`,
    `profile.background_effect === opt.id
                        ? 'border-[#137cc2] bg-[#E3ECF6] text-[#137cc2] font-bold'
                        : 'border-[#d8e7f0] bg-[#ffffff] text-[#536471] hover:border-[#1da1f2] hover:bg-[#E3ECF6]'`
  ],
  // Form labels & inputs
  [
    `<label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1">`,
    `<label className="block text-xs font-semibold text-[#0f1419] mb-2 flex items-center gap-1">`
  ],
  [
    `<label className="block text-xs font-semibold text-white mb-2">`,
    `<label className="block text-xs font-semibold text-[#0f1419] mb-2">`
  ],
  [
    `bg-zinc-950 border border-zinc-850`,
    `bg-[#ffffff] border border-[#d8e7f0] text-[#0f1419]`
  ],
  [
    `border-b border-zinc-800`,
    `border-b border-[#d8e7f0]`
  ],
  [
    `border-t border-zinc-900`,
    `border-t border-[#d8e7f0]`
  ],
  [
    `border-zinc-800`,
    `border-[#d8e7f0]`
  ],
  [
    `border-zinc-850`,
    `border-[#d8e7f0]`
  ],
  [
    `bg-zinc-800`,
    `bg-[#d8e7f0]`
  ],
  [
    `bg-zinc-900/20`,
    `bg-[#ffffff]`
  ],
  [
    `bg-zinc-900/50`,
    `bg-[#ebf3f3]`
  ],
  [
    `bg-zinc-900`,
    `bg-[#ebf3f3]`
  ],
  [
    `bg-zinc-950`,
    `bg-[#ffffff]`
  ],
  // Text colors
  [
    `text-white font-semibold text-sm`,
    `text-[#0f1419] font-bold text-sm`
  ],
  [
    `text-sm font-semibold text-white`,
    `text-sm font-semibold text-[#0f1419]`
  ],
  [
    `text-zinc-400`,
    `text-[#536471]`
  ],
  [
    `text-zinc-550`,
    `text-[#536471]`
  ],
  [
    `text-zinc-650`,
    `text-[#536471]`
  ],
  [
    `text-zinc-450`,
    `text-[#536471]`
  ],
  [
    `text-zinc-300`,
    `text-[#0f1419]`
  ],
  // Sandbox preview container
  [
    `style={{ backgroundColor: '#050508', borderColor: \`\${themeColor}20\` }}`,
    `style={{ backgroundColor: '#ffffff', borderColor: '#d8e7f0' }}`
  ],
  [
    `<h4 className="text-xl font-extrabold text-white tracking-tight uppercase">STUDIO VIEW</h4>`,
    `<h4 className="text-xl font-extrabold text-[#0f1419] tracking-tight uppercase">STUDIO VIEW</h4>`
  ],
  // Replay button
  [
    `className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all text-xs flex items-center gap-1"`,
    `className="p-1 rounded bg-[#ffffff] border border-[#d8e7f0] hover:bg-[#E3ECF6] text-[#536471] hover:text-[#0f1419] transition-all text-xs flex items-center gap-1 shadow-xs"`
  ]
]);

console.log('Batch 2 replacement complete.');
