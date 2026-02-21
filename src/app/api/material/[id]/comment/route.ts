import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { comments } from '@/db/schema';

export const runtime = 'edge';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { content, userId } = await req.json() as { content: string, userId: string };
    const { id: materialId } = await params;

    if (!content) {
      return NextResponse.json({ error: 'Comment content is empty' }, { status: 400 });
    }

    const { env } = getRequestContext();
    const db = getDb(env);

    const commentId = crypto.randomUUID();

    await db.insert(comments).values({
      id: commentId,
      materialId,
      userId,
      content,
    });

    return NextResponse.json({ success: true, id: commentId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
