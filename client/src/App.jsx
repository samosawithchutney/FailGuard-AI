import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AnalysePage from './pages/AnalysePage';
import BusinessesPage from './pages/BusinessesPage';
import Dashboard from './components/Dashboard';
import AutopsyModal from './components/AutopsyModal';
import { AnimatePresence } from 'framer-motion';
import { fetchAutopsyNarrative, fetchRecoveryPlan } from './hooks/useGemini';
import { useBusiness } from './context/BusinessContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBusiness, scoreResult, updateMetrics, loadDemo } = useBusiness();

  const [showAutopsy, setShowAutopsy] = useState(false);
  const [autopsyNarrative, setNarrative] = useState(null);
  const [recoveryActions, setActions] = useState(null);
  const [recoveryLoading, setRecovLoading] = useState(false);

  // If hitting /dashboard directly without a business, auto-load demo
  useEffect(() => {
    if (location.pathname === '/dashboard' && !currentBusiness) {
      loadDemo();
    }
  }, [location.pathname, currentBusiness, loadDemo]);

  // Fetch autopsy narrative from Gemini when modal opens
  const handleOpenAutopsy = async () => {
    setShowAutopsy(true);
    if (!autopsyNarrative && currentBusiness && scoreResult) {
      try {
        const rootCause = currentBusiness.triggerEvent?.description || 'Rapid hiring ignoring cash limits.';
        const burnImpact = currentBusiness.triggerEvent?.burnImpact || '+30% Burn Rate';
        const narrative = await fetchAutopsyNarrative({
          failureScore: scoreResult.score,
          rootCause,
          burnImpact,
          cashDays: currentBusiness.metrics.cashDays,
        });
        setNarrative(narrative);
      } catch {
        setNarrative('Failure trajectory traced to excessive spending patterns relative to revenue growth. Burn rate exceeded safe limits by 34%. Cash runway critically reduced to immediate danger levels.');
      }
    }
  };

  const handleGenerateRecovery = async () => {
    setRecovLoading(true);
    try {
      if (!scoreResult || !currentBusiness) return;

      const actions = await fetchRecoveryPlan({
        failureScore: scoreResult.score,
        cashDays: currentBusiness.metrics.cashDays,
        topRisks: scoreResult.topRisks || [],
      });
      setActions(actions);
    } catch {
      // Fallback recovery plan
      setActions([
        { priority: "HIGH", action: "Freeze all non-essential spending immediately", impact: "Reduces burn rate by an estimated 15-20% within 7 days.", scoreImprovement: 12 },
        { priority: "HIGH", action: "End discount campaign this week", impact: "Restores per-order margin from current depressed levels.", scoreImprovement: 10 },
        { priority: "HIGH", action: "Review new hire necessity and pause recruitment", impact: "Saves money in fixed payroll costs.", scoreImprovement: 8 },
        { priority: "MEDIUM", action: "Launch customer win-back outreach campaign", impact: "Targets recently churned customers to recover 20-30%.", scoreImprovement: 6 },
        { priority: "LOW", action: "Renegotiate supplier payment terms to net-60", impact: "Extends effective cash runway by 15-20 days.", scoreImprovement: 4 },
      ]);
    } finally {
      setRecovLoading(false);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/analyse" element={<AnalysePage />} />
      <Route path="/businesses" element={<BusinessesPage />} />
      <Route path="/dashboard" element={
        currentBusiness && scoreResult ? (
          <div className="min-h-[100dvh] bg-zinc-50 relative">
            <Dashboard
              business={currentBusiness}
              metrics={currentBusiness.metrics}
              scoreResult={scoreResult}
              alerts={currentBusiness.alerts || []}
              topRisks={currentBusiness.topRisks || []}
              historicalScores={currentBusiness.historicalScores || []}
              recoveryActions={recoveryActions}
              recoveryLoading={recoveryLoading}
              onTriggerAutopsy={handleOpenAutopsy}
              onGenerateRecovery={handleGenerateRecovery}
            />
            <AnimatePresence>
              {showAutopsy && (
                <AutopsyModal
                  timeline={currentBusiness.timeline || []}
                  triggerEvent={currentBusiness.triggerEvent || { date: 'Unknown', monthsBeforeCollapse: 2, burnImpact: 'N/A', cashImpact: 'N/A' }}
                  narrative={autopsyNarrative}
                  initialMetrics={currentBusiness.metrics}
                  currentMetrics={currentBusiness.metrics}
                  onMetricsChange={updateMetrics}
                  scoreResult={scoreResult}
                  onClose={() => setShowAutopsy(false)}
                />
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[100dvh]">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2.5 h-2.5 bg-zinc-900 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
              <p className="text-zinc-400 text-sm font-medium tracking-tight">Loading Business Data</p>
            </div>
          </div>
        )
      } />
    </Routes>
  );
}
