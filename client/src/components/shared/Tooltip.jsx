import { useState } from 'react';

export default function Tooltip({ text, example, position = 'right' }) {
    const [show, setShow] = useState(false);
    const posStyle = position === 'right'
        ? { left: '24px', top: '-8px' }
        : { right: '0', top: '24px' };

    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(v => !v)}
                style={{
                    width: '17px', height: '17px', borderRadius: '50%',
                    background: '#F3F4F6', border: '1px solid #E5E7EB',
                    fontSize: '10px', fontWeight: 700, color: '#9CA3AF',
                    cursor: 'pointer', marginLeft: '5px', verticalAlign: 'middle',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}
            >?</button>
            {show && (
                <div style={{
                    position: 'absolute', ...posStyle, zIndex: 500,
                    background: '#0A0A0A', color: '#FFFFFF', borderRadius: '12px',
                    padding: '14px 18px', width: '260px',
                    fontFamily: 'Inter', fontSize: '13px', lineHeight: 1.55,
                    boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
                    pointerEvents: 'none',
                }}>
                    <p style={{ margin: example ? '0 0 10px' : '0' }}>{text}</p>
                    {example && (
                        <p style={{
                            margin: 0, color: '#9CA3AF', fontSize: '12px',
                            borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '8px'
                        }}>
                            📌 {example}
                        </p>
                    )}
                </div>
            )}
        </span>
    );
}
