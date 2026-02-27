# FAILGUARD AI — Complete Code Generation Specification
> **Instructions for AI Agent:** Read this entire document before writing a single line of code. Build every file listed in the file structure. Follow every specification exactly. Do not use Next.js. Do not use a database. Do not use TypeScript. Stack is React 18 + Vite + Tailwind + Recharts + Framer Motion on the frontend, FastAPI + Gemini 1.5 Flash on the backend.

---

## 1. Project Overview

**Product Name:** FailGuard AI  
**Tagline:** Real-Time Business Failure Predictor  
**Demo Business:** Zara Bakeries Pvt Ltd (fictional Indian SMB)  
**Purpose:** Predict business failure risk using a weighted formula, trace root causes through Failure Autopsy Mode, simulate alternate decisions with a What If Simulator, and generate an AI-powered 72-hour recovery plan using Gemini 1.5 Flash.

### What the app does (in order):
1. Loads `demo_data.json` with 90 days of synthetic business metrics
2. Calculates a Failure Score (0–100) using a weighted formula in JavaScript
3. Displays an animated dashboard with the score, cash runway, metrics, and alerts
4. On "Trigger Autopsy" click: shows a fullscreen overlay with a causal event timeline tracing the failure back to its root cause
5. Inside Autopsy: shows a What If Simulator with sliders that recalculate the score live
6. On "Generate Recovery Plan" click: calls Gemini 1.5 Flash API, renders 5 prioritised action cards

---

## 2. Tech Stack — Do Not Deviate

### Frontend
| Library | Version | Install Command | Purpose |
|---|---|---|---|
| React | 18.x | `npm create vite@latest client -- --template react` | UI framework |
| Vite | 5.x | Included in template | Build tool, hot reload |
| Tailwind CSS | 3.x | `npm install -D tailwindcss postcss autoprefixer` | Styling |
| Recharts | 2.x | `npm install recharts` | RadialBarChart for gauge, LineChart for trends |
| Framer Motion | 11.x | `npm install framer-motion` | Animations |
| Axios | 1.x | `npm install axios` | HTTP calls to backend |

### Backend
| Library | Version | Install Command | Purpose |
|---|---|---|---|
| Python | 3.11+ | Pre-installed | Runtime |
| FastAPI | 0.111+ | `pip install fastapi uvicorn` | REST API |
| Uvicorn | 0.30+ | Included above | ASGI server |
| google-generativeai | 0.7+ | `pip install google-generativeai` | Gemini 1.5 Flash SDK |
| python-dotenv | 1.x | `pip install python-dotenv` | Load API key from .env |

### Explicitly NOT Used
- ❌ Next.js — use Vite + React only
- ❌ TypeScript — use plain JavaScript
- ❌ Redux — use useState and props
- ❌ Docker — deploy to Vercel + Render directly
- ❌ PostgreSQL or any database — JSON file is the data layer
- ❌ Redis — JS in-memory state is sufficient
- ❌ LangChain — single direct Gemini SDK call only
- ❌ GPT / OpenAI — use Gemini 1.5 Flash only

---

## 3. Complete Project File Structure

```
failguard/
├── client/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   │   └── demo_data.json
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FailureScoreGauge.jsx
│   │   │   ├── MetricsPanel.jsx
│   │   │   ├── RiskBadges.jsx
│   │   │   ├── AlertFeed.jsx
│   │   │   ├── AutopsyModal.jsx
│   │   │   ├── CausalTimeline.jsx
│   │   │   ├── WhatIfSimulator.jsx
│   │   │   └── RecoveryPlan.jsx
│   │   ├── engine/
│   │   │   └── scoreEngine.js
│   │   ├── hooks/
│   │   │   └── useGemini.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── .gitignore
└── README.md
```

---

## 4. Dataset Specification

### What dataset is used?
FailGuard uses a **synthetic financial dataset** modelled on real SMB operational metrics. It is a pre-seeded JSON file representing **3 years (36 months) of business data** for a fictional Indian bakery — January 2023 to December 2025. It is not scraped or downloaded — it is engineered to demonstrate a realistic long-horizon cause-effect failure narrative across three distinct phases: healthy growth, hidden decline, and visible collapse.

### The 5 Core Variables

| Variable | Type | Unit | What It Measures |
|---|---|---|---|
| `cashDays` | Integer | Days | How many days of cash the business has left at current burn rate |
| `revenueGrowth` | Float | % | Month-over-month revenue change. Negative = shrinking |
| `burnRateRatio` | Float | Ratio | Monthly expenses ÷ monthly revenue. Above 1.0 = spending more than earning |
| `churnRate` | Float | % | Percentage of customers lost in last 30 days |
| `grossMargin` | Float | 0.0–1.0 | Revenue minus cost of goods as a fraction of revenue |

The dataset covers **3 years — 36 monthly snapshots**. The root cause event (October 2024) occurs 14 months before the score reaches DANGER. This is the core demonstration: FailGuard detects the signal in October 2024. Every other tool detects nothing until late 2025.

### Real-World Sources (for production, not hackathon)
- **Tally ERP** — exports P&L, cash flow, balance sheet
- **Razorpay / PayU** — real-time revenue and churn
- **GST Filing API** — verified quarterly revenue
- **Bank Statement APIs** — cash balance via Account Aggregator framework

---

## 5. demo_data.json — Complete File (3-Year Dataset)

Save this as `client/src/assets/demo_data.json`. Do not modify the structure.

This dataset covers **3 years (January 2023 – December 2025)** — 36 monthly snapshots showing a realistic Indian SMB trajectory: healthy growth in Year 1, hidden decline in Year 2, visible collapse in Year 3. The root cause event occurs in October 2024 — over a year before the score reaches DANGER. This is intentional. It demonstrates that FailGuard AI detects signals that remained invisible for 14 months before they became critical.

