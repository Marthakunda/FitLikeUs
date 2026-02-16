import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { JournalEntry, JournalEntrySchema } from '@fitlikeus/shared';
import { mapFirebaseError } from '../lib/errorHandling';

export interface JournalEntryWithId extends JournalEntry {
  id: string;
}

/**
 * Custom hook for managing journal entries with CRUD operations.
 * Handles fetching, creating, updating, and deleting journal entries with proper state management.
 *
 * @param userId - The user's Firebase UID
 * @returns Object containing journal entries, loading states, and mutation functions
 */
export const useJournal = (userId: string) => {
  const queryClient = useQueryClient();

  /**
   * Fetch all journal entries for the user
   */
  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['journalEntries', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const q = query(
          collection(db, 'journalEntries'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as JournalEntryWithId[];
      } catch (err) {
        console.error('Error fetching journal entries:', err);
        throw err;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  /**
   * Create a new journal entry
   */
  const createEntryMutation = useMutation({
    mutationFn: async (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const payload = {
          ...data,
          tags: data.tags || [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, 'journalEntries'), payload);
        return {
          id: docRef.id,
          ...data,
          tags: data.tags || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as JournalEntryWithId;
      } catch (err) {
        const errorMessage = mapFirebaseError(err);
        console.error('Error creating journal entry:', errorMessage);
        throw new Error(errorMessage);
      }
    },
    onSuccess: (newEntry) => {
      // Optimistic update: add new entry to the beginning of the list
      queryClient.setQueryData(['journalEntries', userId], (oldData: JournalEntryWithId[] = []) => {
        return [newEntry, ...oldData];
      });
    },
  });

  /**
   * Update an existing journal entry
   */
  const updateEntryMutation = useMutation({
    mutationFn: async ({
      entryId,
      data,
    }: {
      entryId: string;
      data: Partial<Omit<JournalEntry, 'id' | 'createdAt' | 'userId'>>;
    }) => {
      try {
        const docRef = doc(db, 'journalEntries', entryId);
        const updatePayload = {
          ...data,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(docRef, updatePayload);
        return { id: entryId, ...data };
      } catch (err) {
        const errorMessage = mapFirebaseError(err);
        console.error('Error updating journal entry:', errorMessage);
        throw new Error(errorMessage);
      }
    },
    onSuccess: (_, { entryId, data }) => {
      // Optimistic update
      queryClient.setQueryData(['journalEntries', userId], (oldData: JournalEntryWithId[] = []) => {
        return oldData.map((entry) =>
          entry.id === entryId
            ? { ...entry, ...data, updatedAt: new Date() }
            : entry
        );
      });
    },
  });

  /**
   * Delete a journal entry
   */
  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      try {
        const docRef = doc(db, 'journalEntries', entryId);
        await deleteDoc(docRef);
        return entryId;
      } catch (err) {
        const errorMessage = mapFirebaseError(err);
        console.error('Error deleting journal entry:', errorMessage);
        throw new Error(errorMessage);
      }
    },
    onSuccess: (entryId) => {
      // Optimistic update: remove entry from list
      queryClient.setQueryData(['journalEntries', userId], (oldData: JournalEntryWithId[] = []) => {
        return oldData.filter((entry) => entry.id !== entryId);
      });
    },
  });

  return {
    entries,
    isLoading,
    error,
    createEntry: createEntryMutation.mutateAsync,
    updateEntry: updateEntryMutation.mutateAsync,
    deleteEntry: deleteEntryMutation.mutateAsync,
    isCreating: createEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
    createError: createEntryMutation.error,
    updateError: updateEntryMutation.error,
    deleteError: deleteEntryMutation.error,
  };
};
