import { motion } from 'framer-motion';
import FailureScoreGauge from './FailureScoreGauge';
import MetricsPanel from './MetricsPanel';
import RiskBadges from './RiskBadges';
import AlertFeed from './AlertFeed';
import RecoveryPlan from './RecoveryPlan';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1, y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
};

export default function Dashboard({
    business, metrics, scoreResult, alerts, topRisks,
    historicalScores, recoveryActions, recoveryLoading,
    onTriggerAutopsy, onGenerateRecovery
}) {
    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">
            {/* Header — left-aligned per DESIGN_VARIANCE 8 */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-200"
            >
                <div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight">
                        FailGuard AI
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-500 mt-0.5 tracking-tight">
                        {business.name} &middot; {business.industry} &middot; {business.location}
                    </p>
                </div>
                <div className="mt-2 sm:mt-0 sm:text-right">
                    <p className="text-xs text-zinc-400 font-medium">Real-Time Failure Monitor</p>
                    <p className="text-xs text-zinc-400">Dataset: {business.datasetPeriod}</p>
                </div>
            </motion.div>

            {/* Main Grid — Asymmetric: 2fr 1fr 1fr per DESIGN_VARIANCE 8 */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-5 lg:gap-6"
            >
                {/* LEFT COLUMN — Gauge + Risk Badges + Metrics */}
                <motion.div variants={itemVariants} className="space-y-5">
                    <FailureScoreGauge
                        score={scoreResult.score}
                        riskBand={scoreResult.riskBand}
                        onTriggerAutopsy={onTriggerAutopsy}
                    />
                    <RiskBadges topRisks={scoreResult.topRisks} riskData={topRisks} />
                    <MetricsPanel metrics={metrics} />
                </motion.div>

                {/* CENTER COLUMN — Historical Chart + Recovery Plan */}
                <motion.div variants={itemVariants} className="space-y-5">
                    {/* Historical Score Trend */}
                    <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Score Trend (3 Years)</p>
                        <ResponsiveContainer width="100%" height={160}>
                            <AreaChart data={historicalScores}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.12} />
                                        <stop offset="95%" stopColor="#18181b" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 10, fill: '#a1a1aa' }}
                                    axisLine={{ stroke: '#e4e4e7' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 10, fill: '#a1a1aa' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={28}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#18181b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fafafa',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        padding: '6px 10px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    }}
                                    itemStyle={{ color: '#fafafa' }}
                                    cursor={{ stroke: '#a1a1aa', strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#18181b"
                                    strokeWidth={2}
                                    fill="url(#scoreGradient)"
                                    dot={{ r: 3, fill: '#18181b', strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: '#18181b', stroke: '#fafafa', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <RecoveryPlan
                        actions={recoveryActions}
                        loading={recoveryLoading}
                        onGenerate={onGenerateRecovery}
                    />
                </motion.div>

                {/* RIGHT COLUMN — Alert Feed */}
                <motion.div variants={itemVariants} className="space-y-5">
                    <AlertFeed alerts={alerts} />

                    {/* Business Summary Card */}
                    <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Business Snapshot</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-500">Monthly Revenue</span>
                                <span className="text-sm font-bold text-zinc-900 font-mono">₹3.8L</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-500">Monthly Burn</span>
                                <span className="text-sm font-bold text-zinc-900 font-mono">₹5.09L</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-500">Team Size</span>
                                <span className="text-sm font-bold text-zinc-900 font-mono">{business.employees}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-500">Founded</span>
                                <span className="text-sm font-bold text-zinc-900">{business.founded}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
