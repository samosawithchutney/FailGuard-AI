import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CausalTimeline from './CausalTimeline';
import WhatIfSimulator from './WhatIfSimulator';

export default function AutopsyModal({
    timeline, triggerEvent, narrative, initialMetrics,
    currentMetrics, onMetricsChange, scoreResult, onClose
}) {
    const [loading, setLoading] = useState(true);
    const [showSub, setShowSub] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setShowSub(true), 1000);
        const t2 = setTimeout(() => setLoading(false), 3000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            style={{ background: '#FAFAFA' }}>

            {/* Close button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="fixed top-5 right-6 z-[60] flex items-center gap-1.5 border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-1.5 hover:border-[#D1D5DB] transition-colors"
                style={{ fontSize: 13, fontWeight: 600, color: '#374151', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M9 2L2 9M2 2l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Close
            </motion.button>

            <AnimatePresence mode="wait">
                {/* ── LOADING ── */}
                {loading ? (
                    <motion.div key="loading"
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center min-h-[100dvh] px-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-5">FailGuard Autopsy Engine</p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 28, color: '#0A0A0A', textAlign: 'center', marginBottom: 28, letterSpacing: '-0.01em' }}>
                            Analysing 36 months of business data...
                        </p>
                        {/* Animated dots */}
                        <div className="flex gap-2 mb-6">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} className="w-2 h-2 rounded-full bg-[#0A0A0A]"
                                    animate={{ opacity: [0.15, 1, 0.15] }}
                                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }} />
                            ))}
                        </div>
                        {/* Progress bar */}
                        <div className="w-64 h-[2px] bg-[#E5E7EB] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0A0A0A] rounded-full progress-bar" />
                        </div>
                        {/* Sub-text */}
                        <AnimatePresence>
                            {showSub && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                                    className="mt-6 text-[13px] text-[#9CA3AF] text-center">
                                    Tracing causal chain · Identifying root cause · Building timeline
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    /* ── MAIN CONTENT ── */
                    <motion.div key="content"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                        className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-14">

                        {/* Header */}
                        <div className="mb-8">
                            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 36, color: '#0A0A0A', letterSpacing: '-0.02em', margin: 0 }}>
                                Failure Autopsy Report
                            </h2>
                            <p style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>
                                Root cause identified · {triggerEvent.date} · {triggerEvent.monthsBeforeCollapse} months before current state
                            </p>
                        </div>

                        {/* AI Analysis */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
                            className="mb-7 bg-white rounded-xl border border-[#E5E7EB] p-6"
                            style={{ borderLeft: '4px solid #0A0A0A', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-3">AI Analysis</p>
                            {narrative
                                ? <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>{narrative}</p>
                                : <div className="space-y-2">
                                    <div className="h-3.5 skeleton-shimmer rounded w-4/5" />
                                    <div className="h-3.5 skeleton-shimmer rounded w-full" />
                                    <div className="h-3.5 skeleton-shimmer rounded w-3/5" />
                                </div>
                            }
                        </motion.div>

                        {/* 4 stat cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18, type: 'spring', stiffness: 100, damping: 20 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                            {[
                                { label: 'Trigger Date', value: triggerEvent.date, danger: false },
                                { label: 'Burn Impact', value: triggerEvent.burnImpact, danger: true },
                                { label: 'Cash Impact', value: triggerEvent.cashImpact, danger: false },
                                { label: 'Time to Collapse', value: `${triggerEvent.monthsBeforeCollapse} months`, danger: true },
                            ].map(item => (
                                <div key={item.label}
                                    className="bg-white rounded-xl border border-[#E5E7EB] p-5"
                                    style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-2">{item.label}</p>
                                    <p style={{ fontFamily: 'Courier New, monospace', fontWeight: 700, fontSize: 22, color: item.danger ? '#DC2626' : '#0A0A0A', lineHeight: 1 }}>{item.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Causal Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.26, type: 'spring', stiffness: 100, damping: 20 }}
                            className="mb-8">
                            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 20, color: '#0A0A0A', marginBottom: 16 }}>
                                Causal Chain — 36 Month Trace
                            </h3>
                            <CausalTimeline events={timeline} />
                        </motion.div>

                        {/* What-If Simulator */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.34, type: 'spring', stiffness: 100, damping: 20 }}>
                            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 20, color: '#0A0A0A', marginBottom: 16 }}>
                                What If Simulator
                            </h3>
                            <WhatIfSimulator
                                initialMetrics={initialMetrics}
                                currentMetrics={currentMetrics}
                                onMetricsChange={onMetricsChange}
                                scoreResult={scoreResult} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
