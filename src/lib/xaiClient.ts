/**
 * Official xAI Grok API Client for Persona Flow
 * 
 * Secure server-side client connecting to https://api.x.ai/v1/responses.
 * - Reads API key exclusively from process.env.XAI_API_KEY.
 * - Reads model identifier from process.env.XAI_MODEL (defaults to grok-2-latest).
 * - Zero client-side leakage: never exposes the secret key in frontend bundles, logs, or error responses.
 */

import type { Profile, CareerStage } from '@/types/database.types';

export const XAI_RESPONSES_ENDPOINT = 'https://api.x.ai/v1/responses';
export const XAI_COMPLETIONS_ENDPOINT = 'https://api.x.ai/v1/chat/completions';
export const DEFAULT_XAI_MODEL = 'grok-2-latest';

// Approved Design Tokens
export const APPROVED_COLORS = [
  '#137cc2', // Sky Vivid Primary
  '#0284c7', // Sky Deep Blue
  '#0f1419', // Executive Obsidian
  '#10b981', // Emerald Tech
  '#6366f1', // Indigo Cyber
  '#8b5cf6', // Violet Neon
  '#f59e0b', // Amber Academic
  '#06b6d4', // Cyan Flow
];

export const APPROVED_FONTS = [
  'Plus Jakarta Sans',
  'Inter',
  'Open Sans',
  'JetBrains Mono',
  'Fira Code',
  'Space Grotesk',
  'Outfit',
  'Syncopate',
];

export const APPROVED_LAYOUTS = ['classic', 'minimalist', 'cyberpunk-grid'] as const;
export const APPROVED_BACKGROUNDS = [
  'mesh-gradient',
  'particles',
  'matrix',
  'aurora',
  'cyber-grid',
  'none',
] as const;
export const APPROVED_ANIMATIONS = ['fade', 'slide-up', 'glitch', 'liquid-reveal'] as const;
export const APPROVED_SPEEDS = ['slow', 'normal', 'fast'] as const;

export interface PortfolioDesignConfig {
  theme_pack: 'student-starter' | 'developer-pro' | 'professional-elite';
  theme_color: string;
  typography: string;
  layout_variant: 'classic' | 'minimalist' | 'cyberpunk-grid';
  background_effect: 'mesh-gradient' | 'particles' | 'matrix' | 'aurora' | 'cyber-grid' | 'none';
  animation_style: 'fade' | 'slide-up' | 'glitch' | 'liquid-reveal';
  animation_speed: 'slow' | 'normal' | 'fast';
  ai_headline: string;
  ai_summary_bio: string;
  curated_sections: string[];
  design_rationale: string;
  is_ai_generated: boolean;
  fallback_used?: boolean;
  fallback_reason?: string;
  model_used?: string;
  generated_at: string;
}

/**
 * Sanitizes any string to remove possible API key occurrences.
 */
function sanitizeError(msg: string, key?: string): string {
  if (!msg) return 'Unknown error';
  let sanitized = msg;
  if (key) {
    sanitized = sanitized.split(key).join('[REDACTED_API_KEY]');
  }
  // Also redact any potential Bearer tokens in headers
  sanitized = sanitized.replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]');
  return sanitized;
}

/**
 * Parses text from xAI Responses or Chat Completions API response.
 */
