import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { useEffect } from 'react';

const BAND_COLOR = { SAFE: '#16A34A', CAUTION: '#D97706', DANGER: '#DC2626', CRITICAL: '#DC2626' };
const BAND_BG = { SAFE: '#F0FDF4', CAUTION: '#FFFBEB', DANGER: '#FEF2F2', CRITICAL: '#FEF2F2' };
const BAND_BORDER = { SAFE: '#BBF7D0', CAUTION: '#FDE68A', DANGER: '#FECACA', CRITICAL: '#FECACA' };

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

export default function FailureScoreGauge({ score, riskBand, onTriggerAutopsy }) {
    const color = BAND_COLOR[riskBand] || '#0A0A0A';
    const chartData = [{ value: score, fill: color }];

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[-10px] w-56 h-56 rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-1000" style={{ background: color }}></div>
            <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-5 relative z-10">Failure Score</p>

            <div className="flex flex-col items-center">
                {/* Radial gauge */}
                <div className="relative" style={{ width: 220, height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%"
                            startAngle={220} endAngle={-40} data={chartData} barSize={12}>
                            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#F3F4F6' }} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                        <AnimatedScore score={score} color={color} />
                        <span className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest-editorial">out of 100</span>
                    </div>
                </div>

                {/* Risk band badge */}
                <motion.div layout className="mt-4 px-4 py-1 rounded-full text-xs font-bold tracking-wide border"
                    style={{
                        background: BAND_BG[riskBand],
                        color: BAND_COLOR[riskBand],
                        borderColor: BAND_BORDER[riskBand],
                        fontSize: 12,
                    }}>
                    {riskBand}
                </motion.div>

                {/* Autopsy button */}
                {score > 60 && (
                    <motion.button
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onTriggerAutopsy}
                        className="mt-6 w-full py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-50 shadow-sm relative z-10"
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
    );
}
