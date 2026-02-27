# FAILGUARD AI — Incremental Update Specification
## Version 3 · Real Input + User-Friendly Language

---

> ### Instructions for the AI Agent
>
> **The base FailGuard AI project is already built and running.**
> **DO NOT rebuild or delete anything that already exists.**
>
> This file tells you exactly what to ADD and what to MODIFY.
> Every section is labelled either `[CREATE NEW FILE]` or `[MODIFY EXISTING FILE]`.
> When modifying, only change the specific parts mentioned. Leave everything else alone.
>
> **Two goals for this update:**
> 1. Turn FailGuard from a static demo into a real app where any business owner
>    can enter their own numbers and get their own personalised score.
> 2. Make every single number, term, and feature so plainly explained that
>    a 55-year-old bakery owner with no finance background understands it
>    immediately without asking anyone for help.
>
> Read this entire document before touching a single file.

---

## WHAT THIS UPDATE ADDS

| # | What | Type | Why |
|---|---|---|---|
| 1 | `/analyse` route — manual input form | CREATE | Makes it a real app, not just a demo |
| 2 | `/analyse` route — CSV upload tab | CREATE | Accepts Tally/Zoho exports |
| 3 | `/businesses` route — multi-business manager | CREATE | Track multiple companies |
| 4 | `BusinessContext` — global state | CREATE | Single source of truth for all data |
| 5 | `ScoreExplainer` — plain English score card | CREATE | Non-technical users understand the score |
| 6 | `MetricTooltips` — "What does this mean?" | MODIFY | Every number has a plain explanation |
| 7 | `AlertFeed` rewording | MODIFY | Plain English, no jargon |
| 8 | `RecoveryPlan` explainer banner | MODIFY | Users know what the actions mean |
| 9 | `AutopsyModal` guided intro | MODIFY | Users know what autopsy mode is before they see it |
| 10 | `WhatIfSimulator` guided banner | MODIFY | Users know how to use the sliders |
| 11 | Navbar update | MODIFY | Add navigation to new pages |
| 12 | Landing page CTA update | MODIFY | Two buttons: Analyse + Demo |
| 13 | Dashboard wired to context | MODIFY | Shows user's own data, not hardcoded demo |

---

## NEW PACKAGES TO INSTALL

Run this in the `client/` directory before anything else:

```bash
npm install papaparse react-dropzone react-router-dom
```

---

## PART 1 — GLOBAL STATE

### `[CREATE NEW FILE]` src/context/BusinessContext.jsx

This is the most important file in the entire update.
It replaces all hardcoded `demo_data.json` imports across the app.
Every component reads from this context instead of importing data directly.

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { calculateFailureScore } from '../engine/scoreEngine';
import demoData from '../assets/demo_data.json';

const BusinessContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER — wrap App.jsx with this
// ─────────────────────────────────────────────────────────────────────────────
export function BusinessProvider({ children }) {
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [scoreResult, setScoreResult]         = useState(null);
  const [showAutopsy, setShowAutopsy]         = useState(false);
  const [recoveryActions, setRecoveryActions] = useState(null);
  const [autopsyNarrative, setNarrative]      = useState(null);

  // All saved businesses — survive page refresh via localStorage
  const [businesses, setBusinesses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fg_businesses') || '[]'); }
    catch { return []; }
  });

  // Auto-recalculate score whenever metrics change (e.g. What If Simulator)
  useEffect(() => {
    if (currentBusiness?.metrics) {
      setScoreResult(calculateFailureScore(currentBusiness.metrics));
    }
  }, [currentBusiness]);

  // Persist to localStorage whenever businesses list changes
  useEffect(() => {
    localStorage.setItem('fg_businesses', JSON.stringify(businesses));
  }, [businesses]);

  // ── Load the built-in Zara Bakeries demo ──────────────────────────────────
  const loadDemo = () => {
    setCurrentBusiness({
      id:             'demo',
      name:           demoData.business.name,
      industry:       demoData.business.industry,
      location:       demoData.business.location,
      isDemo:         true,
      metrics:        demoData.currentMetrics,
      historicalScores: demoData.historicalScores,
      timeline:       demoData.timeline,
      triggerEvent:   demoData.triggerEvent,
      alerts:         demoData.alerts,
      monthlyRevenue: demoData.monthlyRevenue,
      monthlyBurn:    demoData.monthlyBurn,
      topRisks:       demoData.topRisks,
      business:       demoData.business,
    });
    setRecoveryActions(null);
    setNarrative(null);
  };

  // ── Load from user input (form or CSV) ───────────────────────────────────
  const loadFromInput = (inputData) => {
    const result = calculateFailureScore(inputData.metrics);
    const biz = {
      id:             Date.now().toString(),
      name:           inputData.businessName,
      industry:       inputData.industry,
      location:       inputData.location || 'India',
      isDemo:         false,
      metrics:        inputData.metrics,
      historicalScores: inputData.historicalScores || [],
      timeline:       demoData.timeline, // reference template
      triggerEvent:   demoData.triggerEvent,
      alerts:         buildAlerts(inputData.metrics),
      monthlyRevenue: inputData.monthlyRevenue,
      monthlyBurn:    inputData.monthlyBurn,
      topRisks:       result.topRisks.map(name => ({
        factor:   name,
        value:    metricValueLabel(name, inputData.metrics),
        severity: result.riskBand,
      })),
      business: {
        name:           inputData.businessName,
        industry:       inputData.industry,
        location:       inputData.location || 'India',
        employees:      inputData.employees || 'N/A',
        founded:        inputData.founded   || new Date().getFullYear().toString(),
        datasetPeriod:  inputData.historicalScores?.length > 1
          ? `${inputData.historicalScores[0].month} – ${inputData.historicalScores.at(-1).month}`
          : 'Current snapshot',
        datasetMonths:  inputData.historicalScores?.length || 1,
      },
      createdAt: new Date().toISOString(),
    };
    setCurrentBusiness(biz);
    setRecoveryActions(null);
    setNarrative(null);
    setBusinesses(prev =>
      [biz, ...prev.filter(b => b.id !== biz.id)].slice(0, 10)
    );
    return biz;
  };

  // ── Update metrics live (What If Simulator) ───────────────────────────────
  const updateMetrics = (newMetrics) =>
    setCurrentBusiness(prev => ({ ...prev, metrics: newMetrics }));

  return (
    <BusinessContext.Provider value={{
      currentBusiness, scoreResult,
      businesses, setBusinesses,
      showAutopsy, setShowAutopsy,
      recoveryActions, setRecoveryActions,
      autopsyNarrative, setNarrative,
      loadDemo, loadFromInput, updateMetrics,
    }}>
      {children}
    </BusinessContext.Provider>
  );
}

export const useBusiness = () => useContext(BusinessContext);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Plain-English alerts built from raw metrics
function buildAlerts(m) {
  const alerts = [];
  if (m.burnRateRatio > 1.2)
    alerts.push({ id: 1, time: 'Right now', level: 'critical',
      msg: `You are spending ₹${m.burnRateRatio.toFixed(2)} for every ₹1 you earn. Your savings are draining every month.` });
  if (m.cashDays < 90)
    alerts.push({ id: 2, time: 'Right now', level: 'danger',
      msg: `You have ${m.cashDays} days of cash left in the bank. The safe minimum is 90 days.` });
  if (m.revenueGrowth < 0)
    alerts.push({ id: 3, time: 'This month', level: 'danger',
      msg: `Your revenue fell by ${Math.abs(m.revenueGrowth).toFixed(1)}% compared to last month.` });
  if (m.churnRate > 10)
    alerts.push({ id: 4, time: 'This month', level: 'warning',
      msg: `${m.churnRate.toFixed(1)} out of every 100 customers left this month without coming back.` });
  if (m.grossMargin < 0.35)
    alerts.push({ id: 5, time: 'This month', level: 'warning',
      msg: `You keep only ${(m.grossMargin * 100).toFixed(0)} paise from every ₹1 of sales after direct costs.` });
  return alerts;
}

