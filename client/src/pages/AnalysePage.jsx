import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';
import InputScreen from '../components/input/InputScreen';
import ProcessingScreen from '../components/input/ProcessingScreen';

export default function AnalysePage() {
    const [processing, setProcessing] = useState(false);
    const { loadFromInput, loadDemo } = useBusiness();
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        setProcessing(true);
        await new Promise(r => setTimeout(r, 2200));
        loadFromInput(data);
        navigate('/dashboard');
    };

    const handleDemo = () => {
        loadDemo();
        navigate('/dashboard');
    };

    if (processing) return <ProcessingScreen />;
    return <InputScreen onSubmit={handleSubmit} onDemo={handleDemo} />;
}
