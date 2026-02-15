import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { usePremium } from '../hooks/usePremium';
import { ArrowLeft, Lock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Resource } from '@fitlikeus/shared';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { isPremium } = usePremium(profile?.uid || '');

  // Fetch resources
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const q = query(collection(db, 'resources'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Resource & { id: string })[];
    },
  });

  const freeResources = resources.filter((r) => !r.premium);
  const premiumResources = resources.filter((r) => r.premium);

  const categoryColors: Record<string, string> = {
    'nutrition': 'bg-glow-yellow/20 border-glow-yellow/50 text-glow-yellow',
    'training': 'bg-neon-red/20 border-neon-red/50 text-neon-red',
    'recovery': 'bg-glow-blue/20 border-glow-blue/50 text-glow-blue',
    'mindset': 'bg-glow-emerald/20 border-glow-emerald/50 text-glow-emerald',
  };

  const ResourceCard = ({ resource, i }: { resource: Resource & { id: string }; i: number }) => {
    const isLocked = resource.premium && !isPremium;

    return (
      <motion.div
        key={resource.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        viewport={{ once: true }}
        className={`card-glass p-6 space-y-4 relative overflow-hidden ${
          isLocked ? 'opacity-75' : ''
        }`}
      >
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              <Lock className="w-8 h-8 text-neon-red mx-auto mb-2" />
              <p className="text-sm font-semibold">Premium Only</p>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{resource.title}</h3>
            <p className="text-sm text-neutral-400 mt-1">{resource.description}</p>
          </div>
          {resource.premium && (
            <div className="ml-4 px-2 py-1 bg-neon-red/20 border border-neon-red/50 rounded text-neon-red text-xs font-bold">
              PREMIUM
            </div>
          )}
        </div>

        <div className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${categoryColors[resource.category] || ''}`}>
          {resource.category}
        </div>

        {resource.link && (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => isLocked && e.preventDefault()}
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
              isLocked
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-glow-blue hover:text-blue-300'
            }`}
          >
            Read More
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.08),transparent)]" />
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-black text-gradient bg-gradient-to-r from-neon-red to-glow-yellow">
              Resources
            </h1>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-glass p-6 space-y-2"
          >
            <h3 className="font-bold text-lg">Free Resources</h3>
            <p className="text-3xl font-black text-glow-blue">{freeResources.length}</p>
            <p className="text-sm text-neutral-400">Available to all users</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-6 space-y-2 border-neon-red/30"
          >
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Lock className={`w-5 h-5 ${isPremium ? 'text-glow-emerald' : 'text-neon-red'}`} />
              Premium Resources
            </h3>
            <p className="text-3xl font-black text-neon-red">{premiumResources.length}</p>
            <p className="text-sm text-neutral-400">
              {isPremium ? 'You have access ✓' : 'Upgrade for access'}
            </p>
          </motion.div>
        </div>

        {/* Free Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-glow-blue">◆</span> All Users
          </h2>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            </div>
          ) : freeResources.length === 0 ? (
            <p className="text-neutral-400">No free resources available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeResources.map((resource, i) => (
                <ResourceCard key={resource.id} resource={resource} i={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Premium Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-neon-red" />
            Premium Only
          </h2>
          {premiumResources.length === 0 ? (
            <p className="text-neutral-400">No premium resources available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumResources.map((resource, i) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  i={i + freeResources.length}
                />
              ))}
            </div>
          )}

          {!isPremium && premiumResources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-glass p-8 mt-8 text-center space-y-4"
            >
              <h3 className="text-2xl font-bold">Unlock Premium Content</h3>
              <p className="text-neutral-300">
                Get access to advanced workouts, nutrition guides, and exclusive analytics
              </p>
              <button
                onClick={() => navigate('/upgrade')}
                className="btn-glow-red inline-block"
              >
                Upgrade to Premium
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
