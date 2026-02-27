import { motion } from 'framer-motion';

export default function MetricsPanel({ metrics }) {
    const runwayPct = Math.min((metrics.cashDays / 180) * 100, 100);

    const cards = [
        {
            label: 'Revenue Growth',
            value: `${metrics.revenueGrowth > 0 ? '+' : ''}${metrics.revenueGrowth}%`,
            sub: 'Month on month',
            danger: metrics.revenueGrowth < 0,
            safe: metrics.revenueGrowth > 5,
        },
        {
            label: 'Burn Rate',
            value: `${metrics.burnRateRatio}x`,
            sub: 'Expenses / Revenue',
            danger: metrics.burnRateRatio > 1,
            safe: metrics.burnRateRatio <= 0.8,
        },
        {
            label: 'Churn Rate',
            value: `${metrics.churnRate}%`,
            sub: 'Last 30 days',
            danger: metrics.churnRate > 10,
            safe: metrics.churnRate < 5,
        },
        {
            label: 'Gross Margin',
            value: `${(metrics.grossMargin * 100).toFixed(0)}%`,
            sub: 'Revenue − COGS',
            danger: metrics.grossMargin < 0.30,
            safe: metrics.grossMargin >= 0.40,
        },
    ];

    const valueColor = (c) => c.danger ? '#DC2626' : c.safe ? '#16A34A' : '#0A0A0A';

    return (
        <div className="space-y-4">
            {/* Cash Runway — hero card with red left border */}
            <motion.div layout
                className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col gap-3"
                style={{ borderLeft: '4px solid #DC2626', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Cash Runway</p>
                <div className="flex items-baseline gap-2">
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 64, lineHeight: 1, letterSpacing: '-0.03em', color: '#DC2626' }}>
                        {metrics.cashDays}
                    </span>
                    <span style={{ fontSize: 14, color: '#6B7280' }}>days remaining</span>
                </div>
                {metrics.cashDays < 90 && (
                    <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#DC2626]">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.5 1L12 12H1L6.5 1z" stroke="#DC2626" strokeWidth="1.3" strokeLinejoin="round" />
                            <path d="M6.5 5.5v3M6.5 9.5v.5" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                        Below 90-day safety threshold
                    </p>
                )}
                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
                    <div className="h-full rounded-full bg-[#DC2626] transition-all duration-700" style={{ width: `${runwayPct}%` }} />
                </div>
                <p className="text-[11px] text-[#9CA3AF]">{metrics.cashDays} of 180 days</p>
            </motion.div>

            {/* Metric sub-cards — 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
                {cards.map((card, i) => (
                    <motion.div key={card.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.06 }}
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        className="bg-white rounded-xl border border-[#E5E7EB] p-5 cursor-default transition-shadow"
                        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF] mb-2">{card.label}</p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 32, lineHeight: 1, letterSpacing: '-0.02em', color: valueColor(card) }}>
                            {card.value}
                        </p>
                        <p className="text-[13px] text-[#6B7280] mt-1.5">{card.sub}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
