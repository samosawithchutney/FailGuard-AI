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
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col overflow-hidden max-h-[500px]">
            {/* Header with LIVE indicator */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50">
                <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400">Live Alerts</p>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 alert-pulse inline-block shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                    LIVE
                </span>
            </div>

            <div className="px-6 pt-3 pb-1">
                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF', margin: '0', lineHeight: 1.5 }}>
                    These are automatic warnings triggered when a business signal crosses
                    a known danger threshold.
                </p>
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
                                className="flex items-start gap-4 p-3.5 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 hover:shadow-sm transition-all cursor-default">
                                {/* Dot indicator */}
                                <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border" style={{ background: badge.bg, borderColor: badge.border }}>
                                    <span className={`w-2 h-2 rounded-full ${dot.pulse ? 'alert-pulse' : ''}`}
                                        style={{ background: dot.color }} />
                                </div>
                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium text-zinc-800 leading-snug">{alert.msg}</p>
                                    <p className="font-mono text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">{alert.time}</p>
                                </div>
                                {/* Badge */}
                                <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-widest"
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
