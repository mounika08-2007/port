import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { POST } from '../src/app/api/ai/generate-portfolio/route';
import { NextRequest } from 'next/server';

// Load env
const env = fs.readFileSync('.env', 'utf-8');
const envVars = Object.fromEntries(
  env.split('\n').filter(l => l.includes('=')).map(l => {
    const idx = l.indexOf('=');
    return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
  })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
Object.assign(process.env, envVars);

async function testRoute() {
  console.log('Testing /api/ai/generate-portfolio route with Supabase authentication...');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 1. Create a test user
  const email = `grok_tester_${Date.now()}@personaflow.test`;
  const password = `GrokTest12345!#`;
  const { data: auth, error: authErr } = await supabase.auth.signUp({ email, password });
  if (authErr || !auth.session) {
    throw new Error('Failed to create auth session: ' + authErr?.message);
  }

  const token = auth.session.access_token;
  const userId = auth.user!.id;
  console.log('Test user created:', email, 'User ID:', userId);

  // 2. Insert initial profile
  const { data: prof } = await supabase.from('profiles').insert({
    user_id: userId,
    slug: 'grok-candidate-' + Date.now().toString(36),
    full_name: 'Vikram Seth',
    professional_title: 'Junior DevOps Engineer',
    bio: 'Experienced in Linux, Docker, and CI/CD pipelines.',
    layout_variant: 'classic'
  }).select().single();
  console.log('Initial profile inserted:', prof?.id);

  // 3. Test unauthenticated call (should return 401)
  const unauthReq = new NextRequest('http://localhost:3000/api/ai/generate-portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const unauthRes = await POST(unauthReq);
  console.log('Unauthenticated call status:', unauthRes.status);
  if (unauthRes.status !== 401) {
    throw new Error('Expected 401 for unauthenticated request');
  }

  // 4. Test authenticated call
  const authReq = new NextRequest('http://localhost:3000/api/ai/generate-portfolio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      target_pack_slug: 'developer-pro',
      apply_to_profile: true
    })
  });
  const authRes = await POST(authReq);
  const authJson = await authRes.json();
  console.log('Authenticated call status:', authRes.status);
  console.log('Response body:', authJson);

  if (authRes.status !== 200 || !authJson.success) {
    throw new Error('Expected 200 success from generate-portfolio');
  }

  // 5. Verify the updated profile in Supabase
  const { data: updatedProf } = await supabase.from('profiles').select('*').eq('id', prof.id).single();
  console.log('Verified updated profile in Supabase:');
  console.log('  theme_color:', updatedProf.theme_color);
  console.log('  layout_variant:', updatedProf.layout_variant);
  console.log('  custom_font:', updatedProf.custom_font);
  console.log('  headline:', updatedProf.professional_title);

  console.log('\nPASS: /api/ai/generate-portfolio end-to-end route verified successfully! ✅');
}

testRoute().catch(e => {
  console.error('Route test failed:', e);
  process.exit(1);
});