function extractTextFromXaiResponse(data: any): string {
  if (!data) return '';

  // 1. Check Responses API output structure: output[0].content[0].text
  if (Array.isArray(data.output)) {
    const texts: string[] = [];
    for (const item of data.output) {
      if (Array.isArray(item.content)) {
        for (const c of item.content) {
          if (c.text) texts.push(c.text);
          else if (c.output_text) texts.push(c.output_text);
        }
      } else if (typeof item.text === 'string') {
        texts.push(item.text);
      }
    }
    if (texts.length > 0) return texts.join('\n');
  }

  // 2. Check legacy Chat Completions choices[0].message.content
  if (Array.isArray(data.choices) && data.choices[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  // 3. Fallback direct text
  if (typeof data.text === 'string') return data.text;
  if (typeof data.response === 'string') return data.response;

  return '';
}

/**
 * Strip Markdown code blocks before parsing JSON.
 */
function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Validates and normalizes an AI-generated or fallback design configuration.
 */
export function validateDesignConfig(
  raw: any,
  fallbackPack: 'student-starter' | 'developer-pro' | 'professional-elite',
  defaultName: string
): PortfolioDesignConfig {
  const theme_pack = ['student-starter', 'developer-pro', 'professional-elite'].includes(
    raw?.theme_pack
  )
    ? raw.theme_pack
    : fallbackPack;

  let theme_color = typeof raw?.theme_color === 'string' && /^#[0-9a-fA-F]{6}$/.test(raw.theme_color)
    ? raw.theme_color
    : '#137cc2';

  if (!APPROVED_COLORS.includes(theme_color)) {
    theme_color = '#137cc2'; // Force approved palette
  }

  const typography = APPROVED_FONTS.includes(raw?.typography)
    ? raw.typography
    : 'Plus Jakarta Sans';

  const layout_variant = APPROVED_LAYOUTS.includes(raw?.layout_variant)
    ? raw.layout_variant
    : theme_pack === 'developer-pro'
    ? 'cyberpunk-grid'
    : theme_pack === 'professional-elite'
    ? 'minimalist'
    : 'classic';

  const background_effect = APPROVED_BACKGROUNDS.includes(raw?.background_effect)
    ? raw.background_effect
    : theme_pack === 'developer-pro'
    ? 'cyber-grid'
    : 'mesh-gradient';

  const animation_style = APPROVED_ANIMATIONS.includes(raw?.animation_style)
    ? raw.animation_style
    : 'fade';

  const animation_speed = APPROVED_SPEEDS.includes(raw?.animation_speed)
    ? raw.animation_speed
    : 'normal';

  const ai_headline = typeof raw?.ai_headline === 'string' && raw.ai_headline.trim()
    ? raw.ai_headline.trim().slice(0, 100)
    : `${defaultName} — Portfolio`;

  const ai_summary_bio = typeof raw?.ai_summary_bio === 'string' && raw.ai_summary_bio.trim()
    ? raw.ai_summary_bio.trim().slice(0, 500)
    : '';

  const curated_sections = Array.isArray(raw?.curated_sections) && raw.curated_sections.length > 0
    ? raw.curated_sections.filter((s: any) => typeof s === 'string')
    : ['hero', 'skills', 'projects', 'education', 'certifications', 'experience', 'social'];

  const design_rationale = typeof raw?.design_rationale === 'string' && raw.design_rationale.trim()
    ? raw.design_rationale.trim().slice(0, 300)
    : 'Synthesized design system optimized for clarity, typography, and candidate career stage.';

  return {
    theme_pack,
    theme_color,
    typography,
    layout_variant,
    background_effect,
    animation_style,
    animation_speed,
    ai_headline,
    ai_summary_bio,
    curated_sections,
    design_rationale,
    is_ai_generated: Boolean(raw?.is_ai_generated),
    fallback_used: Boolean(raw?.fallback_used),
    fallback_reason: raw?.fallback_reason,
    model_used: raw?.model_used,
    generated_at: new Date().toISOString(),
  };
}

/**
 * Deterministic template fallback when XAI_API_KEY is not set or network fails.
 */
export function generateDeterministicFallback(
  profile: Profile,
  targetPack?: string,
  reason = 'xAI Grok API key not configured. Using deterministic stage template.',
  userPreferences?: Partial<PortfolioDesignConfig>
): PortfolioDesignConfig {
  const stage = profile.career_stage || 'first-year';
  let defaultPack: 'student-starter' | 'developer-pro' | 'professional-elite' = 'student-starter';

  if (targetPack === 'developer-pro' || targetPack === 'professional-elite') {
    defaultPack = targetPack;
  } else if (stage === 'third-year' || stage === 'fourth-year' || stage === 'job-seeker') {
    defaultPack = 'developer-pro';
  } else if (stage === 'professional' || stage === 'hr-recruiter') {
    defaultPack = 'professional-elite';
  }

  const raw = {
    theme_pack: userPreferences?.theme_pack || defaultPack,
    theme_color: userPreferences?.theme_color || profile.theme_color || (defaultPack === 'professional-elite' ? '#0f1419' : '#137cc2'),
    typography: userPreferences?.typography || profile.custom_font || (defaultPack === 'developer-pro' ? 'JetBrains Mono' : 'Plus Jakarta Sans'),
    layout_variant: userPreferences?.layout_variant || profile.layout_variant || (defaultPack === 'developer-pro' ? 'cyberpunk-grid' : defaultPack === 'professional-elite' ? 'minimalist' : 'classic'),
    background_effect: userPreferences?.background_effect || profile.background_effect || (defaultPack === 'developer-pro' ? 'cyber-grid' : 'mesh-gradient'),
    animation_style: userPreferences?.animation_style || profile.animation_style || 'fade',
    animation_speed: userPreferences?.animation_speed || profile.animation_speed || 'normal',
    ai_headline: profile.headline || profile.professional_title || `${profile.full_name || 'Candidate'} Portfolio`,
    ai_summary_bio: profile.bio || 'Professional engineering candidate on Persona Flow.',
    curated_sections: ['hero', 'skills', 'projects', 'education', 'certifications', 'experience', 'social'],
    design_rationale: `Standard verified preset configured for ${stage.replace('-', ' ')} stage with customized motion & atmosphere.`,
    is_ai_generated: false,
    fallback_used: true,
    fallback_reason: reason,
    model_used: 'rule-based-fallback',
  };

  return validateDesignConfig(raw, defaultPack, profile.full_name || 'Candidate');
}

/**
 * Step 1: Healthcheck test request to verify API key, model availability, and connectivity.
 */
export async function testXaiConnection(): Promise<{
  success: boolean;
  status: 'connected' | 'missing_key' | 'unauthorized' | 'api_error';
  model: string;
  endpoint: string;
  latencyMs?: number;
  message: string;
  responsePreview?: string;
}> {
  const apiKey = process.env.XAI_API_KEY?.trim();
  const model = process.env.XAI_MODEL?.trim() || DEFAULT_XAI_MODEL;

  if (!apiKey) {
    return {
      success: false,
      status: 'missing_key',
      model,
      endpoint: XAI_RESPONSES_ENDPOINT,
      message: 'XAI_API_KEY environment variable is not configured on the server.',
    };
  }

  const startTime = Date.now();

  try {
    // Attempt 1: Call official Responses API
    const response = await fetch(XAI_RESPONSES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: 'Ping test from Persona Flow. Respond only with: PONG',
        store: false,
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errText = await response.text();
      // If 404 on /responses, try fallback to /chat/completions
      if (response.status === 404) {
        const fallbackResp = await fetch(XAI_COMPLETIONS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: 'Ping test from Persona Flow. Respond only with: PONG' }],
          }),
        });

        if (fallbackResp.ok) {
          const fbData = await fallbackResp.json();
          const reply = extractTextFromXaiResponse(fbData);
          return {
            success: true,
            status: 'connected',
            model,
            endpoint: XAI_COMPLETIONS_ENDPOINT,
            latencyMs: Date.now() - startTime,
            message: 'xAI Grok connection verified successfully via completions endpoint.',
            responsePreview: reply.trim(),
          };
        }
      }

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          status: 'unauthorized',
          model,
          endpoint: XAI_RESPONSES_ENDPOINT,
          latencyMs,
          message: 'xAI API authentication failed. Please check that XAI_API_KEY is valid and has active permissions.',
        };
      }

      return {
        success: false,
        status: 'api_error',
        model,
        endpoint: XAI_RESPONSES_ENDPOINT,
        latencyMs,
        message: sanitizeError(`xAI API returned HTTP ${response.status}: ${errText}`, apiKey),
      };
    }

    const data = await response.json();
    const reply = extractTextFromXaiResponse(data);

    return {
      success: true,
      status: 'connected',
      model,
      endpoint: XAI_RESPONSES_ENDPOINT,
      latencyMs,
      message: 'xAI Grok connection verified successfully via Responses API.',
      responsePreview: reply.trim(),
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'api_error',
      model,
      endpoint: XAI_RESPONSES_ENDPOINT,
      latencyMs: Date.now() - startTime,
      message: sanitizeError(err?.message || 'Network error reaching xAI API', apiKey),
    };
  }
}

