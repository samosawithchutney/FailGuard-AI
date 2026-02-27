import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

const TYPE_STYLES = {
    normal: 'bg-zinc-900 border-zinc-800 text-zinc-300',
    warning: 'bg-zinc-800 border-zinc-700 text-zinc-200',
    critical: 'bg-zinc-700 border-zinc-600 text-white',
    root_cause: 'bg-white border-zinc-950 text-zinc-950 root-cause-pulse',
};

const SCORE_COLOURS = {
    normal: 'text-zinc-500',
    warning: 'text-zinc-400',
    critical: 'text-white',
    root_cause: 'text-zinc-950',
};

const PHASE_COLOURS = {
    'Year 1 — Healthy Growth': 'bg-zinc-700',
    'Year 2 — Hidden Decline': 'bg-zinc-500',
    'Year 3 — Visible Collapse': 'bg-zinc-300',
};

export default function CausalTimeline({ events }) {
    const scrollRef = useRef(null);
    const rootCauseRef = useRef(null);

    // Auto-scroll to root cause event on mount
    useEffect(() => {
        if (rootCauseRef.current && scrollRef.current) {
            const timer = setTimeout(() => {
                rootCauseRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }, 400);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div
            ref={scrollRef}
            className="overflow-x-auto pb-4 dark-scrollbar"
        >
            <div className="flex gap-3 min-w-max px-1 py-1">
                {events.map((event, i) => (
                    <motion.div
                        key={i}
                        ref={event.rootCause ? rootCauseRef : null}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 100,
                            damping: 20,
                            delay: i * 0.03,
                        }}
                        className="relative flex-shrink-0"
                    >
                        {/* Connector line */}
                        {i < events.length - 1 && (
                            <div className="absolute top-10 left-full w-3 h-px bg-zinc-700 z-10" />
                        )}

                        <div className={`border-2 rounded-xl p-3.5 w-56 ${TYPE_STYLES[event.type] || TYPE_STYLES.normal} ${event.rootCause ? 'border-[3px]' : ''}`}>
                            {/* Phase indicator */}
                            {(i === 0 || events[i - 1].phase !== event.phase) && (
                                <div className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold mb-2 ${event.type === 'root_cause' ? 'bg-zinc-950 text-white' : 'bg-zinc-600 text-zinc-200'
                                    }`}>
                                    {event.phase}
                                </div>
                            )}

                            <p className="text-xs font-bold mb-1 font-mono opacity-70">{event.date}</p>

                            {event.rootCause && (
                                <span className="inline-block bg-zinc-950 text-white text-xs font-black px-2 py-0.5 rounded-md mb-2">
                                    ROOT CAUSE
                                </span>
                            )}

                            <p className={`text-3xl font-black mb-1 font-mono tracking-tighter ${SCORE_COLOURS[event.type]}`}>
                                {event.score}
                            </p>

                            <p className="text-xs font-semibold leading-tight mb-2">{event.label}</p>
                            <p className="text-xs opacity-60 leading-relaxed">{event.description}</p>

                            {event.burnImpact && (
                                <p className="text-xs font-black mt-2 font-mono">Burn: {event.burnImpact}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
