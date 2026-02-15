import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Streak } from '@fitlikeus/shared';

/**
 * Custom hook for managing workout streaks and consistency tracking.
 * Tracks consecutive days of workouts and updates streak counts.
 *
 * @param userId - The user's Firebase UID
 * @returns Object containing streak data and mutation functions
 */
export const useStreak = (userId: string) => {
  const queryClient = useQueryClient();

  /**
   * Fetch current streaks for the user
   */
  const { data: streaks = [], isLoading } = useQuery({
    queryKey: ['streaks', userId],
    queryFn: async () => {
      const q = query(
        collection(db, 'streaks'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Streak & { id: string })[];
    },
    enabled: !!userId,
  });

  /**
   * Update streak after workout completion
   * Checks if today is a new day, updates or resets streak accordingly
   */
  const updateStreakMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const streakRef = doc(db, 'streaks', habitId);

      // Get current streak data
      const currentStreak = streaks.find((s) => s.id === habitId);

      if (!currentStreak) {
        // Create new streak
        return await addDoc(collection(db, 'streaks'), {
          userId,
          habitId,
          count: 1,
          lastCompletedDate: today,
          title: `Streak for ${habitId}`,
        });
      }

      const lastDate = new Date(currentStreak.lastCompletedDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        // Consecutive day - increment streak
        await updateDoc(streakRef, {
          count: currentStreak.count + 1,
          lastCompletedDate: today,
        });
        return { ...currentStreak, count: currentStreak.count + 1 };
      } else if (daysDiff === 0) {
        // Same day - no change
        return currentStreak;
      } else {
        // Streak broken - reset to 1
        await updateDoc(streakRef, {
          count: 1,
          lastCompletedDate: today,
        });
        return { ...currentStreak, count: 1 };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streaks', userId] });
    },
  });

  /**
   * Get total active streaks
   */
  const activeStreakCount = streaks.filter((s) => s.count > 0).length;

  /**
   * Get longest streak
   */
  const longestStreak = streaks.length > 0
    ? Math.max(...streaks.map((s) => s.count))
    : 0;

  /**
   * Get total combined streak days
   */
  const totalStreakDays = streaks.reduce((sum, s) => sum + s.count, 0);

  return {
    streaks,
    isLoading,
    activeStreakCount,
    longestStreak,
    totalStreakDays,
    updateStreak: updateStreakMutation.mutateAsync,
    isUpdatingStreak: updateStreakMutation.isPending,
  };
};
