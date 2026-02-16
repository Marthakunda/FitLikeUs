import { useConsistencyStreak } from '../hooks/useConsistencyStreak';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

export default function ConsistencyStreak() {
    const { data: workouts, metrics, isLoading } = useConsistencyStreak(7);

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Create consistency indicator (dots for each day)
    const indicatorDots = Array.from({ length: 7 }, (_, i) => {
        const hasWorkout = workouts.length > 0 && i < workouts.length;
        const delay = i * 0.05;
        return (
            <motion.div
                key={i}
                animate={{ scale: hasWorkout ? [1, 1.2, 1] : 1 }}
                transition={{
                    delay,
                    repeat: hasWorkout ? Infinity : 0,
                    duration: 2,
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                    hasWorkout
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                        : 'bg-white/10'
                }`}
            />
        );
    });

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-xs uppercase tracking-widest font-black text-emerald-400/70">
                        📊 Consistency Streak: {metrics.streakDays} days
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                        {metrics.totalWorkouts} workouts • {metrics.averageReps} avg reps
                    </p>
                </div>
                <div className="flex gap-1.5">{indicatorDots}</div>
            </div>

            <div className="flex-1 min-h-0 -ml-8 -mr-4 -mb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={workouts} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(16,185,129,0.5)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 0 20px rgba(16,185,129,0.2)',
                            }}
                            itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                            labelStyle={{ color: '#10b981' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={2000}
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
