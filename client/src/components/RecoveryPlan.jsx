import { motion, AnimatePresence } from 'framer-motion';

const PRIORITY_STYLES = {
    HIGH: 'bg-zinc-900 text-white',
    MEDIUM: 'bg-zinc-500 text-white',
    LOW: 'bg-zinc-200 text-zinc-700',
};

export default function RecoveryPlan({ actions, loading, onGenerate }) {
    return (
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">AI Recovery Plan</p>

            {/* Empty state — generate button */}
            {!actions && !loading && (
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98, y: 1 }}
                    onClick={onGenerate}
                    className="w-full py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                >
                    Generate 72-Hour Recovery Plan
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline ml-1.5 -mt-0.5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 7h8m0 0L7 4m3 3L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.button>
            )}

            {/* Loading state — skeleton per SKILL.md Rule 5 */}
            {loading && (
                <div className="space-y-3">
                    <p className="text-zinc-400 text-xs text-center font-medium">
                        Generating plan via Gemini 1.5 Flash
                    </p>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-14 skeleton-shimmer-light rounded-xl" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                </div>
            )}

            {/* Actions list */}
            <AnimatePresence>
                {actions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2.5"
                    >
                        {actions.map((action, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.08 }}
                                className="border border-zinc-200/80 rounded-xl p-3.5 hover:border-zinc-300 transition-colors"
                            >
                                <div className="flex items-start gap-2.5">
                                    <span className={`px-2 py-0.5 rounded-md text-xs font-black flex-shrink-0 mt-0.5 ${PRIORITY_STYLES[action.priority]}`}>
                                        {action.priority}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-900 leading-tight">{action.action}</p>
                                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{action.impact}</p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 flex-shrink-0 font-mono">
                                        -{action.scoreImprovement}pts
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
