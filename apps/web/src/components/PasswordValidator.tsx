import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { validatePassword, PasswordValidation } from '../lib/errorHandling';

interface PasswordValidatorProps {
  password: string;
  showGuidelines?: boolean;
}

export default function PasswordValidator({
  password,
  showGuidelines = true,
}: PasswordValidatorProps) {
  const validation = validatePassword(password);
  const requirements = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'One uppercase letter (A-Z)', regex: /[A-Z]/ },
    { label: 'One lowercase letter (a-z)', regex: /[a-z]/ },
    { label: 'One number (0-9)', regex: /\d/ },
    { label: 'One special character (!@#$%^&*)', regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ },
  ];

  if (!showGuidelines || !password) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-3 space-y-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
      >
        <div className="text-xs font-medium text-slate-300 mb-2">Password Requirements:</div>
        
        {requirements.map((req, idx) => {
          const isMet = req.regex.test(password);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-2"
            >
              {isMet ? (
                <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-brand-warning flex-shrink-0" />
              )}
              <span className={`text-xs ${isMet ? 'text-slate-400' : 'text-slate-400'}`}>
                {req.label}
              </span>
            </motion.div>
          );
        })}

        {/* Strength Indicator */}
        <motion.div className="pt-2 border-t border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Strength:</span>
            <span className="text-xs text-slate-400">{validation.score}/5</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(validation.score / 5) * 100}%` }}
              className={`h-full ${
                validation.score <= 2
                  ? 'bg-brand-warning'
                  : validation.score <= 4
                  ? 'bg-blue-500'
                  : 'bg-brand-accent'
              }`}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
