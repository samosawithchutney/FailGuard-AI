import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const ARC_COLOUR = {
    SAFE: '#d4d4d8',
    CAUTION: '#71717a',
    DANGER: '#18181b',
    CRITICAL: '#09090b',
};

// Isolated animated score display — uses useMotionValue outside React render cycle
// per SKILL.md Section 4 (Magnetic Micro-physics / performance)
function AnimatedScore({ score }) {
    const motionVal = useMotionValue(0);
    const springVal = useSpring(motionVal, { stiffness: 60, damping: 20 });
    const display = useTransform(springVal, v => Math.round(v));

    useEffect(() => {
        motionVal.set(score);
    }, [score, motionVal]);

    return (
        <motion.span className="text-5xl font-black text-zinc-900 score-number">
            {display}
        </motion.span>
    );
}

export default function FailureScoreGauge({ score, riskBand, onTriggerAutopsy }) {
    const chartData = [{ value: score, fill: ARC_COLOUR[riskBand] || '#18181b' }];

    return (
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Failure Score</p>

            <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="50%" cy="50%"
                            innerRadius="65%" outerRadius="90%"
                            startAngle={220} endAngle={-40}
                            data={chartData}
                            barSize={14}
                        >
                            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#f4f4f5' }} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    {/* Centred score number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <AnimatedScore score={score} />
                        <span className="text-xs text-zinc-400 mt-1 font-medium">out of 100</span>
                    </div>
                </div>

                {/* Risk band label */}
                <motion.div
                    layout
                    className={`mt-3 px-4 py-1 rounded-full text-xs font-black tracking-wider
            ${riskBand === 'SAFE' ? 'bg-zinc-100 text-zinc-500' : ''}
            ${riskBand === 'CAUTION' ? 'bg-zinc-200 text-zinc-700' : ''}
            ${riskBand === 'DANGER' ? 'bg-zinc-800 text-white' : ''}
            ${riskBand === 'CRITICAL' ? 'bg-zinc-950 text-white' : ''}
          `}
                >
                    {riskBand}
                </motion.div>

                {/* Autopsy button — only shows when score > 60 */}
                {score > 60 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onTriggerAutopsy}
                        className="mt-5 w-full py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors relative overflow-hidden"
                    >
                        <span className="relative z-10">Trigger Autopsy</span>
                        {/* Subtle pulse indicator */}
                        <motion.div
                            className="absolute inset-0 bg-zinc-700"
                            animate={{ opacity: [0, 0.15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </motion.button>
                )}
            </div>
        </div>
    );
}
