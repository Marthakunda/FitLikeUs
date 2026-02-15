import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Brain, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Fixed background gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.08),transparent)]" />
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-glow-red/10 rounded-full blur-3xl animate-glow-fade" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Flame className="w-8 h-8 text-neon-red" />
          <span className="text-2xl font-black text-gradient bg-gradient-to-r from-blue-400 to-emerald-400">
            FitLikeUs
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <Link
            to="/login"
            className="px-6 py-2 rounded-lg text-sm font-semibold text-white hover:text-neon-red transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="btn-glow-red text-sm px-6 py-2"
          >
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              <span className="text-gradient bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400">
                Transform Your Body
              </span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-neon-red to-glow-yellow">
                Train Your Mind
              </span>
            </h1>
            <p className="text-xl text-neutral-300 leading-relaxed">
              FitLikeUs combines physical training with mental discipline. Build sustainable habits, track your progress, and unlock premium analytics designed for beginners.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-neon-red" />
                <span className="font-bold">Body Loop</span>
              </div>
              <p className="text-sm text-neutral-400">Log workouts with video guidance</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-glow-blue" />
                <span className="font-bold">Mind Loop</span>
              </div>
              <p className="text-sm text-neutral-400">Track mood after each session</p>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/signup"
              className="btn-glow-red w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Start Your Journey
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Visual card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative space-y-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="card-glass p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Today's Stats</h3>
                <TrendingUp className="w-5 h-5 text-glow-emerald" />
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-neutral-400">Workout Streak</p>
                  <p className="text-2xl font-bold text-neon-red">7 Days</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-neutral-400">Mood Score</p>
                  <p className="text-2xl font-bold text-glow-blue">8/10</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="card-glass p-6"
            >
              <h3 className="font-bold mb-4">This Week</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-300">Workouts</span>
                  <span className="font-bold text-glow-yellow">5</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-glow-yellow h-full rounded-full" style={{ width: '71%' }} />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black mb-4">
            Everything You Need <span className="text-gradient bg-gradient-to-r from-neon-red to-glow-yellow">to Succeed</span>
          </h2>
          <p className="text-lg text-neutral-300">
            Built for beginners, powered by proven principles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Video Guidance',
              description: 'Learn proper form with professional exercise videos',
              icon: '🎥',
            },
            {
              title: 'Offline Support',
              description: 'Train anywhere, sync automatically when online',
              icon: '📱',
            },
            {
              title: 'Consistency Streaks',
              description: 'Build unbreakable habits with visual progress tracking',
              icon: '🔥',
            },
            {
              title: 'Mood Tracking',
              description: 'Connect physical training with mental wellness',
              icon: '🧠',
            },
            {
              title: 'Premium Analytics',
              description: 'Unlock advanced insights with premium membership',
              icon: '📊',
            },
            {
              title: 'Beginner-Friendly',
              description: 'Simple, intuitive interface designed for you',
              icon: '⭐',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card-glass p-6 hover:border-neon-red/30 transition-colors duration-300"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="card-glass p-12 text-center space-y-6"
        >
          <h2 className="text-4xl font-black">
            Ready to <span className="text-gradient bg-gradient-to-r from-neon-red to-glow-yellow">Transform?</span>
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Join thousands of beginners building sustainable fitness habits and discovering their potential with FitLikeUs.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/signup"
              className="btn-glow-red inline-flex items-center gap-2"
            >
              Get Started Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
