# server/main.py — Complete FastAPI Backend
import os
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")  # NOT gemini-1.5-pro

app = FastAPI(title="FailGuard AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://failguard.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Request Models ─────────────────────────────────────────────
class LegacyAutopsyRequest(BaseModel):
    failureScore: int
    rootCause: str
    burnImpact: str
    cashDays: int

class LegacyRecoveryRequest(BaseModel):
    failureScore: int
    cashDays: int
    topRisks: List[str]

class BusinessInfo(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    employees: Optional[str] = None
    founded: Optional[str] = None
    datasetPeriod: Optional[str] = None

class MetricsInfo(BaseModel):
    cashDays: Optional[float] = None
    revenueGrowth: Optional[float] = None
    burnRateRatio: Optional[float] = None
    churnRate: Optional[float] = None
    grossMargin: Optional[float] = None

class AutopsyRequest(BaseModel):
    failureScore: Optional[int] = None
    riskBand: Optional[str] = None
    business: Optional[BusinessInfo] = None
    monthlyRevenue: Optional[float] = None
    monthlyBurn: Optional[float] = None
    metrics: Optional[MetricsInfo] = None
    topRisks: List[str] = []

class RecoveryRequest(BaseModel):
    failureScore: Optional[int] = None
    riskBand: Optional[str] = None
    business: Optional[BusinessInfo] = None
    monthlyRevenue: Optional[float] = None
    monthlyBurn: Optional[float] = None
    metrics: Optional[MetricsInfo] = None
    topRisks: List[str] = []

# ── Helpers ────────────────────────────────────────────────────────────────
def _strip_code_fences(text: str) -> str:
    if not text:
        return ""
    if text.strip().startswith("```"):
        lines = text.splitlines()
        lines = [line for line in lines if not line.strip().startswith("```")]
        return "\n".join(lines).strip()
    return text.strip()

def _safe_json_loads(text: str):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        if not text:
            return None
        start = min([i for i in [text.find("{"), text.find("[")] if i >= 0], default=-1)
        end = max(text.rfind("}"), text.rfind("]"))
        if start >= 0 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except json.JSONDecodeError:
                return None
        return None

def _add_months(dt: datetime, months: int) -> datetime:
    y = dt.year + (dt.month - 1 + months) // 12
    m = (dt.month - 1 + months) % 12 + 1
    return datetime(y, m, 1)

def _fallback_autopsy(failure_score: int, metrics: dict):
    now = datetime.utcnow()
    start = _add_months(datetime(now.year, now.month, 1), -33)
    total_events = 12
    base = max(10, (failure_score or 60) - 25)
    step = (failure_score - base) / max(1, total_events - 1) if failure_score is not None else 2
    root_idx = 7
    burn_ratio = metrics.get("burnRateRatio")
    burn_ratio = burn_ratio if burn_ratio is not None else 1.0
    cash_days = metrics.get("cashDays")
    cash_days = cash_days if cash_days is not None else 60
    churn = metrics.get("churnRate")
    churn = churn if churn is not None else "N/A"

    timeline = []
    for i in range(total_events):
        date = _add_months(start, i * 3).strftime("%Y-%m")
        score = int(round(base + step * i))
        phase = "Year 1 - Healthy Growth" if i < 4 else "Year 2 - Hidden Decline" if i < 8 else "Year 3 - Visible Collapse"
        is_root = i == root_idx
        event_type = "root_cause" if is_root else "normal" if i < root_idx - 1 else "warning" if score < 65 else "critical"
        timeline.append({
            "date": date,
            "type": event_type,
            "label": "Root cause decision made" if is_root else "Operational signals worsen",
            "score": score,
            "description": "Cash pressure rises as growth weakens and costs climb." if not is_root else "A single decision compounded burn and weakened margins.",
            "rootCause": is_root,
            "phase": phase,
            "burnImpact": "+{}%".format(round(burn_ratio * 10)) if is_root else None,
        })

    trigger_event = {
        "date": timeline[root_idx]["date"],
        "description": "Root cause decision compounded burn and margins.",
        "burnImpact": "+{}%".format(round(burn_ratio * 10)),
        "cashImpact": "-{} days runway".format(max(10, int(cash_days * 0.5))),
        "monthsBeforeCollapse": (total_events - 1 - root_idx) * 3,
    }

    narrative = (
        f"Failure score is {failure_score}/100 with rising burn and slowing growth. "
        f"Burn rate now sits around {burn_ratio}x revenue and churn is {churn}%. "
        f"Cash runway is approximately {cash_days} days, leaving limited time to recover."
    )

    return narrative, trigger_event, timeline

# ── Endpoints ──────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "FailGuard AI API running", "model": "gemini-1.5-flash"}

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/autopsy")
async def api_autopsy(req: AutopsyRequest):
    metrics = req.metrics.dict() if req.metrics else {}
    business = req.business.dict() if req.business else {}
    top_risks = ", ".join(req.topRisks or [])

    prompt = f"""You are a senior CFO analyst.
Return ONLY valid JSON. No markdown, no code fences, no extra text.

JSON schema:
{{
  "narrative": "3-4 sentences",
  "triggerEvent": {{
    "date": "YYYY-MM",
    "description": "short description",
    "burnImpact": "e.g. +25% burn",
    "cashImpact": "e.g. -60 days runway",
    "monthsBeforeCollapse": 0
  }},
  "timeline": [
    {{
      "date": "YYYY-MM",
      "type": "normal|warning|critical|root_cause",
      "label": "short label",
      "score": 0,
      "description": "one sentence",
      "rootCause": false,
      "phase": "Year 1 - Healthy Growth",
      "burnImpact": "optional"
    }}
  ]
}}

Generate exactly 12 timeline events spanning 36 months, oldest first.
Include exactly one root_cause event and align triggerEvent with it.
Scores should rise toward the current failureScore.

Business name: {business.get("name")}
Industry: {business.get("industry")}
Location: {business.get("location")}
Dataset period: {business.get("datasetPeriod")}
Failure score: {req.failureScore}
Risk band: {req.riskBand}
Monthly revenue: {req.monthlyRevenue}
Monthly burn: {req.monthlyBurn}
Cash runway days: {metrics.get("cashDays")}
Revenue growth %: {metrics.get("revenueGrowth")}
Burn rate ratio: {metrics.get("burnRateRatio")}
Churn rate %: {metrics.get("churnRate")}
Gross margin: {metrics.get("grossMargin")}
Top risks: {top_risks}
"""

    try:
        response = model.generate_content(prompt)
        text = _strip_code_fences(response.text if response else "")
        data = _safe_json_loads(text)
        if not isinstance(data, dict):
            raise ValueError("Invalid autopsy response")

        narrative = data.get("narrative")
        timeline = data.get("timeline") if isinstance(data.get("timeline"), list) else None
        trigger_event = data.get("triggerEvent") if isinstance(data.get("triggerEvent"), dict) else None

        if not narrative or not timeline or not trigger_event:
            raise ValueError("Missing autopsy fields")

        return {"narrative": narrative, "timeline": timeline, "triggerEvent": trigger_event}
    except Exception:
        narrative, trigger_event, timeline = _fallback_autopsy(req.failureScore or 60, metrics)
        return {"narrative": narrative, "timeline": timeline, "triggerEvent": trigger_event}

@app.post("/api/recovery-plan")
async def api_recovery_plan(req: RecoveryRequest):
    metrics = req.metrics.dict() if req.metrics else {}
    business = req.business.dict() if req.business else {}
    top_risks = ", ".join(req.topRisks or [])

    prompt = f"""You are a startup CFO.
Return ONLY a valid JSON array of exactly 5 objects. No other text. No markdown. No code fences.
Each object must have these exact keys:
  "priority": must be exactly "HIGH", "MEDIUM", or "LOW"
  "action": action title, maximum 8 words
  "impact": one sentence describing the expected business outcome
  "scoreImprovement": integer between 3 and 15

Business name: {business.get("name")}
Industry: {business.get("industry")}
Failure score: {req.failureScore}/100
Risk band: {req.riskBand}
Monthly revenue: {req.monthlyRevenue}
Monthly burn: {req.monthlyBurn}
Cash runway: {metrics.get("cashDays")} days
Revenue growth: {metrics.get("revenueGrowth")}%
Burn rate ratio: {metrics.get("burnRateRatio")}
Churn rate: {metrics.get("churnRate")}%
Gross margin: {metrics.get("grossMargin")}
Top risks: {top_risks}

Return only the JSON array, nothing else."""

    try:
        response = model.generate_content(prompt)
        text = _strip_code_fences(response.text if response else "")
        actions = _safe_json_loads(text)
        if not isinstance(actions, list):
            raise ValueError("Invalid recovery response")
        return {"actions": actions}
    except Exception:
        return {"actions": [
            {"priority": "HIGH",   "action": "Freeze non-essential spending",      "impact": "Cuts burn within days and preserves runway.",             "scoreImprovement": 12},
            {"priority": "HIGH",   "action": "Pause discounts and promos",          "impact": "Protects margin and stabilizes cash flow.",               "scoreImprovement": 10},
            {"priority": "HIGH",   "action": "Delay new hires and backfill only",   "impact": "Reduces fixed costs while keeping core ops stable.",      "scoreImprovement": 8},
            {"priority": "MEDIUM", "action": "Target churned customers to return",  "impact": "Recovers lost revenue with low acquisition cost.",         "scoreImprovement": 6},
            {"priority": "LOW",    "action": "Renegotiate supplier payment terms",  "impact": "Extends runway by spreading cash outflows.",              "scoreImprovement": 4},
        ]}

@app.post("/autopsy-plan")
async def autopsy_plan(req: LegacyAutopsyRequest):
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
async def recovery_plan(req: LegacyRecoveryRequest):
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
