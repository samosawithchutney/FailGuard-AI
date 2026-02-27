const CONTENT = {
    SAFE: {
        emoji: '✅',
        headline: 'Your business looks healthy.',
        bg: '#F0FDF4', border: '#BBF7D0', textColor: '#16A34A',
        body: 'All five signals we track are within safe ranges. Your cash is comfortable, revenue is stable, and spending is controlled. Check back monthly to catch any early changes.',
        next: 'No immediate action needed. Keep monitoring monthly.',
    },
    CAUTION: {
        emoji: '⚠️',
        headline: 'Some early warning signs are showing.',
        bg: '#FFFBEB', border: '#FDE68A', textColor: '#D97706',
        body: 'One or more signals are moving in the wrong direction. This is not a crisis yet — but small problems compound into big ones if ignored. The best time to act is before it becomes serious.',
        next: 'Look at your Top Risk Factors below. Consider generating a Recovery Plan.',
    },
    DANGER: {
        emoji: '🚨',
        headline: 'Multiple warning signals are active at the same time.',
        bg: '#FEF2F2', border: '#FECACA', textColor: '#DC2626',
        body: 'Several key business health indicators are in the danger zone simultaneously. Businesses in this range typically have 3 to 6 months before the situation becomes very difficult to reverse without taking action.',
        next: 'Run the Failure Autopsy to find the root cause. Generate a Recovery Plan immediately.',
    },
    CRITICAL: {
        emoji: '🔴',
        headline: 'Your business needs immediate attention.',
        bg: '#FEF2F2', border: '#DC2626', textColor: '#7F1D1D',
        body: 'All major failure indicators are in the red. This level requires action this week — not next month. Without intervention, the business faces serious financial risk in the near term.',
        next: 'Stop all non-essential spending immediately. Generate a Recovery Plan. Consider speaking to a financial advisor.',
    },
};

export default function ScoreExplainer({ score, riskBand }) {
    const c = CONTENT[riskBand] || CONTENT.SAFE;
    return (
        <div style={{
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: '16px', padding: '20px',
        }}>
            <p style={{
                fontFamily: 'Inter', fontSize: '16px', fontWeight: 700,
                color: c.textColor, margin: '0 0 10px'
            }}>
                {c.emoji}  {c.headline}
            </p>
            <p style={{
                fontFamily: 'Inter', fontSize: '14px', color: '#374151',
                lineHeight: 1.7, margin: '0 0 12px'
            }}>
                {c.body}
            </p>
            <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '12px' }}>
                <p style={{
                    fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
                    color: c.textColor, margin: 0
                }}>
                    → What to do next: {c.next}
                </p>
            </div>
        </div>
    );
}
