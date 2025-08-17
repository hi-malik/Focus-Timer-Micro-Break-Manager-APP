import React from 'react';
import { render, screen } from '@testing-library/react';
import Welcome from '@/components/Welcome';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('Welcome component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders marketing copy when no user session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Welcome />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Focus Timer & Micro\u2011Break Manager'
    );
    expect(
      screen.getByText(/Stay in deep work with timed focus sessions and restorative micro.?breaks\./i)
    ).toBeInTheDocument();
  });

  test('greets user by name when session present', () => {
    const sessionData = { user: { name: 'Alice', email: 'alice@example.com' } };
    (useSession as jest.Mock).mockReturnValue({ data: sessionData });
    render(<Welcome />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Welcome Alice/i
    );
  });
});
