import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || '';
  if (!token) return NextResponse.redirect(new URL('/sign-in?verified=0', request.url));
  const vt = await prisma.verificationToken.findUnique({ where: { token } });
  if (!vt || vt.expires < new Date()) {
    return NextResponse.redirect(new URL('/sign-in?verified=0', request.url));
  }
  const user = await prisma.user.findUnique({ where: { email: vt.identifier } });
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
  }
  await prisma.verificationToken.delete({ where: { token } });
  return NextResponse.redirect(new URL('/sign-in?verified=1', request.url));
}