function metricValueLabel(name, m) {
  return {
    'Cash Runway':    `${m.cashDays} days`,
    'Revenue Growth': `${m.revenueGrowth.toFixed(1)}% MoM`,
    'Burn Rate':      `${m.burnRateRatio.toFixed(2)}x`,
    'Churn Rate':     `${m.churnRate.toFixed(1)}%`,
    'Gross Margin':   `${(m.grossMargin * 100).toFixed(0)}%`,
  }[name] || '';
}
```

---

## PART 2 — ROUTING UPDATE

### `[MODIFY EXISTING FILE]` src/App.jsx

Find the existing App.jsx. Make only these changes:

```jsx
// 1. ADD these imports at the top (keep all existing imports):
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BusinessProvider } from './context/BusinessContext';
import AnalysePage    from './pages/AnalysePage';
import BusinessesPage from './pages/BusinessesPage';

// 2. WRAP your entire existing JSX return with BusinessProvider and BrowserRouter.
//    If BrowserRouter is already there, just add BusinessProvider outside it.
//    Add the two new routes alongside existing ones:

export default function App() {
  return (
    <BusinessProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Keep all your existing routes exactly as they are ── */}
          <Route path="/"           element={<YourExistingLandingPage />} />
          <Route path="/dashboard"  element={<YourExistingDashboardPage />} />

          {/* ── ADD these two new routes ── */}
          <Route path="/analyse"    element={<AnalysePage />} />
          <Route path="/businesses" element={<BusinessesPage />} />

          <Route path="*"           element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </BusinessProvider>
  );
}
```

---

## PART 3 — LANDING PAGE UPDATE

### `[MODIFY EXISTING FILE]` Landing Page (LandingPage.jsx or Home.jsx)

Find the single "Open Dashboard →" button. Replace it with this:

```jsx
// ADD at the top of the component:
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';

// Inside component:
const navigate = useNavigate();
const { loadDemo } = useBusiness();

