import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';
import { trackEvent } from '@/lib/analytics';
import { useSession, signOut } from 'next-auth/react';

jest.mock('@/lib/analytics', () => ({ trackEvent: jest.fn() }));
jest.mock('next-auth/react', () => ({ useSession: jest.fn(), signOut: jest.fn() }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }) => <a href={href}>{children}</a> }));

describe('Header component', () => {
  beforeEach(() => jest.clearAllMocks());

  test('tracks page_view on mount and shows Sign in when no session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Header />);
    expect(trackEvent).toHaveBeenCalledWith('page_view');
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/sign-in');
  });

  test('shows sign out button and calls signOut when session exists', () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { email: 'a@b.com', name: 'A' } } });
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(signOut).toHaveBeenCalled();
  });
});
