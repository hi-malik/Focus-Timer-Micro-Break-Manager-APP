import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email: string = (body.email || '').toString().trim().toLowerCase();
    const password: string = (body.password || '').toString();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, passwordHash } });

    // Send verification email
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    await prisma.verificationToken.create({ data: { identifier: email, token, expires } });
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const link = `${baseUrl}/api/auth/verify?token=${token}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `Click <a href="${link}">here</a> to verify your email. This link expires in 24 hours.`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}


