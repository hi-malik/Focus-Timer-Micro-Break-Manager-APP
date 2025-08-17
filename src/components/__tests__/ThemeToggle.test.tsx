import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';

describe('ThemeToggle component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('loads saved theme from localStorage and applies to document', () => {
    localStorage.setItem('ft_theme', 'dark');
    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: /toggle theme/i });
    // Should show option to switch to Light when dark is active
    expect(btn).toHaveTextContent('Light Mode');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('toggles theme and persists to localStorage', () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: /toggle theme/i });
    // Default should be light
    expect(btn).toHaveTextContent('Dark Mode');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Toggle to dark
    fireEvent.click(btn);
    expect(btn).toHaveTextContent('Light Mode');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('ft_theme')).toBe('dark');

    // Toggle back to light
    fireEvent.click(btn);
    expect(btn).toHaveTextContent('Dark Mode');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('ft_theme')).toBe('light');
  });
});
