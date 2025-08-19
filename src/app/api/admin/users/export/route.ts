/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Role } from '@/generated/prisma';

export async function GET(request: Request) {
  // Only admins can export
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const role = url.searchParams.get('role') || '';

  // Build filter
  const where: Record<string, any> = {};
  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (role) {
    // Cast to Role enum
    where.role = role as Role;
  }

  const users = await prisma.user.findMany({ where });

  // Generate CSV
  const header = ['id', 'name', 'email', 'role', 'emailVerified'];
  const rows = users.map(u => [
    u.id,
    u.name || '',
    u.email,
    u.role || '',
    u.emailVerified ? u.emailVerified.toISOString() : '',
  ]);
  const csv = [header, ...rows]
    .map(cols => cols.map(c => `"${c.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users.csv"',
    },
  });
}
