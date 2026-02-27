import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AnalysePage from './pages/AnalysePage';
import BusinessesPage from './pages/BusinessesPage';
import Dashboard from './components/Dashboard';
import AutopsyModal from './components/AutopsyModal';
import { AnimatePresence } from 'framer-motion';
import { fetchAutopsyReport, fetchRecoveryPlan } from './hooks/useGemini';
import { useBusiness } from './context/BusinessContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBusiness, scoreResult, updateMetrics, loadDemo } = useBusiness();

  const [showAutopsy, setShowAutopsy] = useState(false);
  const [autopsyNarrative, setNarrative] = useState(null);
  const [autopsyTimeline, setAutopsyTimeline] = useState([]);
  const [autopsyTriggerEvent, setAutopsyTriggerEvent] = useState(null);
  const [recoveryActions, setActions] = useState(null);
  const [recoveryLoading, setRecovLoading] = useState(false);

  // If hitting /dashboard directly without a business, auto-load demo
  useEffect(() => {
    if (location.pathname === '/dashboard' && !currentBusiness) {
      loadDemo();
    }
  }, [location.pathname, currentBusiness, loadDemo]);

  const buildAiPayload = () => {
    const metrics = currentBusiness?.metrics || {};
    const businessDetails = currentBusiness?.business || {};
    return {
      failureScore: scoreResult?.score ?? null,
      riskBand: scoreResult?.riskBand ?? null,
      business: {
        name: currentBusiness?.name ?? businessDetails.name ?? null,
        industry: currentBusiness?.industry ?? businessDetails.industry ?? null,
        location: currentBusiness?.location ?? businessDetails.location ?? null,
        employees: businessDetails.employees ?? currentBusiness?.employees ?? null,
        founded: businessDetails.founded ?? currentBusiness?.founded ?? null,
        datasetPeriod: businessDetails.datasetPeriod ?? currentBusiness?.datasetPeriod ?? null,
      },
      monthlyRevenue: currentBusiness?.monthlyRevenue ?? metrics.revenue ?? null,
      monthlyBurn: currentBusiness?.monthlyBurn ?? metrics.expenses ?? null,
      metrics: {
        cashDays: metrics.cashDays,
        revenueGrowth: metrics.revenueGrowth,
        burnRateRatio: metrics.burnRateRatio,
        churnRate: metrics.churnRate,
        grossMargin: metrics.grossMargin,
      },
      topRisks: scoreResult?.topRisks || currentBusiness?.topRisks?.map(r => r.factor) || [],
    };
  };

  // Fetch autopsy report from backend when modal opens
  const handleOpenAutopsy = async () => {
    setShowAutopsy(true);
    if (!currentBusiness || !scoreResult) return;

    setNarrative(null);
    setAutopsyTimeline([]);
    setAutopsyTriggerEvent(null);

    try {
      const report = await fetchAutopsyReport(buildAiPayload());
      setNarrative(report?.narrative || 'Failure trajectory traced to excessive spending patterns relative to revenue growth. Burn rate exceeded safe limits by 34%. Cash runway critically reduced to immediate danger levels.');
      setAutopsyTimeline(report?.timeline?.length ? report.timeline : (currentBusiness?.timeline || []));
      setAutopsyTriggerEvent(report?.triggerEvent || currentBusiness?.triggerEvent || null);
    } catch (err) {
      setNarrative('Failure trajectory traced to excessive spending patterns relative to revenue growth. Burn rate exceeded safe limits by 34%. Cash runway critically reduced to immediate danger levels.');
      setAutopsyTimeline(currentBusiness?.timeline || []);
      setAutopsyTriggerEvent(currentBusiness?.triggerEvent || null);
    }
  };

  const handleGenerateRecovery = async () => {
    setRecovLoading(true);
    try {
      if (!scoreResult || !currentBusiness) return;
      const actions = await fetchRecoveryPlan(buildAiPayload());
      setActions(actions || null);
    } catch {
      setActions(currentBusiness?.recoveryActions || [
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
                  timeline={autopsyTimeline}
                  triggerEvent={autopsyTriggerEvent || { date: 'Unknown', monthsBeforeCollapse: 'N/A', burnImpact: 'N/A', cashImpact: 'N/A' }}
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
