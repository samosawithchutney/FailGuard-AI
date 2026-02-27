import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CausalTimeline from './CausalTimeline';
import WhatIfSimulator from './WhatIfSimulator';
import ChatbotWidget from './chatbot/ChatbotWidget';

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
            className="fixed inset-0 z-50 overflow-y-auto bg-zinc-50/95 backdrop-blur-sm">

            {/* Close button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="fixed top-5 right-6 z-[60] flex items-center gap-2 border border-zinc-200 bg-white shadow-sm rounded-full px-4 py-2 hover:bg-zinc-50 hover:shadow-md transition-all font-bold text-[11px] uppercase tracking-widest text-zinc-600">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M9 2L2 9M2 2l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Close
            </motion.button>

            <AnimatePresence mode="wait">
                {/* ── LOADING ── */}
                {loading ? (
                    <motion.div key="loading"
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center min-h-[100dvh] px-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-5">FailGuard Autopsy Engine</p>
                        <p className="font-display font-semibold text-3xl text-zinc-900 text-center mb-8 tracking-tight">
                            Analysing 36 months of business data...
                        </p>
                        {/* Animated dots */}
                        <div className="flex gap-3 mb-8">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} className="w-2.5 h-2.5 rounded-full bg-zinc-900"
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
                                    Tracing the chain of events · Finding the moment things changed · Identifying the root cause
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
                        <div className="mb-10 text-center">
                            <h2 className="font-display font-bold text-4xl text-zinc-900 tracking-tighter m-0">
                                Failure Autopsy Report
                            </h2>
                            <p className="font-medium text-[13px] text-zinc-500 mt-3">
                                Root cause identified <span className="opacity-50 mx-1">·</span> {triggerEvent.date} <span className="opacity-50 mx-1">·</span> {triggerEvent.monthsBeforeCollapse} months before current state
                            </p>
                        </div>

                        {/* Guided Intro */}
                        <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 md:p-8 mb-8 text-center max-w-3xl mx-auto">
                            <p className="font-bold text-[10px] uppercase tracking-widest-editorial text-zinc-400 mb-4">
                                WHAT IS FAILURE AUTOPSY MODE?
                            </p>
                            <p className="font-medium text-[14px] text-zinc-600 leading-relaxed mb-4">
                                Think of this like a doctor reviewing your full medical history to find what caused
                                your illness — not just treating the symptoms. Autopsy Mode scans your entire
                                business timeline to find the <strong className="font-bold text-zinc-900">exact moment</strong> things started going
                                wrong, and explains what triggered the decline in plain English.
                            </p>
                            <p className="font-medium text-[14px] text-zinc-600 leading-relaxed m-0">
                                Scroll down to see your timeline. Look for the card labelled{' '}
                                <strong className="bg-zinc-900 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mx-1">ROOT CAUSE</strong>
                                {' '}— that is the event that started the chain reaction. Everything that happened
                                after was a consequence of that one decision.
                            </p>
                        </div>

                        {/* AI Analysis */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
                            className="mb-8 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden group">

                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 bg-white inline-block px-3 py-1 rounded-full border border-zinc-200 shadow-sm">Forensic AI Analysis</p>
                            {narrative
                                ? <p className="font-serif text-[18px] text-zinc-900 leading-relaxed max-w-4xl">{narrative}</p>
                                : <div className="space-y-3 opacity-50">
                                    <div className="h-4 skeleton-shimmer rounded bg-zinc-200 w-4/5" />
                                    <div className="h-4 skeleton-shimmer rounded bg-zinc-200 w-full" />
                                    <div className="h-4 skeleton-shimmer rounded bg-zinc-200 w-3/5" />
                                </div>
                            }
                        </motion.div>

                        {/* 4 stat cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18, type: 'spring', stiffness: 100, damping: 20 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Trigger Date', value: triggerEvent.date, danger: false },
                                { label: 'Burn Impact', value: triggerEvent.burnImpact, danger: true },
                                { label: 'Cash Impact', value: triggerEvent.cashImpact, danger: false },
                                { label: 'Time to Collapse', value: `${triggerEvent.monthsBeforeCollapse} months`, danger: true },
                            ].map(item => (
                                <div key={item.label}
                                    className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
                                    <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-3">{item.label}</p>
                                    <p className="font-display font-semibold text-[22px] tracking-tight text-zinc-900">{item.value}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Causal Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.26, type: 'spring', stiffness: 100, damping: 20 }}
                            className="mb-12">
                            <h3 className="font-display font-bold text-2xl text-zinc-900 mb-6">
                                Causal Chain — 36 Month Trace
                            </h3>
                            <CausalTimeline events={timeline} />
                        </motion.div>

                        {/* What-If Simulator */}
                        <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.34, type: 'spring', stiffness: 100, damping: 20 }}
                            className="mb-8">
                            <h3 className="font-display font-bold text-2xl text-zinc-900 mb-6">
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
