import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateFailureScore } from '../engine/scoreEngine';

const BAND_COLOR = { SAFE: '#16A34A', CAUTION: '#D97706', DANGER: '#DC2626', CRITICAL: '#DC2626' };
const BAND_BG = { SAFE: '#F0FDF4', CAUTION: '#FFFBEB', DANGER: '#FEF2F2', CRITICAL: '#FEF2F2' };
const BAND_BORDER = { SAFE: '#BBF7D0', CAUTION: '#FDE68A', DANGER: '#FECACA', CRITICAL: '#FECACA' };

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
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {/* Score comparison row */}
            <div className="flex flex-wrap items-end gap-6 md:gap-10 mb-8">
                {/* Original */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF] mb-1">Original</p>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 56, lineHeight: 1, letterSpacing: '-0.03em', color: '#6B7280' }}>
                        {scoreResult.score}
                    </span>
                </div>
                {/* Arrow */}
                <span style={{ fontSize: 20, color: '#9CA3AF', marginBottom: 6 }}>→</span>
                {/* Simulated */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF] mb-1">Simulated</p>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 56, lineHeight: 1, letterSpacing: '-0.03em', color: BAND_COLOR[simResult.riskBand] || '#0A0A0A' }}>
                        {simResult.score}
                    </span>
                </div>
                {/* Change */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF] mb-1">Change</p>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 28, lineHeight: 1, color: diff < 0 ? '#16A34A' : diff > 0 ? '#DC2626' : '#9CA3AF' }}>
                        {diff > 0 ? '+' : ''}{diff}
                    </span>
                </div>
                {/* Risk band badge */}
                <motion.span layout className="ml-auto mb-1 self-center px-3 py-1.5 rounded-full text-[11px] font-bold border tracking-wide"
                    style={{ background: BAND_BG[simResult.riskBand], color: BAND_COLOR[simResult.riskBand], borderColor: BAND_BORDER[simResult.riskBand] }}>
                    {simResult.riskBand}
                </motion.span>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
                {SLIDERS.map(({ key, label, min, max, step }) => (
                    <div key={key}>
                        <div className="flex justify-between mb-2">
                            <label style={{ fontWeight: 500, fontSize: 13, color: '#374151' }}>{label}</label>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, color: '#0A0A0A' }}>{simMetrics[key]}</span>
                        </div>
                        <input type="range" min={min} max={max} step={step}
                            value={simMetrics[key]}
                            onChange={e => handleSlider(key, e.target.value)}
                            className="w-full" />
                    </div>
                ))}
            </div>

            {/* Reset */}
            <button onClick={handleReset}
                className="mt-6 underline text-[#9CA3AF] hover:text-[#374151] transition-colors"
                style={{ fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Reset to original values
            </button>
        </div>
    );
}
