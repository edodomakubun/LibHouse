import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { courses } from '@/db/schema';
import { getSession } from '@/lib/auth/session';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { env } = getRequestContext();
    const db = getDb(env);
    const allCourses = await db.select().from(courses).all();
    return NextResponse.json(allCourses);
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

    const { name, code } = await req.json() as { name: string, code?: string };
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const { env } = getRequestContext();
    const db = getDb(env);
    const id = crypto.randomUUID();

    await db.insert(courses).values({ id, name, code });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
