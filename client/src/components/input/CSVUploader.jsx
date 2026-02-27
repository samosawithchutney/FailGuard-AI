import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCSVFile, downloadCSVTemplate } from '../../engine/csvParser';

const LightbulbIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '6px' }}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>;
const CheckIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '6px' }}><polyline points="20 6 9 17 4 12" /></svg>;
const HourglassIcon = <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></svg>;
const DocumentIcon = <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>;
const AlertIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px', transform: 'translateY(-1px)' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;

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
                    {CheckIcon} File read successfully
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
                background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '12px',
                padding: '14px 18px', marginBottom: '20px',
            }}>
                <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#0F766E', lineHeight: 1.5, margin: 0 }}>
                    {LightbulbIcon} Upload a monthly export from <strong>Tally, Zoho Books, QuickBooks</strong>, or any
                    spreadsheet. We need at least a revenue and expenses column.{' '}
                    <button onClick={downloadCSVTemplate} style={{
                        background: 'none', border: 'none', color: '#0F766E', fontWeight: 700,
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
                    {status === 'parsing' ? HourglassIcon : DocumentIcon}
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
                    <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#7C3AED', marginTop: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>{AlertIcon} {error}</span>
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
