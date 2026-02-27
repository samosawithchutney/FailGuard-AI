import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';
import BusinessCard from '../components/businesses/BusinessCard';

export default function BusinessesPage() {
    const { businesses, setCurrentBusiness, setBusinesses } = useBusiness();
    const navigate = useNavigate();

    const handleSelect = (biz) => {
        setCurrentBusiness(biz);
        navigate('/dashboard');
    };

    const handleDelete = (id) => {
        if (window.confirm('Remove this business from your saved list?')) {
            setBusinesses(prev => prev.filter(b => b.id !== id));
        }
    };

    return (
        <div style={{ background: '#FAFAFA', minHeight: '100vh', padding: '60px 24px' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px'
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: 'Inter', fontSize: '40px', fontWeight: 800,
                            color: '#0A0A0A', margin: '0 0 8px'
                        }}>My Businesses</h1>
                        <p style={{ fontFamily: 'Inter', fontSize: '16px', color: '#6B7280', margin: 0 }}>
                            All businesses you have analysed. Click any card to open its full dashboard.
                        </p>
                    </div>
                    <button onClick={() => navigate('/analyse')} style={{
                        background: '#0A0A0A', color: '#FFFFFF', padding: '14px 24px',
                        borderRadius: '12px', border: 'none', fontFamily: 'Inter',
                        fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    }}>
                        + Analyse New Business
                    </button>
                </div>

                {/* Empty state */}
                {businesses.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 24px',
                        background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E7EB',
                    }}>
                        <p style={{ fontSize: '52px', margin: '0 0 16px' }}>🏪</p>
                        <p style={{
                            fontFamily: 'Inter', fontSize: '22px', fontWeight: 700,
                            color: '#374151', margin: '0 0 8px'
                        }}>
                            No businesses analysed yet.
                        </p>
                        <p style={{ fontFamily: 'Inter', fontSize: '15px', color: '#9CA3AF', margin: '0 0 28px' }}>
                            Enter your first set of business numbers to see your failure score here.
                        </p>
                        <button onClick={() => navigate('/analyse')} style={{
                            background: '#0A0A0A', color: '#FFFFFF', padding: '16px 36px',
                            borderRadius: '12px', border: 'none', fontFamily: 'Inter',
                            fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                        }}>
                            Analyse My First Business →
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                        gap: '20px'
                    }}>
                        {businesses.map(biz => (
                            <BusinessCard key={biz.id} business={biz}
                                onSelect={() => handleSelect(biz)}
                                onDelete={() => handleDelete(biz.id)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