```json
{
  "business": {
    "name": "Zara Bakeries Pvt Ltd",
    "industry": "Food & Beverage",
    "founded": "2023",
    "employees": 12,
    "location": "Bengaluru, India",
    "datasetPeriod": "January 2023 – December 2025",
    "datasetMonths": 36
  },
  "currentMetrics": {
    "cashDays": 67,
    "revenueGrowth": -8.2,
    "burnRateRatio": 1.34,
    "churnRate": 14,
    "grossMargin": 0.28
  },
  "failureScore": 74,
  "riskBand": "DANGER",
  "monthlyRevenue": 380000,
  "monthlyBurn": 509200,
  "triggerEvent": {
    "date": "2024-10-12",
    "type": "hiring_spike",
    "description": "Hired 2 staff + launched 20% discount campaign",
    "burnImpact": "+34%",
    "cashImpact": "-113 days runway",
    "monthsBeforeCollapse": 14
  },
  "topRisks": [
    { "factor": "Burn Rate",       "value": "1.34x revenue", "severity": "CRITICAL" },
    { "factor": "Cash Runway",     "value": "67 days",       "severity": "DANGER"   },
    { "factor": "Revenue Growth",  "value": "-8.2% MoM",     "severity": "DANGER"   }
  ],
  "alerts": [
    { "id": 1, "time": "2h ago",  "msg": "Burn rate exceeded 1.3x revenue threshold",             "level": "critical" },
    { "id": 2, "time": "1d ago",  "msg": "Monthly revenue declined for 3rd consecutive month",    "level": "danger"   },
    { "id": 3, "time": "3d ago",  "msg": "Customer churn rate crossed 10% threshold",             "level": "warning"  },
    { "id": 4, "time": "1w ago",  "msg": "Gross margin dropped below 30%",                        "level": "warning"  },
    { "id": 5, "time": "2w ago",  "msg": "Cash runway fell below 90-day safety threshold",        "level": "danger"   }
  ],
  "timeline": [


    {
      "date": "2023-01-01",
      "type": "normal",
      "label": "Business launched. First revenue ₹1.8L/mo",
      "score": 10,
      "description": "Zara Bakeries opens in Bengaluru. Early traction with local orders and one catering contract.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-02-01",
      "type": "normal",
      "label": "Second month revenue grows to ₹2.1L",
      "score": 11,
      "description": "Word-of-mouth driving new customers. Gross margin healthy at 48%.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-03-01",
      "type": "normal",
      "label": "First corporate catering contract signed",
      "score": 12,
      "description": "Secured monthly catering contract worth ₹45,000. Revenue now ₹2.5L/mo.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-04-01",
      "type": "normal",
      "label": "Revenue ₹2.9L. Cash runway 160 days",
      "score": 13,
      "description": "Strong summer season. Online orders growing 12% week-on-week.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-05-01",
      "type": "normal",
      "label": "Hired first full-time delivery staff",
      "score": 14,
      "description": "Team grows to 5. Burn rate at healthy 0.72x. Sustainable hiring.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-06-01",
      "type": "normal",
      "label": "Revenue grows to ₹3.2L/mo",
      "score": 15,
      "description": "Six months in. Revenue up 78% from launch. Business fundamentals strong.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-07-01",
      "type": "normal",
      "label": "New product line launched. Margins stable",
      "score": 15,
      "description": "Premium cake range added. Gross margin maintained at 45%.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-08-01",
      "type": "normal",
      "label": "Revenue ₹3.6L. Second catering contract",
      "score": 16,
      "description": "Business growing steadily. Churn rate low at 3%. Customer retention strong.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-09-01",
      "type": "normal",
      "label": "Team grows to 8. Revenue ₹3.9L/mo",
      "score": 17,
      "description": "Hired 3 more staff to handle order volume. Burn rate 0.81x. Still healthy.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-10-01",
      "type": "normal",
      "label": "Festival season boost. Revenue ₹4.4L",
      "score": 17,
      "description": "Diwali orders drive best month yet. Cash runway extended to 172 days.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-11-01",
      "type": "normal",
      "label": "Post-festival normalisation. Revenue ₹3.8L",
      "score": 19,
      "description": "Expected seasonal dip. Fundamentals remain healthy. Score stable.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },
    {
      "date": "2023-12-01",
      "type": "normal",
      "label": "Year 1 complete. Score 20. All systems healthy",
      "score": 20,
      "description": "First full year closed. Revenue grew from ₹1.8L to ₹4.1L/mo. Gross margin 44%. Cash runway 165 days. Business is healthy.",
      "rootCause": false,
      "phase": "Year 1 — Healthy Growth"
    },


    {
      "date": "2024-01-01",
      "type": "normal",
      "label": "Year 2 begins. Revenue ₹4.0L. Score 22",
      "score": 22,
      "description": "Post-holiday slowdown. Expected. No alarm signals yet.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-02-01",
      "type": "warning",
      "label": "Ingredient costs rise 12%. Margin pressure begins",
      "score": 27,
      "description": "Wheat and dairy prices up. Gross margin slips from 44% to 38%. Leadership does not adjust pricing.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-03-01",
      "type": "warning",
      "label": "New competitor opens nearby. Churn ticks up",
      "score": 31,
      "description": "Competing bakery opens 800 metres away. Monthly churn rises from 3% to 6%.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-04-01",
      "type": "warning",
      "label": "Gross margin dips below 35%",
      "score": 35,
      "description": "Cost increases not passed to customers. Margin now 33%. FailGuard flags this. Leadership ignores.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-05-01",
      "type": "warning",
      "label": "Revenue growth slows to +1.8% MoM",
      "score": 38,
      "description": "Growth nearly flat. Competitor is absorbing new customers. Existing customer retention weakening.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-06-01",
      "type": "warning",
      "label": "Churn rate crosses 8%. Cash runway 142 days",
      "score": 42,
      "description": "Customer base slowly eroding. Revenue still positive but deceleration clear.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-07-01",
      "type": "warning",
      "label": "Revenue growth turns flat: +0.3% MoM",
      "score": 46,
      "description": "Effectively zero growth. Combined effect of competition and margin pressure now visible.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-08-01",
      "type": "warning",
      "label": "Revenue turns negative: -2.1% MoM",
      "score": 49,
      "description": "First month of revenue decline. Burn rate creeping up to 0.98x. Almost spending what is earned.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-09-01",
      "type": "warning",
      "label": "Leadership decides to respond. Plans hiring + discount",
      "score": 51,
      "description": "Owner decides to hire 2 more staff and launch a 20% discount campaign to win back customers. Decision not yet executed.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-10-12",
      "type": "root_cause",
      "label": "ROOT CAUSE: Hired 2 staff + launched 20% discount",
      "score": 58,
      "burnImpact": "+34%",
      "rootCause": true,
      "description": "Two new hires added ₹72,000/mo to fixed payroll. 20% discount campaign reduced per-order margin from 33% to 14%. Monthly burn jumped from ₹3.1L to ₹5.09L overnight. This single compounded decision is the origin of the collapse.",
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-11-01",
      "type": "critical",
      "label": "Burn rate hits 1.18x revenue. First critical alert",
      "score": 63,
      "description": "Spending more than earning for the first time. Cash runway drops from 142 to 101 days in 3 weeks.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },
    {
      "date": "2024-12-01",
      "type": "critical",
      "label": "Year 2 close. Score 65. Business in trouble",
      "score": 65,
      "description": "Year ended with burn rate 1.22x, churn 11%, revenue -5.4% MoM. Cash runway 89 days. The discount did not win back customers — it just burned cash.",
      "rootCause": false,
      "phase": "Year 2 — Hidden Decline"
    },


    {
      "date": "2025-01-01",
      "type": "critical",
      "label": "New year. Old problems. Score 66",
      "score": 66,
      "description": "Discount campaign ended but damage done. Customers who returned on discount are now churning again at full price.",
      "rootCause": false,
      "phase": "Year 3 — Visible Collapse"
    },
    {
      "date": "2025-02-01",
      "type": "critical",
      "label": "Revenue decline accelerates: -6.8% MoM",
      "score": 68,
      "description": "Three consecutive months of revenue decline. Burn rate 1.28x. Cash runway 82 days.",
      "rootCause": false,
      "phase": "Year 3 — Visible Collapse"
    },
    {
      "date": "2025-03-01",
      "type": "critical",
      "label": "Cash runway crosses below 90-day threshold",
      "score": 69,
      "description": "Cash runway now 79 days — below the 90-day safety threshold. FailGuard issues CRITICAL alert. Owner still not aware of full picture.",
      "rootCause": false,
      "phase": "Year 3 — Visible Collapse"
    },
    {
      "date": "2025-04-01",
      "type": "critical",
      "label": "Churn rate hits 12%. Customer base eroding fast",
      "score": 70,
      "description": "12% of remaining customers left this month. Combined with revenue decline, the business is now in accelerating deterioration.",
      "rootCause": false,
      "phase": "Year 3 — Visible Collapse"
    },
    {
      "date": "2025-05-01",
      "type": "critical",
      "label": "Burn rate hits 1.3x. Gross margin 29%",
      "score": 71,
      "description": "Every month the business operates it loses ground. Gross margin now 29%, down from 44% at peak.",
      "rootCause": false,
      "phase": "Year 3 — Visible Collapse"
    },
    {
      "date": "2025-06-01",
      "type": "critical",
      "label": "Revenue -8.1% MoM. Staff morale declining",
      "score": 72,
      "description": "Third year of operation but revenue is now lower than Month 4 of Year 1. Structural decline confirmed.",
      "rootCause": false,
      "phase": "Year 3 — Visible Collapse"
    },
    {
      "date": "2025-07-01",
      "type": "critical",
      "label": "Cash runway 71 days. Burn 1.32x revenue",
      "score": 73,
      "description": "Running out of time. Without intervention the business has roughly 10 weeks before it cannot meet payroll.",
      "rootCause": false,
      "phase": "Year 3 — Visible Collapse"
    },
    {
      "date": "2025-12-01",
      "type": "critical",
      "label": "Current state. Score 74. DANGER. 67 days cash left",
      "score": 74,
      "description": "This is today. Five indicators in the danger zone simultaneously. Cash runway 67 days. Burn rate 1.34x. Revenue -8.2% MoM. Churn 14%. Gross margin 28%. Intervention required immediately.",
      "rootCause": false,
      "phase": "Year 3 — Visible Collapse"
    }
  ],

  "historicalScores": [
    { "month": "Jan 23", "score": 10 },
    { "month": "Apr 23", "score": 13 },
    { "month": "Jul 23", "score": 15 },
    { "month": "Oct 23", "score": 17 },
    { "month": "Jan 24", "score": 22 },
    { "month": "Apr 24", "score": 35 },
    { "month": "Jul 24", "score": 46 },
    { "month": "Oct 24", "score": 58 },
    { "month": "Jan 25", "score": 66 },
    { "month": "Apr 25", "score": 70 },
    { "month": "Jul 25", "score": 73 },
    { "month": "Dec 25", "score": 74 }
  ],

  "datasetSummary": {
    "totalMonths": 36,
    "periodStart": "2023-01-01",
    "periodEnd": "2025-12-01",
    "peakHealthScore": 10,
    "currentScore": 74,
    "rootCauseDate": "2024-10-12",
    "monthsFromRootCauseToCurrentScore": 14,
    "year1AvgScore": 15,
    "year2AvgScore": 41,
    "year3AvgScore": 70,
    "keyInsight": "Root cause occurred 14 months before reaching DANGER. Existing tools detected nothing during this window. FailGuard flagged it on day one."
  }
}
```

