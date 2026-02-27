import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { useEffect } from 'react';

const BAND_COLOR = { SAFE: '#A1A1AA', CAUTION: '#52525B', DANGER: '#18181B', CRITICAL: '#09090B' };
const BAND_BG = { SAFE: '#F4F4F5', CAUTION: '#E4E4E7', DANGER: '#D4D4D8', CRITICAL: '#A1A1AA' };
const BAND_BORDER = { SAFE: '#E4E4E7', CAUTION: '#D4D4D8', DANGER: '#A1A1AA', CRITICAL: '#71717A' };

function AnimatedScore({ score, color }) {
    const motionVal = useMotionValue(0);
    const springVal = useSpring(motionVal, { stiffness: 60, damping: 20 });
    const display = useTransform(springVal, v => Math.round(v));
    useEffect(() => { motionVal.set(score); }, [score, motionVal]);
    return (
        <motion.span className="font-display font-semibold" style={{ fontSize: 80, lineHeight: 1, letterSpacing: '-0.05em', color }}>
            {display}
        </motion.span>
    );
}

export default function FailureScoreGauge({ score, riskBand, onTriggerAutopsy, business, metrics }) {
    const color = BAND_COLOR[riskBand] || '#F4F4F5';
    const chartData = [{ value: score, fill: color }];

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group h-full flex flex-col">
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.03] pointer-events-none transition-colors duration-1000" style={{ background: color }}></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <p className="font-display text-lg font-semibold text-zinc-900 tracking-tight">System Risk Score</p>
                <button className="text-zinc-400 hover:text-zinc-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>
            </div>

            <div className="flex flex-col flex-1">
                {/* Radial gauge */}
                <div className="relative mx-auto" style={{ width: 240, height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%"
                            startAngle={220} endAngle={-40} data={chartData} barSize={16}>
                            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#F4F4F5' }} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                        <AnimatedScore score={score} color={color} />
                        <span className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-widest-editorial">Score / 100</span>
                    </div>
                </div>

                {/* Business Snapshot Info (like the right-side of the score card in inspiration) */}
                <div className="mt-8 border-t border-zinc-200 pt-6 grid grid-cols-2 gap-y-6 gap-x-4 relative z-10">
                    {[
                        { label: 'Monthly Revenue', value: '₹' + (business?.monthlyRevenue || metrics?.revenue || '0').toLocaleString('en-IN') },
                        { label: 'Monthly Burn', value: '₹' + (business?.monthlyBurn || metrics?.expenses || '0').toLocaleString('en-IN') },
                        { label: 'Team Size', value: business?.employees || '—' },
                        { label: 'Founded', value: business?.founded || '—' },
                    ].map((row) => (
                        <div key={row.label} className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                                <span className="text-[11px] font-medium text-zinc-500">{row.label}</span>
                            </div>
                            <span className="font-display font-semibold text-zinc-900 text-[15px] pl-3.5 tracking-tight">{row.value}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-8">
                    {/* Autopsy button */}
                    {score > 60 && (
                        <motion.button
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={onTriggerAutopsy}
                            className="w-full py-3.5 bg-zinc-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 shadow-sm relative z-10 transition-colors"
                            style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}
                        >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 1.5l.75 2.25L10.5 4.5 8.25 5.75 9 8.25 7.5 6.75 6 8.25l.75-2.5L4.5 4.5l2.25-.75z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                <path d="M2 13l3.5-3.5M10.5 10.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Trigger Forensic Autopsy
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
