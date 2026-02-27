import { useState } from 'react';
import ManualEntryForm from './ManualEntryForm';
import CSVUploader from './CSVUploader';

export default function InputScreen({ onSubmit, onDemo }) {
    const [tab, setTab] = useState('manual');

    const TAB = (id, label) => (
        <button
            onClick={() => setTab(id)}
            style={{
                padding: '12px 28px', background: 'none', border: 'none',
                borderBottom: tab === id ? '2px solid #0A0A0A' : '2px solid transparent',
                fontFamily: 'Inter', fontWeight: 600, fontSize: '14px',
                color: tab === id ? '#0A0A0A' : '#9CA3AF',
                cursor: 'pointer', transition: 'all 150ms',
            }}
        >
            {label}
        </button>
    );

    return (
        <div style={{ background: '#FAFAFA', minHeight: '100vh', paddingBottom: '80px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 0' }}>

                {/* Page header */}
                <p style={{
                    fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.08em', color: '#9CA3AF', margin: '0 0 12px'
                }}>
                    STEP 1 OF 1 — ENTER YOUR NUMBERS
                </p>
                <h1 style={{
                    fontFamily: 'Inter', fontSize: '40px', fontWeight: 800,
                    color: '#0A0A0A', margin: '0 0 12px', lineHeight: 1.2
                }}>
                    Get your Business<br />Failure Score.
                </h1>
                <p style={{
                    fontFamily: 'Inter', fontSize: '16px', color: '#6B7280',
                    lineHeight: 1.6, margin: '0 0 6px'
                }}>
                    Enter 9 basic numbers from your business. Every field is explained in
                    plain English — no accounting knowledge needed.
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#9CA3AF', margin: '0 0 36px' }}>
                    🔒 Your data is calculated on your device and never sent to any server.
                </p>

                {/* Tabs */}
                <div style={{ borderBottom: '1px solid #E5E7EB', display: 'flex', marginBottom: '0' }}>
                    {TAB('manual', <span style={{ display: 'flex', alignItems: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg> Enter Manually</span>)}
                    {TAB('csv', <span style={{ display: 'flex', alignItems: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg> Upload CSV File</span>)}
                </div>

                {/* Tab content */}
                {tab === 'manual'
                    ? <ManualEntryForm onSubmit={onSubmit} />
                    : <CSVUploader onSubmit={onSubmit} />
                }

                {/* Demo fallback */}
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
                        Not ready yet?{' '}
                        <button onClick={onDemo} style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                            fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
                            color: '#0A0A0A', textDecoration: 'underline',
                        }}>
                            Explore the demo instead →
                        </button>
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF', margin: '6px 0 0' }}>
                        The demo shows Zara Bakeries — a fictional Bengaluru bakery with 3 years of data.
                    </p>
                </div>
            </div>
        </div>
    );
}
