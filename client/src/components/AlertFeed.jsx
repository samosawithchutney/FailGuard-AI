import { motion } from 'framer-motion';

export default function AlertFeed({ alerts }) {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Live Alerts</p>
                <div className="flex flex-col items-center py-6">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mb-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v3m0 3h.01M14 8A6 6 0 112 8a6 6 0 0112 0z" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium">No active alerts</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Live Alerts</p>
            <div className="space-y-2.5 max-h-72 overflow-y-auto dark-scrollbar pr-1">
                {alerts.map((alert, i) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.06 }}
                        className="flex items-start gap-2.5 group"
                    >
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.level === 'critical' ? 'bg-zinc-900' :
                                alert.level === 'danger' ? 'bg-zinc-600' : 'bg-zinc-400'
                            }`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-700 leading-relaxed">{alert.msg}</p>
                            <p className="text-xs text-zinc-400 mt-0.5 font-mono">{alert.time}</p>
                        </div>
                        <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold ${alert.level === 'critical' ? 'bg-zinc-900 text-white' :
                                alert.level === 'danger' ? 'bg-zinc-200 text-zinc-700' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                            {alert.level}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
