import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth/session';

export const runtime = 'edge';

export async function POST() {
  await logout();
  return NextResponse.json({ success: true });
}