/**
 * Step 2: Generate My Portfolio AI Design Configuration.
 * Sends the candidate's actual profile facts to Grok and returns a validated JSON design system.
 */
export async function generatePortfolioDesignWithGrok(
  profile: Profile,
  targetPackSlug?: string,
  userPreferences?: Partial<PortfolioDesignConfig>
): Promise<PortfolioDesignConfig> {
  const apiKey = process.env.XAI_API_KEY?.trim();
  const model = process.env.XAI_MODEL?.trim() || DEFAULT_XAI_MODEL;

  // If no API key configured, use deterministic template fallback immediately
  if (!apiKey) {
    return generateDeterministicFallback(
      profile,
      targetPackSlug,
      'XAI_API_KEY is not configured on the server. Template fallback activated.',
      userPreferences
    );
  }

  // Construct structured prompt with candidate facts & vibe preferences
  const candidateSummary = {
    full_name: profile.full_name || 'Candidate',
    career_stage: profile.career_stage || 'first-year',
    current_headline: profile.headline || profile.professional_title || '',
    bio: profile.bio || '',
    skills: (profile.skills || []).map((s) => `${s.skill_name} (${s.category || 'General'})`),
    projects: (profile.projects || []).map((p) => ({
      title: p.title,
      description: p.description?.slice(0, 150),
    })),
    education: (profile.education || []).map((e) => `${e.degree} at ${e.institution}`),
    certifications: (profile.certifications || []).map((c) => c.title),
    experience: (profile.experiences || []).map((e) => `${e.role} at ${e.company}`),
    target_pack: targetPackSlug || profile.active_theme_pack || 'student-starter',
    user_preferences: {
      animation_style: userPreferences?.animation_style || profile.animation_style || 'fade',
      animation_speed: userPreferences?.animation_speed || profile.animation_speed || 'normal',
      background_effect: userPreferences?.background_effect || profile.background_effect || 'mesh-gradient',
      typography: userPreferences?.typography || profile.custom_font || 'Plus Jakarta Sans',
      theme_color: userPreferences?.theme_color || profile.theme_color || '#137cc2',
    },
  };

  const systemInstructions = `
You are the Persona Flow AI Design Architect powered by xAI Grok.
Your role is to analyze a candidate's actual engineering profile and generate an optimized visual design configuration.
Respect candidate's selected preferences for motion speed ("${candidateSummary.user_preferences.animation_speed}"), motion style ("${candidateSummary.user_preferences.animation_style}"), atmosphere background ("${candidateSummary.user_preferences.background_effect}"), typography ("${candidateSummary.user_preferences.typography}"), and accent color ("${candidateSummary.user_preferences.theme_color}").

You MUST choose exclusively from these approved design tokens:
- theme_pack: "student-starter" (1st/2nd yr students), "developer-pro" (3rd/4th yr & job seekers), or "professional-elite" (experienced engineers & leaders). Target pack is "${candidateSummary.target_pack}".
- theme_color: One of ["#137cc2", "#0284c7", "#0f1419", "#10b981", "#6366f1", "#8b5cf6", "#f59e0b", "#06b6d4"].
- typography: One of ["Plus Jakarta Sans", "Inter", "Open Sans", "JetBrains Mono", "Fira Code", "Space Grotesk", "Outfit", "Syncopate"].
- layout_variant: One of ["classic", "minimalist", "cyberpunk-grid"].
- background_effect: One of ["mesh-gradient", "particles", "matrix", "aurora", "cyber-grid", "none"].
- animation_style: One of ["fade", "slide-up", "glitch", "liquid-reveal"].
- animation_speed: One of ["slow", "normal", "fast"].

Also generate:
- ai_headline: An impactful, concise (under 80 chars) professional headline tailored to their skills.
- ai_summary_bio: A crisp 2-3 sentence executive bio highlighting their key competencies.
- curated_sections: An array ordering the sections: ["hero", "skills", "projects", "education", "certifications", "experience", "social"].
- design_rationale: 1-2 sentences explaining why this visual identity suits the candidate.

CRITICAL: Return ONLY a valid JSON object matching the schema. No markdown formatting, no code blocks, no text outside the JSON.
`.trim();

  const userPrompt = `
Candidate Profile Details:
${JSON.stringify(candidateSummary, null, 2)}

Generate the complete JSON portfolio design configuration now.
`.trim();

  try {
    let rawJsonText = '';

    // Call xAI Responses API
    const response = await fetch(XAI_RESPONSES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: `${systemInstructions}\n\n${userPrompt}`,
        response_format: { type: 'json_object' },
        store: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      rawJsonText = extractTextFromXaiResponse(data);
    } else {
      // Fallback to chat completions if responses endpoint returned 404 or unsupported
      const fallbackResp = await fetch(XAI_COMPLETIONS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemInstructions },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (fallbackResp.ok) {
        const fbData = await fallbackResp.json();
        rawJsonText = extractTextFromXaiResponse(fbData);
      } else {
        const errText = await response.text();
        throw new Error(`xAI API call failed: ${response.status} - ${errText}`);
      }
    }

    const cleaned = cleanJsonString(rawJsonText);
    const parsed = JSON.parse(cleaned);

    parsed.is_ai_generated = true;
    parsed.model_used = model;

    return validateDesignConfig(
      parsed,
      candidateSummary.target_pack as any,
      profile.full_name || 'Candidate'
    );
  } catch (err: any) {
    console.error('xAI generation failed, falling back to deterministic template:', err?.message);
    return generateDeterministicFallback(
      profile,
      targetPackSlug,
      sanitizeError(`xAI Grok generation encountered an error: ${err?.message}`, apiKey)
    );
  }
}
