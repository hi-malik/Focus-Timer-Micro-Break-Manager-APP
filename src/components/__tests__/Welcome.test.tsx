import React from 'react';
import { render, screen } from '@testing-library/react';
import Welcome from '@/components/Welcome';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));

describe('Welcome component', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders marketing copy when no session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Welcome />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Focus Timer & Micro.?Break Manager/i);
    expect(screen.getByText(/Stay in deep work with timed focus sessions and restorative micro.?breaks\./i)).toBeInTheDocument();
  });

  test('greets user by name when session present', () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { name: 'Bob', email: 'bob@example.com' } } });
    render(<Welcome />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome Bob');
  });
});
