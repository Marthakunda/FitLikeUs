import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWorkout } from './useWorkout';
import * as firestore from 'firebase/firestore';
import React from 'react';

// Mock Firebase
vi.mock('firebase/firestore');
vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('useWorkout', () => {
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

  it('should fetch user workouts', async () => {
    const mockWorkouts = [
      { id: '1', userId: 'user1', exercise: 'Squats', reps: 20, timestamp: new Date() },
      { id: '2', userId: 'user1', exercise: 'Pushups', reps: 15, timestamp: new Date() },
    ];

    vi.mocked(firestore.query).mockReturnValue({} as any);
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: mockWorkouts.map((w) => ({
        id: w.id,
        data: () => w,
        exists: () => true,
      })),
    } as any);

    const { result } = renderHook(() => useWorkout('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.workouts).toBeDefined();
    });
  });

  it('should create a new workout', async () => {
    vi.mocked(firestore.addDoc).mockResolvedValue({
      id: 'new-workout-1',
    } as any);

    const { result } = renderHook(() => useWorkout('user1'), { wrapper });

    await act(async () => {
      await result.current.logWorkout({
        exercise: 'Squats',
        reps: 20,
      });
    });

    expect(firestore.addDoc).toHaveBeenCalled();
  });

  it('should handle workout creation errors', async () => {
    const error = new Error('Firebase error');
    vi.mocked(firestore.addDoc).mockRejectedValue(error);

    const { result } = renderHook(() => useWorkout('user1'), { wrapper });

    await act(async () => {
      try {
        await result.current.logWorkout({
          exercise: 'Squats',
          reps: 20,
        });
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });

  it('should delete a workout', async () => {
    vi.mocked(firestore.deleteDoc).mockResolvedValue(void 0);

    const { result } = renderHook(() => useWorkout('user1'), { wrapper });

    await act(async () => {
      await result.current.deleteWorkout('workout-1');
    });

    expect(firestore.deleteDoc).toHaveBeenCalled();
  });

  it('should calculate workout stats', async () => {
    const mockWorkouts = [
      { id: '1', userId: 'user1', exercise: 'Squats', reps: 20, timestamp: new Date() },
      { id: '2', userId: 'user1', exercise: 'Squats', reps: 25, timestamp: new Date() },
      { id: '3', userId: 'user1', exercise: 'Pushups', reps: 15, timestamp: new Date() },
    ];

    vi.mocked(firestore.query).mockReturnValue({} as any);
    vi.mocked(firestore.getDocs).mockResolvedValue({
      docs: mockWorkouts.map((w) => ({
        id: w.id,
        data: () => w,
        exists: () => true,
      })),
    } as any);

    const { result } = renderHook(() => useWorkout('user1'), { wrapper });

    await waitFor(() => {
      expect(result.current.stats).toBeDefined();
    });
  });
});
