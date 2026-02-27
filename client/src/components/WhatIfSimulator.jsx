import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateFailureScore } from '../engine/scoreEngine';

const BAND_COLOR = { SAFE: '#A1A1AA', CAUTION: '#52525B', DANGER: '#18181B', CRITICAL: '#09090B' };
const BAND_BG = { SAFE: '#F4F4F5', CAUTION: '#E4E4E7', DANGER: '#D4D4D8', CRITICAL: '#A1A1AA' };
const BAND_BORDER = { SAFE: '#E4E4E7', CAUTION: '#D4D4D8', DANGER: '#A1A1AA', CRITICAL: '#71717A' };

const SLIDERS = [
    {
        key: 'cashDays',
        label: 'Cash Runway (days)',
        plain: 'How many days of cash do you have in the bank?',
        tip: 'Drag right to simulate having more cash saved up. Drag left to see what happens as cash runs low.',
        min: 0, max: 180, step: 1,
    },
    {
        key: 'revenueGrowth',
        label: 'Revenue Growth (%)',
        plain: 'Is your monthly revenue going up or down?',
        tip: 'Negative = revenue is falling each month. Zero = flat. Positive = growing.',
        min: -30, max: 30, step: 0.1,
    },
    {
        key: 'burnRateRatio',
        label: 'Burn Rate',
        plain: 'How much do you spend compared to what you earn?',
        tip: 'Below 1.0 = spending less than you earn (good). Above 1.0 = spending more (dangerous).',
        min: 0.5, max: 2.0, step: 0.01,
    },
    {
        key: 'churnRate',
        label: 'Customer Churn (%)',
        plain: 'What % of customers leave each month?',
        tip: '0 = no one leaves. 20 = one in five customers leaves every month.',
        min: 0, max: 30, step: 0.1,
    },
];

export default function WhatIfSimulator({ initialMetrics, currentMetrics, onMetricsChange, scoreResult }) {
    const [simMetrics, setSimMetrics] = useState({ ...currentMetrics });
    const simResult = calculateFailureScore(simMetrics);
    const diff = simResult.score - scoreResult.score;

    const handleSlider = (key, val) => {
        const updated = { ...simMetrics, [key]: parseFloat(val) };
        setSimMetrics(updated);
        onMetricsChange(updated);
    };

    const handleReset = () => {
        setSimMetrics({ ...initialMetrics });
        onMetricsChange({ ...initialMetrics });
    };

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">

            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 mb-8">
                <p className="font-medium text-[13px] text-zinc-900 leading-relaxed m-0">
                    🎛️ <strong className="font-bold">This is your "time machine."</strong> Drag any slider to the left or
                    right to simulate what would happen if you changed that number.
                    Watch your failure score update instantly.
                    <br /><span className="mt-2 block opacity-80">Try asking: <em className="italic">"What if I had kept 120 days of cash instead of 67?"</em></span>
                </p>
            </div>

            {/* Score comparison row */}
            <div className="flex flex-wrap items-end gap-6 md:gap-10 mb-8 border-b border-zinc-100 pb-8">
                {/* Original */}
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-2">Original</p>
                    <span className="font-display font-semibold text-zinc-300" style={{ fontSize: 56, lineHeight: 1, letterSpacing: '-0.04em' }}>
                        {scoreResult.score}
                    </span>
                </div>
                {/* Arrow */}
                <span className="text-2xl text-zinc-200 mb-2 font-light">→</span>
                {/* Simulated */}
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-2">Simulated</p>
                    <span className="font-display font-semibold transition-colors duration-500" style={{ fontSize: 64, lineHeight: 1, letterSpacing: '-0.05em', color: BAND_COLOR[simResult.riskBand] || '#0A0A0A' }}>
                        {simResult.score}
                    </span>
                </div>
                {/* Change */}
                <div className="mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-2">Change</p>
                    <span className="font-display font-semibold transition-colors duration-500" style={{ fontSize: 32, lineHeight: 1, color: diff < 0 ? '#71717A' : diff > 0 ? '#18181B' : '#E4E4E7' }}>
                        {diff > 0 ? '+' : ''}{diff}
                    </span>
                </div>
                {/* Risk band badge */}
                <motion.span layout className="ml-auto mb-2 self-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors duration-500"
                    style={{ background: BAND_BG[simResult.riskBand], color: BAND_COLOR[simResult.riskBand], borderColor: BAND_BORDER[simResult.riskBand] }}>
                    {simResult.riskBand}
                </motion.span>
            </div>

            {/* Sliders */}
            <div className="space-y-8 flex-1">
                {SLIDERS.map(({ key, plain, tip, min, max, step }) => (
                    <div key={key} className="group">
                        <div className="flex justify-between items-end mb-3">
                            <label className="font-semibold text-[13px] text-zinc-900">{plain}</label>
                            <span className="font-display font-bold text-[15px] text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg tabular-nums transition-colors group-hover:bg-zinc-200">{simMetrics[key]}</span>
                        </div>
                        <input type="range" min={min} max={max} step={step}
                            value={simMetrics[key]}
                            onChange={e => handleSlider(key, e.target.value)}
                            className="w-full accent-zinc-900 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer hover:accent-zinc-700 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
                        <p className="font-medium text-[11px] text-zinc-400 mt-2 leading-relaxed">
                            {tip}
                        </p>
                    </div>
                ))}
            </div>

            {/* Reset */}
            <motion.button
                whileHover={{ opacity: 1 }}
                onClick={handleReset}
                className="mt-8 pt-4 border-t border-zinc-100 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors w-full text-center opacity-70">
                ↺ Reset to original values
            </motion.button>
        </div>
    );
}
