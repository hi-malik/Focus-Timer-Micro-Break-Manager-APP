import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';
import { trackEvent } from '@/lib/analytics';
import { useSession, signOut } from 'next-auth/react';

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
}));

// Mock next-auth session and signOut
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/link to render a simple <a>
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('tracks page_view on mount and shows sign in when no session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Header />);
    expect(trackEvent).toHaveBeenCalledWith('page_view');
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toHaveAttribute('href', '/sign-in');
  });

  test('shows sign out button and calls signOut when session exists', () => {
    const sessionData = { user: { email: 'user@test.com', name: 'User' } };
    (useSession as jest.Mock).mockReturnValue({ data: sessionData });
    render(<Header />);
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
    fireEvent.click(signOutButton);
    expect(signOut).toHaveBeenCalled();
  });
});
