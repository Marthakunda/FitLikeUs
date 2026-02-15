import { useState } from 'react';
import WorkoutLogger from '../components/WorkoutLogger';
import MoodSlider from '../components/MoodSlider';
import ConsistencyStreak from '../components/ConsistencyStreak';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Zap, Library } from 'lucide-react';

export default function Dashboard() {
    const { profile } = useAuth();
    const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const navigationLinks = [
        { label: 'Dashboard', path: '/dashboard', icon: '📊' },
        { label: 'Journal', path: '/journal', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Resources', path: '/resources', icon: <Library className="w-4 h-4" /> },
        { label: 'Upgrade', path: '/upgrade', icon: <Zap className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-8 overflow-hidden relative">
            {/* Animated Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.08),transparent)]" />
                <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
                <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse" />
            </div>
            
            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header with Menu */}
                <header className="mb-12 flex items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <h1 
                            className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 mb-2"
                        >
                            FitLikeUs
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-60"></div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                    >
                        <p className="text-lg text-neutral-300">
                            Welcome back, <span className="text-white font-bold">{profile?.displayName || 'Beginner'}</span>
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-neutral-400">Your Level:</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-emerald-500/30 to-emerald-500/10 border border-emerald-500/50 rounded-full text-emerald-400 uppercase tracking-widest text-xs font-bold backdrop-blur-md">
                                {profile?.level}
                            </span>
                        </div>
                    </motion.div>
                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => navigate('/journal')}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                title="Journal"
                            >
                                <BookOpen className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/resources')}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                title="Resources"
                            >
                                <Library className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/upgrade')}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                title="Upgrade"
                            >
                                <Zap className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="px-4 py-2 rounded-xl bg-white/3 backdrop-blur-md border border-neon-red/10 text-neon-red font-semibold hover:shadow-glow-red transition-all flex items-center gap-2"
                        >
                            <span className="w-2 h-2 rounded-full bg-neon-red/80 shadow-[0_0_12px_rgba(255,30,30,0.6)]" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="md:hidden mb-8 card-glass p-4 space-y-2"
                        >
                            {navigationLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => {
                                        navigate(link.path);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3"
                                >
                                    <span>{link.icon}</span>
                                    {link.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Client-only: Go Premium card */}
                {profile?.role === 'client' && profile?.plan === 'free' && (
                    <div className="max-w-5xl mx-auto mb-6">
                        <div className="bg-emerald-900/10 backdrop-blur-lg p-4 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-emerald-200 font-semibold">Go Premium</div>
                                <div className="text-white font-bold text-lg">Unlock Full Body & Mind Programs</div>
                            </div>
                            <button 
                                onClick={() => navigate('/upgrade')}
                                className="px-4 py-2 rounded-xl bg-emerald-400 text-neutral-900 font-bold hover:shadow-[0_12px_40px_rgba(16,185,129,0.24)] transition-all"
                            >
                                Unlock Full Access
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        <WorkoutLogger onComplete={(id) => setActiveWorkoutId(id)} />
                        
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 border-opacity-50 shadow-2xl h-64 hover:border-white/20 transition-all duration-300 hover:bg-white/10 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <ConsistencyStreak />
                        </div>

                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
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
                                    className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center h-full min-h-[320px] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300"
                                >
                                    <motion.div 
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-3xl border border-blue-500/30"
                                    >
                                        🧠
                                    </motion.div>
                                    <h4 className="font-bold text-xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">Mind Loop</h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed">Complete a workout to unlock the <span className="text-blue-400 font-semibold">Mood Slider</span> and sync your mind with your body.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
