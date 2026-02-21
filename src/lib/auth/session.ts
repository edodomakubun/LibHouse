import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) return null;

  try {
    // For simplicity in this MVP, we store the user info in the cookie value as JSON
    // In a real app, this would be a JWT or a session ID in a database
    return JSON.parse(atob(session.value));
  } catch {
    return null;
  }
}

export async function setSession(user: { id: string, username: string }) {
  const cookieStore = await cookies();
  const sessionValue = btoa(JSON.stringify(user));
  cookieStore.set('session', sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
