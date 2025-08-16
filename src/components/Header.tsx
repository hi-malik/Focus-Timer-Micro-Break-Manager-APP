'use client';

import React from 'react';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import ThemeToggle from '@/components/ThemeToggle';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header(): React.ReactElement {
  const { data: session } = useSession();
  useEffect(() => {
    trackEvent('page_view');
  }, []);
  return (
    <header className="w-full py-4">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-foreground/90 text-background grid place-items-center text-xs font-bold">FT</div>
          <span className="font-semibold">Focus Timer</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <button
              className="h-9 px-4 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-sm"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="h-9 px-4 rounded-full border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-sm grid place-items-center"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


