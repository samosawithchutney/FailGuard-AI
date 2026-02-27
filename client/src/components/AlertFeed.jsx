import { motion } from 'framer-motion';

const LEVEL_DOT = {
    critical: { color: '#DC2626', pulse: true },
    danger: { color: '#D97706', pulse: false },
    warning: { color: '#9CA3AF', pulse: false },
};
const LEVEL_BADGE = {
    critical: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
    danger: { bg: '#FFF7ED', color: '#D97706', border: '#FED7AA' },
    warning: { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB' },
};

export default function AlertFeed({ alerts }) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {/* Header with LIVE indicator */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-[#F3F4F6]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Live Alerts</p>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#DC2626]">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] alert-pulse inline-block" />
                    LIVE
                </span>
            </div>

            {/* Alerts list */}
            {!alerts || alerts.length === 0 ? (
                <div className="px-6 py-8 flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#9CA3AF]">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <p className="text-[13px] text-[#9CA3AF]">No active alerts</p>
                </div>
            ) : (
                <div className="p-4 space-y-2 max-h-72 overflow-y-auto dark-scrollbar">
                    {alerts.map((alert, i) => {
                        const dot = LEVEL_DOT[alert.level] || LEVEL_DOT.warning;
                        const badge = LEVEL_BADGE[alert.level] || LEVEL_BADGE.warning;
                        return (
                            <motion.div key={alert.id || i}
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.05 }}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                                {/* Dot */}
                                <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${dot.pulse ? 'alert-pulse' : ''}`}
                                    style={{ background: dot.color }} />
                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{alert.msg}</p>
                                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{alert.time}</p>
                                </div>
                                {/* Badge */}
                                <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[11px] font-bold border"
                                    style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}>
                                    {alert.level}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
