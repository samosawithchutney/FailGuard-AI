import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateFailureScore } from '../engine/scoreEngine';

const SLIDERS = [
    { key: 'cashDays', label: 'Cash Runway (days)', min: 0, max: 180, step: 1 },
    { key: 'revenueGrowth', label: 'Revenue Growth (%)', min: -30, max: 30, step: 0.5 },
    { key: 'burnRateRatio', label: 'Burn Rate Ratio', min: 0.5, max: 2.0, step: 0.01 },
    { key: 'churnRate', label: 'Customer Churn (%)', min: 0, max: 30, step: 0.5 },
];

export default function WhatIfSimulator({ initialMetrics, currentMetrics, onMetricsChange, scoreResult }) {
    const [simMetrics, setSimMetrics] = useState({ ...currentMetrics });
    const simResult = calculateFailureScore(simMetrics);
    const diff = simResult.score - scoreResult.score;

    const handleSlider = (key, value) => {
        const updated = { ...simMetrics, [key]: parseFloat(value) };
        setSimMetrics(updated);
        onMetricsChange(updated);
    };

    const handleReset = () => {
        setSimMetrics({ ...initialMetrics });
        onMetricsChange({ ...initialMetrics });
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6">
            {/* Score comparison */}
            <div className="flex flex-wrap items-center gap-6 md:gap-8 mb-6">
                <div className="text-center">
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider mb-1">Original</p>
                    <p className="text-white text-4xl font-black font-mono tracking-tighter">{scoreResult.score}</p>
                </div>

                <div className="text-zinc-700 text-xl font-bold">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 8h16m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div className="text-center">
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider mb-1">Simulated</p>
                    <p className={`text-4xl font-black font-mono tracking-tighter ${simResult.score < scoreResult.score ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                        {simResult.score}
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider mb-1">Change</p>
                    <p className={`text-2xl font-black font-mono tracking-tighter ${diff < 0 ? 'text-emerald-400' : diff > 0 ? 'text-rose-400' : 'text-zinc-500'
                        }`}>
                        {diff > 0 ? '+' : ''}{diff}
                    </p>
                </div>

                <div className="ml-auto">
                    <motion.span
                        layout
                        className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider
              ${simResult.riskBand === 'SAFE' ? 'bg-zinc-800 text-zinc-400' : ''}
              ${simResult.riskBand === 'CAUTION' ? 'bg-zinc-700 text-white' : ''}
              ${simResult.riskBand === 'DANGER' ? 'bg-zinc-400 text-zinc-950' : ''}
              ${simResult.riskBand === 'CRITICAL' ? 'bg-white text-zinc-950' : ''}
            `}
                    >
                        {simResult.riskBand}
                    </motion.span>
                </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
                {SLIDERS.map(({ key, label, min, max, step }) => (
                    <div key={key}>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-zinc-500 text-xs font-semibold tracking-tight">{label}</label>
                            <span className="text-white text-xs font-bold font-mono">{simMetrics[key]}</span>
                        </div>
                        <input
                            type="range"
                            min={min} max={max} step={step}
                            value={simMetrics[key]}
                            onChange={e => handleSlider(key, e.target.value)}
                            className="w-full"
                        />
                    </div>
                ))}
            </div>

            {/* Reset button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="mt-5 text-xs text-zinc-600 font-semibold hover:text-zinc-300 transition-colors border border-zinc-800 rounded-lg px-3 py-1.5"
            >
                Reset to original values
            </motion.button>
        </div>
    );
}
