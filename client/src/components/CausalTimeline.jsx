import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const TYPE_SCORE_COLOR = { normal: '#A1A1AA', warning: '#52525B', critical: '#18181B', root_cause: '#09090B' };

export default function CausalTimeline({ events }) {
    const scrollRef = useRef(null);
    const rootCauseRef = useRef(null);

    useEffect(() => {
        if (rootCauseRef.current && scrollRef.current) {
            const timer = setTimeout(() => {
                rootCauseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }, 400);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="relative">
            {/* Legend */}
            <div className="absolute -top-12 right-0 hidden md:flex items-center gap-4 bg-white border border-zinc-200 px-3 py-1.5 rounded-xl shadow-sm z-10">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#CA8A04' }}></span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Noticeable</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EA580C' }}></span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Warning</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C2410C' }}></span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Critical</span>
                </div>
            </div>

            <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-6 md:p-8 overflow-x-auto" ref={scrollRef}>
                <div className="flex gap-4 min-w-max py-2 px-1">
                    {events.map((event, i) => {
                        const isRoot = event.rootCause;
                        const prevScore = i > 0 ? events[i - 1].score : event.score;
                        const decline = event.score - prevScore;

                        let declineColor = '#A1A1AA'; // default zinc-400
                        let dropBg = '#F4F4F5';
                        let dropBorder = '#E4E4E7';

                        if (decline >= 6) {
                            declineColor = '#C2410C'; // Deep Orange-700
                            dropBg = '#FFEDD5';
                            dropBorder = '#F97316';
                        } else if (decline >= 3) {
                            declineColor = '#EA580C'; // Med Orange-600
                            dropBg = '#FFEDD5';
                            dropBorder = '#FDBA74';
                        } else if (decline > 0) {
                            declineColor = '#CA8A04'; // Dark Yellow-600
                            dropBg = '#FEF9C3';
                            dropBorder = '#FDE047';
                        }

                        return (
                            <motion.div key={i}
                                ref={isRoot ? rootCauseRef : null}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.025 }}
                                className="relative flex-shrink-0"
                                style={{ transform: isRoot ? 'scale(1.05)' : 'scale(1)', transformOrigin: 'bottom center', zIndex: isRoot ? 2 : 1 }}>

                                {/* Connector */}
                                {i < events.length - 1 && (
                                    <div className="absolute top-12 left-full w-4 h-[2px] z-10 bg-zinc-200" />
                                )}

                                <div className="rounded-2xl p-5 md:p-6 w-[240px] bg-white transition-all shadow-sm"
                                    style={{
                                        border: isRoot ? '2px solid #18181B' : '1px solid #E4E4E7',
                                        boxShadow: isRoot ? '0 0 0 4px rgba(24,24,27,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                                    }}>

                                    {/* Phase label */}
                                    {(i === 0 || events[i - 1].phase !== event.phase) && (
                                        <span className="inline-block mb-3 px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500">
                                            {event.phase}
                                        </span>
                                    )}

                                    {/* Date */}
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-1">{event.date}</p>

                                    {/* ROOT CAUSE badge */}
                                    {isRoot && (
                                        <span className="inline-block mt-1 mb-4 px-2.5 py-1 rounded border border-zinc-700 text-[9px] font-bold uppercase tracking-widest bg-zinc-900 text-white shadow-sm">
                                            ROOT CAUSE
                                        </span>
                                    )}

                                    {/* Score */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <p className="font-display font-semibold text-5xl tracking-tighter" style={{ color: declineColor }}>
                                            {event.score}
                                        </p>
                                        {decline > 0 && (
                                            <span className="font-bold text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border"
                                                style={{ color: declineColor, backgroundColor: dropBg, borderColor: dropBorder }}>
                                                +{decline} pts
                                            </span>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <p className="font-display font-bold text-[15px] text-zinc-900 leading-snug mb-2 tracking-tight">{event.label}</p>

                                    {/* Description */}
                                    <p className="text-[12px] font-medium text-zinc-500 leading-relaxed">{event.description}</p>

                                    {/* Burn impact */}
                                    {event.burnImpact && (
                                        <p className="font-mono text-[11px] font-bold text-zinc-900 mt-4 bg-zinc-100 border border-zinc-200 inline-block px-2.5 py-1 rounded-md">
                                            Burn: {event.burnImpact}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
