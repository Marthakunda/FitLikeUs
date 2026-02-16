import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WorkoutSchema } from '@fitlikeus/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import VideoModal from './VideoModal';
import { mapFirebaseError } from '../lib/errorHandling';

interface WorkoutForm {
    exercise: 'Squats' | 'Pushups' | 'Plank' | 'Lunges';
    reps: number;
}

const EXERCISE_VIDEOS: Record<string, string> = {
    'Squats': 'https://www.youtube.com/embed/gcNh17Ckjgg',
    'Pushups': 'https://www.youtube.com/embed/IODxDxX7oi4',
    'Plank': 'https://www.youtube.com/embed/pSHjTRCQxIw',
    'Lunges': 'https://www.youtube.com/embed/wrwwXE_67X8'
};

export default function WorkoutLogger({ onComplete }: { onComplete?: (workoutId: string) => void }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isOnline = useOnlineStatus();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [retryCount, setRetryCount] = useState(0);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<WorkoutForm>({
        resolver: zodResolver(WorkoutSchema.omit({ userId: true, timestamp: true })),
        defaultValues: {
            exercise: 'Squats',
            reps: 10
        }
    });

    const selectedExercise = watch('exercise');

    const mutation = useMutation({
        mutationFn: async (data: WorkoutForm) => {
            // Validation checks
            if (!user) {
                throw new Error('You must be logged in to log a workout');
            }

            if (!user.uid) {
                throw new Error('User ID is missing. Please try logging in again.');
            }

            if (!data.exercise || !data.reps) {
                throw new Error('Please fill in all required fields');
            }

            if (data.reps < 1 || data.reps > 999) {
                throw new Error('Reps must be between 1 and 999');
            }

            // Log the workout data for debugging
            console.log('🏋️ Logging workout:', {
                userId: user.uid,
                exercise: data.exercise,
                reps: data.reps,
                timestamp: new Date().toISOString()
            });

            try {
                const workoutData = {
                    ...data,
                    userId: user.uid,
                    timestamp: serverTimestamp()
                };

                // Ensure the write is awaited properly
                const docRef = await addDoc(collection(db, 'workouts'), workoutData);

                if (!docRef || !docRef.id) {
                    throw new Error('Failed to get workout ID from database');
                }

                console.log('✅ Workout saved successfully:', docRef.id);
                return docRef.id;
            } catch (firebaseError) {
                const errorMsg = mapFirebaseError(firebaseError);
                console.error('❌ Firebase error saving workout:', {
                    originalError: firebaseError,
                    mappedError: errorMsg,
                    timestamp: new Date().toISOString()
                });
                throw firebaseError;
            }
        },
        onSuccess: (workoutId) => {
            console.log('🎉 Workout mutation succeeded:', workoutId);
            setErrorMessage('');
            setRetryCount(0);
            
            // Optimistic update: immediately update the query cache
            queryClient.setQueryData(['workouts'], (oldData: any[] = []) => [
                {
                    id: workoutId,
                    exercise: watch('exercise'),
                    reps: watch('reps' as unknown as 'exercise'),
                    userId: user!.uid,
                    timestamp: new Date(),
                },
                ...oldData,
            ]);

            // Also invalidate for real-time sync
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
            
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                reset();
                if (onComplete) onComplete(workoutId);
            }, 1500);
        },
        onError: (error) => {
            const errorMsg = mapFirebaseError(error);
            console.error('🚨 Workout logging failed:', {
                error: errorMsg,
                timestamp: new Date().toISOString(),
                retryCount
            });
            setErrorMessage(errorMsg);
        }
    });

    const onSubmit = useCallback((data: WorkoutForm) => {
        // Prevent duplicate submissions
        if (mutation.isPending) {
            console.warn('⚠️ Workout submission already in progress');
            return;
        }

        // Check online status
        if (!isOnline) {
            setErrorMessage('You are offline. Please check your connection and try again.');
            return;
        }

        // Clear previous error
        setErrorMessage('');
        
        console.log('📝 Submitting workout form:', data);
        mutation.mutate(data);
    }, [mutation, isOnline]);

    return (
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 border-opacity-50 shadow-2xl relative overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all duration-300 group">
            {/* Enhanced Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/15 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none group-hover:opacity-150 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -ml-16 -mb-16 pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-2xl font-black flex items-center gap-3">
                    <div className="w-3 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/50" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300">Log Workout</span>
                </h3>
                <div className="flex items-center gap-4">
                    {/* Online/Offline Status */}
                    <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${
                        isOnline
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                        {isOnline ? 'Online' : 'Offline'}
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsVideoOpen(true)}
                        className="text-xs font-bold text-emerald-400/70 hover:text-emerald-300 transition-all flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/20 backdrop-blur-sm"
                    >
                        <span className="text-[11px]">▶</span>
                        <span>How-to</span>
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300 text-sm relative z-10"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="exercise" className="block text-xs font-bold text-emerald-400/60 uppercase tracking-widest mb-2">Exercise</label>
                        <select
                            id="exercise"
                            {...register('exercise')}
                            className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm hover:border-neutral-600/50 disabled:opacity-50"
                            disabled={mutation.isPending || !isOnline}
                        >
                            <option value="Squats">Squats</option>
                            <option value="Pushups">Pushups</option>
                            <option value="Plank">Plank</option>
                            <option value="Lunges">Lunges</option>
                        </select>
                        {errors.exercise && <p className="text-red-400 text-xs mt-1">{errors.exercise.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="reps" className="block text-xs font-bold text-emerald-400/60 uppercase tracking-widest mb-2">Reps/Secs</label>
                        <input
                            id="reps"
                            {...register('reps', { valueAsNumber: true })}
                            type="number"
                            className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm hover:border-neutral-600/50 disabled:opacity-50"
                            disabled={mutation.isPending || !isOnline}
                        />
                        {errors.reps && <p className="text-red-400 text-xs mt-1">{errors.reps.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending || isSuccess || !isOnline}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-white relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSuccess 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50' 
                        : 'bg-gradient-to-r from-emerald-500/30 to-emerald-500/10 hover:from-emerald-500/40 hover:to-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 backdrop-blur-sm'
                    }`}
                    title={!isOnline ? 'You must be online to log a workout' : ''}
                >
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.span
                                key="success"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2"
                            >
                                ✓ Saved!
                            </motion.span>
                        ) : mutation.isPending ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                            </motion.div>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>Log Workout</span>
                                <span className="text-[12px]">→</span>
                            </span>
                        )}
                    </AnimatePresence>
                </button>
            </form>

            <VideoModal 
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                title={`${selectedExercise} Demonstration`}
                videoUrl={EXERCISE_VIDEOS[selectedExercise]}
            />
        </div>
    );
}