// REPLACE the single CTA button with these two buttons + the trust line:
<div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'32px' }}>

  {/* Primary — goes to input form */}
  <button
    onClick={() => navigate('/analyse')}
    style={{
      background:'#0A0A0A', color:'#FFFFFF', padding:'16px 36px',
      borderRadius:'999px', border:'none', cursor:'pointer',
      fontFamily:'Inter', fontWeight:700, fontSize:'16px',
      transition:'transform 150ms ease',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    Analyse My Business →
  </button>

  {/* Secondary — loads Zara Bakeries demo */}
  <button
    onClick={() => { loadDemo(); navigate('/dashboard'); }}
    style={{
      background:'#FFFFFF', color:'#0A0A0A', padding:'16px 36px',
      borderRadius:'999px', border:'1px solid #0A0A0A', cursor:'pointer',
      fontFamily:'Inter', fontWeight:600, fontSize:'16px',
    }}
  >
    View Demo
  </button>
</div>

{/* Trust line below buttons */}
<p style={{ fontFamily:'Inter', fontSize:'13px', color:'#9CA3AF',
            textAlign:'center', marginTop:'16px' }}>
  No account needed · Takes 60 seconds · Your data never leaves your device
</p>
```

---

## PART 4 — INPUT SCREEN (NEW PAGES)

### `[CREATE NEW FILE]` src/pages/AnalysePage.jsx

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';
import InputScreen     from '../components/input/InputScreen';
import ProcessingScreen from '../components/input/ProcessingScreen';

export default function AnalysePage() {
  const [processing, setProcessing] = useState(false);
  const { loadFromInput, loadDemo } = useBusiness();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    loadFromInput(data);
    navigate('/dashboard');
  };

  const handleDemo = () => {
    loadDemo();
    navigate('/dashboard');
  };

  if (processing) return <ProcessingScreen />;
  return <InputScreen onSubmit={handleSubmit} onDemo={handleDemo} />;
}
```

### `[CREATE NEW FILE]` src/components/input/InputScreen.jsx

The outer shell of the input page. Two tabs: manual form and CSV upload.

```jsx
import { useState } from 'react';
import ManualEntryForm from './ManualEntryForm';
import CSVUploader     from './CSVUploader';

export default function InputScreen({ onSubmit, onDemo }) {
  const [tab, setTab] = useState('manual');

  const TAB = (id, label) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding:'12px 28px', background:'none', border:'none',
        borderBottom: tab === id ? '2px solid #0A0A0A' : '2px solid transparent',
        fontFamily:'Inter', fontWeight:600, fontSize:'14px',
        color: tab === id ? '#0A0A0A' : '#9CA3AF',
        cursor:'pointer', transition:'all 150ms',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ background:'#FAFAFA', minHeight:'100vh', paddingBottom:'80px' }}>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'60px 24px 0' }}>

        {/* Page header */}
        <p style={{ fontFamily:'Inter', fontSize:'11px', fontWeight:600,
                    letterSpacing:'0.08em', color:'#9CA3AF', margin:'0 0 12px' }}>
          STEP 1 OF 1 — ENTER YOUR NUMBERS
        </p>
        <h1 style={{ fontFamily:'Inter', fontSize:'40px', fontWeight:800,
                     color:'#0A0A0A', margin:'0 0 12px', lineHeight:1.2 }}>
          Get your Business<br />Failure Score.
        </h1>
        <p style={{ fontFamily:'Inter', fontSize:'16px', color:'#6B7280',
                    lineHeight:1.6, margin:'0 0 6px' }}>
          Enter 9 basic numbers from your business. Every field is explained in
          plain English — no accounting knowledge needed.
        </p>
        <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#9CA3AF', margin:'0 0 36px' }}>
          🔒 Your data is calculated on your device and never sent to any server.
        </p>

        {/* Tabs */}
        <div style={{ borderBottom:'1px solid #E5E7EB', display:'flex', marginBottom:'0' }}>
          {TAB('manual', '✏️  Enter Manually')}
          {TAB('csv',    '📄  Upload CSV File')}
        </div>

        {/* Tab content */}
        {tab === 'manual'
          ? <ManualEntryForm onSubmit={onSubmit} />
          : <CSVUploader onSubmit={onSubmit} />
        }

        {/* Demo fallback */}
        <div style={{ borderTop:'1px solid #E5E7EB', paddingTop:'24px', textAlign:'center' }}>
          <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#9CA3AF', margin:0 }}>
            Not ready yet?{' '}
            <button onClick={onDemo} style={{
              background:'none', border:'none', cursor:'pointer', padding:0,
              fontFamily:'Inter', fontSize:'14px', fontWeight:600,
              color:'#0A0A0A', textDecoration:'underline',
            }}>
              Explore the demo instead →
            </button>
          </p>
          <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#9CA3AF', margin:'6px 0 0' }}>
            The demo shows Zara Bakeries — a fictional Bengaluru bakery with 3 years of data.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### `[CREATE NEW FILE]` src/components/input/ManualEntryForm.jsx

The 9-field input form. Every single field has plain English labels,
a "?" tooltip, an example, and a helper line explaining WHY it matters.

```jsx
import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP — shows plain explanation on hover or tap
// ─────────────────────────────────────────────────────────────────────────────
function Tip({ text, example }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position:'relative', display:'inline-block' }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(v => !v)}
        style={{
          width:'18px', height:'18px', borderRadius:'50%',
          background:'#F3F4F6', border:'1px solid #E5E7EB',
          fontSize:'10px', fontWeight:700, color:'#9CA3AF',
          cursor:'pointer', marginLeft:'6px', verticalAlign:'middle',
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}
      >?</button>
      {show && (
        <div style={{
          position:'absolute', left:'24px', top:'-8px', zIndex:300,
          background:'#0A0A0A', color:'#FFFFFF', borderRadius:'12px',
          padding:'14px 18px', width:'270px',
          fontFamily:'Inter', fontSize:'13px', lineHeight:1.55,
          boxShadow:'0 8px 28px rgba(0,0,0,0.18)',
        }}>
          <p style={{ margin: example ? '0 0 10px' : '0', color:'#FFFFFF' }}>{text}</p>
          {example && (
            <p style={{ margin:0, color:'#9CA3AF', fontSize:'12px',
                        borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'8px' }}>
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
                 onChange, helper, error, type='number' }) {
  return (
    <div style={{ marginBottom:'20px' }}>
      <label style={{
        display:'flex', alignItems:'center', marginBottom:'8px',
        fontFamily:'Inter', fontSize:'13px', fontWeight:600, color:'#374151',
      }}>
        {label} {tip && <Tip text={tip} example={tipExample} />}
      </label>
      <div style={{
        display:'flex', alignItems:'center', overflow:'hidden',
        background:'#FFFFFF', borderRadius:'12px',
        border:`1px solid ${error ? '#DC2626' : '#E5E7EB'}`,
        boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {prefix && (
          <span style={{
            padding:'0 14px', fontFamily:'Inter', fontSize:'16px', fontWeight:600,
            color:'#9CA3AF', background:'#FAFAFA', borderRight:'1px solid #F3F4F6',
            alignSelf:'stretch', display:'flex', alignItems:'center',
          }}>
            {prefix}
          </span>
        )}
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex:1, padding:'14px 16px', border:'none', outline:'none',
            fontFamily:'Inter', fontSize:'16px', color:'#0A0A0A', background:'transparent',
          }}
        />
      </div>
      {error
        ? <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#DC2626', margin:'5px 0 0' }}>⚠ {error}</p>
        : helper && <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#9CA3AF', margin:'5px 0 0' }}>{helper}</p>
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
      fontFamily:'Inter', fontSize:'11px', fontWeight:700,
      letterSpacing:'0.08em', color:'#9CA3AF',
      margin:'28px 0 16px', textTransform:'uppercase',
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
    businessName:'', industry:'',
    currentRevenue:'', previousRevenue:'',
    expenses:'', cashInBank:'', cogs:'',
    customersLost:'', totalCustomers:'',
    location:'', employees:'', founded:'',
  });
  const [errors, setErrors]       = useState({});
  const [showExtra, setShowExtra] = useState(false);

  const set = k => v => setF(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!f.businessName.trim())          e.businessName    = 'Please enter your business name';
    if (!f.industry)                     e.industry        = 'Please select your industry';
    if (!+f.currentRevenue)              e.currentRevenue  = 'Enter this month\'s revenue (use 0 if you had none)';
    if (!+f.previousRevenue)             e.previousRevenue = 'Enter last month\'s revenue';
    if (!+f.expenses)                    e.expenses        = 'Enter your total expenses this month';
    if (f.cashInBank === '')             e.cashInBank      = 'Enter your bank balance (use 0 if empty)';
    if (!+f.cogs && f.cogs === '')       e.cogs            = 'Enter your direct production costs';
    if (f.customersLost === '')          e.customersLost   = 'Enter customers lost (use 0 if none)';
    if (!+f.totalCustomers)             e.totalCustomers  = 'Enter your total customer count';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) { window.scrollTo({ top:0, behavior:'smooth' }); return; }
    const cr = +f.currentRevenue, pr = +f.previousRevenue;
    const ex = +f.expenses,       cb = +f.cashInBank;
    const cg = +f.cogs,           cl = +f.customersLost, tc = +f.totalCustomers;

    onSubmit({
      businessName:   f.businessName.trim(),
      industry:       f.industry,
      location:       f.location || 'India',
      employees:      f.employees || null,
      founded:        f.founded   || null,
      monthlyRevenue: cr,
      monthlyBurn:    ex,
      historicalScores: [],
      metrics: {
        cashDays:      cb > 0 && ex > 0 ? Math.round((cb / ex) * 30) : 0,
        revenueGrowth: pr > 0 ? ((cr - pr) / pr) * 100 : 0,
        burnRateRatio: cr > 0 ? ex / cr : 0,
        churnRate:     tc > 0 ? (cl / tc) * 100 : 0,
        grossMargin:   cr > 0 ? (cr - cg) / cr : 0,
      },
    });
  };

  const ready = f.businessName && f.industry && f.currentRevenue && f.previousRevenue
    && f.expenses && f.cashInBank !== '' && f.cogs !== ''
    && f.customersLost !== '' && f.totalCustomers;

  return (
    <div style={{ paddingTop:'28px' }}>

      {/* Reassurance banner */}
      <div style={{
        background:'#F0F9FF', border:'1px solid #BAE6FD', borderRadius:'12px',
        padding:'14px 18px', marginBottom:'28px',
      }}>
        <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#0369A1',
                    lineHeight:1.5, margin:0 }}>
          💡 <strong>You only need 9 numbers.</strong> These are basic figures you
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

      <div style={{ marginBottom:'20px' }}>
        <label style={{ display:'flex', alignItems:'center', marginBottom:'8px',
                        fontFamily:'Inter', fontSize:'13px', fontWeight:600, color:'#374151' }}>
          Industry
          <Tip
            text="Your type of business. This helps FailGuard compare your numbers to typical patterns in your sector."
            example="A bakery picks 'Food & Beverage'. A software startup picks 'SaaS / Technology'."
          />
        </label>
        <select
          value={f.industry} onChange={e => set('industry')(e.target.value)}
          style={{
            width:'100%', padding:'14px 16px', background:'#FFFFFF',
            border:`1px solid ${errors.industry ? '#DC2626' : '#E5E7EB'}`,
            borderRadius:'12px', fontFamily:'Inter', fontSize:'16px',
            color: f.industry ? '#0A0A0A' : '#9CA3AF', outline:'none', cursor:'pointer',
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
          <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#DC2626', margin:'5px 0 0' }}>
            ⚠ {errors.industry}
          </p>
        )}
      </div>

      {/* ── MONEY ───────────────────────────────────────────────────────── */}
      <SectionLabel>Money — what came in and went out this month</SectionLabel>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
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

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
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

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
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
          background:'none', border:'none', cursor:'pointer', padding:0,
          fontFamily:'Inter', fontSize:'13px', color:'#9CA3AF',
          display:'flex', alignItems:'center', gap:'6px', marginBottom:'20px',
        }}
      >
        {showExtra ? '▲ Hide' : '▼ Add'} optional details (city, team size, year started)
      </button>

      {showExtra && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'20px' }}>
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
          width:'100%', padding:'18px',
          background: ready ? '#0A0A0A' : '#D1D5DB',
          color:'#FFFFFF', border:'none', borderRadius:'14px',
          fontFamily:'Inter', fontSize:'16px', fontWeight:700,
          cursor: ready ? 'pointer' : 'not-allowed',
          transition:'background 200ms ease', marginBottom:'12px',
        }}
      >
        {ready ? 'Calculate My Failure Score →' : 'Fill in all fields to continue'}
      </button>
      <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#9CA3AF', textAlign:'center', margin:0 }}>
        Results appear instantly. No email. No signup.
      </p>
    </div>
  );
}
```

### `[CREATE NEW FILE]` src/components/input/ProcessingScreen.jsx

```jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  'Reading your business numbers...',
  'Calculating cash runway...',
  'Measuring revenue trend...',
  'Checking burn rate...',
  'Identifying top risks...',
  'Your score is ready.',
];

