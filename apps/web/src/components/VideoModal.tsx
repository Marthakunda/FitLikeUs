import { motion, AnimatePresence } from 'framer-motion';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    videoUrl: string;
}

export default function VideoModal({ isOpen, onClose, title, videoUrl }: VideoModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[calc(100%-2rem)] max-w-3xl overflow-hidden"
                    >
                        <div className="bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
                            {/* Background Gradient */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full -mr-40 -mt-40 pointer-events-none" />

                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-sm relative z-10">
                                <h3 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300">{title}</h3>
                                <button 
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 font-bold text-lg"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Video Container with PiP-like feel */}
                            <div className="aspect-video bg-black relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                                <iframe
                                    src={videoUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>

                            {/* Footer/Instructions */}
                            <div className="p-6 bg-gradient-to-b from-neutral-900/80 to-neutral-950 backdrop-blur-sm border-t border-white/5 relative z-10">
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1">
                                        <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                                            💡 <span className="text-emerald-400 font-bold">Pro Tip:</span> Focus on form over speed. Keep your core engaged and breathe steadily throughout the set.
                                        </p>
                                    </div>
                                    <motion.button 
                                        onClick={onClose}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30 whitespace-nowrap"
                                    >
                                        Got it
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
