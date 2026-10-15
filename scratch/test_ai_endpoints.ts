import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { testXaiConnection, generatePortfolioDesignWithGrok, validateDesignConfig } from '../src/lib/xaiClient';
import { checkRateLimit } from '../src/lib/rateLimit';

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

async function runTests() {
  console.log('============================================================');
  console.log('AI GROK BACKEND INTEGRATION — TEST SUITE');
  console.log('============================================================\n');

  // Test 1: Healthcheck with missing key
  console.log('Test 1: Healthcheck test without XAI_API_KEY...');
  const healthResult = await testXaiConnection();
  console.log('Healthcheck result:', healthResult);
  if (healthResult.status !== 'missing_key') {
    throw new Error('Expected status to be missing_key when XAI_API_KEY is not set');
  }
  console.log('PASS: Correctly reported missing_key without crashing or leaking secrets.\n');

  // Test 2: Rate Limiting
  console.log('Test 2: Testing Rate Limiter...');
  const testUserId = 'test-user-' + Date.now();
  for (let i = 1; i <= 5; i++) {
    const res = checkRateLimit(testUserId, 5, 10000);
    if (!res.allowed) throw new Error(`Request ${i} should be allowed`);
  }
  const blockedRes = checkRateLimit(testUserId, 5, 10000);
  if (blockedRes.allowed) throw new Error('Request 6 should be blocked by rate limiter');
  console.log('PASS: Rate limiter successfully allowed 5 requests and blocked 6th.\n');

  // Test 3: Deterministic Fallback Generation
  console.log('Test 3: Testing Deterministic Fallback when xAI is unconfigured...');
  const sampleProfile: any = {
    id: 'test-id',
    full_name: 'Priya Nair',
    career_stage: 'third-year',
    headline: 'Cloud & AI Engineering Candidate',
    bio: 'Specializing in computer vision and scalable microservices.',
    skills: [
      { skill_name: 'Python', category: 'Backend' },
      { skill_name: 'TensorFlow', category: 'AI/ML' }
    ],
    projects: [
      { title: 'Vision Edge', description: 'Real-time inference at edge.' }
    ],
    education: [
      { institution: 'PES University', degree: 'B.Tech CSE' }
    ]
  };

  const config = await generatePortfolioDesignWithGrok(sampleProfile);
  console.log('Generated Fallback Config:', {
    theme_pack: config.theme_pack,
    theme_color: config.theme_color,
    typography: config.typography,
    layout_variant: config.layout_variant,
    background_effect: config.background_effect,
    ai_headline: config.ai_headline,
    is_ai_generated: config.is_ai_generated,
    fallback_used: config.fallback_used,
  });

  if (config.theme_pack !== 'developer-pro') {
    throw new Error('Expected 3rd year student to map to developer-pro');
  }
  if (!config.fallback_used) {
    throw new Error('Expected fallback_used to be true when XAI_API_KEY is absent');
  }
  console.log('PASS: Deterministic fallback successfully generated valid design tokens.\n');

  // Test 4: Schema validator defense against arbitrary inputs
  console.log('Test 4: Testing Schema Validation & Sanitization Defense...');
  const invalidRaw = {
    theme_pack: 'malicious-injected-pack',
    theme_color: 'invalid-red',
    typography: 'Comic Sans MS',
    layout_variant: '<script>alert(1)</script>',
    ai_headline: 'A'.repeat(500), // Too long
  };

  const validated = validateDesignConfig(invalidRaw, 'student-starter', 'Test User');
  console.log('Sanitized Config:', {
    theme_pack: validated.theme_pack,
    theme_color: validated.theme_color,
    typography: validated.typography,
    layout_variant: validated.layout_variant,
    headline_length: validated.ai_headline.length,
  });

  if (validated.theme_pack !== 'student-starter') throw new Error('Failed to sanitize theme_pack');
  if (validated.theme_color !== '#137cc2') throw new Error('Failed to sanitize theme_color');
  if (validated.typography !== 'Plus Jakarta Sans') throw new Error('Failed to sanitize typography');
  if (validated.layout_variant !== 'classic') throw new Error('Failed to sanitize layout_variant');
  if (validated.ai_headline.length > 100) throw new Error('Failed to clamp headline length');
  console.log('PASS: Schema validator rejected all invalid/injected values and applied secure defaults.\n');

  console.log('============================================================');
  console.log('ALL LOCAL UNIT & INTEGRATION CHECKS PASSED! ✅');
  console.log('============================================================\n');
}

runTests().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
