import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';
import { getOrCreatePlan } from '@emagrecer/control';

/**
 * Gets or creates a plan for the requested week.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const weekIso = z.iso.datetime().parse(searchParams.get('week'));
  const week = new Date(weekIso);
  const session = await auth();
  if (session?.user?.id == null) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const source = await getDS();
  const { plan, created } = await getOrCreatePlan(
    source,
    session.user.id,
    week,
  );

  const serializedPln = plan.serialize();
  return NextResponse.json({ plan: serializedPln, created });
}
