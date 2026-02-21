import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { categories } from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { env } = getRequestContext();
    const db = getDb(env);
    const allCategories = await db.select().from(categories).all();
    return NextResponse.json(allCategories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json() as { name: string };
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const { env } = getRequestContext();
    const db = getDb(env);
    const id = crypto.randomUUID();

    await db.insert(categories).values({ id, name });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
