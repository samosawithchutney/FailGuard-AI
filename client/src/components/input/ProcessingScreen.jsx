import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CheckIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '6px' }}><polyline points="20 6 9 17 4 12" /></svg>;

const STEPS = [
    'Reading your business numbers...',
    'Calculating cash runway...',
    'Measuring revenue trend...',
    'Checking burn rate...',
    'Identifying top risks...',
    'Your score is ready.',
];

export default function ProcessingScreen() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * 360));
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0, background: '#FAFAFA',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
            <p style={{
                fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.1em', color: '#9CA3AF', margin: '0 0 20px'
            }}>
                FAILGUARD SCORE ENGINE
            </p>
            <h2 style={{
                fontFamily: 'Inter', fontSize: '28px', fontWeight: 800,
                color: '#0A0A0A', margin: '0 0 32px', textAlign: 'center'
            }}>
                Calculating your failure score...
            </h2>
            <div style={{
                width: '320px', height: '3px', background: '#F3F4F6',
                borderRadius: '2px', overflow: 'hidden', marginBottom: '32px'
            }}>
                <motion.div
                    initial={{ width: '0%' }} animate={{ width: '100%' }}
                    transition={{ duration: 2.0, ease: 'easeInOut' }}
                    style={{ height: '100%', background: '#0A0A0A', borderRadius: '2px' }}
                />
            </div>
            <div style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
                alignItems: 'center', minHeight: '140px'
            }}>
                {STEPS.slice(0, step + 1).map((s, i) => (
                    <motion.p key={s} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontFamily: 'Inter', fontSize: '14px', margin: 0,
                            color: i === step ? '#0A0A0A' : '#9CA3AF',
                            fontWeight: i === step ? 600 : 400,
                        }}
                    >
                        {i < step ? CheckIcon : null}{s}
                    </motion.p>
                ))}
            </div>
        </div>
    );
}
