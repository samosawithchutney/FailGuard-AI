import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FailureScoreGauge from './FailureScoreGauge';
import MetricsPanel from './MetricsPanel';
import RiskBadges from './RiskBadges';
import AlertFeed from './AlertFeed';
import RecoveryPlan from './RecoveryPlan';
import ScoreExplainer from './dashboard/ScoreExplainer';
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

function AlertBanner({ score, riskBand, onTriggerAutopsy }) {
    if (score <= 60) return null;
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 md:px-10 py-3 bg-red-50 border-b border-red-100/50 border-l-4 border-l-red-500 gap-3 sm:gap-0 mt-0.5">
            <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 alert-pulse flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="font-display font-medium text-sm text-red-800 tracking-tight">
                    <strong className="font-bold">{riskBand}</strong> — Zara Bakeries is at elevated failure risk
                </span>
            </div>
            <button onClick={onTriggerAutopsy}
                className="font-display font-bold text-[13px] text-red-700 hover:text-red-900 transition-colors bg-white/50 px-4 py-1.5 rounded-full border border-red-200/50 hover:shadow-sm">
                View Autopsy →
            </button>
        </div>
    );
}

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
        <div className="min-h-screen bg-zinc-50">
            <Nav />
            <AlertBanner score={scoreResult?.score} riskBand={scoreResult?.riskBand} onTriggerAutopsy={onTriggerAutopsy} />

            <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-4">
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-zinc-200/60">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="font-display font-bold text-3xl text-zinc-900 tracking-tighter m-0">
                                {business.name}
                            </h1>
                            {business && !business.isDemo && (
                                <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest">
                                    ✓ YOUR DATA
                                </span>
                            )}
                            {business?.isDemo && (
                                <span className="bg-zinc-100/80 text-zinc-500 border border-zinc-200 px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer hover:bg-zinc-200 transition-colors"
                                    onClick={() => document.location.href = '/analyse'}>
                                    DEMO DATA — Analyse your own business →
                                </span>
                            )}
                        </div>
                        <p className="font-medium text-sm text-zinc-500 mt-2">
                            {business.industry} <span className="mx-1 opacity-50">·</span> {business.location} <span className="mx-1 opacity-50">·</span> Dataset: {business.datasetPeriod}
                        </p>
                    </div>
                    <p className="font-bold text-[11px] text-zinc-400 mt-6 sm:mt-0 uppercase tracking-widest-editorial">
                        Real-Time Failure Monitor
                    </p>
                </motion.div>

                {/* Main grid — asymmetric 2fr 1fr 1fr */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-5">

                    {/* LEFT — Gauge + Risk Badges + Metrics */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <FailureScoreGauge score={scoreResult.score} riskBand={scoreResult.riskBand} onTriggerAutopsy={onTriggerAutopsy} />
                        <ScoreExplainer score={scoreResult.score} riskBand={scoreResult.riskBand} />
                        <RiskBadges topRisks={topRisks} riskData={scoreResult.topRisks} />
                        <MetricsPanel metrics={metrics} />
                    </motion.div>

                    {/* CENTER — Chart + Recovery */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        {/* Score trend chart */}
                        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-4">Score Trend — 3 Years</p>
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={historicalScores}>
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={lineColor} stopOpacity={0.08} />
                                            <stop offset="95%" stopColor={lineColor} stopOpacity={0.01} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fill: '#9CA3AF' }}
                                        axisLine={{ stroke: '#F3F4F6' }} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fill: '#9CA3AF' }}
                                        axisLine={false} tickLine={false} width={28} />
                                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#E5E7EB', strokeDasharray: '4 4' }} />
                                    <ReferenceLine x="Oct 24" stroke="#DC2626" strokeDasharray="4 3" label={{ value: 'Root Cause', position: 'top', fontFamily: 'Inter, sans-serif', fontSize: 10, fill: '#DC2626' }} />
                                    <Area type="monotone" dataKey="score" stroke={lineColor} strokeWidth={2}
                                        fill="url(#scoreGrad)"
                                        dot={{ r: 2.5, fill: lineColor, strokeWidth: 0 }}
                                        activeDot={{ r: 5, fill: lineColor, stroke: '#FFFFFF', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <RecoveryPlan actions={recoveryActions} loading={recoveryLoading} onGenerate={onGenerateRecovery} />
                    </motion.div>

                    {/* RIGHT — Alerts + Business Snapshot */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <AlertFeed alerts={alerts} />

                        {/* Business Snapshot */}
                        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-6">Business Snapshot</p>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                {[
                                    { label: 'Monthly Revenue', value: '₹' + (business.monthlyRevenue || metrics.revenue || '0').toLocaleString('en-IN') },
                                    { label: 'Monthly Burn', value: '₹' + (business.monthlyBurn || metrics.expenses || '0').toLocaleString('en-IN') },
                                    { label: 'Team Size', value: business.employees },
                                    { label: 'Founded', value: business.founded },
                                ].map((row) => (
                                    <div key={row.label} className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest inline-block">{row.label}</span>
                                        <span className="font-display font-semibold text-zinc-900 text-lg tracking-tight">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