---

## 6. Failure Score Engine

Save as `client/src/engine/scoreEngine.js`. This file runs entirely in the browser. No API call. No imports needed.

```javascript
// scoreEngine.js — Failure Score Formula
// Runs client-side in <1ms. No dependencies.

export function calculateFailureScore(metrics) {
  const { cashDays, revenueGrowth, burnRateRatio, churnRate, grossMargin } = metrics;

  // Step 1: Normalise each variable to a 0-100 danger score
  const cashScore    = Math.max(0, Math.min(100, (1 - cashDays / 180) * 100));
  const revenueScore = Math.max(0, Math.min(100, (-revenueGrowth + 20) * 2.5));
  const burnScore    = Math.max(0, Math.min(100, (burnRateRatio - 0.5) * 200));
  const churnScore   = Math.max(0, Math.min(100, churnRate * 5));
  const marginScore  = Math.max(0, Math.min(100, (0.40 - grossMargin) * 250));

  // Step 2: Weighted combination
  // Weights reflect real-world failure priority — cash kills businesses first
  const raw = (
    cashScore    * 0.30 +   // 30% — primary survival signal
    revenueScore * 0.25 +   // 25% — growth trajectory
    burnScore    * 0.20 +   // 20% — spending sustainability
    churnScore   * 0.15 +   // 15% — demand health
    marginScore  * 0.10     // 10% — business model health
  );

  const score = Math.round(raw);

  // Step 3: Assign risk band
  let riskBand;
  if      (score <= 30) riskBand = 'SAFE';
  else if (score <= 60) riskBand = 'CAUTION';
  else if (score <= 85) riskBand = 'DANGER';
  else                  riskBand = 'CRITICAL';

  // Step 4: Identify top 3 risk factors for badge display
  const factors = [
    { name: 'Cash Runway',    score: cashScore,    weight: 0.30 },
    { name: 'Revenue Growth', score: revenueScore, weight: 0.25 },
    { name: 'Burn Rate',      score: burnScore,    weight: 0.20 },
    { name: 'Churn Rate',     score: churnScore,   weight: 0.15 },
    { name: 'Gross Margin',   score: marginScore,  weight: 0.10 },
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
    SAFE:     { text: 'text-gray-400', bg: 'bg-gray-100', border: 'border-gray-300' },
    CAUTION:  { text: 'text-gray-600', bg: 'bg-gray-200', border: 'border-gray-400' },
    DANGER:   { text: 'text-gray-900', bg: 'bg-gray-400', border: 'border-gray-700' },
    CRITICAL: { text: 'text-white',    bg: 'bg-gray-900', border: 'border-black'    },
  };
  return map[riskBand] || map.SAFE;
}
```

