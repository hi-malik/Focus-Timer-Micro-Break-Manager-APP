'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

export default function Welcome(): React.ReactElement {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || null;
  if (!userName) return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-center">Focus Timer & Micro‑Break Manager</h1>
      <p className="text-center opacity-80 max-w-xl">
        Stay in deep work with timed focus sessions and restorative micro‑breaks. Configure durations, start the timer, and let us handle the rhythm.
      </p>
    </>
  );
  return (
    <h1 className="text-3xl sm:text-4xl font-bold text-center">Welcome {userName}</h1>
  );
}


