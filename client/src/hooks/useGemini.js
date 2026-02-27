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
