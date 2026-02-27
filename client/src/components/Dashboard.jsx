import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FailureScoreGauge from './FailureScoreGauge';
import MetricsPanel from './MetricsPanel';
import RiskBadges from './RiskBadges';
import AlertFeed from './AlertFeed';
import RecoveryPlan from './RecoveryPlan';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const BAND_COLOR = { SAFE: '#16A34A', CAUTION: '#D97706', DANGER: '#DC2626', CRITICAL: '#DC2626' };

function Nav({ onOpenDashboard }) {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-30 h-[56px] flex items-center justify-between px-6 md:px-10"
            style={{ background: 'rgba(250,250,250,0.90)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#0A0A0A' }}>FailGuard</span>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="text-sm font-medium text-[#6B7280] hover:text-[#0A0A0A] transition-colors">
                ← Home
            </motion.button>
        </div>
    );
}

function AlertBanner({ score, riskBand, onTriggerAutopsy }) {
    if (score <= 60) return null;
    return (
        <div className="flex items-center justify-between px-6 md:px-10 py-3"
            style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA' }}>
            <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] alert-pulse flex-shrink-0" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#DC2626' }}>
                    {riskBand} — Zara Bakeries is at elevated failure risk
                </span>
            </div>
            <button onClick={onTriggerAutopsy}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>
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
        <div style={{ minHeight: '100dvh', background: '#FAFAFA' }}>
            <Nav />
            <AlertBanner score={scoreResult?.score} riskBand={scoreResult?.riskBand} onTriggerAutopsy={onTriggerAutopsy} />

            <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6">
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-5 border-b border-[#F3F4F6]">
                    <div>
                        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 22, color: '#0A0A0A', letterSpacing: '-0.02em', margin: 0 }}>
                            {business.name}
                        </h1>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9CA3AF', marginTop: 3 }}>
                            {business.industry} · {business.location} · Dataset: {business.datasetPeriod}
                        </p>
                    </div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
                        Real-Time Failure Monitor
                    </p>
                </motion.div>

                {/* Main grid — asymmetric 2fr 1fr 1fr */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-5">

                    {/* LEFT — Gauge + Risk Badges + Metrics */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <FailureScoreGauge score={scoreResult.score} riskBand={scoreResult.riskBand} onTriggerAutopsy={onTriggerAutopsy} />
                        <RiskBadges topRisks={topRisks} riskData={scoreResult.topRisks} />
                        <MetricsPanel metrics={metrics} />
                    </motion.div>

                    {/* CENTER — Chart + Recovery */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        {/* Score trend chart */}
                        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-1">Score Trend — 3 Years</p>
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
                        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-4">Business Snapshot</p>
                            <div className="space-y-0">
                                {[
                                    { label: 'Monthly Revenue', value: '₹3.8L' },
                                    { label: 'Monthly Burn', value: '₹5.09L' },
                                    { label: 'Team Size', value: business.employees },
                                    { label: 'Founded', value: business.founded },
                                ].map((row, i, arr) => (
                                    <div key={row.label} className="flex justify-between items-center py-3"
                                        style={{ borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#6B7280' }}>{row.label}</span>
                                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#0A0A0A' }}>{row.value}</span>
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
