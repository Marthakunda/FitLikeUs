import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';

// Extended schema for signup
const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpInput = z.infer<typeof SignUpSchema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'success'>('form');

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: SignUpInput) => 
      authService.register({ email: data.email, password: data.password, role: 'client' }),
    onSuccess: () => {
      setStep('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create account');
    }
  });

  const onSubmit = (data: SignUpInput) => {
    setError(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.08),transparent)]" />
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 bg-white/3 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
            >
              {/* Header with back button */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => navigate('/login')}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-gradient bg-gradient-to-r from-neon-red to-glow-yellow">
                    Create Account
                  </h2>
                  <p className="text-sm text-neutral-400">Start your fitness journey today</p>
                </div>
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
                  {/* Email Field */}
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-300 mb-2">
                      Email Address
                    </label>
                    <input
                      id="signup-email"
                      {...register('email')}
                      type="email"
                      disabled={mutation.isPending}
                      className="input-field"
                      placeholder="name@example.com"
                    />
                    {errors.email && <p className="text-neon-red text-xs mt-1.5">{errors.email.message}</p>}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-300 mb-2">
                      Password
                    </label>
                    <input
                      id="signup-password"
                      {...register('password')}
                      type="password"
                      disabled={mutation.isPending}
                      className="input-field"
                      placeholder="At least 6 characters"
                    />
                    {errors.password && <p className="text-neon-red text-xs mt-1.5">{errors.password.message}</p>}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      {...register('confirmPassword')}
                      type="password"
                      disabled={mutation.isPending}
                      className="input-field"
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="text-neon-red text-xs mt-1.5">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-glow-blue/10 border border-glow-blue/30 rounded-lg p-4 text-sm text-neutral-300">
                  <p className="mb-2 font-semibold text-glow-blue">What you'll get:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Free access to workout logging</li>
                    <li>✓ Mood tracking integration</li>
                    <li>✓ Offline support</li>
                    <li>✓ Upgrade to Premium anytime</li>
                  </ul>
                </div>

                {/* Submit Button */}
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
                    'Create Account'
                  )}
                </motion.button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-white/5">
                  <p className="text-sm text-neutral-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-glow-blue font-semibold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 bg-white/3 backdrop-blur-xl p-12 rounded-2xl border border-white/10 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-glow-emerald mx-auto mb-4" />
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gradient bg-gradient-to-r from-glow-green to-glow-emerald">
                  Account Created!
                </h2>
                <p className="text-neutral-300">
                  Welcome to FitLikeUs! Get ready to transform your fitness.
                </p>
              </div>

              <div className="pt-4 text-sm text-neutral-400">
                Redirecting to dashboard...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
