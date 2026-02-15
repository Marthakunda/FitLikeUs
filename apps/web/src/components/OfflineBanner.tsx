import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineBanner() {
    const isOnline = useOnlineStatus();

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
                >
                    <div className="bg-amber-500/10 backdrop-blur-xl border border-amber-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                            📡
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-500 text-sm">Offline Mode</h4>
                            <p className="text-amber-500/80 text-xs">Your progress will be saved offline and synced when you're back online.</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
