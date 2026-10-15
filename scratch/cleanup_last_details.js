const fs = require('fs');
const path = require('path');

function normalizeAndReplace(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  let normalized = content.replace(/\r\n/g, '\n');

  for (const [target, replacement] of replacements) {
    const normTarget = target.replace(/\r\n/g, '\n');
    const normReplacement = replacement.replace(/\r\n/g, '\n');
    if (normalized.includes(normTarget)) {
      normalized = normalized.replaceAll(normTarget, normReplacement);
      console.log(`[REPLACED] in ${path.basename(filePath)}: ${normTarget.slice(0, 40)}`);
    } else {
      console.warn(`[NOT FOUND] in ${path.basename(filePath)}: ${normTarget.slice(0, 40)}`);
    }
  }

  const finalContent = isCrlf ? normalized.replace(/\n/g, '\r\n') : normalized;
  fs.writeFileSync(filePath, finalContent, 'utf8');
}

// 1. StatsDisplay.tsx
normalizeAndReplace(path.join(__dirname, '../src/components/portfolio/StatsDisplay.tsx'), [
  [
    `<div className="glass-card-static p-10 flex items-center justify-center border border-white/5">`,
    `<div className="glass-card-static p-10 flex items-center justify-center border border-[#d8e7f0] bg-[#ebf3f3]">`
  ]
]);

// 2. src/app/portfolio/[slug]/page.tsx
normalizeAndReplace(path.join(__dirname, '../src/app/portfolio/[slug]/page.tsx'), [
  [
    `<p className="text-slate-400 text-lg mb-6">
            Portfolio not found for <span className="text-white font-medium">&quot;{slug}&quot;</span>
          </p>`,
    `<p className="text-[#536471] text-lg mb-6">
            Portfolio not found for <span className="text-[#0f1419] font-bold">&quot;{slug}&quot;</span>
          </p>`
  ]
]);

// 3. VibeControlsContainer.tsx
normalizeAndReplace(path.join(__dirname, '../src/components/admin/VibeControlsContainer.tsx'), [
  [
    `hover:border-zinc-700`,
    `hover:border-[#1da1f2]`
  ],
  [
    `hover:text-white`,
    `hover:text-[#137cc2]`
  ],
  [
    `<h5 className="text-white font-semibold text-[10px] leading-none">{tempTesti.reviewer_name}</h5>`,
    `<h5 className="text-[#0f1419] font-semibold text-[10px] leading-none">{tempTesti.reviewer_name}</h5>`
  ],
  [
    `data-text="STUDIO VIEW">\n                        <span className="gradient-text relative z-10">STUDIO VIEW</span>\n                      </h4>`,
    `data-text="STUDIO VIEW">\n                        <span className="gradient-text relative z-10">STUDIO VIEW</span>\n                      </h4>`
  ]
]);

// 4. admin/projects/page.tsx
normalizeAndReplace(path.join(__dirname, '../src/app/admin/projects/page.tsx'), [
  [
    `bg-black/50`,
    `bg-slate-900/60`
  ]
]);

console.log('Cleanup complete.');
