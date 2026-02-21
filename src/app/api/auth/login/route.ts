import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth/session';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as any;

    // Mock authentication - Using a pseudo-hash of email as ID for consistency in this MVP
    if (email && password) {
      // Create a unique-ish ID from the email
      const userId = btoa(email).substring(0, 10);
      await setSession({ id: userId, username: email.split('@')[0] });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
