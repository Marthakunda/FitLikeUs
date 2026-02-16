import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [error, setError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordInput) =>
      authService.sendPasswordReset(data.email),
    onSuccess: (_: any, variables: ForgotPasswordInput) => {
      setSuccessEmail(variables.email);
      setStep('success');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to send reset email');
    }
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    setError(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08),transparent)]" />
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.div
              key="email"
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
                  <h2 className="text-2xl font-bold text-white">
                    Reset Password
                  </h2>
                  <p className="text-sm text-slate-400">Find your account and reset your password</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Alert */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-brand-warning/10 border border-brand-warning/50 text-brand-warning p-3 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    {...register('email')}
                    type="email"
                    disabled={mutation.isPending}
                    className="input-field"
                    placeholder="name@example.com"
                  />
                  {errors.email && (
                    <p className="text-brand-warning text-xs mt-1.5">{errors.email.message}</p>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg p-4 text-sm text-slate-300">
                  <p className="font-medium text-brand-primary-light mb-2">How it works:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Enter your email address</li>
                    <li>✓ Check your inbox for reset link</li>
                    <li>✓ Follow the link to create a new password</li>
                    <li>✓ Return and sign in with new password</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={mutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-glow-primary w-full flex items-center justify-center gap-2"
                >
                  {mutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Reset Email
                    </>
                  )}
                </motion.button>

                {/* Back to Login Link */}
                <div className="text-center pt-4 border-t border-white/5">
                  <p className="text-sm text-slate-400">
                    Remember your password?{' '}
                    <Link to="/login" className="text-brand-primary font-semibold hover:underline">
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
                <CheckCircle className="w-16 h-16 text-brand-accent mx-auto mb-4" />
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-white">
                  Check Your Email
                </h2>
                <p className="text-slate-400">
                  We've sent a password reset link to:
                </p>
                <p className="text-brand-primary font-semibold text-sm break-all">
                  {successEmail}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <p className="text-sm text-slate-400">
                  Follow the link in your email to reset your password. The link will expire in 1 hour.
                </p>
                <p className="text-xs text-slate-500">
                  Didn't receive it? Check your spam folder or request a new link.
                </p>
              </div>

              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-glow-primary w-full"
              >
                Back to Sign In
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
