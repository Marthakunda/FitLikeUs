import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Workout, WorkoutSchema } from '@fitlikeus/shared';

/**
 * Custom hook for managing workout data and operations.
 * Handles fetching, creating, and deleting workouts with automatic caching.
 *
 * @param userId - The user's Firebase UID
 * @returns Object containing workouts, loading state, stats, and mutation functions
 */
export const useWorkout = (userId: string) => {
  const queryClient = useQueryClient();

  /**
   * Fetch all workouts for the user
   */
  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['workouts', userId],
    queryFn: async () => {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...WorkoutSchema.parse(doc.data()),
      })) as (Workout & { id: string })[];
    },
    enabled: !!userId,
  });

  /**
   * Calculate workout statistics
   */
  const stats = {
    totalWorkouts: workouts.length,
    totalReps: workouts.reduce((sum, w) => sum + (w.reps || 0), 0),
    favoriteExercise: calculateFavoriteExercise(workouts),
    thisWeek: countWorkoutsThisWeek(workouts),
    thisMonth: countWorkoutsThisMonth(workouts),
  };

  /**
   * Log a new workout
   */
  const logWorkoutMutation = useMutation({
    mutationFn: async (workoutData: Omit<Workout, 'userId' | 'timestamp' | 'id'>) => {
      const payload = {
        userId,
        ...workoutData,
        timestamp: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'workouts'), payload);
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', userId] });
    },
  });

  /**
   * Delete a workout
   */
  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      await deleteDoc(doc(db, 'workouts', workoutId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', userId] });
    },
  });

  return {
    workouts,
    isLoading,
    stats,
    logWorkout: logWorkoutMutation.mutateAsync,
    deleteWorkout: deleteWorkoutMutation.mutateAsync,
    isLoggingWorkout: logWorkoutMutation.isPending,
    isDeletingWorkout: deleteWorkoutMutation.isPending,
  };
};

/**
 * Helper: Find the most frequently logged exercise
 */
function calculateFavoriteExercise(workouts: Workout[]): string | null {
  if (workouts.length === 0) return null;

  const counts = workouts.reduce(
    (acc, w) => {
      acc[w.exercise] = (acc[w.exercise] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

/**
 * Helper: Count workouts completed this week
 */
function countWorkoutsThisWeek(workouts: Workout[]): number {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return workouts.filter((w) => {
    const timestamp = w.timestamp?.toDate?.() || w.timestamp;
    return timestamp > weekAgo;
  }).length;
}

/**
 * Helper: Count workouts completed this month
 */
function countWorkoutsThisMonth(workouts: Workout[]): number {
  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

  return workouts.filter((w) => {
    const timestamp = w.timestamp?.toDate?.() || w.timestamp;
    return timestamp > monthAgo;
  }).length;
}
