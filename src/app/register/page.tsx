'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push('/sign-in?registered=1');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Unexpected error. Please try again.');
    }
  }

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border rounded-xl p-6 border-black/10 dark:border-white/15">
        <h1 className="text-xl font-semibold mb-4">Register</h1>
        <div className="flex flex-col gap-3">
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
          <input
            type="password"
            placeholder="Confirm password"
            className="h-10 px-3 rounded-md border border-black/10 dark:border-white/15 bg-transparent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="h-10 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10">
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}


