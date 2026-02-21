import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { materials } from '@/db/schema';
import { getSession } from '@/lib/auth/session';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const course = formData.get('course') as string;
    const isAnonymous = formData.get('isAnonymous') === 'true';

    if (!file || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { env } = getRequestContext();
    const db = getDb(env);

    const fileId = crypto.randomUUID();
    const fileKey = `materials/${fileId}.pdf`;

    // Upload to R2
    await env.BUCKET.put(fileKey, file.stream(), {
      httpMetadata: { contentType: 'application/pdf' }
    });

    // Save metadata to D1
    await db.insert(materials).values({
      id: fileId,
      title,
      description,
      fileKey,
      category,
      course,
      isAnonymous,
      userId: session.id,
      upvotesCount: 0,
    });

    return NextResponse.json({ success: true, id: fileId });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
