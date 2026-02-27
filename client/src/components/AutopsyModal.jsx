import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CausalTimeline from './CausalTimeline';
import WhatIfSimulator from './WhatIfSimulator';

export default function AutopsyModal({
    timeline, triggerEvent, narrative, initialMetrics,
    currentMetrics, onMetricsChange, scoreResult, onClose
}) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-zinc-950 z-50 overflow-y-auto"
        >
            {/* Close button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="fixed top-4 right-6 text-zinc-400 text-sm font-bold border border-zinc-700 px-3.5 py-1.5 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors z-[60]"
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="inline mr-1.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Close
            </motion.button>

            <AnimatePresence mode="wait">
                {loading ? (
                    /* Loading screen */
                    <motion.div
                        key="loading"
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center min-h-[100dvh]"
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            className="text-white text-xl md:text-2xl font-bold mb-6 tracking-tight text-center px-4"
                        >
                            Analysing 36 months of business data
                        </motion.p>
                        <LoadingDots />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-zinc-600 text-xs md:text-sm mt-8 tracking-tight text-center px-4"
                        >
                            Tracing causal chain &middot; Identifying root cause &middot; Building timeline
                        </motion.p>
                    </motion.div>
                ) : (
                    /* Main autopsy content */
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                        className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12"
                    >
                        <div className="mb-8">
                            <h2 className="text-white text-2xl md:text-3xl font-black tracking-tight mb-2">
                                Failure Autopsy Report
                            </h2>
                            <p className="text-zinc-500 text-sm font-medium">
                                Root cause identified &middot; {triggerEvent.date} &middot; {triggerEvent.monthsBeforeCollapse} months before current state
                            </p>
                        </div>

                        {/* AI Narrative */}
                        {narrative && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 100, damping: 20 }}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6 mb-8"
                            >
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">AI Analysis</p>
                                <p className="text-zinc-200 text-sm md:text-base leading-relaxed">{narrative}</p>
                            </motion.div>
                        )}
                        {!narrative && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6 mb-8">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">AI Analysis</p>
                                <div className="space-y-2.5">
                                    <div className="h-3.5 skeleton-shimmer rounded w-3/4" />
                                    <div className="h-3.5 skeleton-shimmer rounded w-full" />
                                    <div className="h-3.5 skeleton-shimmer rounded w-2/3" />
                                </div>
                            </div>
                        )}

                        {/* Trigger Event Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, type: 'spring', stiffness: 100, damping: 20 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                        >
                            {[
                                { label: 'Trigger Date', value: triggerEvent.date },
                                { label: 'Burn Impact', value: triggerEvent.burnImpact },
                                { label: 'Cash Impact', value: triggerEvent.cashImpact },
                                { label: 'Time to Collapse', value: `${triggerEvent.monthsBeforeCollapse} months` },
                            ].map((item, i) => (
                                <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5">
                                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider">{item.label}</p>
                                    <p className="text-white text-lg font-black mt-1 font-mono tracking-tight">{item.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Causal Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, type: 'spring', stiffness: 100, damping: 20 }}
                            className="mb-8"
                        >
                            <h3 className="text-white text-lg font-bold tracking-tight mb-4">
                                Causal Chain — 36 Month Trace
                            </h3>
                            <CausalTimeline events={timeline} />
                        </motion.div>

                        {/* What If Simulator */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, type: 'spring', stiffness: 100, damping: 20 }}
                        >
                            <h3 className="text-white text-lg font-bold tracking-tight mb-4">
                                What If Simulator
                            </h3>
                            <WhatIfSimulator
                                initialMetrics={initialMetrics}
                                currentMetrics={currentMetrics}
                                onMetricsChange={onMetricsChange}
                                scoreResult={scoreResult}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Animated loading dots — isolated per SKILL.md performance rules
function LoadingDots() {
    return (
        <div className="flex gap-2.5">
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-white rounded-full"
                    animate={{ opacity: [0.15, 1, 0.15], scale: [0.85, 1, 0.85] }}
                    transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}
