import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStreak } from './useStreak';
import * as firestore from 'firebase/firestore';
import React from 'react';

// Mock Firebase
vi.mock('firebase/firestore');
vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('useStreak', () => {
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

  it('should fetch user streaks', async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockStreaks = [
      { id: '1', userId: 'user1', habitId: 'workout', count: 5, lastCompletedDate: today, title: 'Workout Streak' },
    ];

    vi.mocked(firestore.query).mockReturnValue({} as any);
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: mockStreaks.map((s) => ({
        id: s.id,
        data: () => s,
        exists: () => true,
      })),
    } as any);

    const { result } = renderHook(() => useStreak('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.streaks).toHaveLength(1);
      expect(result.current.streaks[0].count).toBe(5);
    });
  });

  it('should calculate longest streak', async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockStreaks = [
      { id: '1', userId: 'user1', habitId: 'workout', count: 10, lastCompletedDate: today, title: 'Workout' },
      { id: '2', userId: 'user1', habitId: 'mood', count: 7, lastCompletedDate: today, title: 'Mood' },
    ];

    vi.mocked(firestore.query).mockReturnValue({} as any);
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: mockStreaks.map((s) => ({
        id: s.id,
        data: () => s,
        exists: () => true,
      })),
    } as any);

    const { result } = renderHook(() => useStreak('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.longestStreak).toBe(10);
    });
  });

  it('should count active streaks', async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockStreaks = [
      { id: '1', userId: 'user1', habitId: 'workout', count: 5, lastCompletedDate: today, title: 'Workout' },
      { id: '2', userId: 'user1', habitId: 'mood', count: 0, lastCompletedDate: today, title: 'Mood' },
    ];

    vi.mocked(firestore.query).mockReturnValue({} as any);
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: mockStreaks.map((s) => ({
        id: s.id,
        data: () => s,
        exists: () => true,
      })),
    } as any);

    const { result } = renderHook(() => useStreak('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.activeStreakCount).toBe(1);
    });
  });

  it('should calculate total streak days', async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockStreaks = [
      { id: '1', userId: 'user1', habitId: 'workout', count: 10, lastCompletedDate: today, title: 'Workout' },
      { id: '2', userId: 'user1', habitId: 'mood', count: 5, lastCompletedDate: today, title: 'Mood' },
    ];

    vi.mocked(firestore.query).mockReturnValue({} as any);
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: mockStreaks.map((s) => ({
        id: s.id,
        data: () => s,
        exists: () => true,
      })),
    } as any);

    const { result } = renderHook(() => useStreak('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.totalStreakDays).toBe(15);
    });
  });

  it('should update streak on consecutive day', async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockStreaks = [
      { id: 'habit1', userId: 'user1', habitId: 'habit1', count: 5, lastCompletedDate: today, title: 'Test' },
    ];

    vi.mocked(firestore.query).mockReturnValue({} as any);
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: mockStreaks.map((s) => ({
        id: s.id,
        data: () => s,
        exists: () => true,
      })),
    } as any);

    vi.mocked(firestore.updateDoc).mockResolvedValue(void 0);

    const { result } = renderHook(() => useStreak('user1'), { wrapper });

    await act(async () => {
      await result.current.updateStreak('habit1');
    });

    expect(firestore.updateDoc).toHaveBeenCalled();
  });

  it('should reset streak if day is missed', async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 2); // 2 days ago
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const mockStreaks = [
      { id: 'habit1', userId: 'user1', habitId: 'habit1', count: 5, lastCompletedDate: yesterdayStr, title: 'Test' },
    ];

    vi.mocked(firestore.query).mockReturnValue({} as any);
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: mockStreaks.map((s) => ({
        id: s.id,
        data: () => s,
        exists: () => true,
      })),
    } as any);

    vi.mocked(firestore.updateDoc).mockResolvedValue(void 0);

    const { result } = renderHook(() => useStreak('user1'), { wrapper });

    await act(async () => {
      await result.current.updateStreak('habit1');
    });

    // Should call updateDoc to reset streak
    expect(firestore.updateDoc).toHaveBeenCalled();
  });
});
