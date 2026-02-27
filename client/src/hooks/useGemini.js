import { API_BASE_URL } from '../config/api';

async function postJson(path, payload) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let message = 'Request failed';
        try {
            const text = await res.text();
            message = text || message;
        } catch {
            // ignore
        }
        throw new Error(message);
    }

    return res.json();
}

export async function fetchAutopsyReport(payload) {
    return postJson('/api/autopsy', payload);
}

export async function fetchRecoveryPlan(payload) {
    const data = await postJson('/api/recovery-plan', payload);
    return data.actions;
}
