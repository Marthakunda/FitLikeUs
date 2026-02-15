import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/auth', () => ({
  authService: {
    logout: vi.fn().mockResolvedValue(undefined),
  }
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    profile: { uid: 'u1', displayName: 'Test User', level: 'beginner', role: 'client' },
    user: {},
    loading: false,
  })
}));

import { authService } from '../../services/auth';

describe('Logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls authService.logout when logout button is clicked', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const btn = await screen.findByRole('button', { name: /logout/i });
    fireEvent.click(btn);

    expect(authService.logout).toHaveBeenCalled();
  });
});