export default function ProcessingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * 360));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:'fixed', inset:0, background:'#FAFAFA',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    }}>
      <p style={{ fontFamily:'Inter', fontSize:'11px', fontWeight:600,
                  letterSpacing:'0.1em', color:'#9CA3AF', margin:'0 0 20px' }}>
        FAILGUARD SCORE ENGINE
      </p>
      <h2 style={{ fontFamily:'Inter', fontSize:'28px', fontWeight:800,
                   color:'#0A0A0A', margin:'0 0 32px', textAlign:'center' }}>
        Calculating your failure score...
      </h2>
      <div style={{ width:'320px', height:'3px', background:'#F3F4F6',
                    borderRadius:'2px', overflow:'hidden', marginBottom:'32px' }}>
        <motion.div
          initial={{ width:'0%' }} animate={{ width:'100%' }}
          transition={{ duration:2.0, ease:'easeInOut' }}
          style={{ height:'100%', background:'#0A0A0A', borderRadius:'2px' }}
        />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px',
                    alignItems:'center', minHeight:'140px' }}>
        {STEPS.slice(0, step + 1).map((s, i) => (
          <motion.p key={s} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
            style={{
              fontFamily:'Inter', fontSize:'14px', margin:0,
              color: i === step ? '#0A0A0A' : '#9CA3AF',
              fontWeight: i === step ? 600 : 400,
            }}
          >
            {i < step ? '✓  ' : ''}{s}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
```

---

## PART 5 — CSV UPLOADER

### `[CREATE NEW FILE]` src/engine/csvParser.js

```javascript
import Papa from 'papaparse';

// Flexible — works with Tally, Zoho Books, QuickBooks, or custom CSVs
const ALIASES = {
  month:           ['month','date','period','Month','Date'],
  revenue:         ['revenue','sales','income','total_revenue','Revenue','Sales'],
  expenses:        ['expenses','costs','total_expenses','Expenses','Total Costs'],
  cash_balance:    ['cash_balance','cash','bank_balance','Cash','Cash Balance'],
  customers_lost:  ['customers_lost','churned','lost','cancellations'],
  total_customers: ['total_customers','customers','active_customers','Total Customers'],
  cogs:            ['cogs','cost_of_goods','direct_costs','COGS'],
};

function findCol(headers, key) {
  for (const alias of ALIASES[key]) {
    const match = headers.find(h => h.toLowerCase().trim() === alias.toLowerCase());
    if (match) return match;
  }
  return null;
}

export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: ({ data }) => {
        if (!data.length) return reject(new Error('File appears to be empty'));
        const headers = Object.keys(data[0]);
        const col = {};
        for (const key of Object.keys(ALIASES)) col[key] = findCol(headers, key);

        const missing = ['revenue', 'expenses'].filter(k => !col[k]);
        if (missing.length) {
          return resolve({ success: false, needsMapping: true, headers, data, col });
        }

        const rows = data.map((row, i) => {
          const rev  = parseFloat(row[col.revenue])          || 0;
          const exp  = parseFloat(row[col.expenses])         || 0;
          const cash = parseFloat(row[col.cash_balance])     || 0;
          const lost = parseFloat(row[col.customers_lost])   || 0;
          const tot  = parseFloat(row[col.total_customers])  || 1;
          const cog  = parseFloat(row[col.cogs])             || rev * 0.6;
          const prev = i > 0 ? (parseFloat(data[i-1][col.revenue]) || rev) : rev;
          return {
            month:         row[col.month] || `Month ${i + 1}`,
            revenue: rev, expenses: exp,
            cashDays:      cash > 0 && exp > 0 ? Math.round((cash / exp) * 30) : 0,
            revenueGrowth: prev > 0 ? ((rev - prev) / prev) * 100 : 0,
            burnRateRatio: rev > 0 ? exp / rev : 0,
            churnRate:     tot > 0 ? (lost / tot) * 100 : 0,
            grossMargin:   rev > 0 ? (rev - cog) / rev : 0,
          };
        });

        const latest = rows[rows.length - 1];
        resolve({
          success: true,
          currentMetrics: {
            cashDays:      latest.cashDays,
            revenueGrowth: latest.revenueGrowth,
            burnRateRatio: latest.burnRateRatio,
            churnRate:     latest.churnRate,
            grossMargin:   latest.grossMargin,
          },
          monthlyRevenue: latest.revenue,
          monthlyBurn:    latest.expenses,
          historicalScores: rows.map(r => ({
            month: r.month,
            score: Math.round(
              Math.max(0, Math.min(100, (1 - r.cashDays / 180) * 100))      * 0.30 +
              Math.max(0, Math.min(100, (-r.revenueGrowth + 20) * 2.5))     * 0.25 +
              Math.max(0, Math.min(100, (r.burnRateRatio - 0.5) * 200))     * 0.20 +
              Math.max(0, Math.min(100, r.churnRate * 5))                   * 0.15 +
              Math.max(0, Math.min(100, (0.40 - r.grossMargin) * 250))      * 0.10
            ),
          })),
          rowCount: rows.length,
        });
      },
      error: reject,
    });
  });
}

export function downloadCSVTemplate() {
  const csv = [
    'month,revenue,expenses,cash_balance,customers_lost,total_customers,cogs',
    '2023-01,210000,158000,340000,12,380,126000',
    '2023-02,238000,171000,367000,14,392,142800',
    '2023-03,265000,182000,410000,11,406,159000',
    '(add one row per month...)',
  ].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'failguard_template.csv';
  a.click();
}
```

### `[CREATE NEW FILE]` src/components/input/CSVUploader.jsx

```jsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseCSVFile, downloadCSVTemplate } from '../../engine/csvParser';

