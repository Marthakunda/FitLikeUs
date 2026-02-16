import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import PasswordValidator from '../components/PasswordValidator';
import { validatePasswordMatch } from '../lib/errorHandling';

const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => validatePasswordMatch(data.password, data.confirmPassword), {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [error, setError] = useState<string | null>(null);
  const [resetCode] = useState(searchParams.get('oobCode') || '');
  const [password, setPassword] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const passwordValue = watch('password');

  // Verify reset code on mount
  useEffect(() => {
    if (!resetCode) {
      setStep('error');
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    // Verify the code is valid
    const verifyCode = async () => {
      try {
        await authService.verifyResetCode(resetCode);
      } catch (err: any) {
        setStep('error');
        setError(err.message || 'Invalid or expired reset link.');
      }
    };

    verifyCode();
  }, [resetCode]);

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      authService.resetPassword(resetCode, data.password),
    onSuccess: () => {
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to reset password');
    }
  });

  const onSubmit = (data: ResetPasswordInput) => {
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
          {step === 'form' && resetCode ? (
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
                  <h2 className="text-2xl font-bold text-white">
                    Create New Password
                  </h2>
                  <p className="text-sm text-slate-400">Secure your account with a strong password</p>
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

                <div className="space-y-4">
                  {/* New Password Field */}
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      {...register('password')}
                      type="password"
                      disabled={mutation.isPending}
                      className="input-field"
                      placeholder="Create a strong password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        register('password').onChange?.(e);
                      }}
                    />
                    {errors.password && (
                      <p className="text-brand-warning text-xs mt-1.5">{errors.password.message}</p>
                    )}
                    
                    {/* Password Validator */}
                    <PasswordValidator password={passwordValue} showGuidelines={true} />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirm-new-password" className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-new-password"
                      {...register('confirmPassword')}
                      type="password"
                      disabled={mutation.isPending}
                      className="input-field"
                      placeholder="Confirm your new password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-brand-warning text-xs mt-1.5">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 text-sm text-slate-400">
                  <p className="font-medium text-slate-300 mb-2">Password Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Use a unique password you don't use elsewhere</li>
                    <li>✓ Mix uppercase, lowercase, numbers, and symbols</li>
                    <li>✓ Avoid personal information like birthdate</li>
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
                      <Lock className="w-5 h-5" />
                      Reset Password
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : step === 'success' ? (
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

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">
                  Password Reset!
                </h2>
                <p className="text-slate-400">
                  Your password has been successfully updated.
                </p>
              </div>

              <div className="pt-4 text-sm text-slate-500">
                Redirecting to login...
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 bg-white/3 backdrop-blur-xl p-12 rounded-2xl border border-white/10 text-center"
            >
              <div className="text-5xl">⚠️</div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Invalid Reset Link
                </h2>
                <p className="text-slate-400">
                  {error || 'The password reset link is invalid or has expired.'}
                </p>
              </div>

              <div className="space-y-3 pt-6">
                <motion.button
                  onClick={() => navigate('/forgot-password')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-glow-primary w-full"
                >
                  Request New Reset Link
                </motion.button>
                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary w-full"
                >
                  Back to Sign In
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
