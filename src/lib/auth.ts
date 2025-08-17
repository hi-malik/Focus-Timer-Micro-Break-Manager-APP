import { type NextAuthOptions, type User as NextAuthUser } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString() ?? '';
        const password = credentials?.password?.toString() ?? '';
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash || '');
        if (!ok) return null;
        return { id: user.id, name: user.name ?? user.email, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-me',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        try {
          const userId = (user as { id?: string } | undefined)?.id || token.sub || '';
          const dbUser = await prisma.user.findUnique({ where: { id: userId } });
          const incomingRole = (user as Partial<NextAuthUser> & { role?: 'USER' | 'ADMIN' }).role;
          token.role = dbUser?.role || incomingRole || token.role || 'USER';
        } catch {
          const incomingRole = (user as Partial<NextAuthUser> & { role?: 'USER' | 'ADMIN' }).role;
          token.role = incomingRole || token.role || 'USER';
        }
      }
      if (!token.role && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
          token.role = dbUser?.role || 'USER';
        } catch {
          token.role = token.role || 'USER';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || 'USER';
      }
      return session;
    },
  },
};