export default function CSVUploader({ onSubmit }) {
  const [status,   setStatus]   = useState('idle');
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState('');
  const [bizName,  setBizName]  = useState('');
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
    if (!industry)       { alert('Please select your industry'); return; }
    onSubmit({ businessName: bizName, industry, ...result });
  };

  // ── After successful parse ────────────────────────────────────────────────
  if (status === 'success') return (
    <div style={{ paddingTop:'24px' }}>
      <div style={{
        background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'16px',
        padding:'20px', marginBottom:'24px',
      }}>
        <p style={{ fontFamily:'Inter', fontWeight:700, fontSize:'16px',
                    color:'#16A34A', margin:'0 0 4px' }}>
          ✓ File read successfully
        </p>
        <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#374151', margin:0 }}>
          Found <strong>{result.rowCount} months</strong> of data.
          Your score will be calculated from the most recent month.
        </p>
      </div>

      <div style={{ marginBottom:'16px' }}>
        <label style={{ fontFamily:'Inter', fontSize:'13px', fontWeight:600,
                        color:'#374151', display:'block', marginBottom:'8px' }}>
          Your Business Name
        </label>
        <input placeholder="e.g. Zara Bakeries Pvt Ltd" value={bizName}
          onChange={e => setBizName(e.target.value)}
          style={{ width:'100%', padding:'14px 16px', borderRadius:'12px',
                   border:'1px solid #E5E7EB', fontFamily:'Inter', fontSize:'16px',
                   outline:'none', boxSizing:'border-box' }} />
      </div>

      <div style={{ marginBottom:'24px' }}>
        <label style={{ fontFamily:'Inter', fontSize:'13px', fontWeight:600,
                        color:'#374151', display:'block', marginBottom:'8px' }}>
          Industry
        </label>
        <select value={industry} onChange={e => setIndustry(e.target.value)}
          style={{ width:'100%', padding:'14px 16px', borderRadius:'12px',
                   border:'1px solid #E5E7EB', fontFamily:'Inter', fontSize:'16px', outline:'none' }}>
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
        width:'100%', padding:'18px', background:'#0A0A0A', color:'#FFFFFF',
        border:'none', borderRadius:'14px', fontFamily:'Inter',
        fontSize:'16px', fontWeight:700, cursor:'pointer', marginBottom:'12px',
      }}>
        Analyse {result.rowCount} Months of Data →
      </button>
      <button onClick={() => setStatus('idle')} style={{
        width:'100%', background:'none', border:'none', cursor:'pointer',
        fontFamily:'Inter', fontSize:'13px', color:'#9CA3AF',
      }}>
        Upload a different file
      </button>
    </div>
  );

  // ── Default: dropzone ─────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop:'24px' }}>
      <div style={{
        background:'#F0F9FF', border:'1px solid #BAE6FD', borderRadius:'12px',
        padding:'14px 18px', marginBottom:'20px',
      }}>
        <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#0369A1', lineHeight:1.5, margin:0 }}>
          💡 Upload a monthly export from <strong>Tally, Zoho Books, QuickBooks</strong>, or any
          spreadsheet. We need at least a revenue and expenses column.{' '}
          <button onClick={downloadCSVTemplate} style={{
            background:'none', border:'none', color:'#0369A1', fontWeight:700,
            cursor:'pointer', padding:0, fontFamily:'Inter', fontSize:'13px',
            textDecoration:'underline',
          }}>
            Download our template →
          </button>
        </p>
      </div>

      <div {...getRootProps()} style={{
        border:`2px dashed ${isDragActive ? '#0A0A0A' : '#D1D5DB'}`,
        borderRadius:'16px', padding:'52px 24px', textAlign:'center',
        background: isDragActive ? '#F3F4F6' : '#FAFAFA',
        cursor:'pointer', transition:'all 200ms ease', marginBottom:'16px',
      }}>
        <input {...getInputProps()} />
        <p style={{ fontSize:'40px', margin:'0 0 14px' }}>
          {status === 'parsing' ? '⏳' : '📄'}
        </p>
        <p style={{ fontFamily:'Inter', fontSize:'16px', fontWeight:600,
                    color:'#374151', margin:'0 0 6px' }}>
          {isDragActive ? 'Drop it here!' : status === 'parsing'
            ? 'Reading your file...'
            : 'Drag your CSV or Excel file here'}
        </p>
        {status !== 'parsing' && (
          <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#9CA3AF', margin:0 }}>
            or click to browse your files
          </p>
        )}
        {status === 'error' && (
          <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#DC2626', marginTop:'14px' }}>
            ⚠ {error}
          </p>
        )}
      </div>
      <p style={{ fontFamily:'Inter', fontSize:'12px', color:'#9CA3AF', textAlign:'center' }}>
        Accepts .csv · .xlsx · .xls &nbsp;·&nbsp;
        Works with Tally, Zoho Books, QuickBooks, or any spreadsheet export
      </p>
    </div>
  );
}
```

---

## PART 6 — USER FRIENDLY LAYER

> This part is the most important for the reviewer.
> Every number must explain itself. No jargon. No abbreviations.
> A person who has never heard the word "burn rate" must understand it instantly.

### `[CREATE NEW FILE]` src/components/dashboard/ScoreExplainer.jsx

Add this component **directly below the FailureScoreGauge** on the dashboard.
It translates the score into a plain English verdict.

```jsx
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
      borderRadius:'16px', padding:'20px',
    }}>
      <p style={{ fontFamily:'Inter', fontSize:'16px', fontWeight:700,
                  color: c.textColor, margin:'0 0 10px' }}>
        {c.emoji}  {c.headline}
      </p>
      <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#374151',
                  lineHeight:1.7, margin:'0 0 12px' }}>
        {c.body}
      </p>
      <div style={{ borderTop:`1px solid ${c.border}`, paddingTop:'12px' }}>
        <p style={{ fontFamily:'Inter', fontSize:'13px', fontWeight:600,
                    color: c.textColor, margin:0 }}>
          → What to do next: {c.next}
        </p>
      </div>
    </div>
  );
}
```

---

### `[MODIFY EXISTING FILE]` — MetricsPanel, AlertFeed, RecoveryPlan, AutopsyModal, WhatIfSimulator

#### Shared Tooltip Component

Create this once and import it wherever needed:

### `[CREATE NEW FILE]` src/components/shared/Tooltip.jsx

```jsx
import { useState } from 'react';

export default function Tooltip({ text, example, position = 'right' }) {
  const [show, setShow] = useState(false);
  const posStyle = position === 'right'
    ? { left: '24px', top: '-8px' }
    : { right: '0', top: '24px' };

  return (
    <span style={{ position:'relative', display:'inline-block' }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(v => !v)}
        style={{
          width:'17px', height:'17px', borderRadius:'50%',
          background:'#F3F4F6', border:'1px solid #E5E7EB',
          fontSize:'10px', fontWeight:700, color:'#9CA3AF',
          cursor:'pointer', marginLeft:'5px', verticalAlign:'middle',
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          flexShrink: 0,
        }}
      >?</button>
      {show && (
        <div style={{
          position:'absolute', ...posStyle, zIndex:500,
          background:'#0A0A0A', color:'#FFFFFF', borderRadius:'12px',
          padding:'14px 18px', width:'260px',
          fontFamily:'Inter', fontSize:'13px', lineHeight:1.55,
          boxShadow:'0 8px 28px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
        }}>
          <p style={{ margin: example ? '0 0 10px' : '0' }}>{text}</p>
          {example && (
            <p style={{ margin:0, color:'#9CA3AF', fontSize:'12px',
                        borderTop:'1px solid rgba(255,255,255,0.12)', paddingTop:'8px' }}>
              📌 {example}
            </p>
          )}
        </div>
      )}
    </span>
  );
}
```

---

#### Changes to `MetricsPanel.jsx` — Add tooltips to every metric

Find the label of each metric card. Add the Tooltip component next to each label using these exact explanations:

```javascript
// Import at top:
import Tooltip from '../shared/Tooltip';

