import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { eq, or, sql } from 'drizzle-orm';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// Helper to hash password using SHA-256 (Edge compatible)
async function hashPassword(password: string) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json() as any;

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Email, username, and password are required' }, { status: 400 });
    }

    const { env } = getRequestContext();
    const db = getDb(env);

    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .get();

    if (existingUser) {
      return NextResponse.json({ error: 'Email or username already taken' }, { status: 400 });
    }

    // First user becomes admin
    const userCount = await db.select({ count: sql`count(*)` }).from(users).get() as { count: number };
    const role = userCount.count === 0 ? 'admin' : 'user';

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      email,
      username,
      password: hashedPassword,
      role: role,
      name: username,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
