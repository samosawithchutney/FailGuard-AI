import { createContext, useContext, useState, useEffect } from 'react';
import { calculateFailureScore } from '../engine/scoreEngine';
import demoData from '../assets/demo_data.json';

const BusinessContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER — wrap App.jsx with this
// ─────────────────────────────────────────────────────────────────────────────
export function BusinessProvider({ children }) {
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [scoreResult, setScoreResult] = useState(null);
    const [showAutopsy, setShowAutopsy] = useState(false);
    const [recoveryActions, setRecoveryActions] = useState(null);
    const [autopsyNarrative, setNarrative] = useState(null);

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
            id: 'demo',
            name: demoData.business.name,
            industry: demoData.business.industry,
            location: demoData.business.location,
            isDemo: true,
            metrics: demoData.currentMetrics,
            historicalScores: demoData.historicalScores,
            timeline: demoData.timeline,
            triggerEvent: demoData.triggerEvent,
            alerts: demoData.alerts,
            monthlyRevenue: demoData.monthlyRevenue,
            monthlyBurn: demoData.monthlyBurn,
            topRisks: demoData.topRisks,
            business: demoData.business,
        });
        setRecoveryActions(null);
        setNarrative(null);
    };

    // ── Load from user input (form or CSV) ───────────────────────────────────
    const loadFromInput = (inputData) => {
        const result = calculateFailureScore(inputData.metrics);
        const biz = {
            id: Date.now().toString(),
            name: inputData.businessName,
            industry: inputData.industry,
            location: inputData.location || 'India',
            isDemo: false,
            metrics: inputData.metrics,
            historicalScores: inputData.historicalScores || [],
            timeline: demoData.timeline, // reference template
            triggerEvent: demoData.triggerEvent,
            alerts: buildAlerts(inputData.metrics),
            monthlyRevenue: inputData.monthlyRevenue,
            monthlyBurn: inputData.monthlyBurn,
            topRisks: result.topRisks.map(name => ({
                factor: name,
                value: metricValueLabel(name, inputData.metrics),
                severity: result.riskBand,
            })),
            business: {
                name: inputData.businessName,
                industry: inputData.industry,
                location: inputData.location || 'India',
                employees: inputData.employees || 'N/A',
                founded: inputData.founded || new Date().getFullYear().toString(),
                datasetPeriod: inputData.historicalScores?.length > 1
                    ? `${inputData.historicalScores[0].month} – ${inputData.historicalScores.at(-1).month}`
                    : 'Current snapshot',
                datasetMonths: inputData.historicalScores?.length || 1,
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
        alerts.push({
            id: 1, time: 'Right now', level: 'critical',
            msg: `You are spending ₹${m.burnRateRatio.toFixed(2)} for every ₹1 you earn. Your savings are draining every month.`
        });
    if (m.cashDays < 90)
        alerts.push({
            id: 2, time: 'Right now', level: 'danger',
            msg: `You have ${m.cashDays} days of cash left in the bank. The safe minimum is 90 days.`
        });
    if (m.revenueGrowth < 0)
        alerts.push({
            id: 3, time: 'This month', level: 'danger',
            msg: `Your revenue fell by ${Math.abs(m.revenueGrowth).toFixed(1)}% compared to last month.`
        });
    if (m.churnRate > 10)
        alerts.push({
            id: 4, time: 'This month', level: 'warning',
            msg: `${m.churnRate.toFixed(1)} out of every 100 customers left this month without coming back.`
        });
    if (m.grossMargin < 0.35)
        alerts.push({
            id: 5, time: 'This month', level: 'warning',
            msg: `You keep only ${(m.grossMargin * 100).toFixed(0)} paise from every ₹1 of sales after direct costs.`
        });
    return alerts;
}

function metricValueLabel(name, m) {
    return {
        'Cash Runway': `${m.cashDays} days`,
        'Revenue Growth': `${m.revenueGrowth.toFixed(1)}% MoM`,
        'Burn Rate': `${m.burnRateRatio.toFixed(2)}x`,
        'Churn Rate': `${m.churnRate.toFixed(1)}%`,
        'Gross Margin': `${(m.grossMargin * 100).toFixed(0)}%`,
    }[name] || '';
}