---

## 7. Backend — server/main.py (Complete File)

This is the **entire backend** in a single file. Two POST endpoints only. Both call Gemini 1.5 Flash.

```python
# server/main.py — Complete FastAPI Backend
import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")  # NOT gemini-1.5-pro

app = FastAPI(title="FailGuard AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request Models ─────────────────────────────────────────────
class AutopsyRequest(BaseModel):
    failureScore: int
    rootCause: str
    burnImpact: str
    cashDays: int

class RecoveryRequest(BaseModel):
    failureScore: int
    cashDays: int
    topRisks: List[str]

# ── Endpoints ──────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "FailGuard AI API running", "model": "gemini-1.5-flash"}

@app.post("/autopsy-plan")
async def autopsy_plan(req: AutopsyRequest):
    prompt = f"""You are a senior CFO analyst.
Write exactly 3 sentences explaining this business failure trajectory.
Be specific. Use the numbers provided. Plain text only. No bullet points. No headers.

Business failure score: {req.failureScore}/100
Root cause event: {req.rootCause}
Burn rate increase: {req.burnImpact}
Cash runway remaining: {req.cashDays} days"""

    try:
        response = model.generate_content(prompt)
        return {"narrative": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recovery-plan")
async def recovery_plan(req: RecoveryRequest):
    prompt = f"""You are a startup CFO.
Return ONLY a valid JSON array of exactly 5 objects. No other text. No markdown. No code fences.
Each object must have these exact keys:
  "priority": must be exactly "HIGH", "MEDIUM", or "LOW"
  "action": action title, maximum 8 words
  "impact": one sentence describing the expected business outcome
  "scoreImprovement": integer between 3 and 15

Business failure score: {req.failureScore}/100
Cash runway: {req.cashDays} days
Top risks: {", ".join(req.topRisks)}

Return only the JSON array, nothing else."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown code fences if Gemini adds them
        if text.startswith("```"):
            lines = text.split("\n")
            text = "\n".join(lines[1:-1])
        actions = json.loads(text)
        return {"actions": actions}
    except json.JSONDecodeError:
        # Fallback: return safe default plan
        return {"actions": [
            {"priority": "HIGH",   "action": "Freeze all non-essential spending immediately",     "impact": "Reduces burn rate by an estimated 15-20% within 7 days.", "scoreImprovement": 12},
            {"priority": "HIGH",   "action": "End discount campaign this week",                   "impact": "Restores per-order margin from current depressed levels.",  "scoreImprovement": 10},
            {"priority": "HIGH",   "action": "Review new hire necessity and pause recruitment",   "impact": "Saves ₹72,000/month in fixed payroll costs.",              "scoreImprovement": 8},
            {"priority": "MEDIUM", "action": "Launch customer win-back outreach campaign",        "impact": "Targets recently churned customers to recover 20-30%.",    "scoreImprovement": 6},
            {"priority": "LOW",    "action": "Renegotiate supplier payment terms to net-60",      "impact": "Extends effective cash runway by 15-20 days.",             "scoreImprovement": 4},
        ]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### server/requirements.txt

```
fastapi==0.111.0
uvicorn==0.30.1
google-generativeai==0.7.2
python-dotenv==1.0.1
pydantic==2.7.1
```

### server/.env

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get a free Gemini API key at: https://aistudio.google.com/

---

## 8. Frontend Files

### 8.1 client/src/main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 8.2 client/src/App.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  background-color: #f9f9f9;
  color: #111111;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
}

