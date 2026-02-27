import { motion } from 'framer-motion';
import Tooltip from './shared/Tooltip';

export default function MetricsPanel({ metrics }) {
    const runwayPct = Math.min((metrics.cashDays / 180) * 100, 100);

    const cards = [
        {
            label: 'Revenue Growth',
            tooltip: <Tooltip text="Whether your income went up or down compared to last month, shown as a percentage. Positive = growing. Negative = shrinking." example="-8.2% means for every ₹100 you earned last month, you earned only ₹91.80 this month." position="right" />,
            value: `${metrics.revenueGrowth > 0 ? '+' : ''}${parseFloat(metrics.revenueGrowth).toFixed(1)}%`,
            sub: 'Month on month',
            danger: metrics.revenueGrowth < 0,
            safe: metrics.revenueGrowth > 5,
        },
        {
            label: 'Burn Rate',
            tooltip: <Tooltip text="How much you are spending compared to what you earn. 1.0 means you spend exactly what you earn. Above 1.0 means you are spending more than you earn — your savings shrink every month." example="1.34x means: you earn ₹100, but spend ₹134. You lose ₹34 every ₹100 earned." position="right" />,
            value: `${parseFloat(metrics.burnRateRatio).toFixed(2)}x`,
            sub: 'Expenses / Revenue',
            danger: metrics.burnRateRatio > 1,
            safe: metrics.burnRateRatio <= 0.8,
        },
        {
            label: 'Churn Rate',
            tooltip: <Tooltip text="The percentage of your customers who stopped buying from you this month. High churn means customers leave faster than new ones arrive." example="14% churn means 14 out of every 100 customers didn't come back this month." position="right" />,
            value: `${parseFloat(metrics.churnRate).toFixed(1)}%`,
            sub: 'Last 30 days',
            danger: metrics.churnRate > 10,
            safe: metrics.churnRate < 5,
        },
        {
            label: 'Gross Margin',
            tooltip: <Tooltip text="How much money you keep from each rupee of sales after paying for the direct cost of making your product or delivering your service. Higher is better." example="28% margin means you keep ₹28 from every ₹100 sale after ingredient and material costs." position="right" />,
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
                className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                style={{ borderLeft: '4px solid #EF4444' }}>
                <p className="flex items-center text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400">
                    Cash Runway
                    <Tooltip text="How many days your business can keep running with the cash you have right now, at your current spending rate. Think of it like how many days of fuel you have left in the tank." example="₹2 lakh in bank, spending ₹1 lakh/month = 60 days of runway." position="right" />
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-semibold" style={{ fontSize: 64, lineHeight: 1, letterSpacing: '-0.04em', color: '#EF4444' }}>
                        {metrics.cashDays}
                    </span>
                    <span className="text-sm font-medium text-zinc-500">days remaining</span>
                </div>
                {metrics.cashDays < 90 && (
                    <p className="flex items-start gap-1.5 text-[12.5px] font-medium text-[#DC2626] mt-1 leading-snug">
                        <svg width="14" height="14" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
                            <path d="M6.5 1L12 12H1L6.5 1z" stroke="#DC2626" strokeWidth="1.3" strokeLinejoin="round" />
                            <path d="M6.5 5.5v3M6.5 9.5v.5" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                        <span>At your current spending rate, you have <strong>{metrics.cashDays} days</strong> until your bank account runs dry. The safe minimum is 90 days.</span>
                    </p>
                )}
                {/* Progress bar */}
                <div className="h-[2px] w-full bg-zinc-100 rounded-full mt-2 overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${runwayPct}%` }} />
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest-editorial">{metrics.cashDays} of 180 days</p>
            </motion.div>

            {/* Metric sub-cards — 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
                {cards.map((card, i) => (
                    <motion.div key={card.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.06 }}
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        className="bg-white rounded-2xl border border-zinc-200 p-5 cursor-default shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                        <p className="flex items-center text-[10px] font-bold uppercase tracking-widest-editorial text-zinc-400 mb-3">{card.label} {card.tooltip}</p>
                        <div>
                            <p className="font-display font-semibold" style={{ fontSize: 36, lineHeight: 1, letterSpacing: '-0.03em', color: valueColor(card) }}>
                                {card.value}
                            </p>
                            <p className="text-[12px] font-medium text-zinc-500 mt-2">{card.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
