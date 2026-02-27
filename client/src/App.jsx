import { useState, useEffect } from 'react';
import demoData from './assets/demo_data.json';
import { calculateFailureScore } from './engine/scoreEngine';
import { fetchAutopsyNarrative, fetchRecoveryPlan } from './hooks/useGemini';
import Dashboard from './components/Dashboard';
import AutopsyModal from './components/AutopsyModal';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const [metrics, setMetrics] = useState(demoData.currentMetrics);
  const [scoreResult, setScoreResult] = useState(null);
  const [showAutopsy, setShowAutopsy] = useState(false);
  const [autopsyNarrative, setNarrative] = useState(null);
  const [recoveryActions, setActions] = useState(null);
  const [recoveryLoading, setRecovLoading] = useState(false);

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
        setNarrative('Failure trajectory traced to October 2024 hiring and discount decision. Burn rate exceeded revenue by 34%. Cash runway critically reduced to 67 days, placing the business in immediate danger of insolvency.');
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
      // Fallback recovery plan
      setActions([
        { priority: "HIGH", action: "Freeze all non-essential spending immediately", impact: "Reduces burn rate by an estimated 15-20% within 7 days.", scoreImprovement: 12 },
        { priority: "HIGH", action: "End discount campaign this week", impact: "Restores per-order margin from current depressed levels.", scoreImprovement: 10 },
        { priority: "HIGH", action: "Review new hire necessity and pause recruitment", impact: "Saves ₹72,000/month in fixed payroll costs.", scoreImprovement: 8 },
        { priority: "MEDIUM", action: "Launch customer win-back outreach campaign", impact: "Targets recently churned customers to recover 20-30%.", scoreImprovement: 6 },
        { priority: "LOW", action: "Renegotiate supplier payment terms to net-60", impact: "Extends effective cash runway by 15-20 days.", scoreImprovement: 4 },
      ]);
    } finally {
      setRecovLoading(false);
    }
  };

  if (!scoreResult) return (
    <div className="flex items-center justify-center min-h-[100dvh]">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-zinc-900 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <p className="text-zinc-400 text-sm font-medium tracking-tight">Loading FailGuard AI</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-zinc-50">
      <Dashboard
        business={demoData.business}
        metrics={metrics}
        scoreResult={scoreResult}
        alerts={demoData.alerts}
        topRisks={demoData.topRisks}
        historicalScores={demoData.historicalScores}
        recoveryActions={recoveryActions}
        recoveryLoading={recoveryLoading}
        onTriggerAutopsy={handleOpenAutopsy}
        onGenerateRecovery={handleGenerateRecovery}
      />
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}
