import { useState } from 'react';
import Navbar from '../components/Navbar';
import FitnessDataManager from '../components/FitnessDataManager';
import WorkoutLogger from '../components/WorkoutLogger';
import MoodSlider from '../components/MoodSlider';
import ConsistencyStreak from '../components/ConsistencyStreak';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { profile } = useAuth();
    const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Navbar />
            
            <main className="relative">
                {/* Animated Background */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08),transparent)]" />
                    <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl animate-glow-pulse" />
                    <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl animate-glow-pulse" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl font-bold text-white mb-2">
                            Welcome back, <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                                {profile?.displayName || 'Champion'}
                            </span>
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-slate-400">Your Level:</span>
                            <span className="px-4 py-2 bg-brand-primary/20 border border-brand-primary/50 rounded-full text-brand-primary-light uppercase tracking-widest text-xs font-bold">
                                {profile?.level}
                            </span>
                        </div>
                    </motion.div>

                    {/* Premium Upgrade Banner */}
                    {profile?.role === 'client' && profile?.plan === 'free' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 bg-gradient-to-r from-brand-accent/20 to-brand-primary/20 backdrop-blur-md p-6 rounded-lg border border-brand-primary/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-brand-accent font-semibold">Go Premium</div>
                                    <div className="text-white font-bold text-lg">Unlock advanced fitness tracking</div>
                                </div>
                                <button 
                                    onClick={() => navigate('/upgrade')}
                                    className="btn-glow-primary"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 border-b border-slate-700/50">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-3 font-medium transition-all relative ${
                                activeTab === 'overview' 
                                    ? 'text-white' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Overview
                            {activeTab === 'overview' && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`px-4 py-3 font-medium transition-all relative ${
                                activeTab === 'manage' 
                                    ? 'text-white' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Manage Workouts
                            {activeTab === 'manage' && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                                />
                            )}
                        </button>
                    </div>

                    {/* Content Tabs */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                            >
                                <div className="lg:col-span-2 space-y-8">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <WorkoutLogger onComplete={(id) => setActiveWorkoutId(id)} />
                                    </motion.div>
                                </div>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-dark-card border border-slate-700/50 rounded-lg p-6 h-full">
                                        <ConsistencyStreak />
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {activeWorkoutId ? (
                                            <MoodSlider 
                                                key="mood"
                                                workoutId={activeWorkoutId} 
                                                onComplete={() => setActiveWorkoutId(null)} 
                                            />
                                        ) : (
                                            <motion.div 
                                                key="instructions"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="bg-dark-card border border-dashed border-slate-700/50 rounded-lg p-6 text-center flex flex-col items-center justify-center"
                                            >
                                                <div className="text-4xl mb-3">🧠</div>
                                                <h4 className="font-bold text-lg mb-2 text-white">Mood Sync</h4>
                                                <p className="text-slate-400 text-sm">Complete a workout to track your mood</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="manage"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <FitnessDataManager />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
