import Papa from 'papaparse';

// Flexible — works with Tally, Zoho Books, QuickBooks, or custom CSVs
const ALIASES = {
    month: ['month', 'date', 'period', 'Month', 'Date'],
    revenue: ['revenue', 'sales', 'income', 'total_revenue', 'Revenue', 'Sales'],
    expenses: ['expenses', 'costs', 'total_expenses', 'Expenses', 'Total Costs'],
    cash_balance: ['cash_balance', 'cash', 'bank_balance', 'Cash', 'Cash Balance'],
    customers_lost: ['customers_lost', 'churned', 'lost', 'cancellations'],
    total_customers: ['total_customers', 'customers', 'active_customers', 'Total Customers'],
    cogs: ['cogs', 'cost_of_goods', 'direct_costs', 'COGS'],
};

function findCol(headers, key) {
    for (const alias of ALIASES[key]) {
        const match = headers.find(h => h.toLowerCase().trim() === alias.toLowerCase());
        if (match) return match;
    }
    return null;
}

export function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true, skipEmptyLines: true,
            complete: ({ data }) => {
                if (!data.length) return reject(new Error('File appears to be empty'));
                const headers = Object.keys(data[0]);
                const col = {};
                for (const key of Object.keys(ALIASES)) col[key] = findCol(headers, key);

                const missing = ['revenue', 'expenses'].filter(k => !col[k]);
                if (missing.length) {
                    return resolve({ success: false, needsMapping: true, headers, data, col });
                }

                const rows = data.map((row, i) => {
                    const rev = parseFloat(row[col.revenue]) || 0;
                    const exp = parseFloat(row[col.expenses]) || 0;
                    const cash = parseFloat(row[col.cash_balance]) || 0;
                    const lost = parseFloat(row[col.customers_lost]) || 0;
                    const tot = parseFloat(row[col.total_customers]) || 1;
                    const cog = parseFloat(row[col.cogs]) || rev * 0.6;
                    const prev = i > 0 ? (parseFloat(data[i - 1][col.revenue]) || rev) : rev;
                    return {
                        month: row[col.month] || `Month ${i + 1}`,
                        revenue: rev, expenses: exp,
                        cashDays: cash > 0 && exp > 0 ? Math.round((cash / exp) * 30) : 0,
                        revenueGrowth: prev > 0 ? ((rev - prev) / prev) * 100 : 0,
                        burnRateRatio: rev > 0 ? exp / rev : 0,
                        churnRate: tot > 0 ? (lost / tot) * 100 : 0,
                        grossMargin: rev > 0 ? (rev - cog) / rev : 0,
                    };
                });

                const latest = rows[rows.length - 1];
                resolve({
                    success: true,
                    metrics: {
                        cashDays: latest.cashDays,
                        revenueGrowth: latest.revenueGrowth,
                        burnRateRatio: latest.burnRateRatio,
                        churnRate: latest.churnRate,
                        grossMargin: latest.grossMargin,
                    },
                    monthlyRevenue: latest.revenue,
                    monthlyBurn: latest.expenses,
                    historicalScores: rows.map(r => ({
                        month: r.month,
                        score: Math.round(
                            Math.max(0, Math.min(100, (1 - r.cashDays / 180) * 100)) * 0.30 +
                            Math.max(0, Math.min(100, (-r.revenueGrowth + 20) * 2.5)) * 0.25 +
                            Math.max(0, Math.min(100, (r.burnRateRatio - 0.5) * 200)) * 0.20 +
                            Math.max(0, Math.min(100, r.churnRate * 5)) * 0.15 +
                            Math.max(0, Math.min(100, (0.40 - r.grossMargin) * 250)) * 0.10
                        ),
                    })),
                    rowCount: rows.length,
                });
            },
            error: reject,
        });
    });
}

export function downloadCSVTemplate() {
    const csv = [
        'month,revenue,expenses,cash_balance,customers_lost,total_customers,cogs',
        '2023-01,210000,158000,340000,12,380,126000',
        '2023-02,238000,171000,367000,14,392,142800',
        '2023-03,265000,182000,410000,11,406,159000',
        '(add one row per month...)',
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'failguard_template.csv';
    a.click();
}
