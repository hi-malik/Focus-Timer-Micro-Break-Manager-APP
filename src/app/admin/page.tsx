import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== 'ADMIN') {
    return null;
  }
  return session;
}

export default async function AdminPage() {
  const session = await requireAdmin();
  if (!session) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Access denied</h1>
          <p className="text-sm opacity-80 mb-4">You must be an admin to view this page.</p>
          <Link href="/" className="underline">Go home</Link>
        </div>
      </main>
    );
  }

  const [usersCount, accountsCount, sessionsCount] = await Promise.all([
    prisma.user.count(),
    prisma.account.count(),
    prisma.session.count(),
  ]);

  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-black/[.03] dark:bg-white/[.03]">
          <div className="text-sm opacity-70">Users</div>
          <div className="text-2xl font-semibold">{usersCount}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-black/[.03] dark:bg-white/[.03]">
          <div className="text-sm opacity-70">OAuth Accounts</div>
          <div className="text-2xl font-semibold">{accountsCount}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-black/[.03] dark:bg-white/[.03]">
          <div className="text-sm opacity-70">Active Sessions</div>
          <div className="text-2xl font-semibold">{sessionsCount}</div>
        </div>
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 bg-black/[.03] dark:bg-white/[.03] flex items-center justify-between">
          <h2 className="font-medium">Users</h2>
        </div>
        <div className="divide-y divide-black/10 dark:divide-white/10">
          <div className="grid grid-cols-6 gap-2 px-6 py-3 text-xs uppercase opacity-70">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Verified</div>
            <div>Actions</div>
          </div>
          {users.map((u) => (
            <div key={u.id} className="grid grid-cols-6 gap-2 px-6 py-3 items-center">
              <div className="truncate" title={u.id}>{u.id}</div>
              <div className="truncate" title={u.name ?? ''}>{u.name ?? '-'}</div>
              <div className="truncate" title={u.email}>{u.email}</div>
              <div className="truncate">{(u as { role?: 'USER' | 'ADMIN' }).role || 'USER'}</div>
              <div>{u.emailVerified ? 'Yes' : 'No'}</div>
              <div className="flex gap-2">
                <form action={`/api/admin/users/${u.id}/role`} method="post">
                  <input type="hidden" name="role" value={(u as { role?: 'USER' | 'ADMIN' }).role === 'ADMIN' ? 'USER' : 'ADMIN'} />
                  <button className="h-8 px-3 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-xs">
                    {(u as { role?: 'USER' | 'ADMIN' }).role === 'ADMIN' ? 'Demote' : 'Promote'}
                  </button>
                </form>
                <form action={`/api/admin/users/${u.id}`} method="post">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button className="h-8 px-3 rounded-full border border-red-300 text-red-700 dark:border-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


