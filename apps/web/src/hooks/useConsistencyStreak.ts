import { useQuery } from '@tanstack/react-query';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useMemo } from 'react';

interface WorkoutData {
  date: string;
  value: number;
}

/**
 * Custom hook for computing and caching consistency streak data
 * Optimized to:
 * - Only fetch required fields (timestamp, reps)
 * - Fetch last 7 days only once
 * - Memoize computation to avoid recalculating on every render
 * - Use O(n) complexity for all operations
 *
 * @param dayCount - Number of days to fetch (default: 7)
 * @returns Object containing computed streak data and loading state
 */
export const useConsistencyStreak = (dayCount: number = 7) => {
  const { user } = useAuth();

  // Fetch workouts - occurs once, cached by React Query
  const { data: rawWorkouts = [], isLoading, error } = useQuery({
    queryKey: ['workouts', 'streak', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(dayCount)
      );
      const snapshot = await getDocs(q);
      // Only extract needed fields for performance
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          timestamp: data.timestamp,
          reps: data.reps || 0,
        };
      });
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Memoize the processed data to avoid recalculations on render
  const processedData = useMemo(() => {
    if (!rawWorkouts.length) return [];

    // Transform and sort in one pass - O(n)
    const sorted = rawWorkouts
      .map((workout) => {
        const date = workout.timestamp?.toDate?.()
          ? new Date(workout.timestamp.toDate()).toLocaleDateString('en-US', {
              weekday: 'short',
            })
          : '';
        return {
          date: date || 'N/A',
          value: workout.reps || 0,
        };
      })
      .reverse(); // Reverse only once after mapping

    return sorted as WorkoutData[];
  }, [rawWorkouts]);

  // Calculate consistency metrics - memoized
  const metrics = useMemo(() => {
    if (!processedData.length)
      return {
        totalWorkouts: 0,
        averageReps: 0,
        streakDays: 0,
        maxDayValue: 0,
      };

    const totalWorkouts = processedData.length;
    const totalReps = processedData.reduce((sum, w) => sum + w.value, 0);
    const averageReps = totalWorkouts > 0 ? Math.round(totalReps / totalWorkouts) : 0;
    const maxDayValue = Math.max(...processedData.map((w) => w.value));

    // Calculate consecutive days from most recent workouts
    let streakDays = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < dayCount; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toLocaleDateString('en-US', { weekday: 'short' });

      // Simple check: does this date exist in our workout data
      const hasWorkout = processedData.some(
        (w) => w.date === dateStr || w.date === checkDate.toISOString().split('T')[0]
      );

      if (hasWorkout) {
        streakDays++;
      } else if (streakDays > 0) {
        break; // Streak broken
      }
    }

    return {
      totalWorkouts,
      averageReps,
      streakDays,
      maxDayValue,
    };
  }, [processedData, dayCount]);

  return {
    data: processedData,
    metrics,
    isLoading,
    error,
  };
};
