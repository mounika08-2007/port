import { NextResponse } from 'next/server';
import { testXaiConnection } from '@/lib/xaiClient';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ai/test
 * Public/Admin test ping to verify xAI Grok connectivity, API key validity, and model availability.
 * Never leaks the actual secret key.
 */
export async function GET() {
  const result = await testXaiConnection();

  const statusCode = result.status === 'connected' ? 200 : result.status === 'missing_key' ? 503 : 502;

  return NextResponse.json(result, { status: statusCode });
}

/**
 * POST /api/ai/test
 */
export async function POST() {
  const result = await testXaiConnection();

  const statusCode = result.status === 'connected' ? 200 : result.status === 'missing_key' ? 503 : 502;

  return NextResponse.json(result, { status: statusCode });
}