/* Root cause pulse animation */
@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.6); }
  50%       { box-shadow: 0 0 0 8px rgba(0, 0, 0, 0.0); }
}

.root-cause-pulse {
  animation: pulse-border 1.8s ease-in-out infinite;
}

/* Score number count-up */
.score-number {
  font-variant-numeric: tabular-nums;
}
```

### 8.3 client/tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 8.4 client/src/hooks/useGemini.js

```js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchAutopsyNarrative({ failureScore, rootCause, burnImpact, cashDays }) {
  const res = await axios.post(`${API}/autopsy-plan`, {
    failureScore,
    rootCause,
    burnImpact,
    cashDays,
  });
  return res.data.narrative;
}

export async function fetchRecoveryPlan({ failureScore, cashDays, topRisks }) {
  const res = await axios.post(`${API}/recovery-plan`, {
    failureScore,
    cashDays,
    topRisks,
  });
  return res.data.actions;
}
```

---

### 8.5 client/src/App.jsx

**Purpose:** Root component. Loads demo data, runs initial score, manages all global state.

**State variables:**
- `metrics` — object: current values of the 5 input variables
- `scoreResult` — object: `{ score, riskBand, topRisks }` returned by scoreEngine
- `showAutopsy` — boolean: controls AutopsyModal visibility
- `autopsyNarrative` — string or null: GPT response from /autopsy-plan
- `recoveryActions` — array or null: GPT response from /recovery-plan
- `recoveryLoading` — boolean: loading state for recovery plan generation

**Behaviour:** On mount, import demo_data.json and run `calculateFailureScore(currentMetrics)`. On metrics change (from WhatIfSimulator), recalculate score instantly without any API call.

```jsx
import { useState, useEffect } from 'react';
import demoData from './assets/demo_data.json';
import { calculateFailureScore } from './engine/scoreEngine';
import { fetchAutopsyNarrative, fetchRecoveryPlan } from './hooks/useGemini';
import Dashboard from './components/Dashboard';
import AutopsyModal from './components/AutopsyModal';

