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
  // Extract id from URL path: /api/admin/users/[id]
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const userId = segments[segments.indexOf('users') + 1] || '';
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body._method === 'DELETE') {
        // fallthrough
      } else {
        return NextResponse.json({ error: 'Unsupported' }, { status: 405 });
      }
    } else {
      const form = await request.formData();
      if ((form.get('_method') || '').toString() !== 'DELETE') {
        return NextResponse.json({ error: 'Unsupported' }, { status: 405 });
      }
    }

    // Prevent deleting yourself
    if (session?.user?.email) {
      const self = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (self?.id === userId) {
        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
      }
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}


