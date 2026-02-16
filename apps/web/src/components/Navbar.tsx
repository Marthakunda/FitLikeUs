import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, BarChart3, BookOpen, Gift } from 'lucide-react';
import { authService } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setIsOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/resources', label: 'Resources', icon: Gift },
  ];

  return (
    <nav className="bg-dark-card/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/30 transition-colors">
              <span className="text-brand-primary font-bold text-lg">F</span>
            </div>
            <span className="hidden sm:inline font-bold text-white">FitLikeUs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-brand-primary/20 text-brand-primary-light'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-700/50">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300 truncate max-w-[120px]">
                  {profile?.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-700/50"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(path)
                        ? 'bg-brand-primary/20 text-brand-primary-light'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}

                {/* Mobile User Section */}
                <div className="pt-4 mt-4 border-t border-slate-700/50 space-y-2">
                  <div className="px-4 py-2 text-sm text-slate-400">
                    Signed in as <span className="text-slate-300 font-medium">{profile?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
