import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Profile,
  Education,
  Certification,
  Project,
  Skill,
  SocialLink,
  Experience,
  CareerStage,
} from '@/types/database.types';

export interface SaveProfilePayload {
  fullName: string;
  slug: string;
  headline: string;
  professionalTitle: string;
  bio: string;
  location: string;
  phone: string;
  avatarUrl: string;
  resumeUrl: string;
  careerStage: CareerStage;
  activeThemePack: string;
  isPublished: boolean;
  educationList: Education[];
  skillsList: Skill[];
  projectsList: Project[];
  certificationsList: Certification[];
  socialLinksList: SocialLink[];
  experiencesList: Experience[];
}

export async function normalizeProfile(
  supabase: SupabaseClient,
  profile: any
): Promise<Profile> {
  if (!profile) return profile;

  // 1. Safely check dedicated education table if it exists
  try {
    const { data: eduData, error: eduError } = await supabase
      .from('education')
      .select('*')
      .eq('profile_id', profile.id)
      .order('display_order', { ascending: true });
    if (!eduError && eduData && eduData.length > 0) {
      profile.education = eduData;
    }
  } catch {
    // Schema fallback
  }

  // 2. Safely check dedicated certifications table if it exists
  try {
    const { data: certData, error: certError } = await supabase
      .from('certifications')
      .select('*')
      .eq('profile_id', profile.id)
      .order('display_order', { ascending: true });
    if (!certError && certData && certData.length > 0) {
      profile.certifications = certData;
    }
  } catch {
    // Schema fallback
  }

  // 3. Extract education, certifications, and stage metadata from testimonials JSONB if stored there
  if (
    profile.testimonials &&
    typeof profile.testimonials === 'object' &&
    !Array.isArray(profile.testimonials)
  ) {
    const t = profile.testimonials;
    if (
      (!profile.education || profile.education.length === 0) &&
      Array.isArray(t.education)
    ) {
      profile.education = t.education;
    }
    if (
      (!profile.certifications || profile.certifications.length === 0) &&
      Array.isArray(t.certifications)
    ) {
      profile.certifications = t.certifications;
    }
    if (!profile.headline && t.headline) profile.headline = t.headline;
    if (!profile.location && t.location) profile.location = t.location;
    if (!profile.phone && t.phone) profile.phone = t.phone;
    if (!profile.career_stage && t.stage) profile.career_stage = t.stage;
    if (profile.is_published === undefined && t.is_published !== undefined) {
      profile.is_published = t.is_published;
    }
  }

  // 4. Resolve Publication Status:
  // If explicitly set, use it. Otherwise, use show_terminal_toggle (defaults to true)
  if (profile.is_published === undefined) {
    profile.is_published = profile.show_terminal_toggle !== false;
  }

  // 5. Resolve Active Theme Pack from active_theme_pack or layout_variant
  if (!profile.active_theme_pack) {
    const variant = profile.layout_variant;
    if (
      variant === 'student-starter' ||
      variant === 'developer-pro' ||
      variant === 'professional-elite'
    ) {
      profile.active_theme_pack = variant;
    } else if (variant === 'cyberpunk-grid') {
      profile.active_theme_pack = 'developer-pro';
    } else if (variant === 'minimalist') {
      profile.active_theme_pack = 'professional-elite';
    } else {
      profile.active_theme_pack = 'student-starter';
    }
  }

  // 6. Resolve headline / professional title
  if (!profile.headline) {
    profile.headline = profile.professional_title || '';
  }
  if (!profile.professional_title) {
    profile.professional_title = profile.headline || '';
  }

  // 7. Ensure arrays
  if (!profile.education) profile.education = [];
  if (!profile.certifications) profile.certifications = [];
  if (!profile.skills) profile.skills = [];
  if (!profile.projects) profile.projects = [];
  if (!profile.social_links) profile.social_links = [];
  if (!profile.experiences) profile.experiences = [];

  return profile as Profile;
}

export async function getFullProfileBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Profile | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, skills(*), projects(*), social_links(*)')
    .eq('slug', slug)
    .single();

  if (error || !profile) return null;

  return normalizeProfile(supabase, profile);
}

export async function getFullProfileByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, skills(*), projects(*), social_links(*)')
    .eq('user_id', userId)
    .single();

  if (error || !profile) return null;

  return normalizeProfile(supabase, profile);
}

