import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePremium } from './usePremium';
import * as firestore from 'firebase/firestore';
import React from 'react';

// Mock Firebase
vi.mock('firebase/firestore');
vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('usePremium', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  it('should determine if user has premium access', async () => {
    vi.mocked(firestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        plan: 'premium',
        premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }),
    } as any);

    const { result } = renderHook(() => usePremium('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isPremium).toBe(true);
    });
  });

  it('should return false for expired premium', async () => {
    vi.mocked(firestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        plan: 'premium',
        premiumExpiresAt: new Date(Date.now() - 1000), // Already expired
      }),
    } as any);

    const { result } = renderHook(() => usePremium('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isPremium).toBe(false);
    });
  });

  it('should return false for free users', async () => {
    vi.mocked(firestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        plan: 'free',
      }),
    } as any);

    const { result } = renderHook(() => usePremium('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isPremium).toBe(false);
    });
  });

  it('should determine feature access based on premium status', async () => {
    vi.mocked(firestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        plan: 'free',
      }),
    } as any);

    const { result } = renderHook(() => usePremium('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.hasFeatureAccess('advanced-analytics')).toBe(false);
      expect(result.current.hasFeatureAccess('advanced-workouts')).toBe(false);
    });
  });

  it('should allow premium features for premium users', async () => {
    vi.mocked(firestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        plan: 'premium',
        premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }),
    } as any);

    const { result } = renderHook(() => usePremium('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.hasFeatureAccess('advanced-analytics')).toBe(true);
      expect(result.current.hasFeatureAccess('advanced-workouts')).toBe(true);
    });
  });
});
