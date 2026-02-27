import { motion } from 'framer-motion';

const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 20, delay: i * 0.06 }
    })
};

export default function MetricsPanel({ metrics }) {
    const cards = [
        {
            label: 'Revenue Growth',
            value: `${metrics.revenueGrowth > 0 ? '+' : ''}${metrics.revenueGrowth}%`,
            sub: 'Month on month',
            danger: metrics.revenueGrowth < 0,
        },
        {
            label: 'Burn Rate',
            value: `${metrics.burnRateRatio}x`,
            sub: 'Expenses / Revenue',
            danger: metrics.burnRateRatio > 1,
        },
        {
            label: 'Churn Rate',
            value: `${metrics.churnRate}%`,
            sub: 'Last 30 days',
            danger: metrics.churnRate > 10,
        },
        {
            label: 'Gross Margin',
            value: `${(metrics.grossMargin * 100).toFixed(0)}%`,
            sub: 'Revenue - COGS',
            danger: metrics.grossMargin < 0.30,
        },
    ];

    return (
        <div className="space-y-3">
            {/* Cash Runway — hero card */}
            <motion.div
                layout
                className="bg-zinc-900 text-white rounded-2xl p-5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)]"
            >
                <p className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Cash Runway</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-5xl font-black font-mono tracking-tighter">{metrics.cashDays}</span>
                    <span className="text-sm text-zinc-500 font-medium">days remaining</span>
                </div>
                {metrics.cashDays < 90 && (
                    <p className="text-xs text-zinc-500 mt-2 font-medium">
                        Below 90-day safety threshold
                    </p>
                )}
            </motion.div>

            {/* Metric sub-cards — 2x2 grid instead of banned 3-col equal layout */}
            <div className="grid grid-cols-2 gap-2.5">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -1 }}
                        className={`rounded-xl p-3.5 border transition-colors ${card.danger
                                ? 'border-zinc-300 bg-zinc-100'
                                : 'border-zinc-200/60 bg-white'
                            }`}
                    >
                        <p className="text-xs text-zinc-500 leading-tight font-medium">{card.label}</p>
                        <p className={`text-xl font-black mt-1.5 font-mono tracking-tight ${card.danger ? 'text-zinc-900' : 'text-zinc-500'
                            }`}>
                            {card.value}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">{card.sub}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