// CASH RUNWAY card label — add tooltip:
<Tooltip
  text="How many days your business can keep running with the cash you have right now, at your current spending rate. Think of it like how many days of fuel you have left in the tank."
  example="₹2 lakh in bank, spending ₹1 lakh/month = 60 days of runway."
/>

// REVENUE GROWTH label — add tooltip:
<Tooltip
  text="Whether your income went up or down compared to last month, shown as a percentage. Positive = growing. Negative = shrinking."
  example="-8.2% means for every ₹100 you earned last month, you earned only ₹91.80 this month."
/>

// BURN RATE label — add tooltip:
<Tooltip
  text="How much you are spending compared to what you earn. 1.0 means you spend exactly what you earn. Above 1.0 means you are spending more than you earn — your savings shrink every month."
  example="1.34x means: you earn ₹100, but spend ₹134. You lose ₹34 every ₹100 earned."
/>

// CHURN RATE label — add tooltip:
<Tooltip
  text="The percentage of your customers who stopped buying from you this month. High churn means customers leave faster than new ones arrive."
  example="14% churn means 14 out of every 100 customers didn't come back this month."
/>

// GROSS MARGIN label — add tooltip:
<Tooltip
  text="How much money you keep from each rupee of sales after paying for the direct cost of making your product or delivering your service. Higher is better."
  example="28% margin means you keep ₹28 from every ₹100 sale after ingredient and material costs."
/>
```

Also add a plain-language sub-line to the Cash Runway card when it is in danger:

```jsx
// ADD inside the Cash Runway card, below the days number, when cashDays < 90:
{metrics.cashDays < 90 && (
  <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#DC2626',
              fontWeight:500, margin:'8px 0 0' }}>
    ⚠ At your current spending rate, you have{' '}
    <strong>{metrics.cashDays} days</strong> until your bank account runs dry.
    The safe minimum is 90 days.
  </p>
)}
```

---

#### Changes to `AlertFeed.jsx` — Plain English messages

The existing alert messages use financial jargon. Replace all alert text with plain English.
The `buildAlerts` function in `BusinessContext.jsx` already generates plain-English messages for user-entered data.

For the demo data alerts in `demo_data.json`, update the `msg` fields:

```json
"alerts": [
  {
    "id": 1, "time": "2 hours ago", "level": "critical",
    "msg": "You are spending ₹1.34 for every ₹1 you earn. Your bank balance shrinks every month at this rate."
  },
  {
    "id": 2, "time": "Yesterday", "level": "danger",
    "msg": "Revenue has fallen for 3 months in a row. The business is earning less each month."
  },
  {
    "id": 3, "time": "3 days ago", "level": "warning",
    "msg": "14 out of every 100 customers didn't come back this month. Customer loss is accelerating."
  },
  {
    "id": 4, "time": "1 week ago", "level": "warning",
    "msg": "You now keep only 28 paise from every ₹1 of sales after ingredient costs. Margins are thin."
  },
  {
    "id": 5, "time": "1 week ago", "level": "danger",
    "msg": "Only 67 days of cash remaining. The safe minimum is 90 days."
  }
]
```

Also add a header to AlertFeed explaining what alerts are:

```jsx
// ADD at the top of AlertFeed, before the list:
<p style={{ fontFamily:'Inter', fontSize:'12px', color:'#9CA3AF',
            margin:'0 0 14px', lineHeight:1.5 }}>
  These are automatic warnings triggered when a business signal crosses
  a known danger threshold.
</p>
```

---

#### Changes to `RecoveryPlan.jsx` — Explain what the plan is

Add this explanation banner when the recovery plan is shown:

```jsx
// ADD this before the list of action cards when actions array is populated:
<div style={{
  background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:'12px',
  padding:'14px 16px', marginBottom:'16px',
}}>
  <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#6B7280', lineHeight:1.6, margin:0 }}>
    These are <strong style={{ color:'#0A0A0A' }}>5 specific actions</strong>, ranked by impact.
    The number next to each (e.g.{' '}
    <strong style={{ color:'#16A34A' }}>↓ 12 pts</strong>) shows how much your failure score
    will drop if you complete that action.{' '}
    <strong>Lower score = safer business.</strong>
  </p>
</div>
```

Change the score improvement display from `-12pts` to `↓ 12 pts safer`:

```jsx
// FIND the score improvement badge in each action card
// REPLACE with:
<span style={{ fontFamily:'Inter', fontSize:'12px', fontWeight:700, color:'#16A34A' }}>
  ↓ {action.scoreImprovement} pts safer
</span>
```

Also add a "Generate" button explainer before the button is clicked:

```jsx
// ADD above the "Generate Recovery Plan" button:
<p style={{ fontFamily:'Inter', fontSize:'13px', color:'#9CA3AF',
            margin:'0 0 12px', lineHeight:1.5 }}>
  Our AI will analyse your specific numbers and generate a personalised
  action plan — 5 concrete steps to reduce your failure score.
</p>
```

---

#### Changes to `AutopsyModal.jsx` — Guided plain-English intro

Add this plain-English explanation panel **as the very first content** inside
the modal, above the AI Analysis box:

```jsx
// ADD at the very top of modal content (after the header row):
<div style={{
  background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:'16px',
  padding:'24px', marginBottom:'28px',
}}>
  <p style={{ fontFamily:'Inter', fontSize:'11px', fontWeight:700,
              letterSpacing:'0.08em', color:'#9CA3AF', margin:'0 0 10px' }}>
    WHAT IS FAILURE AUTOPSY MODE?
  </p>
  <p style={{ fontFamily:'Inter', fontSize:'15px', color:'#374151',
              lineHeight:1.75, margin:'0 0 14px' }}>
    Think of this like a doctor reviewing your full medical history to find what caused
    your illness — not just treating the symptoms. Autopsy Mode scans your entire
    business timeline to find the <strong>exact moment</strong> things started going
    wrong, and explains what triggered the decline in plain English.
  </p>
  <p style={{ fontFamily:'Inter', fontSize:'15px', color:'#374151',
              lineHeight:1.75, margin:0 }}>
    Scroll down to see your timeline. Look for the card labelled{' '}
    <strong style={{ background:'#0A0A0A', color:'#FFFFFF', padding:'2px 8px',
                     borderRadius:'4px', fontSize:'12px' }}>ROOT CAUSE</strong>
    {' '}— that is the event that started the chain reaction. Everything that happened
    after was a consequence of that one decision.
  </p>
</div>
```

Also update the loading screen text from technical language to plain:

```jsx
// Find the loading screen steps array and replace with:
const LOADING_STEPS = [
  'Scanning your 36-month business history...',
  'Tracing the chain of events...',
  'Finding the moment things changed...',
  'Identifying the root cause...',
  'Writing your plain-English analysis...',
];
```

---

#### Changes to `WhatIfSimulator.jsx` — Guided explainer banner

Add this at the very top of the simulator, before the score comparison row:

```jsx
// ADD at the top of WhatIfSimulator:
<div style={{
  background:'#F0F9FF', border:'1px solid #BAE6FD', borderRadius:'12px',
  padding:'16px 20px', marginBottom:'28px',
}}>
  <p style={{ fontFamily:'Inter', fontSize:'14px', color:'#0369A1',
              lineHeight:1.7, margin:0 }}>
    🎛️ <strong>This is your "time machine."</strong>  Drag any slider to the left or
    right to simulate what would happen if you changed that number.
    Watch your failure score update instantly.
    Try asking: <em>"What if I had kept 120 days of cash instead of 67?"</em>
  </p>
