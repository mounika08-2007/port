import { createClient } from '@/lib/supabase';
import type { ThemePack, UserEntitlement, CareerStage } from '@/types/database.types';

export const DEFAULT_THEME_PACKS: ThemePack[] = [
  {
    slug: 'student-starter',
    name: 'Student Starter Pack',
    tagline: 'Clean academic & foundational project showcase tailored for 1st and 2nd year engineering students.',
    listed_price: 199,
    currency: 'INR',
    is_active: true,
    thumbnail_url: '/themes/student-starter-preview.png',
    recommended_for: ['first-year', 'second-year'],
    features: [
      'Academic Credentials & CGPA Highlights',
      'Coursework & Foundational Skills Showcase',
      'Club, Hackathon & Volunteering Timeline',
      'Problem-Solution Mini-Project Cards',
      'Clean Sky Vivid Academic Light Theme',
      'Direct Resume PDF Viewer & Download',
      'Custom Public URL (/portfolio/your-name)',
    ],
    display_order: 1,
  },
  {
    slug: 'developer-pro',
    name: 'Developer Pro Pack',
    tagline: 'Engineered for 3rd & 4th year tech students and active job seekers with interactive CLI & live GitHub metrics.',
    listed_price: 399,
    currency: 'INR',
    is_active: true,
    thumbnail_url: '/themes/developer-pro-preview.png',
    recommended_for: ['third-year', 'fourth-year', 'job-seeker'],
    features: [
      'Everything in Student Starter Pack',
      'Interactive CLI Terminal & Command Shell',
      'AI Portfolio Assistant with Smart Chat',
      'GitHub Live API & Repo Metric Widgets',
      'Detailed Case Studies (Problem, Solution, Architecture)',
      'Vibe Controls & Background FX Engine',
      'Direct Resume Download & Social Integrations',
    ],
    display_order: 2,
  },
  {
    slug: 'professional-elite',
    name: 'Professional Elite Pack',
    tagline: 'Designed for experienced engineers, team leads, and HR/recruitment professionals requiring executive credibility.',
    listed_price: 599,
    currency: 'INR',
    is_active: true,
    thumbnail_url: '/themes/professional-elite-preview.png',
    recommended_for: ['professional', 'hr-recruiter'],
    features: [
      'Everything in Developer Pro Pack',
      'Executive Career Timeline & Milestone Tracker',
      'Leadership Impact & Architecture Case Studies',
      'Peer & Client Recommendations / Testimonials',
      'Technical Articles & Thought Leadership Blog Section',
      'Recruiter-First Quick Contact & Booking Widget',
      'Priority Public Slug & Custom Meta Tags',
    ],
    display_order: 3,
  },
];

/**
 * Fetch all theme packs from Supabase, falling back to default packs if table not migrated yet.
 */
export async function fetchThemePacks(): Promise<ThemePack[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('theme_packs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_THEME_PACKS;
    }

    return data.map((item) => ({
      ...item,
      features: Array.isArray(item.features)
        ? item.features
        : typeof item.features === 'string'
        ? JSON.parse(item.features)
        : [],
    }));
  } catch {
    return DEFAULT_THEME_PACKS;
  }
}

/**
 * Fetch a single theme pack by slug.
 */
export async function fetchThemePackBySlug(slug: string): Promise<ThemePack> {
  const packs = await fetchThemePacks();
  const match = packs.find((p) => p.slug === slug);
  if (match) return match;
  return DEFAULT_THEME_PACKS.find((p) => p.slug === slug) || DEFAULT_THEME_PACKS[0];
}

/**
 * Fetch active entitlements for a given user.
 */
export async function fetchUserEntitlements(userId: string): Promise<UserEntitlement[]> {
  if (!userId) return [];

  const localKey = `paas_entitlements_${userId}`;
  let localFallback: UserEntitlement[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(localKey);
      if (stored) {
        localFallback = JSON.parse(stored);
      }
    } catch {
      // ignore JSON errors
    }
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_entitlements')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error || !data) {
      return localFallback;
    }

    // Merge Supabase records with local fallback
    const all = [...data, ...localFallback];
    const unique = Array.from(new Map(all.map((item) => [item.pack_slug, item])).values());
    return unique;
  } catch {
    return localFallback;
  }
}

/**
 * Activate a demo theme pack for a user under the AICTE Expo Demo policy.
 * - ₹0 amount payable
 * - 100% demo discount
 * - Transparently marked as a Demo Entitlement in Supabase
 */
export async function activateDemoPack({
  userId,
  packSlug,
  userEmail,
}: {
  userId: string;
  packSlug: string;
  userEmail?: string;
}): Promise<{ success: boolean; entitlement: UserEntitlement; error?: string }> {
  const pack = await fetchThemePackBySlug(packSlug);
  const transactionRef = `EXPO-DEMO-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;

  const newEntitlement: UserEntitlement = {
    user_id: userId,
    pack_slug: pack.slug,
    status: 'active',
    is_demo: true,
    listed_price_inr: pack.listed_price,
    amount_paid_inr: 0,
    transaction_ref: transactionRef,
    notes: `AICTE Expo Demo Activation for ${userEmail || 'Demo User'} — ₹0 Demo Pass`,
    activated_at: new Date().toISOString(),
  };

  // 1. Save to Supabase user_entitlements
  const supabase = createClient();
  try {
    await supabase.from('user_entitlements').insert({
      user_id: userId,
      pack_slug: pack.slug,
      status: 'active',
      is_demo: true,
      listed_price_inr: pack.listed_price,
      amount_paid_inr: 0,
      transaction_ref: transactionRef,
      notes: newEntitlement.notes,
    });
  } catch (err) {
    console.warn('Note: Supabase user_entitlements insert fallback active:', err);
  }

  // 2. Update user's active_theme_pack in profiles
  try {
    await supabase
      .from('profiles')
      .update({
        active_theme_pack: pack.slug,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  } catch (err) {
    console.warn('Note: Supabase profiles active_theme_pack update fallback active:', err);
  }

  // 3. Save to localStorage for robust offline/demo resilience
  if (typeof window !== 'undefined') {
    try {
      const localKey = `paas_entitlements_${userId}`;
      const existing = localStorage.getItem(localKey);
      const list: UserEntitlement[] = existing ? JSON.parse(existing) : [];
      list.push(newEntitlement);
      localStorage.setItem(localKey, JSON.stringify(list));
      localStorage.setItem(`paas_active_pack_${userId}`, pack.slug);
    } catch (err) {
      console.warn('localStorage save warning:', err);
    }
  }

  return { success: true, entitlement: newEntitlement };
}
