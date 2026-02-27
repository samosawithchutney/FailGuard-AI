import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

/* ── Shared Nav (same across landing + could be imported) ─────── */
function Nav() {
    const navigate = useNavigate();
    return (
        <nav className="fixed top-0 inset-x-0 z-40 h-[56px] flex items-center justify-between px-6 md:px-12"
            style={{ background: 'rgba(250,250,250,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#0A0A0A' }}>FailGuard</span>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A0A0A] text-white"
                style={{ fontSize: 14, fontWeight: 600 }}>
                Open Dashboard
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8m0 0L7.5 3m3 3.5L7.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </motion.button>
        </nav>
    );
}

/* ── Stat strip ─────────────────────────────────────────────── */
const STATS = [
    '36 Months of Business History Analysed',
    '14 Months Early Warning Demonstrated',
    '5 Signals. One Score.',
];

/* ── Feature cards ─────────────────────────────────────────── */
const FEATURES = [
    {
        num: '01',
        title: 'Real-Time Failure Prediction',
        desc: 'Deterministic scoring logic continuously evaluates your live operational metrics against established collapse trajectories.',
        icon: (
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
    {
        num: '02',
        title: 'Failure Autopsy Mode',
        desc: 'A forensic timeline engine that traces the causal chain of events to pinpoint exactly when, why, and where the decline began.',
        icon: (
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
    {
        num: '03',
        title: 'What-If Decision Simulator',
        desc: 'Test alternate business decisions in a safe sandbox environment to instantly see their impact on your operational survival score.',
        icon: (
            <path d="M8 7h8M8 11h5m-9-8h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ),
    },
];

const DEMO_STATS = [
    { val: '74/100', label: 'Failure Score' },
    { val: 'Oct 2024', label: 'Root Cause' },
    { val: '+34%', label: 'Burn Spike' },
    { val: '14 Months', label: 'Early Warning' },
];

const COMPARISON = [
    ['Shows past', 'Predicts future'],
    ['Surface metrics', 'Causal signals'],
    ['No tracing', 'Autopsy Mode'],
    ['Manual analysis', 'AI recovery'],
];

const fadeIn = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#FAFAFA', color: '#0A0A0A', minHeight: '100dvh' }}>
            <Nav />

            {/* ── SECTION 1: HERO ──────────────────────────────────── */}
            <section className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '100dvh', paddingTop: 56 }}>
                <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center gap-6 max-w-3xl">
                    {/* Label pill */}
                    <motion.div variants={fadeIn} className="flex items-center gap-2 px-4 py-2 rounded-full border"
                        style={{ background: '#FEF2F2', borderColor: '#FCA5A5' }}>
                        <span className="w-2 h-2 rounded-full bg-[#DC2626] alert-pulse flex-shrink-0" />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em', color: '#DC2626', textTransform: 'uppercase' }}>
                            Early Warning Intelligence
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 variants={fadeIn} style={{ margin: 0, lineHeight: 1.08, letterSpacing: '-0.03em' }}>
                        <span className="font-serif-display block" style={{ fontSize: 'clamp(48px, 7vw, 76px)', color: '#0A0A0A' }}>
                            Predict Business Failure
                        </span>
                        <span className="font-serif-display block" style={{ fontSize: 'clamp(48px, 7vw, 76px)', color: '#9CA3AF' }}>
                            Before It Happens.
                        </span>
                    </motion.h1>

                    {/* Sub */}
                    <motion.p variants={fadeIn} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 18, lineHeight: 1.65, color: '#6B7280', maxWidth: 520, margin: 0 }}>
                        FailGuard AI analyzes hidden operational signals to detect collapse trajectories — and tells you exactly when, why, and where the decline began.
                    </motion.p>

                    {/* CTA */}
                    <motion.button variants={fadeIn}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-4 rounded-full bg-[#0A0A0A] text-white"
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, transition: 'all 0.2s ease' }}>
                        Open Dashboard →
                    </motion.button>

                    {/* Tagline */}
                    <motion.p variants={fadeIn} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 11, letterSpacing: '0.08em', color: '#9CA3AF', textTransform: 'uppercase', margin: 0 }}>
                        Explainable Risk Intelligence for 63M Indian SMBs
                    </motion.p>
                </motion.div>
            </section>

            {/* ── SECTION 2: SOCIAL PROOF BAR ─────────────────────── */}
            <section style={{ background: '#F3F4F6', padding: '16px 0' }}>
                <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
                    {STATS.map((s, i) => (
                        <div key={i} className="flex items-center gap-4">
                            {i > 0 && <span style={{ color: '#D1D5DB', display: 'none' }} className="sm:inline">|</span>}
                            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#374151', textAlign: 'center' }}>{s}</span>
                            {i < STATS.length - 1 && <span className="hidden sm:inline" style={{ color: '#D1D5DB', marginLeft: 16, marginRight: 16 }}>|</span>}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SECTION 3: ABOUT ─────────────────────────────────── */}
            <section className="max-w-[1100px] mx-auto px-6 py-20 md:py-28 grid md:grid-cols-[55%_45%] gap-12 md:gap-16">
                {/* Left */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeIn}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-4">The Problem</p>
                    <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 36px)', color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 24 }}>
                        Your dashboard shows you what happened. Not what's about to.
                    </h2>
                    <div style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.7 }} className="space-y-4">
                        <p>Businesses rarely fail suddenly. Collapse is almost always preceded by a silent accumulation of risk — a compounding series of small decisions that slowly erode operational health and cash runway.</p>
                        <p>Traditional analytics dashboards show you lagging indicators of performance. They tell you what happened last quarter, but they don't alert you when your current trajectory crosses the threshold into fatal insolvency.</p>
                        <p style={{ fontWeight: 600, color: '#0A0A0A' }}>FailGuard AI shifts the paradigm from observation to prediction. We detect early risk signals, trace the causal origin of decline, and provide executable AI recovery plans to course-correct before it's too late.</p>
                    </div>
                    {/* 3 inline stats */}
                    <div className="mt-8 pt-8 border-t border-[#F3F4F6] grid grid-cols-3 gap-6">
                        {[
                            { num: '70%', label: 'of SMBs fail' },
                            { num: '₹700M', label: 'avg investor loss' },
                            { num: '67', label: 'days avg runway at detection', suffix: 'days' },
                        ].map(s => (
                            <div key={s.num}>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 32, color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.num}</p>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.4 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right — comparison card */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeIn}
                    className="self-center bg-white rounded-2xl border border-[#E5E7EB] p-8"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#F3F4F6]">
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#9CA3AF' }}>Traditional Tools</span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, color: '#9CA3AF' }}>vs</span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, color: '#0A0A0A' }}>FailGuard</span>
                    </div>
                    <div className="space-y-4">
                        {COMPARISON.map(([old, neu], i) => (
                            <div key={i} className="flex items-center justify-between gap-4">
                                <span style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'line-through' }}>{old}</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#0A0A0A' }}>{neu}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── SECTION 4: FEATURES ──────────────────────────────── */}
            <section className="max-w-[1100px] mx-auto px-6 pb-20 md:pb-28">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
                    <motion.p variants={fadeIn} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] text-center mb-4">Core Capabilities</motion.p>
                    <motion.h2 variants={fadeIn} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 40px)', color: '#0A0A0A', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 48 }}>
                        Everything you need to see what's coming.
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => (
                            <motion.div key={i} variants={fadeIn}
                                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.09)' }}
                                className="bg-white rounded-2xl border border-[#E5E7EB] p-8 flex flex-col group transition-all"
                                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'default' }}>
                                {/* Background number */}
                                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 64, color: '#F3F4F6', lineHeight: 1, marginBottom: 16, letterSpacing: '-0.04em' }}>{f.num}</p>
                                {/* Icon */}
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:bg-[#0A0A0A]" style={{ background: '#F9FAFB' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#6B7280] group-hover:text-white transition-colors">
                                        {f.icon}
                                    </svg>
                                </div>
                                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 20, color: '#0A0A0A', marginBottom: 10, letterSpacing: '-0.01em' }}>{f.title}</h3>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#6B7280', lineHeight: 1.65, flex: 1 }}>{f.desc}</p>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#0A0A0A', marginTop: 20 }}>→</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── SECTION 5: DEMO STRIP (intentional dark) ─────────── */}
            <section style={{ background: '#0A0A0A', padding: '96px 24px' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
                        <motion.h2 variants={fadeIn} className="font-serif-display"
                            style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.01em' }}>
                            The collapse at Zara Bakeries started in October 2024.
                        </motion.h2>
                        <motion.p variants={fadeIn} style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: '#9CA3AF', marginBottom: 48 }}>
                            FailGuard detected it 14 months before anyone else noticed.
                        </motion.p>
                        {/* 4 stat boxes */}
                        <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {DEMO_STATS.map((s, i) => (
                                <motion.div key={i} variants={fadeIn}
                                    className="border rounded-xl p-5 text-center"
                                    style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'transparent' }}>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 22, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 4 }}>{s.val}</p>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#6B7280' }}>{s.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.button variants={fadeIn}
                            onClick={() => { window.location.href = '/dashboard'; }}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="px-7 py-3.5 rounded-full border border-white text-white"
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, background: 'transparent', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                            See the Full Autopsy →
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ── SECTION 6: FOOTER ────────────────────────────────── */}
            <footer style={{ background: '#FAFAFA', borderTop: '1px solid #E5E7EB', padding: '32px 24px' }}>
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#0A0A0A' }}>FailGuard AI</p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Explainable failure intelligence.</p>
                    </div>
                    <div className="flex gap-6">
                        <button onClick={() => navigate('/')} style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
                            className="hover:text-[#374151] transition-colors">Home</button>
                        <button onClick={() => navigate('/dashboard')} style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
                            className="hover:text-[#374151] transition-colors">Dashboard</button>
                    </div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9CA3AF' }}>Built at TechBiz 2026 · Presidency University</p>
                </div>
            </footer>
        </div>
    );
}