</div>
```

Replace bare slider labels with these enriched versions:

```javascript
// Update the SLIDERS config array to include plain-language context:
const SLIDERS = [
  {
    key:          'cashDays',
    label:        'Cash Runway (days)',
    plain:        'How many days of cash do you have in the bank?',
    tip:          'Drag right to simulate having more cash saved up. Drag left to see what happens as cash runs low.',
    min: 0, max: 180, step: 1,
  },
  {
    key:          'revenueGrowth',
    label:        'Revenue Growth (%)',
    plain:        'Is your monthly revenue going up or down?',
    tip:          'Negative = revenue is falling each month. Zero = flat. Positive = growing.',
    min: -30, max: 30, step: 0.1,
  },
  {
    key:          'burnRateRatio',
    label:        'Burn Rate',
    plain:        'How much do you spend compared to what you earn?',
    tip:          'Below 1.0 = spending less than you earn (good). Above 1.0 = spending more (dangerous).',
    min: 0.5, max: 2.0, step: 0.01,
  },
  {
    key:          'churnRate',
    label:        'Customer Churn (%)',
    plain:        'What % of customers leave each month?',
    tip:          '0 = no one leaves. 20 = one in five customers leaves every month.',
    min: 0, max: 30, step: 0.1,
  },
];

// In the JSX for each slider, show plain label and tip below the value:
// Below the slider input, add:
<p style={{ fontFamily:'Inter', fontSize:'11px', color:'#9CA3AF',
            margin:'5px 0 0', lineHeight:1.4 }}>
  {slider.tip}
</p>
```

---

## PART 7 — MULTI-BUSINESS MANAGER

### `[CREATE NEW FILE]` src/pages/BusinessesPage.jsx

```jsx
import { useNavigate } from 'react-router-dom';
import { useBusiness }  from '../context/BusinessContext';
import BusinessCard      from '../components/businesses/BusinessCard';

