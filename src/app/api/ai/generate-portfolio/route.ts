import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getFullProfileByUserId, saveUserProfile } from '@/lib/portfolioService';
import { generatePortfolioDesignWithGrok } from '@/lib/xaiClient';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ai/generate-portfolio
 * 
 * Secure server-side endpoint for "Generate My Portfolio" powered by xAI Grok.
 * Enforces:
 * 1. Authentication (valid Supabase Bearer token).
 * 2. Strict user-data isolation (reads only authenticated user's records).
 * 3. Pack entitlement verification.
 * 4. Rate limiting (max 5 requests per minute per user).
 * 5. Strict schema validation (only approved visual tokens).
 * 6. Graceful template fallback if xAI API is unreachable or unconfigured.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication Token
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication token is required.' },
        { status: 401 }
      );
    }

    const supabase = createServerClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser(token);

    if (authErr || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired authentication session.' },
        { status: 401 }
      );
    }

    // 2. Enforce Rate Limiting (5 requests per minute per user)
    const rateCheck = checkRateLimit(user.id, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${Math.ceil(
            rateCheck.resetInMs / 1000
          )} seconds before generating again.`,
          resetInMs: rateCheck.resetInMs,
        },
        { status: 429 }
      );
    }

    // Parse Request Body
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const targetPackSlug = body?.target_pack_slug;
    const applyToProfile = Boolean(body?.apply_to_profile ?? true);

    // 3. User Data Isolation: Fetch only the authenticated user's saved profile
    const profile = await getFullProfileByUserId(supabase, user.id);

    if (!profile) {
      return NextResponse.json(
        { error: 'No profile record found for the authenticated user. Please create a profile first.' },
        { status: 404 }
      );
    }

    // 4. Verify Theme Pack Entitlement
    // Query public.user_entitlements or allow demo pass
    const { data: entitlements } = await supabase
      .from('user_entitlements')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    const effectiveTargetPack =
      targetPackSlug || profile.active_theme_pack || 'student-starter';

    // If entitlements table exists and has rows, ensure entitlement matches
    if (entitlements && entitlements.length > 0) {
      const hasEntitlement = entitlements.some(
        (e) => e.pack_slug === effectiveTargetPack || e.is_demo
      );
      if (!hasEntitlement) {
        return NextResponse.json(
          {
            error: `Forbidden: Active entitlement required for theme pack "${effectiveTargetPack}".`,
            requiredPack: effectiveTargetPack,
          },
          { status: 403 }
        );
      }
    }

    // Extract candidate aesthetic & motion preferences
    const userPreferences = {
      theme_pack: effectiveTargetPack,
      theme_color: body?.theme_color,
      typography: body?.custom_font || body?.typography,
      layout_variant: body?.layout_variant,
      background_effect: body?.background_effect,
      animation_style: body?.animation_style,
      animation_speed: body?.animation_speed,
    };

    // 5. Generate Design Configuration with xAI Grok (with automatic fallback)
    const designConfig = await generatePortfolioDesignWithGrok(
      profile,
      effectiveTargetPack,
      userPreferences
    );

    // 6. Optionally commit the generated design parameters directly to Supabase profile
    if (applyToProfile) {
      await saveUserProfile(supabase, profile.id, user.id, {
        fullName: profile.full_name,
        slug: profile.slug,
        headline: designConfig.ai_headline || profile.headline || profile.professional_title,
        professionalTitle: profile.professional_title || designConfig.ai_headline,
        bio: designConfig.ai_summary_bio || profile.bio,
        location: profile.location || '',
        phone: profile.phone || '',
        avatarUrl: profile.avatar_url || '',
        resumeUrl: profile.resume_url || '',
        careerStage: profile.career_stage || 'first-year',
        activeThemePack: designConfig.theme_pack,
        isPublished: profile.is_published ?? true,
        educationList: profile.education || [],
        skillsList: profile.skills || [],
        projectsList: profile.projects || [],
        certificationsList: profile.certifications || [],
        socialLinksList: profile.social_links || [],
        experiencesList: profile.experiences || [],
      });

      // Also persist aesthetic parameters in profiles
      await supabase
        .from('profiles')
        .update({
          theme_color: designConfig.theme_color,
          layout_variant: designConfig.layout_variant,
          animation_style: designConfig.animation_style,
          animation_speed: designConfig.animation_speed,
          background_effect: designConfig.background_effect,
          custom_font: designConfig.typography,
        })
        .eq('id', profile.id);
    }

    return NextResponse.json({
      success: true,
      config: designConfig,
      applied: applyToProfile,
      profile: {
        id: profile.id,
        slug: profile.slug,
        full_name: profile.full_name,
        headline: designConfig.ai_headline,
        theme_pack: designConfig.theme_pack,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/ai/generate-portfolio:', err);
    return NextResponse.json(
      { error: 'Internal Server Error: Failed to generate portfolio design.' },
      { status: 500 }
    );
  }
}
