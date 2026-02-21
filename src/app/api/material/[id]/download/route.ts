import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { materials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Harus login dulu bos!' }, { status: 401 });
    }

    const { id } = await params;
    const { env } = getRequestContext();
    const db = getDb(env);

    const material = await db.select().from(materials).where(eq(materials.id, id)).get();
    if (!material) {
      return NextResponse.json({ error: 'Materi gak ketemu' }, { status: 404 });
    }

    const file = await env.BUCKET.get(material.fileKey);
    if (!file) {
      return NextResponse.json({ error: 'File ilang di storage' }, { status: 404 });
    }

    const headers = new Headers();
    file.writeHttpMetadata(headers);
    headers.set('etag', file.httpEtag);
    headers.set('Content-Disposition', `attachment; filename="${material.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);

    return new Response(file.body, { headers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
