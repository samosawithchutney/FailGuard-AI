import { motion, AnimatePresence } from 'framer-motion';

const PRIORITY_STYLES = {
    HIGH: { bg: '#18181B', color: '#F4F4F5', border: '#3F3F46' },
    MEDIUM: { bg: '#F4F4F5', color: '#18181B', border: '#D4D4D8' },
    LOW: { bg: '#FAFAFA', color: '#52525B', border: '#E4E4E7', dashed: true },
};

export default function RecoveryPlan({ actions, loading, onGenerate }) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
            {/* Header */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-white">
                <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-500">AI Recovery Plan</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Gemini 1.5 Flash</p>
            </div>

            <div className="p-5">
                {/* Empty — generate button */}
                {!actions && !loading && (
                    <div className="mb-2">
                        <p className="font-medium text-[13px] text-zinc-500 mb-4 leading-relaxed">
                            Our AI will analyse your specific numbers and generate a personalised action plan — 5 concrete steps to reduce your failure score.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98, y: 1 }}
                            onClick={onGenerate}
                            className="w-full py-3 bg-zinc-900 text-white border border-zinc-900 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 shadow-sm relative z-10 transition-colors"
                            style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Generate 72-Hour Recovery Plan
                        </motion.button>
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-3">
                        <p className="text-[12px] text-[#9CA3AF] text-center mb-3">Generating via Gemini 1.5 Flash…</p>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-14 skeleton-shimmer rounded-xl" style={{ animationDelay: `${i * 80}ms` }} />
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {actions && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <div style={{
                                background: '#F4F4F5', border: '1px solid #E4E4E7', borderRadius: '12px',
                                padding: '14px 16px', marginBottom: '16px',
                            }}>
                                <p className="font-medium text-[12.5px] text-zinc-600 leading-relaxed m-0">
                                    These are <strong className="text-zinc-900 font-bold">5 specific actions</strong>, ranked by impact.
                                    The number next to each (e.g. <strong className="text-zinc-900 font-bold bg-zinc-100 px-1 py-0.5 rounded border border-zinc-300">↓ 12 pts</strong>) shows how much your failure score
                                    will drop. <strong className="text-zinc-900 font-bold">Lower score = safer business.</strong>
                                </p>
                            </div>
                            {actions.map((action, i) => {
                                const s = PRIORITY_STYLES[action.priority] || PRIORITY_STYLES.LOW;
                                return (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.07 }}
                                        whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                                        className="border rounded-2xl p-4 transition-shadow bg-white hover:bg-zinc-50"
                                        style={{ borderColor: s.border, borderStyle: s.dashed ? 'dashed' : 'solid', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                        <div className="flex items-start gap-3">
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest flex-shrink-0 mt-0.5 border"
                                                style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                                {action.priority}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-display font-semibold text-[14px] text-zinc-900 leading-tight">{action.action}</p>
                                                <p className="text-[12px] font-medium text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">{action.impact}</p>
                                            </div>
                                            <span className="font-bold text-[11px] text-zinc-900 flex-shrink-0 mt-0.5 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                                                ↓ {action.scoreImprovement} pts
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
