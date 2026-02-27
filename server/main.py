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
