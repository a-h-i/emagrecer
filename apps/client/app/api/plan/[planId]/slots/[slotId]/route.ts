import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDS } from '@/lib/getDS';
import { deleteSlot, ForbiddenError } from '@emagrecer/control';
import { EntityNotFoundError } from 'typeorm';

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<'/api/plan/[planId]/slots/[slotId]'>,
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (userId == null) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { planId, slotId } = await ctx.params;
  const source = await getDS();

  try {
    await source.manager.transaction(async (transaction) => {
      await deleteSlot(transaction, slotId, userId, planId);
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    if (err instanceof EntityNotFoundError) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: 'unknown error' }, { status: 500 });
  }
}
