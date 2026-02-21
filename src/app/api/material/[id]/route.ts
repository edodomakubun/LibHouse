import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { materials, upvotes, comments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export const runtime = 'edge';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { env } = getRequestContext();
    const db = getDb(env);

    // Get material to check ownership and get file key
    const material = await db.select().from(materials).where(eq(materials.id, id)).get();

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    if (material.userId !== session.id) {
      return NextResponse.json({ error: 'Bukan punya lu bos!' }, { status: 403 });
    }

    // Delete related records first
    await db.delete(upvotes).where(eq(upvotes.materialId, id));
    await db.delete(comments).where(eq(comments.materialId, id));

    // Delete from D1
    await db.delete(materials).where(eq(materials.id, id));

    // Delete from R2
    await env.BUCKET.delete(material.fileKey);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
