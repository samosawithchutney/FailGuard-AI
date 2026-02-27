const SafeIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginRight: '8px' }}><polyline points="20 6 9 17 4 12" /></svg>;
const CautionIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginRight: '8px' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
const CriticalIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginRight: '8px' }}><circle cx="12" cy="12" r="10" /></svg>;

const CONTENT = {
    SAFE: {
        icon: SafeIcon,
        headline: 'Your business looks healthy.',
        bg: '#F0FDF4', border: '#BBF7D0', textColor: '#16A34A',
        body: 'All five signals we track are within safe ranges. Your cash is comfortable, revenue is stable, and spending is controlled. Check back monthly to catch any early changes.',
        focus: 'Growth & Scaling',
        window: 'Optimal / Stable',
        next: 'No immediate action needed. Keep monitoring monthly.',
    },
    CAUTION: {
        icon: CautionIcon,
        headline: 'Some early warning signs are showing.',
        bg: '#FFFBEB', border: '#FDE68A', textColor: '#D97706',
        body: 'One or more signals are moving in the wrong direction. This is not a crisis yet — but small problems compound into big ones if ignored. The best time to act is before it becomes serious.',
        focus: 'Cost Control & Efficiency',
        window: '6 to 12 Months',
        next: 'Look at your Top Risk Factors below. Consider generating a Recovery Plan.',
    },
    DANGER: {
        icon: CautionIcon,
        headline: 'Multiple warning signals are active at the same time.',
        bg: '#FFF7ED', border: '#FED7AA', textColor: '#EA580C',
        body: 'Several key business health indicators are in the danger zone simultaneously. Businesses in this range typically have 3 to 6 months before the situation becomes very difficult to reverse without taking action.',
        focus: 'Immediate Runway Extension',
        window: '3 to 6 Months',
        next: 'Run the Failure Autopsy to find the root cause. Generate a Recovery Plan immediately.',
    },
    CRITICAL: {
        icon: CriticalIcon,
        headline: 'Your business needs immediate attention.',
        bg: '#F5F3FF', border: '#EDE9FE', textColor: '#7C3AED',
        body: 'All major failure indicators are in the red. This level requires action this week — not next month. Without intervention, the business faces serious financial risk in the near term.',
        focus: 'Emergency Restructuring',
        window: 'Under 3 Months',
        next: 'Stop all non-essential spending immediately. Generate a Recovery Plan. Consider speaking to a financial advisor.',
    },
};

export default function ScoreExplainer({ score, riskBand }) {
    const c = CONTENT[riskBand] || CONTENT.SAFE;
    return (
        <div style={{
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: '16px', padding: '24px',
            display: 'flex', flexDirection: 'column', flex: 1, height: '100%'
        }}>
            <div>
                <p style={{
                    fontFamily: 'Inter', fontSize: '17px', fontWeight: 700,
                    color: c.textColor, margin: '0 0 12px', display: 'flex', alignItems: 'center', letterSpacing: '-0.01em'
                }}>
                    {c.icon}{c.headline}
                </p>
                <p style={{
                    fontFamily: 'Inter', fontSize: '14.5px', color: '#374151',
                    lineHeight: 1.6, margin: '0 0 24px'
                }}>
                    {c.body}
                </p>

                {/* Additional Insight Box */}
                <div style={{
                    background: 'rgba(255,255,255,0.6)', border: `1px solid ${c.border}`, borderRadius: '12px', padding: '16px', marginBottom: '24px'
                }}>
                    <div className="flex items-center justify-between mb-3 border-b pb-3" style={{ borderColor: c.border }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Focus</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{c.focus}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action Window</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{c.window}</span>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '16px', marginTop: 'auto' }}>
                <p style={{
                    fontFamily: 'Inter', fontSize: '13.5px', fontWeight: 600,
                    color: c.textColor, margin: 0, lineHeight: 1.5
                }}>
                    → What to do next: {c.next}
                </p>
            </div>
        </div >
    );
}