export default function BusinessesPage() {
  const { businesses, setCurrentBusiness, setBusinesses } = useBusiness();
  const navigate = useNavigate();

  const handleSelect = (biz) => {
    setCurrentBusiness(biz);
    navigate('/dashboard');
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this business from your saved list?')) {
      setBusinesses(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div style={{ background:'#FAFAFA', minHeight:'100vh', padding:'60px 24px' }}>
      <div style={{ maxWidth:'960px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'flex-start', marginBottom:'40px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <h1 style={{ fontFamily:'Inter', fontSize:'40px', fontWeight:800,
                         color:'#0A0A0A', margin:'0 0 8px' }}>My Businesses</h1>
            <p style={{ fontFamily:'Inter', fontSize:'16px', color:'#6B7280', margin:0 }}>
              All businesses you have analysed. Click any card to open its full dashboard.
            </p>
          </div>
          <button onClick={() => navigate('/analyse')} style={{
            background:'#0A0A0A', color:'#FFFFFF', padding:'14px 24px',
            borderRadius:'12px', border:'none', fontFamily:'Inter',
            fontSize:'14px', fontWeight:700, cursor:'pointer',
          }}>
            + Analyse New Business
          </button>
        </div>

        {/* Empty state */}
        {businesses.length === 0 ? (
          <div style={{
            textAlign:'center', padding:'80px 24px',
            background:'#FFFFFF', borderRadius:'20px', border:'1px solid #E5E7EB',
          }}>
            <p style={{ fontSize:'52px', margin:'0 0 16px' }}>🏪</p>
            <p style={{ fontFamily:'Inter', fontSize:'22px', fontWeight:700,
                        color:'#374151', margin:'0 0 8px' }}>
              No businesses analysed yet.
            </p>
            <p style={{ fontFamily:'Inter', fontSize:'15px', color:'#9CA3AF', margin:'0 0 28px' }}>
              Enter your first set of business numbers to see your failure score here.
            </p>
            <button onClick={() => navigate('/analyse')} style={{
              background:'#0A0A0A', color:'#FFFFFF', padding:'16px 36px',
              borderRadius:'12px', border:'none', fontFamily:'Inter',
              fontSize:'15px', fontWeight:700, cursor:'pointer',
            }}>
              Analyse My First Business →
            </button>
          </div>
        ) : (
          <div style={{ display:'grid',
                        gridTemplateColumns:'repeat(auto-fill, minmax(400px, 1fr))',
                        gap:'20px' }}>
            {businesses.map(biz => (
              <BusinessCard key={biz.id} business={biz}
                onSelect={() => handleSelect(biz)}
                onDelete={() => handleDelete(biz.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### `[CREATE NEW FILE]` src/components/businesses/BusinessCard.jsx

```jsx
import { useState } from 'react';
import { calculateFailureScore } from '../../engine/scoreEngine';

const BAND = {
  SAFE:     { bg:'#F0FDF4', text:'#16A34A', border:'#BBF7D0' },
  CAUTION:  { bg:'#FFFBEB', text:'#D97706', border:'#FDE68A' },
  DANGER:   { bg:'#FEF2F2', text:'#DC2626', border:'#FECACA' },
  CRITICAL: { bg:'#0A0A0A', text:'#FFFFFF', border:'#0A0A0A' },
};

const SCORE_PLAIN = {
  SAFE:     'Healthy',
  CAUTION:  'Early warnings',
  DANGER:   'Needs attention',
  CRITICAL: 'Act immediately',
};

export default function BusinessCard({ business, onSelect, onDelete }) {
  const [hover, setHover] = useState(false);
  const result = calculateFailureScore(business.metrics);
  const band   = BAND[result.riskBand] || BAND.SAFE;
  const date   = business.createdAt
    ? new Date(business.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    : null;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:'20px',
        padding:'24px', cursor:'pointer', position:'relative',
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.06)',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        transition:'all 200ms ease',
      }}
    >
      {/* Delete button */}
      {hover && (
        <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{
          position:'absolute', top:'16px', right:'16px',
          background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:'8px',
          width:'28px', height:'28px', cursor:'pointer',
          fontFamily:'Inter', fontSize:'14px', color:'#9CA3AF',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>✕</button>
      )}

      {/* Business name + score */}
      <div style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'flex-start', marginBottom:'16px', paddingRight: hover ? '36px' : '0' }}>
        <div>
          <p style={{ fontFamily:'Inter', fontSize:'18px', fontWeight:700,
                      color:'#0A0A0A', margin:'0 0 4px' }}>
            {business.name}
          </p>
          <p style={{ fontFamily:'Inter', fontSize:'13px', color:'#9CA3AF', margin:0 }}>
            {business.industry}
            {business.isDemo && (
              <span style={{ marginLeft:'8px', background:'#F3F4F6', color:'#6B7280',
                             padding:'2px 8px', borderRadius:'999px', fontSize:'11px',
                             fontWeight:600 }}>
                DEMO
              </span>
            )}
          </p>
        </div>
        <div style={{ background: band.bg, border:`1px solid ${band.border}`,
                      borderRadius:'14px', padding:'10px 16px', textAlign:'center',
                      flexShrink: 0 }}>
          <p style={{ fontFamily:'Inter', fontSize:'26px', fontWeight:900,
                      color: band.text, margin:'0 0 2px', lineHeight:1 }}>
            {result.score}
          </p>
          <p style={{ fontFamily:'Inter', fontSize:'10px', fontWeight:700,
                      color: band.text, margin:0, letterSpacing:'0.05em' }}>
            {SCORE_PLAIN[result.riskBand]}
          </p>
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                    gap:'10px', marginBottom:'16px' }}>
        {[
          { label:'Cash Left',    value:`${business.metrics.cashDays} days`,
            warn: business.metrics.cashDays < 90 },
          { label:'Burn Rate',    value:`${business.metrics.burnRateRatio.toFixed(2)}x`,
            warn: business.metrics.burnRateRatio > 1 },
          { label:'Churn',        value:`${business.metrics.churnRate.toFixed(1)}%`,
            warn: business.metrics.churnRate > 10 },
        ].map(m => (
          <div key={m.label} style={{ background:'#F9FAFB', borderRadius:'10px', padding:'10px 12px' }}>
            <p style={{ fontFamily:'Inter', fontSize:'10px', fontWeight:600,
                        color:'#9CA3AF', margin:'0 0 3px', letterSpacing:'0.06em' }}>
              {m.label.toUpperCase()}
            </p>
            <p style={{ fontFamily:'Inter', fontSize:'15px', fontWeight:700,
                        color: m.warn ? '#DC2626' : '#0A0A0A', margin:0 }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontFamily:'Inter', fontSize:'12px', color:'#9CA3AF' }}>
          {date ? `Analysed ${date}` : 'Demo dataset'}
        </span>
        <span style={{ fontFamily:'Inter', fontSize:'13px', fontWeight:600, color:'#0A0A0A' }}>
          Open Dashboard →
        </span>
      </div>
    </div>
  );
}
```

---

## PART 8 — NAVBAR UPDATE

### `[MODIFY EXISTING FILE]` — Navbar component (whatever it's currently called)

Find the existing navbar. Add these elements to the right side:

```jsx
// ADD at top of Navbar:
import { useNavigate, useLocation } from 'react-router-dom';
import { useBusiness } from '../../context/BusinessContext';

// Inside component:
const navigate  = useNavigate();
const location  = useLocation();
const { businesses } = useBusiness();

// ADD to the right side of the nav (keep existing elements):
<div style={{ display:'flex', alignItems:'center', gap:'20px' }}>

  {/* Only show if user has saved businesses */}
  {businesses.length > 0 && (
    <button onClick={() => navigate('/businesses')} style={{
      background:'none', border:'none', cursor:'pointer',
      fontFamily:'Inter', fontWeight:500, fontSize:'14px',
      color: location.pathname === '/businesses' ? '#0A0A0A' : '#9CA3AF',
      transition:'color 150ms',
    }}>
      My Businesses ({businesses.length})
    </button>
  )}

  <button onClick={() => navigate('/analyse')} style={{
    background:'#0A0A0A', color:'#FFFFFF',
    padding:'9px 22px', borderRadius:'999px', border:'none',
    fontFamily:'Inter', fontSize:'14px', fontWeight:600, cursor:'pointer',
  }}>
    Analyse a Business
  </button>

</div>
```

---

## PART 9 — DASHBOARD WIRED TO CONTEXT

### `[MODIFY EXISTING FILE]` Dashboard page (DashboardPage.jsx or wherever the dashboard is mounted)

The dashboard currently imports `demo_data.json` directly. Change it to use context.

```jsx
// REMOVE any line like:
// import demoData from '../assets/demo_data.json';

// ADD:
import { useBusiness } from '../context/BusinessContext';
import { useNavigate }  from 'react-router-dom';
import { useEffect }    from 'react';
import ScoreExplainer   from '../components/dashboard/ScoreExplainer';

// Inside the component:
const { currentBusiness, scoreResult, updateMetrics, loadDemo } = useBusiness();
const navigate = useNavigate();

// Redirect to /analyse if no business is loaded
useEffect(() => {
  if (!currentBusiness) {
    loadDemo();   // auto-load demo so dashboard doesn't break
  }
}, []);

// Replace ALL references to demoData.xxx with currentBusiness?.xxx
// Replace ALL references to hardcoded score/riskBand with scoreResult?.score / scoreResult?.riskBand
// Replace the onMetricsChange function with: (newMetrics) => updateMetrics(newMetrics)

// ADD ScoreExplainer directly below the FailureScoreGauge component:
<ScoreExplainer score={scoreResult?.score} riskBand={scoreResult?.riskBand} />

// ADD dataset indicator in the header when not demo:
{currentBusiness && !currentBusiness.isDemo && (
  <span style={{
    background:'#F0FDF4', color:'#16A34A', border:'1px solid #BBF7D0',
    padding:'4px 10px', borderRadius:'999px',
    fontFamily:'Inter', fontSize:'11px', fontWeight:600,
  }}>
    ✓ YOUR DATA
  </span>
)}
{currentBusiness?.isDemo && (
  <span style={{
    background:'#F3F4F6', color:'#6B7280', border:'1px solid #E5E7EB',
    padding:'4px 10px', borderRadius:'999px',
    fontFamily:'Inter', fontSize:'11px', fontWeight:600,
  }}>
    DEMO DATA — Analyse your own business →
  </span>
)}
```

---

## PART 10 — CRITICAL RULES FOR THE AGENT

```
1.  DO NOT rebuild existing files — only add what's listed as [CREATE] and
    modify only the specific parts listed as [MODIFY].

2.  BusinessContext is the ONLY source of business data after this update.
    No component should import demo_data.json directly anymore.
    The only exception: BusinessContext itself imports it as a fallback.

3.  The demo path must still work perfectly.
    "View Demo" on landing → loadDemo() → navigate to /dashboard.
    Everything on the demo dashboard must function identically to before.

4.  Every tooltip text must be in plain English.
    No financial jargon. No abbreviations.
    Test: would a 55-year-old shop owner understand this without googling it?

5.  Alert messages must be full sentences in plain English.
    Not: "Burn rate 1.34x threshold exceeded"
    Yes: "You are spending ₹1.34 for every ₹1 you earn."

6.  The ScoreExplainer must render on the dashboard for EVERY risk band.
    It should be the first thing a user reads after seeing the score number.

7.  CSV upload generates real historicalScores.
    The score trend chart must show the user's own history if CSV was uploaded.
    If manual form was used, the chart falls back to demo historicalScores.

8.  Multi-business saves to localStorage under key 'fg_businesses'.
    It must persist on page refresh. Maximum 10 businesses.

9.  ProcessingScreen shows for exactly 2.2 seconds.
    Long enough to feel like something real is happening. Not longer.

10. The WhatIfSimulator explainer banner and slider tips must all be
    in plain, encouraging language — not technical. The user is
    "exploring what-if scenarios", not "adjusting parameter values".

11. Install papaparse and react-dropzone before running the build.
    The project will fail to compile without these packages.

12. After all changes, test these 4 user journeys manually:
    A. Landing → "Analyse My Business" → fill form → see dashboard with own score
    B. Landing → "View Demo" → see Zara Bakeries dashboard
    C. Dashboard → "My Businesses" → see saved list → click → return to dashboard
    D. Analyse → "Upload CSV" → drop template file → see dashboard with history chart
```

---

*End of Update Specification V3.*
*This document covers only the incremental changes to the existing codebase.*
*Do not rebuild. Do not delete. Only add and modify as instructed above.*
