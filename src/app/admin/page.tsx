import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

type AppRole = 'USER' | 'ADMIN';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role !== 'ADMIN') {
    return null;
  }
  return session;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
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

  // Handle search and pagination params
  const sp = await searchParams ?? {};
  const q = Array.isArray(sp.q) ? sp.q[0] : (sp.q ?? '');
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = parseInt(pageParam ?? '1', 10) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // Gather metrics
  const totalUsers = await prisma.user.count({ where: q ? { OR: [
      { email: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
    ] } : undefined });
  const accountsCount = await prisma.account.count();
  const sessionsCount = await prisma.session.count();

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { email: 'asc' },
    skip,
    take: pageSize,
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm opacity-70 mt-1">Manage users, roles, and monitor key metrics.</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-black/[.03] dark:bg-white/[.03] shadow-sm">
          <div className="text-xs uppercase tracking-wide opacity-70">Users</div>
          <div className="text-2xl font-semibold mt-1">{totalUsers}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-black/[.03] dark:bg-white/[.03] shadow-sm">
          <div className="text-xs uppercase tracking-wide opacity-70">OAuth Accounts</div>
          <div className="text-2xl font-semibold mt-1">{accountsCount}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-black/[.03] dark:bg-white/[.03] shadow-sm">
          <div className="text-xs uppercase tracking-wide opacity-70">Active Sessions</div>
          <div className="text-2xl font-semibold mt-1">{sessionsCount}</div>
        </div>
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 bg-black/[.03] dark:bg-white/[.03] flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="font-medium">Users</h2>
          <form className="flex items-center gap-2 w-full md:w-auto" method="get">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search name or email..."
              className="h-9 px-3 rounded-md border border-black/10 dark:border-white/15 bg-transparent w-full md:w-72"
            />
            <button className="h-9 px-4 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-sm">
              Search
            </button>
          </form>
        </div>
        <div className="divide-y divide-black/10 dark:divide-white/10">
          <div className="grid grid-cols-6 gap-2 px-6 py-3 text-xs uppercase opacity-70">
            <div className="col-span-2">User</div>
            <div>Email</div>
            <div>Role</div>
            <div>Verified</div>
            <div>Actions</div>
          </div>
          {users.map((u) => {
            const role: AppRole = (u as { role?: AppRole }).role || 'USER';
            const isAdmin = role === 'ADMIN';
            return (
              <div key={u.id} className="grid grid-cols-6 gap-2 px-6 py-3 items-center">
                <div className="col-span-2 min-w-0">
                  <div className="font-medium truncate" title={u.name ?? u.email}>{u.name ?? '—'}</div>
                  <div className="text-xs opacity-70 truncate" title={u.id}>{u.id}</div>
                </div>
                <div className="truncate" title={u.email}>{u.email}</div>
                <div>
                  <span className={
                    isAdmin
                      ? 'inline-flex items-center h-6 px-2 rounded-full text-xs border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      : 'inline-flex items-center h-6 px-2 rounded-full text-xs border border-sky-500/25 text-sky-600 dark:text-sky-400 bg-sky-500/10'
                  }>
                    {role}
                  </span>
                </div>
                <div>
                  {u.emailVerified ? (
                    <span className="inline-flex items-center h-6 px-2 rounded-full text-xs border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">Verified</span>
                  ) : (
                    <span className="inline-flex items-center h-6 px-2 rounded-full text-xs border border-rose-500/25 text-rose-600 dark:text-rose-400 bg-rose-500/10">Unverified</span>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <form action={`/api/admin/users/${u.id}/role`} method="post">
                    <input type="hidden" name="role" value={isAdmin ? 'USER' : 'ADMIN'} />
                    <button className={
                      'h-8 px-3 rounded-full border text-xs ' +
                      (isAdmin
                        ? 'border-amber-400/40 text-amber-600 dark:text-amber-300 hover:bg-amber-500/10'
                        : 'border-emerald-500/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10')
                    }>
                      {isAdmin ? 'Demote' : 'Promote'}
                    </button>
                  </form>
                  <form action={`/api/admin/users/${u.id}`} method="post">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button className="h-8 px-3 rounded-full border text-xs border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
          {users.length === 0 && (
            <div className="px-6 py-6 text-sm opacity-70">No users found{q ? ` for “${q}”` : ''}.</div>
          )}
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4">
            <button
              disabled={page <= 1}
              className="px-3 py-1 rounded-md border border-black/20 dark:border-white/20 text-sm"
            >
              Previous
            </button>
            <span className="text-sm opacity-70">Page {page} of {Math.ceil(totalUsers / pageSize)}</span>
            <button
              disabled={page >= Math.ceil(totalUsers / pageSize)}
              className="px-3 py-1 rounded-md border border-black/20 dark:border-white/20 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}


