'use client';

import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage(): React.ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Avoid useSearchParams to prevent suspense requirement during prerender
    try {
      const sp = new URLSearchParams(window.location.search);
      setRegistrationSuccess(sp.get('registered') === '1');
    } catch {
      setRegistrationSuccess(false);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.ok) {
      router.push('/');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border rounded-xl p-6 border-black/10 dark:border-white/15">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <div className="flex flex-col gap-3">
          {registrationSuccess && (
            <p className="text-sm text-green-600">Registration successful. Please sign in.</p>
          )}
          <input
            type="email"
            placeholder="Email"
            className="h-10 px-3 rounded-md border border-black/10 dark:border-white/15 bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="h-10 px-3 rounded-md border border-black/10 dark:border-white/15 bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="h-10 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10">
            Continue
          </button>
          <p className="text-sm opacity-80 text-center">Don&apos;t have an account?</p>
          <Link href="/register" className="h-10 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 grid place-items-center text-sm">
            Register yourself
          </Link>
        </div>
      </form>
    </div>
  );
}


