import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FailureScoreGauge from './FailureScoreGauge';
import MetricsPanel from './MetricsPanel';
import RiskBadges from './RiskBadges';
import AlertFeed from './AlertFeed';
import RecoveryPlan from './RecoveryPlan';
import ScoreExplainer from './dashboard/ScoreExplainer';
import ChatbotWidget from './chatbot/ChatbotWidget';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const BAND_COLOR = { SAFE: '#16A34A', CAUTION: '#D97706', DANGER: '#DC2626', CRITICAL: '#DC2626' };

function Nav({ onOpenDashboard }) {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 md:px-10 bg-white/70 backdrop-blur-md border-b border-zinc-200/50">
            <span className="font-display font-bold text-xl tracking-tight text-zinc-900 cursor-pointer" onClick={() => navigate('/')}>FailGuard AI</span>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="text-xs font-semibold tracking-widest-editorial text-zinc-500 hover:text-zinc-900 transition-colors uppercase">
                ← Home
            </motion.button>
        </div>
    );
}

// AlertBanner removed per user request to implement it somewhere else.

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } } };

/* Custom tooltip for chart */
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontFamily: 'Inter, sans-serif' }}>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A' }}>{payload[0].value}</p>
        </div>
    );
};

export default function Dashboard({
    business, metrics, scoreResult, alerts, topRisks,
    historicalScores, recoveryActions, recoveryLoading,
    onTriggerAutopsy, onGenerateRecovery
}) {
    const lineColor = BAND_COLOR[scoreResult?.riskBand] || '#DC2626';

    return (
        <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans relative overflow-x-hidden selection:bg-zinc-900 selection:text-white">
            <Nav />

            <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-4">
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-200">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="font-display font-bold text-3xl text-zinc-900 tracking-tighter m-0">
                                {business.name}
                            </h1>
                            {scoreResult?.score > 60 && (
                                <span className="bg-zinc-900 text-white border border-zinc-800 px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    {scoreResult.riskBand} STATUS
                                </span>
                            )}
                            {business && !business.isDemo && (
                                <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest">
                                    ✓ YOUR DATA
                                </span>
                            )}
                            {business?.isDemo && (
                                <span className="bg-white text-zinc-600 border border-zinc-300 px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer hover:bg-zinc-50 transition-colors shadow-sm"
                                    onClick={() => document.location.href = '/analyse'}>
                                    DEMO DATA — Analyse your own business →
                                </span>
                            )}
                        </div>
                        <p className="font-medium text-sm text-zinc-500 mt-2">
                            {business.industry} <span className="mx-1 opacity-50">·</span> {business.location} <span className="mx-1 opacity-50">·</span> Dataset: {business.datasetPeriod}
                        </p>
                    </div>

                    {/* View Autopsy Inline Button */}
                    {scoreResult?.score > 60 && (
                        <div className="mt-4 sm:mt-0">
                            <button onClick={onTriggerAutopsy}
                                className="group relative inline-flex items-center justify-center px-5 py-2 text-[11px] font-bold tracking-widest uppercase text-zinc-900 bg-white border border-zinc-200 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:border-zinc-300 overflow-hidden">
                                <div className="absolute inset-0 bg-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    View Autopsy Report
                                    <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                </span>
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Main grid — Dark Bento-Box Layout */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                    {/* TOP ROW: 4 Metric Cards */}
                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-12">
                        <MetricsPanel metrics={metrics} />
                    </motion.div>

                    {/* ROW 2: Score Gauge (Left - 5 cols), Trend & Risks (Right - 7 cols) */}
                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-4 h-full">
                        <FailureScoreGauge score={scoreResult.score} riskBand={scoreResult.riskBand} onTriggerAutopsy={onTriggerAutopsy} business={business} metrics={metrics} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-8 flex flex-col gap-5">
                        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-500 mb-4">Total Profit (Score Trend)</p>
                            <ResponsiveContainer width="100%" height={160}>
                                <AreaChart data={historicalScores}>
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#18181B" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#18181B" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fill: '#71717A' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} width={28} />
                                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#E5E7EB', strokeDasharray: '4 4' }} />
                                    <Area type="monotone" dataKey="score" stroke="#18181B" strokeWidth={2.5} fill="url(#scoreGrad)" activeDot={{ r: 5, fill: '#FFFFFF', stroke: '#18181B', strokeWidth: 2 }} dot={{ r: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <RiskBadges topRisks={topRisks} riskData={scoreResult.topRisks} />
                    </motion.div>

                    {/* ROW 3: Alert Feed (Left - 7 cols), Recovery Plan (Right - 5 cols) */}
                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-7">
                        <AlertFeed alerts={alerts} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-5 flex flex-col gap-5">
                        <ScoreExplainer score={scoreResult.score} riskBand={scoreResult.riskBand} />
                        <RecoveryPlan actions={recoveryActions} loading={recoveryLoading} onGenerate={onGenerateRecovery} />
                    </motion.div>

                </motion.div>
            </div>
            <ChatbotWidget />
        </div>
    );
}
