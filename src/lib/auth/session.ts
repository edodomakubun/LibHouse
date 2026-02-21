import { cookies } from 'next/headers';

// In production, this should be a strong secret from environment variables
const SESSION_SECRET = process.env.SESSION_SECRET || 'gaskeun-belajar-bareng-mantap-jaya-2024';

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SESSION_SECRET);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return btoa(Array.from(new Uint8Array(signature), b => String.fromCharCode(b)).join(''));
}

async function verify(payload: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SESSION_SECRET);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const sigBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
  return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payload));
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie) return null;

  try {
    const [payloadBase64, signature] = sessionCookie.value.split('.');
    if (!payloadBase64 || !signature) return null;

    if (!(await verify(payloadBase64, signature))) {
      console.warn('Session signature verification failed');
      return null;
    }

    const decoded = new TextDecoder().decode(Uint8Array.from(atob(payloadBase64), c => c.charCodeAt(0)));
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Session parsing error:', e);
    return null;
  }
}

export async function setSession(user: { id: string, username: string, role?: string }) {
  const cookieStore = await cookies();
  const jsonStr = JSON.stringify(user);
  const payloadBase64 = btoa(Array.from(new TextEncoder().encode(jsonStr), b => String.fromCharCode(b)).join(''));
  const signature = await sign(payloadBase64);

  const sessionValue = `${payloadBase64}.${signature}`;

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
