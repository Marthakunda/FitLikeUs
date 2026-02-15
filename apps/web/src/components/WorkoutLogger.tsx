import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WorkoutSchema } from '@fitlikeus/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from './VideoModal';

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
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

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
            if (!user) throw new Error('Not authenticated');
            
            const workoutData = {
                ...data,
                userId: user.uid,
                timestamp: serverTimestamp()
            };
            
            const docRef = await addDoc(collection(db, 'workouts'), workoutData);
            return docRef.id;
        },
        onSuccess: (workoutId) => {
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                reset();
                if (onComplete) onComplete(workoutId);
            }, 1000);
        }
    });

    const onSubmit = (data: WorkoutForm) => {
        mutation.mutate(data);
    };

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
                <button 
                    type="button"
                    onClick={() => setIsVideoOpen(true)}
                    className="text-xs font-bold text-emerald-400/70 hover:text-emerald-300 transition-all flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/20 backdrop-blur-sm"
                >
                    <span className="text-[11px]">▶</span>
                    <span>How-to</span>
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="exercise" className="block text-xs font-bold text-emerald-400/60 uppercase tracking-widest mb-2">Exercise</label>
                        <select
                            id="exercise"
                            {...register('exercise')}
                            className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm hover:border-neutral-600/50"
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
                            className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all backdrop-blur-sm hover:border-neutral-600/50"
                        />
                        {errors.reps && <p className="text-red-400 text-xs mt-1">{errors.reps.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending || isSuccess}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-white relative overflow-hidden ${
                        isSuccess 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50' 
                        : 'bg-gradient-to-r from-emerald-500/30 to-emerald-500/10 hover:from-emerald-500/40 hover:to-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 backdrop-blur-sm'
                    }`}
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
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
