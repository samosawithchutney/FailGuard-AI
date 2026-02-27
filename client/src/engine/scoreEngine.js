// scoreEngine.js — Failure Score Formula
// Runs client-side in <1ms. No dependencies.

export function calculateFailureScore(metrics) {
    const { cashDays, revenueGrowth, burnRateRatio, churnRate, grossMargin } = metrics;

    // Step 1: Normalise each variable to a 0-100 danger score
    const cashScore = Math.max(0, Math.min(100, (1 - cashDays / 180) * 100));
    const revenueScore = Math.max(0, Math.min(100, (-revenueGrowth + 20) * 2.5));
    const burnScore = Math.max(0, Math.min(100, (burnRateRatio - 0.5) * 200));
    const churnScore = Math.max(0, Math.min(100, churnRate * 5));
    const marginScore = Math.max(0, Math.min(100, (0.40 - grossMargin) * 250));

    // Step 2: Weighted combination
    // Weights reflect real-world failure priority — cash kills businesses first
    const raw = (
        cashScore * 0.30 +   // 30% — primary survival signal
        revenueScore * 0.25 +   // 25% — growth trajectory
        burnScore * 0.20 +   // 20% — spending sustainability
        churnScore * 0.15 +   // 15% — demand health
        marginScore * 0.10     // 10% — business model health
    );

    const score = Math.round(raw);

    // Step 3: Assign risk band
    let riskBand;
    if (score <= 30) riskBand = 'SAFE';
    else if (score <= 60) riskBand = 'CAUTION';
    else if (score <= 85) riskBand = 'DANGER';
    else riskBand = 'CRITICAL';

    // Step 4: Identify top 3 risk factors for badge display
    const factors = [
        { name: 'Cash Runway', score: cashScore, weight: 0.30 },
        { name: 'Revenue Growth', score: revenueScore, weight: 0.25 },
        { name: 'Burn Rate', score: burnScore, weight: 0.20 },
        { name: 'Churn Rate', score: churnScore, weight: 0.15 },
        { name: 'Gross Margin', score: marginScore, weight: 0.10 },
    ];
    const topRisks = factors
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(f => f.name);

    return { score, riskBand, topRisks };
}

// Returns Tailwind classes for a given risk band
export function getRiskColour(riskBand) {
    const map = {
        SAFE: { text: 'text-zinc-400', bg: 'bg-zinc-100', border: 'border-zinc-300' },
        CAUTION: { text: 'text-zinc-600', bg: 'bg-zinc-200', border: 'border-zinc-400' },
        DANGER: { text: 'text-zinc-900', bg: 'bg-zinc-400', border: 'border-zinc-700' },
        CRITICAL: { text: 'text-white', bg: 'bg-zinc-900', border: 'border-zinc-950' },
    };
    return map[riskBand] || map.SAFE;
}
