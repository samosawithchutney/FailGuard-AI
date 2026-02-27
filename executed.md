# FailGuard AI — Execution Summary

## Project Overview

**FailGuard AI** is a real-time business failure predictor built for **Zara Bakeries Pvt Ltd** (fictional Indian SMB). It uses a weighted scoring formula to predict failure risk, traces root causes through a Failure Autopsy Mode, and generates AI-powered recovery plans via Gemini 1.5 Flash.

**Stack:** React 18 + Vite + Tailwind CSS 3 + Recharts + Framer Motion (frontend), FastAPI + Gemini 1.5 Flash (backend)

---

## Implemented Features

### 1. Deterministic Failure Score Engine
- Client-side scoring formula in `scoreEngine.js` — runs in <1ms, no API call
- Normalises 5 business metrics to 0–100 danger scores
- Weighted combination: Cash (30%) + Revenue (25%) + Burn (20%) + Churn (15%) + Margin (10%)
- Risk band assignment: SAFE (0–30), CAUTION (31–60), DANGER (61–85), CRITICAL (86–100)
- Top 3 risk factor identification for badge display

### 2. Marketing Landing Page (`/`)
- Minimalist premium aesthetic using Zinc/Slate colors
- Strong typography suite with generous whitespace (DESIGN_VARIANCE 7)
- Three sections: Hero (headline + CTA), About (narrative), Features (3 cards)
- Framer Motion used only for subtle fade-in and scroll reveals (MOTION_INTENSITY 4)
- React Router 6 integration separating marketing (`/`) from analytics (`/dashboard`)
- "Open Dashboard" button navigates cleanly without full page reload

### 3. Synthetic 36-Month Dataset
- `demo_data.json` — 36 monthly snapshots (Jan 2023 – Dec 2025)
- Three distinct phases: Healthy Growth → Hidden Decline → Visible Collapse
- Root cause event: October 12, 2024 (hiring spike + discount campaign)
- 14-month gap between root cause and DANGER threshold — demonstrates early detection
- Includes: business info, current metrics, timeline events, historical scores, alerts, top risks

### 3. Interactive Dashboard
- **Failure Score Gauge** — Recharts RadialBarChart with animated spring count-up via Framer Motion `useMotionValue`
- **Cash Runway Card** — dark hero card showing days remaining with below-threshold warning
- **Metrics Panel** — 4 metric cards (Revenue Growth, Burn Rate, Churn Rate, Gross Margin) in 2x2 grid with danger-state highlighting
- **Score Trend Chart** — 3-year AreaChart with gradient fill showing score trajectory from 10 to 70
- **Risk Badges** — top 3 risk factors with numbered badges and CRITICAL/DANGER/WARNING severity labels
- **Alert Feed** — scrollable list of 5 live alerts with severity indicators and timestamps
- **Business Snapshot** — monthly revenue (₹3.8L), monthly burn (₹5.09L), team size, founded year
- **Recovery Plan Section** — button to generate AI recovery plan, skeleton loading state, 5 priority-coded action cards

### 4. Failure Autopsy Mode (Star Feature)
- Fullscreen dark overlay triggered by "Trigger Autopsy" button (appears when score > 60)
- **3-second loading animation** with animated dots and status text
- **AI Narrative Panel** — 3-sentence GPT analysis (falls back to hardcoded narrative if backend unavailable)
- **Trigger Event Summary** — 4 cards showing trigger date, burn impact (+34%), cash impact (-113 days), time to collapse (14 months)
- **Causal Timeline** — horizontal scrollable timeline of all 32 events across 3 years
  - Root cause event highlighted with bold border + CSS pulse animation
  - Auto-scrolls to root cause on mount
  - Phase indicators (Year 1/2/3) shown at phase boundaries
  - Score displayed per event with phase-appropriate styling
- Body scroll lock while modal is open

### 5. What-If Simulator
- 4 range sliders: Cash Runway (0–180 days), Revenue Growth (-30% to +30%), Burn Rate (0.5–2.0x), Customer Churn (0–30%)
- **Instant recalculation** — score updates in real-time as sliders move, no API call
- Original vs Simulated score comparison with color-coded diff (emerald for improvement, rose for worsening)
- Dynamic risk band that updates with slider changes
- Reset button to restore original values
- Custom-styled range slider thumbs and tracks

