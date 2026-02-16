import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useJournal } from '../hooks/useJournal';
import { Plus, Trash2, Edit2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

interface FormData {
  title: string;
  content: string;
  mood: number;
}

const INITIAL_FORM_STATE: FormData = {
  title: '',
  content: '',
  mood: 5,
};

export default function JournalPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const userId = profile?.uid || '';
  
  // Journal hook
  const {
    entries,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
  } = useJournal(userId);

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form when showing/hiding
  useEffect(() => {
    if (!showForm) {
      setFormData(INITIAL_FORM_STATE);
      setEditingId(null);
    }
  }, [showForm]);

  // Show success message briefly
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleEditEntry = (entryId: string) => {
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      setFormData({
        title: entry.title,
        content: entry.content,
        mood: entry.mood || 5,
      });
      setEditingId(entryId);
      setShowForm(true);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      if (editingId) {
        // Update existing entry
        await updateEntry({
          entryId: editingId,
          data: {
            title: formData.title,
            content: formData.content,
            mood: formData.mood,
          },
        });
        setSuccessMessage('Journal entry updated!');
      } else {
        // Create new entry
        await createEntry({
          userId,
          title: formData.title,
          content: formData.content,
          mood: formData.mood,
          tags: [],
        });
        setSuccessMessage('Journal entry created!');
      }

      setFormData(INITIAL_FORM_STATE);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving entry:', error);
      // Error is displayed in UI via the error state
    }
  };

  const handleDeleteClick = (entryId: string) => {
    setDeleteConfirmId(entryId);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await deleteEntry(deleteConfirmId);
        setSuccessMessage('Journal entry deleted!');
        setDeleteConfirmId(null);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const currentError = createError || updateError || deleteError;

  const getMoodColor = (score: number) => {
    if (score <= 3) return 'text-blue-400';
    if (score <= 5) return 'text-cyan-400';
    if (score <= 7) return 'text-emerald-400';
    return 'text-yellow-400';
  };

  const getMoodLabel = (score: number) => {
    if (score <= 3) return 'Tired';
    if (score <= 5) return 'Neutral';
    if (score <= 7) return 'Good';
    return 'Energized';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Background */}
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
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-black bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              Journal
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </motion.button>
        </motion.div>

        {/* Error Alert */}
        {currentError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-300"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{currentError.message}</span>
          </motion.div>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3 text-emerald-300"
          >
            <span>✓ {successMessage}</span>
          </motion.div>
        )}

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-8 space-y-4"
          >
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Entry title..."
                  className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 text-white placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Entry *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your thoughts here..."
                  className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 text-white placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all resize-none h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Mood: {getMoodLabel(formData.mood)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-400 pt-2">
                  <span>Tired</span>
                  <span>Energized</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {editingId ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    editingId ? 'Update Entry' : 'Save Entry'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData(INITIAL_FORM_STATE);
                  }}
                  className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl font-bold text-white transition-all"
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
              className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center"
            >
              <p className="text-neutral-400">
                No entries yet. Start journaling your fitness journey!
              </p>
            </motion.div>
          ) : (
            entries.map((entry, i) => {
              const date = entry.createdAt
                ? new Date(
                    entry.createdAt instanceof Date
                      ? entry.createdAt
                      : entry.createdAt.toDate?.() || entry.createdAt
                  ).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Unknown date';

              const updatedDate = entry.updatedAt
                ? new Date(
                    entry.updatedAt instanceof Date
                      ? entry.updatedAt
                      : entry.updatedAt.toDate?.() || entry.updatedAt
                  ).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : null;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg break-words">{entry.title}</h3>
                      <p className="text-sm text-neutral-400">
                        {date}
                        {updatedDate && date !== updatedDate && (
                          <span> (edited {updatedDate})</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditEntry(entry.id)}
                        className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                        disabled={isUpdating || isDeleting}
                        aria-label="Edit entry"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                        disabled={isDeleting}
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed break-words">{entry.content}</p>

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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmId !== null}
        title="Delete Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