export default function App() {
  const [metrics, setMetrics]               = useState(demoData.currentMetrics);
  const [scoreResult, setScoreResult]       = useState(null);
  const [showAutopsy, setShowAutopsy]       = useState(false);
  const [autopsyNarrative, setNarrative]    = useState(null);
  const [recoveryActions, setActions]       = useState(null);
  const [recoveryLoading, setRecovLoading]  = useState(false);

  // Recalculate score whenever metrics change
  useEffect(() => {
    const result = calculateFailureScore(metrics);
    setScoreResult(result);
  }, [metrics]);

  // Fetch autopsy narrative from Gemini when modal opens
  const handleOpenAutopsy = async () => {
    setShowAutopsy(true);
    if (!autopsyNarrative) {
      try {
        const narrative = await fetchAutopsyNarrative({
          failureScore: scoreResult.score,
          rootCause: demoData.triggerEvent.description,
          burnImpact: demoData.triggerEvent.burnImpact,
          cashDays: metrics.cashDays,
        });
        setNarrative(narrative);
      } catch {
        setNarrative('Failure trajectory traced to October 2025 hiring and discount decision. Burn rate exceeded revenue by 34%. Cash runway critically reduced.');
      }
    }
  };

  const handleGenerateRecovery = async () => {
    setRecovLoading(true);
    try {
      const actions = await fetchRecoveryPlan({
        failureScore: scoreResult.score,
        cashDays: metrics.cashDays,
        topRisks: scoreResult.topRisks,
      });
      setActions(actions);
    } catch {
      setActions(null);
    } finally {
      setRecovLoading(false);
    }
  };

  if (!scoreResult) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-400 text-lg">Loading FailGuard AI...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard
        business={demoData.business}
        metrics={metrics}
        scoreResult={scoreResult}
        alerts={demoData.alerts}
        historicalScores={demoData.historicalScores}
        recoveryActions={recoveryActions}
        recoveryLoading={recoveryLoading}
        onTriggerAutopsy={handleOpenAutopsy}
        onGenerateRecovery={handleGenerateRecovery}
      />
      {showAutopsy && (
        <AutopsyModal
          timeline={demoData.timeline}
          triggerEvent={demoData.triggerEvent}
          narrative={autopsyNarrative}
          initialMetrics={demoData.currentMetrics}
          currentMetrics={metrics}
          onMetricsChange={setMetrics}
          scoreResult={scoreResult}
          onClose={() => setShowAutopsy(false)}
        />
      )}
    </div>
  );
}
```

---

### 8.6 client/src/components/Dashboard.jsx

**Purpose:** Main layout. Two-column layout: left panel (gauge + risk badges + metrics), right panel (historical chart + recovery plan + alert feed).

```jsx
import FailureScoreGauge from './FailureScoreGauge';
import MetricsPanel from './MetricsPanel';
import RiskBadges from './RiskBadges';
import AlertFeed from './AlertFeed';
import RecoveryPlan from './RecoveryPlan';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({
  business, metrics, scoreResult, alerts,
  historicalScores, recoveryActions, recoveryLoading,
  onTriggerAutopsy, onGenerateRecovery
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FailGuard AI</h1>
          <p className="text-sm text-gray-500">{business.name} · {business.industry} · {business.location}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Real-Time Failure Monitor</p>
          <p className="text-xs text-gray-400">Last updated: just now</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Gauge + Badges */}
        <div className="col-span-1 space-y-4">
          <FailureScoreGauge
            score={scoreResult.score}
            riskBand={scoreResult.riskBand}
            onTriggerAutopsy={onTriggerAutopsy}
          />
          <RiskBadges topRisks={scoreResult.topRisks} />
        </div>

        {/* Centre: Metrics + Historical Chart */}
        <div className="col-span-1 space-y-4">
          <MetricsPanel metrics={metrics} />
          {/* Historical Score Trend */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Score Trend (5 months)</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={historicalScores}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#111111" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recovery Plan + Alert Feed */}
        <div className="col-span-1 space-y-4">
          <RecoveryPlan
            actions={recoveryActions}
            loading={recoveryLoading}
            onGenerate={onGenerateRecovery}
          />
          <AlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
```

---

### 8.7 client/src/components/FailureScoreGauge.jsx

**Purpose:** Animated radial gauge. The centrepiece. Framer Motion count-up from 0 to score on mount.

**Key behaviours:**
- Recharts `RadialBarChart` with single bar
- Score number counts up from 0 using Framer Motion `useMotionValue` + `useSpring`
- Arc colour: black for DANGER/CRITICAL, gray-500 for CAUTION, gray-300 for SAFE
- "Trigger Autopsy" button only renders when score > 60, with `animate-pulse` class

```jsx
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const ARC_COLOUR = {
  SAFE:     '#D1D5DB',
  CAUTION:  '#6B7280',
  DANGER:   '#111111',
  CRITICAL: '#000000',
};

export default function FailureScoreGauge({ score, riskBand, onTriggerAutopsy }) {
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const displayScore = useTransform(springVal, v => Math.round(v));

  useEffect(() => {
    motionVal.set(score);
  }, [score, motionVal]);

  const chartData = [{ value: score, fill: ARC_COLOUR[riskBand] || '#111' }];

  return (
    <div className="bg-white border border-gray-200 rounded p-4 flex flex-col items-center">
      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Failure Score</p>
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="65%" outerRadius="90%"
            startAngle={220} endAngle={-40}
            data={chartData}
            barSize={14}
          >
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#F3F4F6' }} />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Centred score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-5xl font-black text-gray-900 score-number">
            {displayScore}
          </motion.span>
          <span className="text-xs text-gray-400 mt-1">out of 100</span>
        </div>
      </div>
      {/* Risk band label */}
      <div className={`mt-2 px-4 py-1 rounded-full text-sm font-bold
        ${riskBand === 'SAFE'     ? 'bg-gray-100 text-gray-500' : ''}
        ${riskBand === 'CAUTION'  ? 'bg-gray-200 text-gray-700' : ''}
        ${riskBand === 'DANGER'   ? 'bg-gray-800 text-white'    : ''}
        ${riskBand === 'CRITICAL' ? 'bg-black text-white'       : ''}
      `}>
        {riskBand}
      </div>
      {/* Autopsy button — only shows when score > 60 */}
      {score > 60 && (
        <button
          onClick={onTriggerAutopsy}
          className="mt-4 w-full py-2 bg-black text-white text-sm font-bold rounded animate-pulse hover:animate-none hover:bg-gray-800 transition-colors"
        >
          Trigger Autopsy →
        </button>
      )}
    </div>
  );
}
```

---

### 8.8 client/src/components/MetricsPanel.jsx

**Purpose:** Cash runway countdown card + 3 metric cards.

```jsx
export default function MetricsPanel({ metrics }) {
  const cards = [
    {
      label: 'Revenue Growth',
      value: `${metrics.revenueGrowth > 0 ? '+' : ''}${metrics.revenueGrowth}%`,
      sub: 'Month on month',
      danger: metrics.revenueGrowth < 0,
    },
    {
      label: 'Burn Rate',
      value: `${metrics.burnRateRatio}x`,
      sub: 'Expenses / Revenue',
      danger: metrics.burnRateRatio > 1,
    },
    {
      label: 'Churn Rate',
      value: `${metrics.churnRate}%`,
      sub: 'Last 30 days',
      danger: metrics.churnRate > 10,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Cash Runway — hero card */}
      <div className="bg-black text-white rounded p-4">
        <p className="text-xs font-bold uppercase text-gray-400">Cash Runway</p>
        <p className="text-5xl font-black mt-1">{metrics.cashDays}</p>
        <p className="text-sm text-gray-400 mt-1">days remaining</p>
      </div>
      {/* 3 metric cards */}
      <div className="grid grid-cols-3 gap-2">
        {cards.map(card => (
          <div
            key={card.label}
            className={`rounded p-3 border ${card.danger ? 'border-gray-700 bg-gray-100' : 'border-gray-200 bg-white'}`}
          >
            <p className="text-xs text-gray-500 leading-tight">{card.label}</p>
            <p className={`text-xl font-black mt-1 ${card.danger ? 'text-gray-900' : 'text-gray-500'}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-400">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 8.9 client/src/components/RiskBadges.jsx

**Purpose:** Three dark pill badges showing the top risk factors from scoreEngine output.

```jsx
export default function RiskBadges({ topRisks }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <p className="text-xs font-bold text-gray-500 uppercase mb-3">Top Risk Factors</p>
      <div className="flex flex-col gap-2">
        {topRisks.map((risk, i) => (
          <div key={risk} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">
              {i + 1}
            </span>
            <span className="text-sm font-semibold text-gray-800">{risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 8.10 client/src/components/AlertFeed.jsx

**Purpose:** Scrollable list of system alerts from demo_data.json.

```jsx
const LEVEL_STYLES = {
  critical: 'bg-black text-white',
  danger:   'bg-gray-700 text-white',
  warning:  'bg-gray-300 text-gray-800',
};

export default function AlertFeed({ alerts }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <p className="text-xs font-bold text-gray-500 uppercase mb-3">Live Alerts</p>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-start gap-2">
            <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
              alert.level === 'critical' ? 'bg-black' :
              alert.level === 'danger'   ? 'bg-gray-600' : 'bg-gray-400'
            }`} />
            <div>
              <p className="text-xs text-gray-700 leading-tight">{alert.msg}</p>
              <p className="text-xs text-gray-400 mt-0.5">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 8.11 client/src/components/AutopsyModal.jsx

**Purpose:** STAR FEATURE. Fullscreen overlay. Shows 3-second loading screen, then causal timeline, GPT narrative, and What If Simulator.

**Behaviour sequence:**
1. On open: show loading screen with animated dots for 3 seconds
2. After 3s: fade in the causal timeline and narrative using Framer Motion
3. Render CausalTimeline and WhatIfSimulator inside the overlay
4. "Close" button top-right dismisses modal

```jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CausalTimeline from './CausalTimeline';
import WhatIfSimulator from './WhatIfSimulator';

export default function AutopsyModal({
  timeline, triggerEvent, narrative, initialMetrics,
  currentMetrics, onMetricsChange, scoreResult, onClose
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-y-auto"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-6 text-white text-sm font-bold border border-gray-600 px-3 py-1 rounded hover:bg-gray-800 transition-colors z-60"
      >
        ✕ Close
      </button>

      <AnimatePresence mode="wait">
        {loading ? (
          /* Loading screen */
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-screen"
          >
            <p className="text-white text-2xl font-bold mb-4">Analysing 90 days of business data</p>
            <LoadingDots />
            <p className="text-gray-500 text-sm mt-6">Tracing causal chain · Identifying root cause · Building timeline</p>
          </motion.div>
        ) : (
          /* Main autopsy content */
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-6 py-12"
          >
            <div className="mb-8">
              <h2 className="text-white text-3xl font-black mb-2">Failure Autopsy Report</h2>
              <p className="text-gray-400 text-sm">Root cause identified · {triggerEvent.date}</p>
            </div>

            {/* GPT Narrative */}
            {narrative && (
              <div className="bg-gray-900 border border-gray-700 rounded p-6 mb-8">
                <p className="text-gray-400 text-xs font-bold uppercase mb-2">AI Analysis</p>
                <p className="text-white text-base leading-relaxed">{narrative}</p>
              </div>
            )}
            {!narrative && (
              <div className="bg-gray-900 border border-gray-700 rounded p-6 mb-8 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-700 rounded w-2/3" />
              </div>
            )}

            {/* Causal Timeline */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-bold mb-4">Causal Chain — 90 Day Trace</h3>
              <CausalTimeline events={timeline} />
            </div>

            {/* What If Simulator */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">What If Simulator</h3>
              <WhatIfSimulator
                initialMetrics={initialMetrics}
                currentMetrics={currentMetrics}
                onMetricsChange={onMetricsChange}
                scoreResult={scoreResult}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Animated loading dots
function LoadingDots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-white rounded-full"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}
```

---

### 8.12 client/src/components/CausalTimeline.jsx

**Purpose:** Horizontal scrollable timeline of events. Root cause event has black border + CSS pulse animation.

```jsx
const TYPE_STYLES = {
  normal:     'bg-gray-100 border-gray-300 text-gray-700',
  warning:    'bg-gray-200 border-gray-400 text-gray-800',
  critical:   'bg-gray-700 border-gray-800 text-white',
  root_cause: 'bg-white border-black text-black root-cause-pulse',
};

const SCORE_COLOURS = {
  normal:     'text-gray-500',
  warning:    'text-gray-600',
  critical:   'text-white',
  root_cause: 'text-black',
};

export default function CausalTimeline({ events }) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {events.map((event, i) => (
          <div key={i} className="relative">
            {/* Connector line */}
            {i < events.length - 1 && (
              <div className="absolute top-8 left-full w-4 h-0.5 bg-gray-600 z-10" />
            )}
            <div className={`border-2 rounded p-4 w-52 ${TYPE_STYLES[event.type] || TYPE_STYLES.normal} ${event.rootCause ? 'border-4' : ''}`}>
              <p className="text-xs font-bold mb-1">{event.date}</p>
              {event.rootCause && (
                <span className="inline-block bg-black text-white text-xs font-black px-2 py-0.5 rounded mb-2">
                  ROOT CAUSE
                </span>
              )}
              <p className={`text-3xl font-black mb-1 ${SCORE_COLOURS[event.type]}`}>{event.score}</p>
              <p className="text-xs font-semibold leading-tight mb-2">{event.label}</p>
              <p className="text-xs opacity-70 leading-tight">{event.description}</p>
              {event.burnImpact && (
                <p className="text-xs font-bold mt-2">Burn: {event.burnImpact}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 8.13 client/src/components/WhatIfSimulator.jsx

**Purpose:** Four range sliders. Each change recalculates score instantly in the browser.

```jsx
import { useState } from 'react';
import { calculateFailureScore } from '../engine/scoreEngine';

const SLIDERS = [
  { key: 'cashDays',       label: 'Cash Runway (days)',    min: 0,    max: 180,  step: 1  },
  { key: 'revenueGrowth',  label: 'Revenue Growth (%)',    min: -30,  max: 30,   step: 0.5 },
  { key: 'burnRateRatio',  label: 'Burn Rate Ratio',       min: 0.5,  max: 2.0,  step: 0.01 },
  { key: 'churnRate',      label: 'Customer Churn (%)',    min: 0,    max: 30,   step: 0.5 },
];

export default function WhatIfSimulator({ initialMetrics, currentMetrics, onMetricsChange, scoreResult }) {
  const [simMetrics, setSimMetrics] = useState({ ...currentMetrics });
  const simResult = calculateFailureScore(simMetrics);
  const diff = simResult.score - scoreResult.score;

  const handleSlider = (key, value) => {
    const updated = { ...simMetrics, [key]: parseFloat(value) };
    setSimMetrics(updated);
    onMetricsChange(updated);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-6">
      {/* Score comparison */}
      <div className="flex items-center gap-8 mb-6">
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">Original</p>
          <p className="text-white text-4xl font-black">{scoreResult.score}</p>
        </div>
        <div className="text-gray-600 text-2xl">→</div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">Simulated</p>
          <p className={`text-4xl font-black ${simResult.score < scoreResult.score ? 'text-green-400' : 'text-red-400'}`}>
            {simResult.score}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">Change</p>
          <p className={`text-2xl font-black ${diff < 0 ? 'text-green-400' : diff > 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {diff > 0 ? '+' : ''}{diff}
          </p>
        </div>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded text-sm font-bold
            ${simResult.riskBand === 'SAFE'     ? 'bg-gray-700 text-gray-300' : ''}
            ${simResult.riskBand === 'CAUTION'  ? 'bg-gray-600 text-white' : ''}
            ${simResult.riskBand === 'DANGER'   ? 'bg-gray-400 text-black' : ''}
            ${simResult.riskBand === 'CRITICAL' ? 'bg-white text-black' : ''}
          `}>{simResult.riskBand}</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {SLIDERS.map(({ key, label, min, max, step }) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <label className="text-gray-400 text-xs font-semibold">{label}</label>
              <span className="text-white text-xs font-bold">{simMetrics[key]}</span>
            </div>
            <input
              type="range"
              min={min} max={max} step={step}
              value={simMetrics[key]}
              onChange={e => handleSlider(key, e.target.value)}
              className="w-full accent-white"
            />
          </div>
        ))}
      </div>

      {/* Reset button */}
      <button
        onClick={() => { setSimMetrics({ ...initialMetrics }); onMetricsChange({ ...initialMetrics }); }}
        className="mt-4 text-xs text-gray-500 underline hover:text-gray-300 transition-colors"
      >
        Reset to original values
      </button>
    </div>
  );
}
```

---

### 8.14 client/src/components/RecoveryPlan.jsx

**Purpose:** Renders Gemini-generated 5-action recovery plan as priority cards.

```jsx
const PRIORITY_STYLES = {
  HIGH:   'bg-black text-white',
  MEDIUM: 'bg-gray-600 text-white',
  LOW:    'bg-gray-200 text-gray-700',
};

export default function RecoveryPlan({ actions, loading, onGenerate }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <p className="text-xs font-bold text-gray-500 uppercase mb-3">AI Recovery Plan</p>

      {!actions && !loading && (
        <button
          onClick={onGenerate}
          className="w-full py-3 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors"
        >
          Generate 72-Hour Recovery Plan →
        </button>
      )}

      {loading && (
        <div className="space-y-3">
          <p className="text-gray-400 text-xs text-center animate-pulse">Generating plan via Gemini 1.5 Flash...</p>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      )}

      {actions && (
        <div className="space-y-2">
          {actions.map((action, i) => (
            <div key={i} className="border border-gray-200 rounded p-3">
              <div className="flex items-start gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-black flex-shrink-0 ${PRIORITY_STYLES[action.priority]}`}>
                  {action.priority}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{action.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.impact}</p>
                </div>
                <span className="text-xs font-black text-gray-700 flex-shrink-0">
                  -{action.scoreImprovement}pts
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 9. Build & Run Instructions

### Step 1 — Prerequisites
```bash
node --version    # Must be 18+
python3 --version # Must be 3.11+
```
Get a free Gemini API key at: https://aistudio.google.com/

### Step 2 — Frontend
```bash
mkdir failguard && cd failguard
npm create vite@latest client -- --template react
cd client
npm install
npm install recharts framer-motion axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
# → Running at http://localhost:5173
```

### Step 3 — Backend
```bash
# From failguard/ root:
mkdir server && cd server
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn google-generativeai python-dotenv
echo "GEMINI_API_KEY=your_key_here" > .env
uvicorn main:app --reload --port 8000
# → Running at http://localhost:8000
```

### Step 4 — Deploy
**Frontend → Vercel:**
```bash
cd client && vercel deploy
# Set env var in Vercel dashboard: VITE_API_URL = https://your-backend.onrender.com
```

**Backend → Render:**
- Connect GitHub repo at render.com
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add env var: `GEMINI_API_KEY = your_key`

---

## 10. Gemini 1.5 Flash — Why This Model

| Model | Speed | Cost | Use Case |
|---|---|---|---|
| **Gemini 1.5 Flash** | ~150 tok/s | Free tier | Short tasks, summaries ✅ Our choice |
| Gemini 1.5 Pro | ~40 tok/s | Paid | Complex reasoning ❌ |
| Gemini Ultra | ~20 tok/s | Enterprise | Research-grade ❌ |

We use Flash because we only need two short outputs: a 3-sentence narrative and a 5-item JSON list. Flash handles both perfectly at zero cost during development.

---

## 11. Failure Score — Formula Summary

```
Failure Score = (CashScore × 0.30) + (RevenueScore × 0.25) + (BurnScore × 0.20) + (ChurnScore × 0.15) + (MarginScore × 0.10)
```

| Signal | Formula | Weight | Reason |
|---|---|---|---|
| Cash Score | `(1 - cashDays/180) × 100` | 30% | Cash is the primary cause of business death |
| Revenue Score | `(-revenueGrowth + 20) × 2.5` | 25% | Declining revenue is the earliest visible signal |
| Burn Score | `(burnRateRatio - 0.5) × 200` | 20% | Controllable if caught early |
| Churn Score | `churnRate × 5` | 15% | Signals product failure or broken trust |
| Margin Score | `(0.40 - grossMargin) × 250` | 10% | Lagging indicator — slowest to move |

All variables normalised to 0–100 before weighting. Final score is always an integer 0–100.

---

## 12. Risk Bands

| Score | Band | Meaning |
|---|---|---|
| 0 – 30 | SAFE | Fundamentals healthy. Monitor quarterly. |
| 31 – 60 | CAUTION | Warning signals present. Review within 30 days. |
| 61 – 85 | DANGER | Multiple failure indicators active. Act this week. |
| 86 – 100 | CRITICAL | Imminent failure risk. Emergency intervention required. |

---

*End of specification. Build every file listed. Follow every spec. Do not deviate from the tech stack.*
