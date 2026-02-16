import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

interface FitnessEntry {
  id: string;
  exercise: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  calories: number;
  notes: string;
  date: Date;
  createdAt: Date;
}

interface FormData {
  exercise: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  calories: number;
  notes: string;
}

export default function FitnessDataManager() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<FitnessEntry[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    exercise: '',
    duration: 30,
    intensity: 'medium',
    calories: 0,
    notes: '',
  });

  // Fetch entries in real-time
  useEffect(() => {
    if (!profile?.uid) return;

    const q = query(
      collection(db, 'fitness_entries'),
      where('uid', '==', profile.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as FitnessEntry[];

      setEntries(fetchedEntries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    });

    return unsubscribe;
  }, [profile?.uid]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAddEntry = async () => {
    if (!profile?.uid || !formData.exercise.trim()) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await addDoc(collection(db, 'fitness_entries'), {
        uid: profile.uid,
        ...formData,
        date: new Date(),
        createdAt: serverTimestamp(),
      });

      showMessage('success', 'Workout logged successfully!');
      resetForm();
      setIsFormVisible(false);
    } catch (error) {
      showMessage('error', 'Failed to add entry');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editingId || !profile?.uid) return;

    try {
      setIsLoading(true);
      const entryRef = doc(db, 'fitness_entries', editingId);
      await updateDoc(entryRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });

      showMessage('success', 'Workout updated successfully!');
      resetForm();
      setEditingId(null);
    } catch (error) {
      showMessage('error', 'Failed to update entry');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteDoc(doc(db, 'fitness_entries', id));
      showMessage('success', 'Workout deleted successfully!');
      setDeleteConfirm(null);
    } catch (error) {
      showMessage('error', 'Failed to delete entry');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEntry = (entry: FitnessEntry) => {
    setFormData({
      exercise: entry.exercise,
      duration: entry.duration,
      intensity: entry.intensity,
      calories: entry.calories,
      notes: entry.notes,
    });
    setEditingId(entry.id);
    setIsFormVisible(true);
  };

  const resetForm = () => {
    setFormData({
      exercise: '',
      duration: 30,
      intensity: 'medium',
      calories: 0,
      notes: '',
    });
    setEditingId(null);
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'text-brand-accent bg-brand-accent/10';
      case 'medium':
        return 'text-blue-400 bg-blue-500/10';
      case 'high':
        return 'text-brand-warning bg-brand-warning/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-slate-700/50 rounded-lg p-6"
        >
          <div className="text-slate-400 text-sm font-medium mb-2">Total Workouts</div>
          <div className="text-3xl font-bold text-white">{entries.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-slate-700/50 rounded-lg p-6"
        >
          <div className="text-slate-400 text-sm font-medium mb-2">Total Duration</div>
          <div className="text-3xl font-bold text-white">
            {entries.reduce((sum, e) => sum + e.duration, 0)} min
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-slate-700/50 rounded-lg p-6"
        >
          <div className="text-slate-400 text-sm font-medium mb-2">Calories Burned</div>
          <div className="text-3xl font-bold text-white">
            {entries.reduce((sum, e) => sum + e.calories, 0)}
          </div>
        </motion.div>
      </div>

      {/* Message Alert */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-3 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-brand-accent/10 border-brand-accent/50 text-brand-accent'
                : 'bg-brand-warning/10 border-brand-warning/50 text-brand-warning'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Button */}
      {!isFormVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            resetForm();
            setIsFormVisible(true);
          }}
          className="btn-glow-primary w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Workout
        </motion.button>
      )}

      {/* Form */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-dark-card border border-slate-700/50 rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Workout' : 'New Workout'}
              </h3>
              <button
                onClick={() => {
                  setIsFormVisible(false);
                  resetForm();
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Exercise */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Exercise</label>
                <input
                  type="text"
                  value={formData.exercise}
                  onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                  placeholder="e.g., Running, Cycling, Swimming"
                  className="input-field"
                  disabled={isLoading}
                />
              </div>

              {/* Duration and Intensity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="480"
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Intensity</label>
                  <select
                    value={formData.intensity}
                    onChange={(e) => setFormData({ ...formData, intensity: e.target.value as any })}
                    className="input-field"
                    disabled={isLoading}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Calories */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Calories Burned</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="input-field"
                  disabled={isLoading}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How did you feel?"
                  rows={3}
                  className="input-field resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={editingId ? handleUpdateEntry : handleAddEntry}
                disabled={isLoading}
                className="btn-glow-primary flex-1"
              >
                {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add Workout'}
              </button>
              <button
                onClick={() => {
                  setIsFormVisible(false);
                  resetForm();
                }}
                disabled={isLoading}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 rounded-lg border border-dashed border-slate-700/50"
          >
            <div className="text-slate-400 mb-2">No workouts logged yet</div>
            <div className="text-sm text-slate-500">Start logging your workouts to see them here</div>
          </motion.div>
        ) : (
          entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-dark-card border border-slate-700/50 rounded-lg p-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-white">{entry.exercise}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getIntensityColor(entry.intensity)}`}>
                      {entry.intensity.charAt(0).toUpperCase() + entry.intensity.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-2">
                    <div>⏱️ {entry.duration} min</div>
                    <div>🔥 {entry.calories} kcal</div>
                    <div>📅 {entry.date.toLocaleDateString()}</div>
                  </div>
                  {entry.notes && (
                    <div className="text-sm text-slate-400 italic">"{entry.notes}"</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEntry(entry)}
                    disabled={isLoading}
                    className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(entry.id)}
                    disabled={isLoading}
                    className="p-2 rounded-lg text-brand-warning hover:bg-brand-warning/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              <AnimatePresence>
                {deleteConfirm === entry.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-700/50 flex gap-3"
                  >
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      disabled={isLoading}
                      className="flex-1 px-3 py-2 bg-brand-warning/20 text-brand-warning rounded-lg font-medium text-sm hover:bg-brand-warning/30 transition-colors"
                    >
                      {isLoading ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      disabled={isLoading}
                      className="flex-1 px-3 py-2 bg-white/5 text-slate-300 rounded-lg font-medium text-sm hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
