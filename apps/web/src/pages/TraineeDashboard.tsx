import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';

type ClientProfile = {
  uid: string;
  displayName?: string;
  email?: string;
};

export default function TraineeDashboard() {
  const { profile } = useAuth();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [logs, setLogs] = useState<{ type: 'workout' | 'mood'; text: string; when: string }[]>([]);

  useEffect(() => {
    if (!profile?.uid) return;

    const loadClients = async () => {
      const q = query(collection(db, 'users'), where('assignedTraineeId', '==', profile.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ uid: d.id, ...(d.data() as any) } as ClientProfile));
      setClients(data);
    };

    loadClients();
  }, [profile]);

  const selectClient = async (client: ClientProfile) => {
    setSelectedClient(client);
    // fetch last 5 workouts and moods
    const workoutsQ = query(collection(db, 'workouts'), where('uid', '==', client.uid), orderBy('createdAt', 'desc'), limit(5));
    const moodsQ = query(collection(db, 'moods'), where('uid', '==', client.uid), orderBy('createdAt', 'desc'), limit(5));
    const [wSnap, mSnap] = await Promise.all([getDocs(workoutsQ), getDocs(moodsQ)]);
    const w = wSnap.docs.map(d => ({ type: 'workout' as const, text: (d.data() as any).exercise || 'Workout', when: (d.data() as any).createdAt?.toDate?.()?.toISOString?.() || '' }));
    const m = mSnap.docs.map(d => ({ type: 'mood' as const, text: `Mood ${ (d.data() as any).value }`, when: (d.data() as any).createdAt?.toDate?.()?.toISOString?.() || '' }));
    setLogs([...w, ...m].sort((a, b) => (b.when || '').localeCompare(a.when)));
  };

  return (
    <div className="min-h-screen p-8 bg-neutral-950 text-white">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">Trainee Dashboard</h2>
          <p className="text-sm text-neutral-400">Assigned Clients</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white/5 backdrop-blur-lg p-4 rounded-xl border border-white/10">
            {clients.length === 0 ? (
              <p className="text-neutral-400 text-sm">No clients assigned yet.</p>
            ) : (
              <ul className="space-y-2">
                {clients.map(c => (
                  <li key={c.uid}>
                    <button onClick={() => selectClient(c)} className="w-full text-left p-3 rounded-lg hover:bg-white/3 transition-colors flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{c.displayName || c.email || c.uid}</div>
                        <div className="text-xs text-neutral-400">{c.email}</div>
                      </div>
                      <div className="text-sm text-blue-300">View</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="md:col-span-2 bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 min-h-[240px]">
            {selectedClient ? (
              <div>
                <h3 className="font-bold text-lg mb-2">{selectedClient.displayName || selectedClient.email}</h3>
                <div className="space-y-3">
                  {logs.length === 0 ? (
                    <p className="text-neutral-400">No recent logs for this client.</p>
                  ) : (
                    logs.map((l, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-white/3 rounded-lg">
                        <div className="text-sm text-neutral-300">{l.type === 'workout' ? 'Body Loop' : 'Mind Loop'}</div>
                        <div className="font-semibold">{l.text}</div>
                        <div className="text-xs text-neutral-400">{new Date(l.when).toLocaleString()}</div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-neutral-400">Select a client to view recent logs.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
