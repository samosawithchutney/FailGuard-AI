import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCSVFile, downloadCSVTemplate } from '../../engine/csvParser';

export default function CSVUploader({ onSubmit }) {
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [bizName, setBizName] = useState('');
    const [industry, setIndustry] = useState('');

    const onDrop = useCallback(async (files) => {
        if (!files[0]) return;
        setStatus('parsing'); setError('');
        try {
            const res = await parseCSVFile(files[0]);
            setResult(res);
            setStatus(res.success ? 'success' : 'error');
            if (!res.success) setError('Could not detect required columns. Please use our template format.');
        } catch (e) {
            setError(e.message || 'Could not read file. Try saving as .csv and re-uploading.');
            setStatus('error');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xlsx', '.xls'] },
        maxFiles: 1,
    });

    const handleAnalyse = () => {
        if (!bizName.trim()) { alert('Please enter your business name first'); return; }
        if (!industry) { alert('Please select your industry'); return; }
        onSubmit({ businessName: bizName, industry, ...result });
    };

    // ── After successful parse ────────────────────────────────────────────────
    if (status === 'success') return (
        <div style={{ paddingTop: '24px' }}>
            <div style={{
                background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '16px',
                padding: '20px', marginBottom: '24px',
            }}>
                <p style={{
                    fontFamily: 'Inter', fontWeight: 700, fontSize: '16px',
                    color: '#16A34A', margin: '0 0 4px'
                }}>
                    ✓ File read successfully
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#374151', margin: 0 }}>
                    Found <strong>{result.rowCount} months</strong> of data.
                    Your score will be calculated from the most recent month.
                </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <label style={{
                    fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
                    color: '#374151', display: 'block', marginBottom: '8px'
                }}>
                    Your Business Name
                </label>
                <input placeholder="e.g. Zara Bakeries Pvt Ltd" value={bizName}
                    onChange={e => setBizName(e.target.value)}
                    style={{
                        width: '100%', padding: '14px 16px', borderRadius: '12px',
                        border: '1px solid #E5E7EB', fontFamily: 'Inter', fontSize: '16px',
                        outline: 'none', boxSizing: 'border-box'
                    }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <label style={{
                    fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
                    color: '#374151', display: 'block', marginBottom: '8px'
                }}>
                    Industry
                </label>
                <select value={industry} onChange={e => setIndustry(e.target.value)}
                    style={{
                        width: '100%', padding: '14px 16px', borderRadius: '12px',
                        border: '1px solid #E5E7EB', fontFamily: 'Inter', fontSize: '16px', outline: 'none'
                    }}>
                    <option value="">Select your industry</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Retail">Retail</option>
                    <option value="SaaS / Technology">SaaS / Technology</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Services">Professional Services</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <button onClick={handleAnalyse} style={{
                width: '100%', padding: '18px', background: '#0A0A0A', color: '#FFFFFF',
                border: 'none', borderRadius: '14px', fontFamily: 'Inter',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px',
            }}>
                Analyse {result.rowCount} Months of Data →
            </button>
            <button onClick={() => setStatus('idle')} style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter', fontSize: '13px', color: '#9CA3AF',
            }}>
                Upload a different file
            </button>
        </div>
    );

    // ── Default: dropzone ─────────────────────────────────────────────────────
    return (
        <div style={{ paddingTop: '24px' }}>
            <div style={{
                background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '12px',
                padding: '14px 18px', marginBottom: '20px',
            }}>
                <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#0369A1', lineHeight: 1.5, margin: 0 }}>
                    💡 Upload a monthly export from <strong>Tally, Zoho Books, QuickBooks</strong>, or any
                    spreadsheet. We need at least a revenue and expenses column.{' '}
                    <button onClick={downloadCSVTemplate} style={{
                        background: 'none', border: 'none', color: '#0369A1', fontWeight: 700,
                        cursor: 'pointer', padding: 0, fontFamily: 'Inter', fontSize: '13px',
                        textDecoration: 'underline',
                    }}>
                        Download our template →
                    </button>
                </p>
            </div>

            <div {...getRootProps()} style={{
                border: `2px dashed ${isDragActive ? '#0A0A0A' : '#D1D5DB'}`,
                borderRadius: '16px', padding: '52px 24px', textAlign: 'center',
                background: isDragActive ? '#F3F4F6' : '#FAFAFA',
                cursor: 'pointer', transition: 'all 200ms ease', marginBottom: '16px',
            }}>
                <input {...getInputProps()} />
                <p style={{ fontSize: '40px', margin: '0 0 14px' }}>
                    {status === 'parsing' ? '⏳' : '📄'}
                </p>
                <p style={{
                    fontFamily: 'Inter', fontSize: '16px', fontWeight: 600,
                    color: '#374151', margin: '0 0 6px'
                }}>
                    {isDragActive ? 'Drop it here!' : status === 'parsing'
                        ? 'Reading your file...'
                        : 'Drag your CSV or Excel file here'}
                </p>
                {status !== 'parsing' && (
                    <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
                        or click to browse your files
                    </p>
                )}
                {status === 'error' && (
                    <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#DC2626', marginTop: '14px' }}>
                        ⚠ {error}
                    </p>
                )}
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>
                Accepts .csv · .xlsx · .xls &nbsp;·&nbsp;
                Works with Tally, Zoho Books, QuickBooks, or any spreadsheet export
            </p>
        </div>
    );
}
