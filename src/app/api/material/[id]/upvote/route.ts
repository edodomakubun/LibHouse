import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { upvotes, materials } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export const runtime = 'edge';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: materialId } = await params;

    const { env } = getRequestContext();
    const db = getDb(env);

    // Check if already upvoted
    const existing = await db.select().from(upvotes).where(
      and(eq(upvotes.userId, session.id), eq(upvotes.materialId, materialId))
    ).get();

    if (existing) {
      // Remove upvote
      await db.delete(upvotes).where(
        and(eq(upvotes.userId, session.id), eq(upvotes.materialId, materialId))
      );
      await db.update(materials)
        .set({ upvotesCount: sql`${materials.upvotesCount} - 1` })
        .where(eq(materials.id, materialId));

      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      // Add upvote
      await db.insert(upvotes).values({
        id: crypto.randomUUID(),
        userId: session.id,
        materialId,
      });
      await db.update(materials)
        .set({ upvotesCount: sql`${materials.upvotesCount} + 1` })
        .where(eq(materials.id, materialId));

      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
