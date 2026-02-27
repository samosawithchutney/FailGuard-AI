import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const TYPE_SCORE_COLOR = { normal: '#9CA3AF', warning: '#D97706', critical: '#DC2626', root_cause: '#0A0A0A' };

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
        <div className="rounded-xl bg-[#F9FAFB] p-6 overflow-x-auto dark-scrollbar" ref={scrollRef}>
            <div className="flex gap-3 min-w-max py-2 px-1">
                {events.map((event, i) => {
                    const isRoot = event.rootCause;
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
                                <div className="absolute top-10 left-full w-3 h-px z-10" style={{ background: '#E5E7EB' }} />
                            )}

                            <div className="rounded-xl p-5 w-[220px]"
                                style={{
                                    background: '#FFFFFF',
                                    border: isRoot ? '2px solid #0A0A0A' : '1px solid #E5E7EB',
                                    boxShadow: isRoot ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                                    animation: isRoot ? 'rootCausePulse 2s ease-in-out infinite' : 'none',
                                }}>

                                {/* Phase label */}
                                {(i === 0 || events[i - 1].phase !== event.phase) && (
                                    <span className="inline-block mb-2 px-2 py-0.5 rounded text-[10px] font-bold"
                                        style={{ background: '#F3F4F6', color: '#6B7280' }}>
                                        {event.phase}
                                    </span>
                                )}

                                {/* Date */}
                                <p style={{ fontFamily: 'Courier New, monospace', fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{event.date}</p>

                                {/* ROOT CAUSE badge */}
                                {isRoot && (
                                    <span className="inline-block mb-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest"
                                        style={{ background: '#0A0A0A', color: '#FFFFFF' }}>
                                        ROOT CAUSE
                                    </span>
                                )}

                                {/* Score */}
                                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em', color: TYPE_SCORE_COLOR[event.type] || '#9CA3AF', marginBottom: 6 }}>
                                    {event.score}
                                </p>

                                {/* Label */}
                                <p style={{ fontWeight: 600, fontSize: 13, color: '#0A0A0A', marginBottom: 4, lineHeight: 1.3 }}>{event.label}</p>

                                {/* Description */}
                                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{event.description}</p>

                                {/* Burn impact */}
                                {event.burnImpact && (
                                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: 12, fontWeight: 700, color: '#DC2626', marginTop: 8 }}>
                                        Burn: {event.burnImpact}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
