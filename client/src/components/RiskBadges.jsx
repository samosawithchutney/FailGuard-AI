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
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-4">Top Risk Factors</p>
            <div className="flex flex-col gap-4">
                {items.map((risk, i) => {
                    const badge = BADGE[risk.severity] || BADGE.WARNING;
                    return (
                        <motion.div key={risk.factor}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.08 }}
                            className="flex items-center gap-3">
                            {/* Rank */}
                            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 12, color: '#9CA3AF', minWidth: 24 }}>
                                0{i + 1}
                            </span>
                            {/* Name + value */}
                            <div className="flex-1 min-w-0">
                                <p style={{ fontWeight: 600, fontSize: 14, color: '#0A0A0A' }}>{risk.factor}</p>
                                {risk.value && risk.value !== '—' && (
                                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: 12, color: '#6B7280', marginTop: 1 }}>{risk.value}</p>
                                )}
                            </div>
                            {/* Severity badge */}
                            <span className="flex-shrink-0 px-2 py-0.5 rounded-md text-[11px] font-bold border"
                                style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}>
                                {risk.severity}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