### 6. AI Recovery Plan (Gemini 1.5 Flash)
- "Generate 72-Hour Recovery Plan" button triggers API call to backend
- 5 prioritised action cards with HIGH/MEDIUM/LOW badges
- Each card shows: action title, expected impact, score improvement points
- Skeleton shimmer loading state while generating
- Graceful fallback with hardcoded plan if backend is unavailable

### 7. FastAPI Backend
- `POST /autopsy-plan` — generates 3-sentence failure narrative via Gemini
- `POST /recovery-plan` — generates 5-action JSON recovery plan via Gemini
- CORS configured for localhost and Vercel deployments
- JSON parse error handling with fallback responses
- Markdown code fence stripping for Gemini output

---

## Design & UI Implementation (SKILL.md Compliance)

### Control Dials Applied
| Dial | Value | Effect |
|---|---|---|
| DESIGN_VARIANCE | 8 | Asymmetric `2fr 1fr 1fr` CSS Grid layout, left-aligned headers, varied spacing zones |
| MOTION_INTENSITY | 6 | Spring physics (`stiffness:100, damping:20`), stagger reveals, layout transitions, animated gauge |
| VISUAL_DENSITY | 6 | Medium-high analytics density, data-rich panels with balanced whitespace |

### Typography
- **Font stack:** Geist + Geist Mono (loaded from Google Fonts CDN)
- **No Inter** — banned per SKILL.md Rule 1
- **No serif fonts** — banned for dashboard UIs
- Tabular-nums for score display, font-mono for all data values

### Color System
- **Zinc/Slate neutral base** — no pure black (`#000000`), using zinc-950 (`#09090b`)
- **No purple/neon** — banned per SKILL.md "LILA BAN"
- **Single accent:** Emerald for positive changes, Rose for negative
- Consistent warm-neutral palette across all components

### Animation & Motion
- Spring physics on all interactive elements (no linear easing)
- Staggered mount animations across dashboard grid items
- `useMotionValue` + `useTransform` for gauge count-up (outside React render cycle per SKILL.md)
- `whileHover` and `whileTap` tactile feedback (`scale-[0.98]`) on all buttons
- `AnimatePresence` for modal enter/exit transitions
- Skeleton shimmer animations for loading states

### Performance Guardrails
- Hardware-accelerated transforms only (no animating `top`, `left`, `width`, `height`)
- `min-h-[100dvh]` instead of `h-screen` (prevents mobile layout jumping)
- Proper `useEffect` cleanup on timers and scroll locks
- Z-index used only for modal overlay layer

### Anti-Patterns Avoided
- No emojis anywhere — all icons are SVG primitives
- No 3-column equal card layouts (banned) — using 2x2 grid
- No Unsplash links, no placeholder images
- No generic names ("John Doe") or slop names ("Acme")
- No oversized H1 tags — controlled hierarchy via weight and color

### States Implemented
- **Loading:** Skeleton shimmer for AI narrative, animated dots for autopsy loading, pulse loader for recovery plan
- **Empty:** AlertFeed shows SVG icon + "No active alerts" message
- **Error:** Fallback narrative and recovery plan when backend is unreachable

---

## File Structure

```
FailGuard-AI/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── demo_data.json
│   │   ├── components/
│   │   │   ├── LandingPage.jsx
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
├── FAILGUARD_SPEC.md
├── SKILL.md
└── executed.md
```

---

## Verification Results

| Check | Status |
|---|---|
| `npm run build` | Passed — zero errors |
| Dashboard renders | Passed — all 8 component sections visible |
| Score engine output | 70 (correct deterministic calculation) |
| DANGER risk band | Displayed correctly |
| Trigger Autopsy button | Appears when score > 60 |
| Autopsy modal loading | 3-second animation confirmed |
| Causal timeline | 32 events render, auto-scrolls to root cause |
| What-If sliders | Score recalculates instantly on input change |
| Recovery Plan button | Renders, triggers loading skeleton |
| Mobile responsive | Single-column fallback on small viewports |

---

## How to Run

```bash
# Frontend
cd client
npm install
npm run dev           # → http://localhost:5173

# Backend (optional — for AI features)
cd server
pip install -r requirements.txt
# Add your Gemini API key to .env
uvicorn main:app --reload --port 8000
```


Get a free Gemini API key at: https://aistudio.google.com/
