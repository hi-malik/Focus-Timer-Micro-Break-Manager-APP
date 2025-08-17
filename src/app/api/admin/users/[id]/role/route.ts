import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Extract id from URL path: /api/admin/users/[id]/role
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const userId = segments[segments.indexOf('users') + 1] || '';
  try {
    // Support both form and JSON
    let desiredRole: string = '';
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      desiredRole = (body.role || '').toString();
    } else {
      const form = await request.formData();
      desiredRole = (form.get('role') || '').toString();
    }
    if (!['USER', 'ADMIN'].includes(desiredRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    // Prevent demoting yourself to avoid lockout
    if (session?.user?.email) {
      const self = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (self?.id === userId && desiredRole !== 'ADMIN') {
        return NextResponse.json({ error: 'Cannot demote yourself' }, { status: 400 });
      }
    }

    await prisma.user.update({ where: { id: userId }, data: { role: desiredRole as 'USER' | 'ADMIN' } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}


