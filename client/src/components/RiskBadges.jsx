import { motion } from 'framer-motion';

const SEVERITY_STYLES = {
    CRITICAL: 'bg-zinc-900 text-white',
    DANGER: 'bg-zinc-600 text-white',
    WARNING: 'bg-zinc-300 text-zinc-800',
};

export default function RiskBadges({ topRisks, riskData }) {
    return (
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Top Risk Factors</p>
            <div className="flex flex-col gap-2.5">
                {riskData && riskData.map((risk, i) => (
                    <motion.div
                        key={risk.factor}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.08 }}
                        className="flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                                {i + 1}
                            </span>
                            <div>
                                <span className="text-sm font-semibold text-zinc-800">{risk.factor}</span>
                                <p className="text-xs text-zinc-400 font-mono">{risk.value}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-black flex-shrink-0 ${SEVERITY_STYLES[risk.severity] || SEVERITY_STYLES.WARNING}`}>
                            {risk.severity}
                        </span>
                    </motion.div>
                ))}
                {(!riskData || riskData.length === 0) && topRisks && topRisks.map((risk, i) => (
                    <div key={risk} className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-bold">
                            {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-zinc-800">{risk}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
