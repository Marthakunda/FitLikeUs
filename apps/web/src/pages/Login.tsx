import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginInput } from '@fitlikeus/shared';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: LoginInput) => isLogin ? authService.login(data) : authService.register(data),
        onSuccess: (profile) => {
            // Role-based redirects
            if (profile.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (profile.role === 'client') {
                navigate('/dashboard');
            } else {
                navigate('/dashboard');
            }
        },
        onError: (err: Error) => {
            setError(err.message || `Failed to ${isLogin ? 'sign in' : 'register'}`);
        }
    });

    const onSubmit = (data: LoginInput) => {
        setError(null);
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white p-4 overflow-hidden relative">
            {/* Animated Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.08),transparent)]" />
                <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
                <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8 bg-white/3 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10"
            >
                <div className="text-center space-y-2">
                    <motion.h2 
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl font-black text-gradient bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400"
                    >
                        {isLogin ? 'FitLikeUs' : 'Join FitLikeUs'}
                    </motion.h2>
                    <p className="text-neutral-300 text-sm">
                        {isLogin ? 'Welcome back to your fitness journey' : 'Start your holistic fitness journey'}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-neon-red/10 border border-neon-red/50 text-neon-red/80 p-3 rounded-xl text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
                            <input
                                id="login-email"
                                {...register('email')}
                                type="email"
                                disabled={mutation.isPending}
                                className="input-field"
                                placeholder="name@example.com"
                            />
                            {errors.email && <p className="text-neon-red text-xs mt-1.5">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
                            <input
                                id="login-password"
                                {...register('password')}
                                type="password"
                                disabled={mutation.isPending}
                                className="input-field"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-neon-red text-xs mt-1.5">{errors.password.message}</p>}
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={mutation.isPending}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-glow-red w-full flex items-center justify-center gap-2"
                    >
                        {mutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </motion.button>

                    <div className="text-center pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            disabled={mutation.isPending}
                            className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                        >
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span className="text-glow-blue font-semibold">{isLogin ? 'Sign Up' : 'Log In'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
