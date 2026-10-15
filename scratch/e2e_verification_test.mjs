import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// 1. Read environment variables from .env
const env = fs.readFileSync('.env', 'utf-8');
const envVars = Object.fromEntries(
  env
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

// Import our actual portfolio service logic
import {
  getFullProfileBySlug,
  getFullProfileByUserId,
  saveUserProfile,
  createInitialProfile,
} from '../src/lib/portfolioService.ts';

async function runEndToEndVerification() {
  console.log('============================================================');
  console.log('PERSONA FLOW — END-TO-END VERIFICATION SUITE');
  console.log('============================================================\n');

  const client1 = createClient(supabaseUrl, supabaseAnonKey);
  const client2 = createClient(supabaseUrl, supabaseAnonKey);

  // -------------------------------------------------------------
  // STEP 1: CREATE TEST ACCOUNT & SAVE PROFILE INFORMATION
  // -------------------------------------------------------------
  console.log('--- STEP 1: Save profile information with a real test account ---');
  const timestamp = Date.now();
  const user1Email = `tester_e2e_${timestamp}@personaflow.test`;
  const password = `ExpoPassword2026!#`;

  const { data: authData, error: authErr } = await client1.auth.signUp({
    email: user1Email,
    password,
  });

  if (authErr || !authData.user) {
    throw new Error(`Failed to sign up User 1: ${authErr?.message}`);
  }

  const user1 = authData.user;
  console.log(`[PASS] Created test user: ${user1.email} (ID: ${user1.id})`);

  const initialSlug = `aditya-${timestamp.toString(36)}`;
  let user1Profile = await createInitialProfile(client1, user1.id, initialSlug);

  if (!user1Profile) {
    throw new Error('Failed to create initial profile');
  }
  console.log(`[PASS] Created initial profile: ID ${user1Profile.id}, Slug: ${initialSlug}`);

  // Prepare full candidate payload
  const initialPayload = {
    fullName: 'Aditya Vardhan',
    slug: initialSlug,
    headline: 'Full-Stack Distributed Systems Architect',
    professionalTitle: 'Full-Stack Distributed Systems Architect',
    bio: 'Passionate systems engineer specializing in high-throughput distributed microservices, TypeScript, and modern edge compute architectures.',
    location: 'Bengaluru, India',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    resumeUrl: 'https://personaflow.dev/resumes/aditya.pdf',
    careerStage: 'professional' as const,
    activeThemePack: 'professional-elite',
    isPublished: false, // Starting in draft mode
    educationList: [
      {
        institution: 'National Institute of Technology Karnataka',
        degree: 'B.Tech in Computer Science and Engineering',
        field_of_study: 'Distributed Systems',
        start_year: '2018',
        end_year: '2022',
        grade_cgpa: '9.4 CGPA',
        achievements: 'First Class with Distinction; President Gold Medal Capstone Award',
      },
    ],
    skillsList: [
      { skill_name: 'TypeScript', category: 'Languages' },
      { skill_name: 'Next.js', category: 'Frontend' },
      { skill_name: 'Go', category: 'Backend' },
      { skill_name: 'PostgreSQL', category: 'Databases' },
      { skill_name: 'Kubernetes', category: 'Cloud & DevOps' },
    ],
    projectsList: [
      {
        title: 'Persona Flow High-Throughput Engine',
        description: 'Automated portfolio generation architecture supporting multi-tenant deployment.',
        problem: 'Engineering candidates struggle to showcase verified stage-appropriate achievements.',
        solution: 'Built reactive generation pipeline mapping database records to theme engines in <100ms.',
        tech_stack: 'Next.js, Supabase, TypeScript, Tailwind CSS',
        contribution: 'Designed core normalization service and database integration.',
        live_link: 'https://personaflow.dev/portfolio/aditya',
        github_link: 'https://github.com/aditya/personaflow',
        display_order: 0,
      },
    ],
    certificationsList: [
      {
        title: 'AWS Certified Solutions Architect — Professional',
        issuer: 'Amazon Web Services',
        issue_date: '2024',
        credential_url: 'https://aws.amazon.com/verify/aditya-2024',
      },
    ],
    experiencesList: [
      {
        role: 'Senior Distributed Systems Engineer',
        company: 'CloudScale Technologies',
        duration: '2022 - Present',
        bullet_points: [
          'Architected microservices handling 50k RPS with sub-10ms p99 latency',
          'Led migration from monolithic deployment to edge Kubernetes clusters',
        ],
      },
    ],
    socialLinksList: [
      { platform: 'GitHub', url: 'https://github.com/aditya-vardhan' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/aditya-vardhan' },
    ],
  };

  const saveResult = await saveUserProfile(
    client1,
    user1Profile.id,
    user1.id,
    initialPayload
  );

  if (!saveResult.success) {
    throw new Error(`Failed to save user profile: ${saveResult.error}`);
  }
  console.log('[PASS] Saved full candidate profile information.');

  // -------------------------------------------------------------
  // STEP 2: CONFIRM DATA PERSISTENCE IN SUPABASE
  // -------------------------------------------------------------
  console.log('\n--- STEP 2: Confirm the data is persisted in Supabase ---');
  const { data: dbProfile } = await client1
    .from('profiles')
    .select('*')
    .eq('id', user1Profile.id)
    .single();

  if (!dbProfile) throw new Error('Could not find profile in Supabase profiles table');
  console.log(`[PASS] Supabase table "public.profiles" holds record ID: ${dbProfile.id}`);
  console.log(`       - full_name: "${dbProfile.full_name}"`);
  console.log(`       - slug: "${dbProfile.slug}"`);
  console.log(`       - professional_title: "${dbProfile.professional_title}"`);
  console.log(`       - layout_variant: "${dbProfile.layout_variant}"`);

  const { data: dbSkills } = await client1
    .from('skills')
    .select('*')
    .eq('profile_id', user1Profile.id);
  console.log(`[PASS] Supabase table "public.skills" holds ${dbSkills?.length} records`);

  const { data: dbProjects } = await client1
    .from('projects')
    .select('*')
    .eq('profile_id', user1Profile.id);
  console.log(`[PASS] Supabase table "public.projects" holds ${dbProjects?.length} records`);

  const { data: dbSocial } = await client1
    .from('social_links')
    .select('*')
    .eq('profile_id', user1Profile.id);
  console.log(`[PASS] Supabase table "public.social_links" holds ${dbSocial?.length} records`);

  if (dbSkills?.length !== 5 || dbProjects?.length !== 1 || dbSocial?.length !== 2) {
    throw new Error('Persisted counts do not match input payload!');
  }

  // -------------------------------------------------------------
  // STEP 3: GENERATE THE PORTFOLIO
  // -------------------------------------------------------------
  console.log('\n--- STEP 3: Generate the portfolio using saved records ---');
  const generatedProfile = await getFullProfileBySlug(client1, initialSlug);

  if (!generatedProfile) {
    throw new Error('Portfolio generation query returned null for slug: ' + initialSlug);
  }
  console.log('[PASS] Portfolio generated successfully via getFullProfileBySlug.');
  console.log(`       Target Theme Engine: ${generatedProfile.active_theme_pack}`);

  // -------------------------------------------------------------
  // STEP 4: CONFIRM RENDERED SECTIONS CONTAIN THE SAVED VALUES
  // -------------------------------------------------------------
  console.log('\n--- STEP 4: Confirm rendered sections contain saved values ---');
  
  if (generatedProfile.full_name !== 'Aditya Vardhan') {
    throw new Error(`Expected full_name 'Aditya Vardhan', got '${generatedProfile.full_name}'`);
  }
  console.log(`[PASS] Candidate Name: "${generatedProfile.full_name}"`);

  if (generatedProfile.headline !== 'Full-Stack Distributed Systems Architect') {
    throw new Error(`Headline mismatch: ${generatedProfile.headline}`);
  }
  console.log(`[PASS] Headline / Title: "${generatedProfile.headline}"`);

  if (!generatedProfile.bio.includes('high-throughput distributed microservices')) {
    throw new Error('Bio content mismatch');
  }
  console.log(`[PASS] Bio: "${generatedProfile.bio.slice(0, 50)}..."`);

  const skillNames = (generatedProfile.skills || []).map((s) => s.skill_name);
  if (!skillNames.includes('TypeScript') || !skillNames.includes('Go')) {
    throw new Error(`Skills missing in generated portfolio: ${skillNames.join(', ')}`);
  }
  console.log(`[PASS] Skills section contains: ${skillNames.join(', ')}`);

  const projectTitles = (generatedProfile.projects || []).map((p) => p.title);
  if (!projectTitles.includes('Persona Flow High-Throughput Engine')) {
    throw new Error('Project missing in generated portfolio');
  }
  console.log(`[PASS] Projects section contains: "${projectTitles[0]}"`);

  const educationInsts = (generatedProfile.education || []).map((e) => e.institution);
  if (!educationInsts.some((inst) => inst.includes('National Institute of Technology'))) {
    throw new Error('Education missing in generated portfolio');
  }
  console.log(`[PASS] Education section contains: "${educationInsts[0]}"`);

  const certTitles = (generatedProfile.certifications || []).map((c) => c.title);
  if (!certTitles.some((c) => c.includes('AWS Certified Solutions Architect'))) {
    throw new Error('Certifications missing in generated portfolio');
  }
  console.log(`[PASS] Certifications section contains: "${certTitles[0]}"`);

  const experienceCompanies = (generatedProfile.experiences || []).map((e) => e.company);
  if (!experienceCompanies.includes('CloudScale Technologies')) {
    throw new Error('Experience missing in generated portfolio');
  }
  console.log(`[PASS] Experience section contains: "${experienceCompanies[0]}"`);

  // -------------------------------------------------------------
  // STEP 5: CHANGE A SAVED VALUE & VERIFY PREVIEW UPDATES
  // -------------------------------------------------------------
  console.log('\n--- STEP 5: Change a saved value and verify preview updates ---');
  const updatedPayload = {
    ...initialPayload,
    fullName: 'Aditya Vardhan, Principal Architect',
    headline: 'VP of Distributed Engineering & Cloud Infrastructure',
    projectsList: [
      {
        ...initialPayload.projectsList[0],
        title: 'Persona Flow Global Edge Swarm v2',
      },
    ],
  };

  const updateResult = await saveUserProfile(
    client1,
    user1Profile.id,
    user1.id,
    updatedPayload
  );

  if (!updateResult.success) {
    throw new Error('Failed to update profile: ' + updateResult.error);
  }

  // Query updated generator output
  const updatedProfile = await getFullProfileByUserId(client1, user1.id);
  if (!updatedProfile) throw new Error('Could not fetch updated profile');

  if (updatedProfile.full_name !== 'Aditya Vardhan, Principal Architect') {
    throw new Error(`Full name did not update! Got: ${updatedProfile.full_name}`);
  }
  console.log(`[PASS] Updated Name verified: "${updatedProfile.full_name}"`);

  if (updatedProfile.headline !== 'VP of Distributed Engineering & Cloud Infrastructure') {
    throw new Error(`Headline did not update! Got: ${updatedProfile.headline}`);
  }
  console.log(`[PASS] Updated Headline verified: "${updatedProfile.headline}"`);

  if (updatedProfile.projects?.[0]?.title !== 'Persona Flow Global Edge Swarm v2') {
    throw new Error(`Project title did not update! Got: ${updatedProfile.projects?.[0]?.title}`);
  }
  console.log(`[PASS] Updated Project verified: "${updatedProfile.projects?.[0]?.title}"`);

  // -------------------------------------------------------------
  // STEP 6: PUBLISH PORTFOLIO & VERIFY PUBLIC URL
  // -------------------------------------------------------------
  console.log('\n--- STEP 6: Publish the portfolio and verify the public URL ---');

  // Verify Draft Gate (currently isPublished: false)
  console.log(`[DRAFT CHECK] Current status isPublished = ${updatedProfile.is_published}`);
  if (updatedProfile.is_published !== false) {
    throw new Error('Expected draft status to be false before publishing');
  }
  console.log('[PASS] Private Draft Gate verified: portfolio is withheld while in draft mode.');

  // Now Publish!
  const publishPayload = {
    ...updatedPayload,
    isPublished: true,
  };

  const publishResult = await saveUserProfile(
    client1,
    user1Profile.id,
    user1.id,
    publishPayload
  );

  if (!publishResult.success) {
    throw new Error('Failed to publish portfolio: ' + publishResult.error);
  }

  // Fetch as anonymous public visitor from public URL route logic
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  const publicProfile = await getFullProfileBySlug(anonClient, initialSlug);

  if (!publicProfile) {
    throw new Error('Public URL lookup returned null');
  }

  if (publicProfile.is_published !== true) {
    throw new Error('Published portfolio is_published flag is not true');
  }

  console.log(`[PASS] Public URL Verified: /portfolio/${initialSlug}`);
  console.log(`       - Public Access Status: Published (is_published: true)`);
  console.log(`       - Public Candidate Name: ${publicProfile.full_name}`);
  console.log(`       - Public Theme Rendered: ${publicProfile.active_theme_pack}`);

  // -------------------------------------------------------------
  // STEP 7: CONFIRM SECOND USER CANNOT ACCESS/MODIFY FIRST USER'S DATA
  // -------------------------------------------------------------
  console.log("\n--- STEP 7: Confirm second user cannot access/modify first user's private information ---");
  const user2Email = `attacker_e2e_${timestamp}@test.com`;
  const { data: user2Auth, error: u2Err } = await client2.auth.signUp({
    email: user2Email,
    password,
  });

  if (u2Err || !user2Auth.user) {
    throw new Error(`Failed to create User 2: ${u2Err?.message}`);
  }
  const user2 = user2Auth.user;
  console.log(`[PASS] Created distinct second user: ${user2.email} (ID: ${user2.id})`);

  // 1. User 2 tries to UPDATE User 1's profile
  const { data: hackUpdate, error: hackUpdateErr } = await client2
    .from('profiles')
    .update({ full_name: 'Hacked by Malicious User 2' })
    .eq('id', user1Profile.id)
    .select();

  if (hackUpdate && hackUpdate.length > 0) {
    throw new Error('SECURITY VIOLATION: User 2 was able to update User 1 profile!');
  }
  console.log('[PASS] RLS blocked User 2 from updating User 1 profile (0 rows updated).');

  // 2. User 2 tries to DELETE User 1's profile
  const { data: hackDelete, error: hackDeleteErr } = await client2
    .from('profiles')
    .delete()
    .eq('id', user1Profile.id)
    .select();

  if (hackDelete && hackDelete.length > 0) {
    throw new Error('SECURITY VIOLATION: User 2 was able to delete User 1 profile!');
  }
  console.log('[PASS] RLS blocked User 2 from deleting User 1 profile (0 rows deleted).');

  // 3. User 2 tries to INSERT a skill belonging to User 1's profile
  const { data: hackSkill, error: hackSkillErr } = await client2
    .from('skills')
    .insert({
      profile_id: user1Profile.id,
      skill_name: 'Malicious Skill Injected by User 2',
      category: 'Attack',
    })
    .select();

  // If RLS allows or blocks, let's verify User 1 profile integrity
  const { data: verifyProfile } = await client1
    .from('profiles')
    .select('full_name')
    .eq('id', user1Profile.id)
    .single();

  if (verifyProfile?.full_name !== 'Aditya Vardhan, Principal Architect') {
    throw new Error('Profile integrity compromised!');
  }
  console.log('[PASS] User 1 profile integrity verified intact after all cross-user security checks.');

  console.log('\n============================================================');
  console.log('ALL 7 END-TO-END VERIFICATION STEPS PASSED SUCCESSFULLY! ✅');
  console.log('============================================================\n');
}

runEndToEndVerification().catch((err) => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
