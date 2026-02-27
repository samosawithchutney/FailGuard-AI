import { useState } from 'react';

const LightbulbIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '6px' }}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>;
const AlertIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px', transform: 'translateY(-1px)' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP — shows plain explanation on hover or tap
// ─────────────────────────────────────────────────────────────────────────────
function Tip({ text, example }) {
    const [show, setShow] = useState(false);
    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(v => !v)}
                style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: '#F3F4F6', border: '1px solid #E5E7EB',
                    fontSize: '10px', fontWeight: 700, color: '#9CA3AF',
                    cursor: 'pointer', marginLeft: '6px', verticalAlign: 'middle',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}
            >?</button>
            {show && (
                <div style={{
                    position: 'absolute', left: '24px', top: '-8px', zIndex: 300,
                    background: '#0A0A0A', color: '#FFFFFF', borderRadius: '12px',
                    padding: '14px 18px', width: '270px',
                    fontFamily: 'Inter', fontSize: '13px', lineHeight: 1.55,
                    boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
                }}>
                    <p style={{ margin: example ? '0 0 10px' : '0', color: '#FFFFFF' }}>{text}</p>
                    {example && (
                        <p style={{
                            margin: 0, color: '#9CA3AF', fontSize: '12px',
                            borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px'
                        }}>
                            📌 {example}
                        </p>
                    )}
                </div>
            )}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD — single input with label, tooltip, helper, error
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, tip, tipExample, prefix, placeholder, value,
    onChange, helper, error, type = 'number' }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{
                display: 'flex', alignItems: 'center', marginBottom: '8px',
                fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#374151',
            }}>
                {label} {tip && <Tip text={tip} example={tipExample} />}
            </label>
            <div style={{
                display: 'flex', alignItems: 'center', overflow: 'hidden',
                background: '#FFFFFF', borderRadius: '12px',
                border: `1px solid ${error ? '#7C3AED' : '#E5E7EB'}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
                {prefix && (
                    <span style={{
                        padding: '0 14px', fontFamily: 'Inter', fontSize: '16px', fontWeight: 600,
                        color: '#9CA3AF', background: '#FAFAFA', borderRight: '1px solid #F3F4F6',
                        alignSelf: 'stretch', display: 'flex', alignItems: 'center',
                    }}>
                        {prefix}
                    </span>
                )}
                <input
                    type={type} placeholder={placeholder} value={value}
                    onChange={e => onChange(e.target.value)}
                    style={{
                        flex: 1, padding: '14px 16px', border: 'none', outline: 'none',
                        fontFamily: 'Inter', fontSize: '16px', color: '#0A0A0A', background: 'transparent',
                    }}
                />
            </div>
            {error
                ? <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#7C3AED', margin: '5px 0 0' }}><span style={{ display: 'flex', alignItems: 'center' }}>{AlertIcon} {error}</span></p>
                : helper && <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF', margin: '5px 0 0' }}>{helper}</p>
            }
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL — separates groups of fields visually
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (
        <p style={{
            fontFamily: 'Inter', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', color: '#9CA3AF',
            margin: '28px 0 16px', textTransform: 'uppercase',
        }}>
            {children}
        </p>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FORM
// ─────────────────────────────────────────────────────────────────────────────
export default function ManualEntryForm({ onSubmit }) {
    const [f, setF] = useState({
        businessName: '', industry: '',
        currentRevenue: '', previousRevenue: '',
        expenses: '', cashInBank: '', cogs: '',
        customersLost: '', totalCustomers: '',
        location: '', employees: '', founded: '',
    });
    const [errors, setErrors] = useState({});
    const [showExtra, setShowExtra] = useState(false);

    const set = k => v => setF(p => ({ ...p, [k]: v }));

    const validate = () => {
        const e = {};
        if (!f.businessName.trim()) e.businessName = 'Please enter your business name';
        if (!f.industry) e.industry = 'Please select your industry';
        if (!+f.currentRevenue) e.currentRevenue = 'Enter this month\'s revenue (use 0 if you had none)';
        if (!+f.previousRevenue) e.previousRevenue = 'Enter last month\'s revenue';
        if (!+f.expenses) e.expenses = 'Enter your total expenses this month';
        if (f.cashInBank === '') e.cashInBank = 'Enter your bank balance (use 0 if empty)';
        if (!+f.cogs && f.cogs === '') e.cogs = 'Enter your direct production costs';
        if (f.customersLost === '') e.customersLost = 'Enter customers lost (use 0 if none)';
        if (!+f.totalCustomers) e.totalCustomers = 'Enter your total customer count';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSubmit = () => {
        if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const cr = +f.currentRevenue, pr = +f.previousRevenue;
        const ex = +f.expenses, cb = +f.cashInBank;
        const cg = +f.cogs, cl = +f.customersLost, tc = +f.totalCustomers;

        onSubmit({
            businessName: f.businessName.trim(),
            industry: f.industry,
            location: f.location || 'India',
            employees: f.employees || null,
            founded: f.founded || null,
            monthlyRevenue: cr,
            monthlyBurn: ex,
            historicalScores: [],
            metrics: {
                cashDays: cb > 0 && ex > 0 ? Math.round((cb / ex) * 30) : 0,
                revenueGrowth: pr > 0 ? ((cr - pr) / pr) * 100 : 0,
                burnRateRatio: cr > 0 ? ex / cr : 0,
                churnRate: tc > 0 ? (cl / tc) * 100 : 0,
                grossMargin: cr > 0 ? (cr - cg) / cr : 0,
            },
        });
    };

    const ready = f.businessName && f.industry && f.currentRevenue && f.previousRevenue
        && f.expenses && f.cashInBank !== '' && f.cogs !== ''
        && f.customersLost !== '' && f.totalCustomers;

    return (
        <div style={{ paddingTop: '28px' }}>

            {/* Reassurance banner */}
            <div style={{
                background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '12px',
                padding: '14px 18px', marginBottom: '28px',
            }}>
                <p style={{
                    fontFamily: 'Inter', fontSize: '13px', color: '#0F766E',
                    lineHeight: 1.5, margin: 0
                }}>
                    {LightbulbIcon} <strong>You only need 9 numbers.</strong> These are basic figures you
                    already know — monthly sales, expenses, bank balance, and customer count.
                    Every field is explained below. Takes about 2 minutes.
                </p>
            </div>

            {/* ── ABOUT YOUR BUSINESS ─────────────────────────────────────────── */}
            <SectionLabel>About your business</SectionLabel>

            <Field
                label="Business Name"
                tip="Just what you call your business. This is what appears on your personal dashboard."
                placeholder="e.g. Zara Bakeries Pvt Ltd"
                value={f.businessName} onChange={set('businessName')}
                type="text"
                helper="Appears on your dashboard header"
                error={errors.businessName}
            />

            <div style={{ marginBottom: '20px' }}>
                <label style={{
                    display: 'flex', alignItems: 'center', marginBottom: '8px',
                    fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#374151'
                }}>
                    Industry
                    <Tip
                        text="Your type of business. This helps FailGuard compare your numbers to typical patterns in your sector."
                        example="A bakery picks 'Food & Beverage'. A software startup picks 'SaaS / Technology'."
                    />
                </label>
                <select
                    value={f.industry} onChange={e => set('industry')(e.target.value)}
                    style={{
                        width: '100%', padding: '14px 16px', background: '#FFFFFF',
                        border: `1px solid ${errors.industry ? '#7C3AED' : '#E5E7EB'}`,
                        borderRadius: '12px', fontFamily: 'Inter', fontSize: '16px',
                        color: f.industry ? '#0A0A0A' : '#9CA3AF', outline: 'none', cursor: 'pointer',
                    }}
                >
                    <option value="">Select the type of business you run</option>
                    <option value="Food & Beverage">Food & Beverage — Restaurant, Bakery, Café, Catering</option>
                    <option value="Retail">Retail — Shop, Store, Boutique, Outlet</option>
                    <option value="SaaS / Technology">Software / Technology</option>
                    <option value="Manufacturing">Manufacturing — Factory, Production, Assembly</option>
                    <option value="Healthcare">Healthcare — Clinic, Pharmacy, Diagnostic Centre</option>
                    <option value="Education">Education — School, Coaching, Training Institute</option>
                    <option value="Logistics">Logistics — Delivery, Transport, Warehousing</option>
                    <option value="Services">Professional Services — Agency, Consulting, Freelance</option>
                    <option value="Other">Something else</option>
                </select>
                {errors.industry && (
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#7C3AED', margin: '5px 0 0' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>{AlertIcon} {errors.industry}</span>
                    </p>
                )}
            </div>

            {/* ── MONEY ───────────────────────────────────────────────────────── */}
            <SectionLabel>Money — what came in and went out this month</SectionLabel>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field
                    label="Revenue this month"
                    tip="Total money that customers paid you this month. Also called 'sales' or 'turnover'. Include all sources: orders, deliveries, subscriptions, walk-ins."
                    tipExample="Bakery earned ₹3,80,000 from orders this month → enter 380000"
                    prefix="₹" placeholder="380000"
                    value={f.currentRevenue} onChange={set('currentRevenue')}
                    helper="All income received from customers"
                    error={errors.currentRevenue}
                />
                <Field
                    label="Revenue last month"
                    tip="The same number but for the month before. We compare these two months to see if your business is growing or shrinking. Check last month's bank statement or invoice total."
                    tipExample="Last month earned ₹4,12,000 → enter 412000"
                    prefix="₹" placeholder="412000"
                    value={f.previousRevenue} onChange={set('previousRevenue')}
                    helper="Used to measure if you are growing or declining"
                    error={errors.previousRevenue}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field
                    label="Total expenses this month"
                    tip="Everything you spent money on this month to run the business. Add up: all salaries (including yours), rent, raw materials, electricity, delivery costs, marketing, software — literally everything."
                    tipExample="Salaries ₹2L + Rent ₹50k + Ingredients ₹2L + Other ₹59k = ₹5,09,000"
                    prefix="₹" placeholder="509000"
                    value={f.expenses} onChange={set('expenses')}
                    helper="All costs — salaries, rent, materials, everything combined"
                    error={errors.expenses}
                />
                <Field
                    label="Cash in your bank account right now"
                    tip="Check your business bank account balance today. Only count actual cash — not money customers still owe you (receivables), not credit limits, not loans you haven't drawn."
                    tipExample="Bank shows ₹2,01,000 balance → enter 201000"
                    prefix="₹" placeholder="201000"
                    value={f.cashInBank} onChange={set('cashInBank')}
                    helper="Actual bank balance today — not credit, not receivables"
                    error={errors.cashInBank}
                />
            </div>

            <Field
                label="Direct cost to make your product or deliver your service"
                tip="The cost directly tied to making each product or delivering each order. For a bakery: flour, butter, eggs, packaging. For a salon: products used on clients. NOT rent or office salaries — those are overhead."
                tipExample="Bakery: flour + butter + packaging + chef wages = ₹2,73,600 this month"
                prefix="₹" placeholder="273600"
                value={f.cogs} onChange={set('cogs')}
                helper="Ingredients, materials, or direct production costs only — not rent or admin salaries"
                error={errors.cogs}
            />

            {/* ── CUSTOMERS ───────────────────────────────────────────────────── */}
            <SectionLabel>Customers — who stayed and who left</SectionLabel>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field
                    label="Customers who stopped this month"
                    tip="How many customers cancelled, didn't renew, or simply stopped coming back this month? For a subscription service: cancellations. For a bakery: regular customers who stopped ordering. If you have no idea, enter 0."
                    tipExample="53 regular customers who used to order every week stopped this month → enter 53"
                    placeholder="53"
                    value={f.customersLost} onChange={set('customersLost')}
                    helper="Cancellations or customers who didn't return. Enter 0 if unsure."
                    error={errors.customersLost}
                />
                <Field
                    label="Total customers right now"
                    tip="How many paying customers do you have in total today? For a shop: your regular customer count. For a subscription: active subscribers. Use your best estimate if you don't track this precisely."
                    tipExample="You have about 379 regular customers → enter 379"
                    placeholder="379"
                    value={f.totalCustomers} onChange={set('totalCustomers')}
                    helper="Your total active paying customer base"
                    error={errors.totalCustomers}
                />
            </div>

            {/* ── OPTIONAL DETAILS ────────────────────────────────────────────── */}
            <button
                onClick={() => setShowExtra(v => !v)}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontFamily: 'Inter', fontSize: '13px', color: '#9CA3AF',
                    display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px',
                }}
            >
                {showExtra ? '▲ Hide' : '▼ Add'} optional details (city, team size, year started)
            </button>

            {showExtra && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <Field label="City / State" tip="Where is your business located?"
                        placeholder="Bengaluru" value={f.location} onChange={set('location')}
                        type="text" helper="Optional" />
                    <Field label="Team size" tip="Total people working in your business, including yourself."
                        placeholder="12" value={f.employees} onChange={set('employees')} helper="Optional" />
                    <Field label="Year started" tip="The year you founded this business."
                        placeholder="2021" value={f.founded} onChange={set('founded')} helper="Optional" />
                </div>
            )}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!ready}
                style={{
                    width: '100%', padding: '18px',
                    background: ready ? '#0A0A0A' : '#D1D5DB',
                    color: '#FFFFFF', border: 'none', borderRadius: '14px',
                    fontFamily: 'Inter', fontSize: '16px', fontWeight: 700,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    transition: 'background 200ms ease', marginBottom: '12px',
                }}
            >
                {ready ? 'Calculate My Failure Score →' : 'Fill in all fields to continue'}
            </button>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
                Results appear instantly. No email. No signup.
            </p>
        </div>
    );
}
