import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '@fitlikeus/shared';

export default function JournalPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(5);

  const userId = profile?.uid || '';

  // Fetch journal entries
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journalEntries', userId],
    queryFn: async () => {
      if (!userId) return [];
      const q = query(
        collection(db, 'journalEntries'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (JournalEntry & { id: string })[];
    },
    enabled: !!userId,
  });

  // Add entry mutation
  const addEntryMutation = useMutation({
    mutationFn: async () => {
      await addDoc(collection(db, 'journalEntries'), {
        userId,
        title,
        content,
        mood: parseInt(mood.toString()),
        timestamp: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries', userId] });
      setTitle('');
      setContent('');
      setMood(5);
      setShowForm(false);
    },
  });

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      await deleteDoc(doc(db, 'journalEntries', entryId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries', userId] });
    },
  });

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await addEntryMutation.mutateAsync();
  };

  const getMoodColor = (score: number) => {
    if (score <= 3) return 'text-blue-400';
    if (score <= 5) return 'text-cyan-400';
    if (score <= 7) return 'text-glow-emerald';
    return 'text-glow-yellow';
  };

  const getMoodLabel = (score: number) => {
    if (score <= 3) return 'Tired';
    if (score <= 5) return 'Neutral';
    if (score <= 7) return 'Good';
    return 'Energized';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.08),transparent)]" />
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
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
              Journal
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-glow-red flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </motion.button>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass p-8 mb-8 space-y-4"
          >
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Entry</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="input-field resize-none h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Mood: {getMoodLabel(mood)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-400 pt-2">
                  <span>Tired</span>
                  <span>Energized</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-glow-red flex-1" disabled={addEntryMutation.isPending}>
                  {addEntryMutation.isPending ? 'Saving...' : 'Save Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            </div>
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-glass p-8 text-center"
            >
              <p className="text-neutral-400">No entries yet. Start journaling your fitness journey!</p>
            </motion.div>
          ) : (
            entries.map((entry, i) => {
              const date = entry.createdAt?.toDate?.()
                ? new Date(entry.createdAt.toDate()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Unknown date';

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="card-glass p-6 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{entry.title}</h3>
                      <p className="text-sm text-neutral-400">{date}</p>
                    </div>
                    <button
                      onClick={() => deleteEntryMutation.mutate(entry.id!)}
                      className="p-2 rounded-lg hover:bg-neon-red/10 text-neon-red transition-colors"
                      disabled={deleteEntryMutation.isPending}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-neutral-300 leading-relaxed">{entry.content}</p>

                  {entry.mood && (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm text-neutral-400">Mood:</span>
                      <span className={`font-bold ${getMoodColor(entry.mood)}`}>
                        {getMoodLabel(entry.mood)} ({entry.mood}/10)
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