export async function saveUserProfile(
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
  payload: SaveProfilePayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanSlug = payload.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // 1. Prepare Base Profile Update (guaranteed supported by core schema)
    const baseProfileUpdate: any = {
      full_name: payload.fullName,
      slug: cleanSlug,
      professional_title: payload.professionalTitle || payload.headline,
      bio: payload.bio,
      avatar_url: payload.avatarUrl,
      resume_url: payload.resumeUrl,
      theme_color: '#137cc2',
      layout_variant: payload.activeThemePack,
      experiences: payload.experiencesList,
      show_terminal_toggle: payload.isPublished,
      testimonials: {
        education: payload.educationList,
        certifications: payload.certificationsList,
        stage: payload.careerStage,
        headline: payload.headline,
        location: payload.location,
        phone: payload.phone,
        is_published: payload.isPublished,
      },
    };

    // Extended profile update if migration columns exist
    const extendedProfileUpdate = {
      ...baseProfileUpdate,
      career_stage: payload.careerStage,
      headline: payload.headline,
      location: payload.location,
      phone: payload.phone,
      active_theme_pack: payload.activeThemePack,
      is_published: payload.isPublished,
      updated_at: new Date().toISOString(),
    };

    let { error: profErr } = await supabase
      .from('profiles')
      .update(extendedProfileUpdate)
      .eq('id', profileId);

    if (profErr && (profErr.code === 'PGRST204' || profErr.message?.includes('column'))) {
      const fallbackRes = await supabase
        .from('profiles')
        .update(baseProfileUpdate)
        .eq('id', profileId);
      profErr = fallbackRes.error;
    }

    if (profErr) {
      return { success: false, error: profErr.message };
    }

    // 2. Save Education to dedicated table if available
    try {
      await supabase.from('education').delete().eq('profile_id', profileId);
      if (payload.educationList.length > 0) {
        await supabase.from('education').insert(
          payload.educationList.map((e, idx) => ({
            profile_id: profileId,
            institution: e.institution,
            degree: e.degree,
            field_of_study: e.field_of_study || '',
            start_year: e.start_year || '',
            end_year: e.end_year || '',
            grade_cgpa: e.grade_cgpa || '',
            achievements: e.achievements || '',
            display_order: idx,
          }))
        );
      }
    } catch {
      // Safely persisted in profile.testimonials
    }

    // 3. Save Skills
    await supabase.from('skills').delete().eq('profile_id', profileId);
    if (payload.skillsList.length > 0) {
      await supabase.from('skills').insert(
        payload.skillsList.map((s) => ({
          profile_id: profileId,
          skill_name: s.skill_name,
          category: s.category || 'General',
        }))
      );
    }

    // 4. Save Projects
    await supabase.from('projects').delete().eq('profile_id', profileId);
    if (payload.projectsList.length > 0) {
      const standardProjects = payload.projectsList.map((p, idx) => ({
        profile_id: profileId,
        title: p.title,
        description: p.description || '',
        live_link: p.live_link || '',
        github_link: p.github_link || '',
        image_url: p.image_url || '',
        display_order: idx,
      }));

      const extendedProjects = payload.projectsList.map((p, idx) => ({
        ...standardProjects[idx],
        problem: p.problem || '',
        solution: p.solution || '',
        tech_stack: p.tech_stack || '',
        contribution: p.contribution || '',
      }));

      const { error: projErr } = await supabase.from('projects').insert(extendedProjects);
      if (projErr && (projErr.code === 'PGRST204' || projErr.message?.includes('column'))) {
        await supabase.from('projects').insert(standardProjects);
      }
    }

    // 5. Save Certifications to dedicated table if available
    try {
      await supabase.from('certifications').delete().eq('profile_id', profileId);
      if (payload.certificationsList.length > 0) {
        await supabase.from('certifications').insert(
          payload.certificationsList.map((c, idx) => ({
            profile_id: profileId,
            title: c.title,
            issuer: c.issuer,
            issue_date: c.issue_date || '',
            expiry_date: c.expiry_date || '',
            credential_url: c.credential_url || '',
            display_order: idx,
          }))
        );
      }
    } catch {
      // Safely persisted in profile.testimonials
    }

    // 6. Save Social Links
    await supabase.from('social_links').delete().eq('profile_id', profileId);
    if (payload.socialLinksList.length > 0) {
      await supabase.from('social_links').insert(
        payload.socialLinksList.map((s) => ({
          profile_id: profileId,
          platform: s.platform,
          url: s.url,
        }))
      );
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save profile' };
  }
}

export async function createInitialProfile(
  supabase: SupabaseClient,
  userId: string,
  initialSlug: string
): Promise<Profile | null> {
  const baseProfile = {
    user_id: userId,
    full_name: 'Portfolio Creator',
    slug: initialSlug,
    layout_variant: 'student-starter',
    show_terminal_toggle: false,
    experiences: [],
    testimonials: {
      stage: 'first-year',
      is_published: false,
      education: [],
      certifications: [],
    },
  };

  const extendedProfile = {
    ...baseProfile,
    career_stage: 'first-year',
    active_theme_pack: 'student-starter',
    is_published: false,
  };

  let { data, error } = await supabase
    .from('profiles')
    .insert(extendedProfile)
    .select()
    .single();

  if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
    const res = await supabase
      .from('profiles')
      .insert(baseProfile)
      .select()
      .single();
    data = res.data;
  }

  if (data) {
    return normalizeProfile(supabase, data);
  }
  return null;
}
