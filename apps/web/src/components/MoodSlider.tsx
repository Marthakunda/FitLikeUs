import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function MoodSlider({ workoutId, onComplete }: { workoutId: string, onComplete?: () => void }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [score, setScore] = useState(5);
    const [isSuccess, setIsSuccess] = useState(false);

    const mutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error('Not authenticated');
            
            const moodData = {
                userId: user.uid,
                workoutId,
                score,
                timestamp: serverTimestamp()
            };
            
            await addDoc(collection(db, 'moods'), moodData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moods'] });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                if (onComplete) onComplete();
            }, 1000);
        }
    });

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 border-opacity-50 shadow-2xl relative overflow-hidden hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 group"
        >
            {/* Enhanced Background Glow */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/15 blur-3xl rounded-full -ml-20 -mt-20 pointer-events-none group-hover:opacity-150 transition-opacity duration-300" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mb-16 pointer-events-none" />

            <h3 className="text-2xl font-black mb-2 flex items-center gap-3 relative z-10">
                <div className="w-3 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">How do you feel?</span>
            </h3>
            <p className="text-neutral-400 text-sm mb-8 relative z-10">Connect your effort to your mood with precision. (1 = Tired, 10 = Energized)</p>

            <div className="space-y-8 relative z-10">
                <div className="relative pt-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 rounded-lg blur-sm pointer-events-none" />
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={score}
                        onChange={(e) => setScore(parseInt(e.target.value))}
                        className="relative w-full h-3 bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all hover:accent-blue-400"
                    />
                    <div className="flex justify-between mt-3 text-xs font-bold text-neutral-400">
                        <span className="text-neutral-500">Tired</span>
                        <span className="text-neutral-400">Neutral</span>
                        <span className="text-neutral-500">Energized</span>
                    </div>
                </div>

                <div className="text-center py-4">
                    <motion.div
                        key={score}
                        animate={{ scale: [0.8, 1.1, 1] }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="inline-block"
                    >
                        <span className={`text-6xl font-black ${
                            score <= 3 ? 'text-blue-500' :
                            score <= 5 ? 'text-cyan-400' :
                            score <= 7 ? 'text-emerald-400' :
                            'text-yellow-400'
                        }`}>
                            {score}
                        </span>
                    </motion.div>
                </div>

                <button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending || isSuccess}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
                        isSuccess 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50' 
                        : 'bg-gradient-to-r from-blue-500/30 to-blue-500/10 hover:from-blue-500/40 hover:to-blue-500/20 text-blue-300 border border-blue-500/30 hover:border-blue-500/50 backdrop-blur-sm'
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
                                ✓ Mind Synced!
                            </motion.span>
                        ) : mutation.isPending ? (
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-blue-300/30 border-t-blue-300 rounded-full"
                            />
                        ) : (
                            <span className="flex items-center gap-2">
                                <span>Save Mood</span>
                                <span className="text-[12px]">→</span>
                            </span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.div>
    );
}
