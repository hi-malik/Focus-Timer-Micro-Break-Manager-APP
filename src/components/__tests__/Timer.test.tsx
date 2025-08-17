import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Modal to avoid portal/visibility complexity
jest.mock('@/components/Modal', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock analytics tracking
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
}));

import Timer from '@/components/Timer';

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

test('shows Focus session by default and switches tabs correctly', () => {
  render(<Timer />);

  // Default is Focus
  expect(screen.getByText(/Focus Session/i)).toBeInTheDocument();
  expect(screen.getByText('25:00')).toBeInTheDocument();

  // Switch to Break Duration
  fireEvent.click(screen.getByRole('button', { name: /Break Duration/i }));
  expect(screen.getByText(/Break Session/i)).toBeInTheDocument();
  expect(screen.getByText('05:00')).toBeInTheDocument();

  // Switch back to Focus Duration
  fireEvent.click(screen.getByRole('button', { name: /Focus Duration/i }));
  expect(screen.getByText(/Focus Session/i)).toBeInTheDocument();
  expect(screen.getByText('25:00')).toBeInTheDocument();
});

test('Skip switches phase and active duration tab', () => {
  render(<Timer />);

  // Initially focus, after skip should be break
  fireEvent.click(screen.getByRole('button', { name: /Skip/i }));
  expect(screen.getByText(/Break Session/i)).toBeInTheDocument();
  // Break controls should be visible
  expect(screen.getByText(/Break \(min\)/i)).toBeInTheDocument();
  expect(screen.getByText('05:00')).toBeInTheDocument();

  // Skip again returns to focus and shows focus controls
  fireEvent.click(screen.getByRole('button', { name: /Skip/i }));
  expect(screen.getByText(/Focus Session/i)).toBeInTheDocument();
  expect(screen.getByText(/Focus \(min\)/i)).toBeInTheDocument();
  expect(screen.getByText('25:00')).toBeInTheDocument();
});


