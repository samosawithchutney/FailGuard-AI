import { motion } from 'framer-motion';

const BADGE = {
    CRITICAL: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
    DANGER: { bg: '#FFF7ED', color: '#D97706', border: '#FED7AA' },
    WARNING: { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB' },
};

export default function RiskBadges({ topRisks, riskData }) {
    const items = riskData && riskData.length > 0 ? riskData : (topRisks || []).map((r, i) => ({
        factor: r, value: '—', severity: i === 0 ? 'CRITICAL' : i === 1 ? 'DANGER' : 'WARNING'
    }));

    return (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
            <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-5">Top Risk Factors</p>
            <div className="flex flex-col gap-3">
                {items.map((risk, i) => {
                    const badge = BADGE[risk.severity] || BADGE.WARNING;
                    return (
                        <motion.div key={risk.factor}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.08 }}
                            className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 hover:shadow-sm transition-all cursor-default">
                            {/* Rank */}
                            <span className="font-display font-bold text-xl text-zinc-300 min-w-6 text-center">
                                {i + 1}
                            </span>
                            {/* Name + value */}
                            <div className="flex-1 min-w-0 ml-1">
                                <p className="font-display font-semibold text-[15px] text-zinc-900 leading-tight tracking-tight">{risk.factor}</p>
                                {risk.value && risk.value !== '—' && (
                                    <p className="font-mono text-xs text-zinc-500 mt-0.5">{risk.value}</p>
                                )}
                            </div>
                            {/* Severity badge */}
                            <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                                {risk.severity}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
