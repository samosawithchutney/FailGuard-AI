import { useState } from 'react';
import { calculateFailureScore } from '../../engine/scoreEngine';

const BAND = {
    SAFE: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    CAUTION: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
    DANGER: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    CRITICAL: { bg: '#0A0A0A', text: '#FFFFFF', border: '#0A0A0A' },
};

const SCORE_PLAIN = {
    SAFE: 'Healthy',
    CAUTION: 'Early warnings',
    DANGER: 'Needs attention',
    CRITICAL: 'Act immediately',
};

export default function BusinessCard({ business, onSelect, onDelete }) {
    const [hover, setHover] = useState(false);
    const result = calculateFailureScore(business.metrics);
    const band = BAND[result.riskBand] || BAND.SAFE;
    const date = business.createdAt
        ? new Date(business.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    return (
        <div
            onClick={onSelect}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '20px',
                padding: '24px', cursor: 'pointer', position: 'relative',
                boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.06)',
                transform: hover ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all 200ms ease',
            }}
        >
            {/* Delete button */}
            {hover && (
                <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px',
                    width: '28px', height: '28px', cursor: 'pointer',
                    fontFamily: 'Inter', fontSize: '14px', color: '#9CA3AF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
            )}

            {/* Business name + score */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '16px', paddingRight: hover ? '36px' : '0'
            }}>
                <div>
                    <p style={{
                        fontFamily: 'Inter', fontSize: '18px', fontWeight: 700,
                        color: '#0A0A0A', margin: '0 0 4px'
                    }}>
                        {business.name}
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
                        {business.industry}
                        {business.isDemo && (
                            <span style={{
                                marginLeft: '8px', background: '#F3F4F6', color: '#6B7280',
                                padding: '2px 8px', borderRadius: '999px', fontSize: '11px',
                                fontWeight: 600
                            }}>
                                DEMO
                            </span>
                        )}
                    </p>
                </div>
                <div style={{
                    background: band.bg, border: `1px solid ${band.border}`,
                    borderRadius: '14px', padding: '10px 16px', textAlign: 'center',
                    flexShrink: 0
                }}>
                    <p style={{
                        fontFamily: 'Inter', fontSize: '26px', fontWeight: 900,
                        color: band.text, margin: '0 0 2px', lineHeight: 1
                    }}>
                        {result.score}
                    </p>
                    <p style={{
                        fontFamily: 'Inter', fontSize: '10px', fontWeight: 700,
                        color: band.text, margin: 0, letterSpacing: '0.05em'
                    }}>
                        {SCORE_PLAIN[result.riskBand]}
                    </p>
                </div>
            </div>

            {/* Key metrics */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px', marginBottom: '16px'
            }}>
                {[
                    {
                        label: 'Cash Left', value: `${business.metrics.cashDays} days`,
                        warn: business.metrics.cashDays < 90
                    },
                    {
                        label: 'Burn Rate', value: `${business.metrics.burnRateRatio.toFixed(2)}x`,
                        warn: business.metrics.burnRateRatio > 1
                    },
                    {
                        label: 'Churn', value: `${business.metrics.churnRate.toFixed(1)}%`,
                        warn: business.metrics.churnRate > 10
                    },
                ].map(m => (
                    <div key={m.label} style={{ background: '#F9FAFB', borderRadius: '10px', padding: '10px 12px' }}>
                        <p style={{
                            fontFamily: 'Inter', fontSize: '10px', fontWeight: 600,
                            color: '#9CA3AF', margin: '0 0 3px', letterSpacing: '0.06em'
                        }}>
                            {m.label.toUpperCase()}
                        </p>
                        <p style={{
                            fontFamily: 'Inter', fontSize: '15px', fontWeight: 700,
                            color: m.warn ? '#DC2626' : '#0A0A0A', margin: 0
                        }}>
                            {m.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF' }}>
                    {date ? `Analysed ${date}` : 'Demo dataset'}
                </span>
                <span style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#0A0A0A' }}>
                    Open Dashboard →
                </span>
            </div>
        </div>
    );
}
