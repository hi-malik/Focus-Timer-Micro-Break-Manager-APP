import { POST } from '../route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({ status: init?.status || 200, json: async () => body }),
  },
}));
jest.mock('@/lib/prisma', () => ({ prisma: { user: { findUnique: jest.fn(), create: jest.fn() } } }));
jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed') }));

describe('register API route', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 400 on invalid input', async () => {
    const req = { json: async () => ({ email: '', password: '123' }) } as any;
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid input' });
  });

  test('returns 409 when user already exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'a@test.com' });
    const req = { json: async () => ({ email: 'a@test.com', password: '123456' }) } as any;
    const res = await POST(req);
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: 'User already exists' });
  });

  test('creates user and returns ok on success', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const req = { json: async () => ({ email: 'new@test.com', password: 'securepw' }) } as any;
    const res = await POST(req);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'new@test.com' } });
    expect(bcrypt.hash).toHaveBeenCalledWith('securepw', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({ data: { email: 'new@test.com', passwordHash: 'hashed' } });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test('returns 500 on unexpected error', async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const req = { json: async () => ({ email: 'e@test.com', password: '123456' }) } as any;
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Unexpected error' });
  });
});
