import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';

export default function LandingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { businesses, loadDemo } = useBusiness();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleDemo = () => {
        loadDemo();
        navigate('/dashboard');
    };

    return (
        <div className="bg-gradient-editorial text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white min-h-screen relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-noise mix-blend-overlay"></div>

            <nav className="w-full fixed top-0 z-[100] bg-white/70 backdrop-blur-md border-b border-zinc-200/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-95 transition-transform duration-300">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-zinc-900">FailGuard AI</span>
                    </div>

                    <div className="hidden md:flex gap-10 text-xs font-semibold tracking-widest-editorial text-zinc-500 uppercase">
                        <a className="hover:text-zinc-900 transition-colors" href="#features">Features</a>
                        <a className="hover:text-zinc-900 transition-colors" href="#about">About</a>
                        <a className="hover:text-zinc-900 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {businesses.length > 0 && (
                            <button onClick={() => navigate('/businesses')} className="hidden sm:block text-xs font-semibold tracking-widest-editorial text-zinc-500 hover:text-zinc-900 transition-colors uppercase">
                                My Businesses ({businesses.length})
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/analyse')}
                            className="hidden sm:block text-xs font-semibold tracking-wide bg-zinc-900 text-white px-8 py-3 rounded-full hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Analyse a Business
                        </button>
                        <button
                            className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-900"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-zinc-200 transition-all duration-300 shadow-xl overflow-hidden ${mobileMenuOpen ? 'max-h-72' : 'max-h-0'}`}>
                    <div className="flex flex-col p-6 gap-6 text-xs font-semibold tracking-widest-editorial text-zinc-500 uppercase">
                        <a className="hover:text-zinc-900 transition-colors" href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a className="hover:text-zinc-900 transition-colors" href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
                        <a className="hover:text-zinc-900 transition-colors" href="#" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>Dashboard</a>
                        <button
                            onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                            className="sm:hidden text-center bg-zinc-900 text-white py-4 rounded-full font-bold"
                        >
                            Open Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <section className="relative pt-16 pb-16 lg:pt-20 lg:pb-20 overflow-hidden z-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
                    <div className="lg:col-span-6 relative z-20 text-center lg:text-left">
                        <div className="inline-block mb-6 px-3 py-1 border border-zinc-300 rounded-full bg-white/50 backdrop-blur-sm">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Editorial Release v2.0</span>
                        </div>
                        <h1 className="font-display text-editorial-headline text-5xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-[6.5rem] leading-[0.9] sm:leading-[0.85] tracking-tighter-editorial mb-8 text-zinc-900">
                            Predict <br className="hidden sm:block" />
                            <span className="text-zinc-400 italic font-serif tracking-normal">Business</span> <br className="hidden sm:block" />
                            Failure.
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-zinc-600 leading-relaxed max-w-lg mb-10 font-normal tracking-tight border-l-0 lg:border-l lg:border-zinc-300 lg:pl-6 mx-auto lg:ml-1 lg:mr-0">
                            Neutralize risk before it becomes irreversible. We analyze hidden operational signals to detect collapse trajectories early.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start">
                            <button
                                onClick={() => navigate('/analyse')}
                                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-zinc-900 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full transition-all duration-300 shadow-glass-button hover:bg-white hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="relative z-10">Analyse My Business</span>
                                <span className="material-symbols-outlined relative z-10 ml-2 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <button
                                onClick={handleDemo}
                                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-zinc-600 border border-zinc-200 rounded-full transition-all duration-300 hover:text-zinc-900 hover:bg-zinc-50"
                            >
                                View Demo
                            </button>
                            <span className="text-[10px] sm:text-xs font-medium text-zinc-400 tracking-wide uppercase opacity-70">
                                <span className="material-symbols-outlined text-[10px] mr-1 align-middle">lock</span>
                                Data stays on your device
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative z-10 order-first lg:order-last mb-12 lg:mb-0">
                        <div className="relative w-full aspect-square sm:aspect-video lg:aspect-auto lg:h-[600px] transform scale-100 lg:translate-y-8">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl rounded-3xl shadow-dashboard border border-white/60 overflow-hidden group">
                                <div className="h-10 border-b border-zinc-200/50 flex items-center px-4 gap-2 bg-white/40">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
                                </div>
                                <div className="p-8 lg:p-12 grid-lines h-full">
                                    <div className="flex justify-between items-end mb-12">
                                        <div>
                                            <div className="text-[10px] lg:text-xs text-zinc-400 uppercase tracking-widest mb-2 font-bold">Risk Probability</div>
                                            <div className="text-5xl lg:text-6xl font-display font-bold text-zinc-900 tracking-tighter">12.4%</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] lg:text-xs text-zinc-400 uppercase tracking-widest mb-2 font-bold">Status</div>
                                            <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase tracking-wider">Stable</div>
                                        </div>
                                    </div>
                                    <div className="relative h-48 lg:h-64 w-full mt-4">
                                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                            <path d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,90 C350,100 400,40 450,50 C500,60 550,20 600,30" fill="none" stroke="#18181b" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                                            <path d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,90 C350,100 400,40 450,50 C500,60 550,20 600,30 L600,200 L0,200 Z" fill="url(#gradientChart)" opacity="0.1"></path>
                                            <defs>
                                                <linearGradient id="gradientChart" x1="0%" x2="0%" y1="0%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#18181b', stopOpacity: 1 }}></stop>
                                                    <stop offset="100%" style={{ stopColor: '#18181b', stopOpacity: 0 }}></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute top-[30px] right-[10%] w-5 h-5 bg-zinc-900 rounded-full border-4 border-white shadow-2xl pulse-glow"></div>
                                        <div className="absolute top-[0px] right-[4%] bg-zinc-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-full shadow-2xl tracking-wider">
                                            PROJECTED +14.2%
                                        </div>
                                    </div>
                                    <div className="mt-12 grid grid-cols-4 gap-4 opacity-40">
                                        <div className="h-1.5 w-full bg-zinc-200 rounded-full"></div>
                                        <div className="h-1.5 w-full bg-zinc-200 rounded-full"></div>
                                        <div className="h-1.5 w-full bg-zinc-200 rounded-full"></div>
                                        <div className="h-1.5 w-full bg-zinc-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="py-12 lg:py-16 bg-white relative z-10 border-t border-zinc-100">
                <div className="max-w-6xl mx-auto px-6 text-center sm:text-left">
                    <div className="max-w-4xl lg:max-w-none mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                            <div className="lg:col-span-4 space-y-12">
                                <div className="lg:sticky lg:top-32">
                                    <h2 className="font-display font-bold text-xs tracking-widest-editorial uppercase text-zinc-400 mb-6">
                                        The Methodology
                                    </h2>
                                    <div className="h-px w-full bg-zinc-200 mb-8"></div>
                                    <div className="bg-zinc-50 p-8 border border-zinc-100 rounded-2xl">
                                        <span className="block text-4xl lg:text-5xl font-display font-bold text-zinc-900 mb-3 tracking-tighter">94%</span>
                                        <p className="text-xs lg:text-sm text-zinc-500 font-medium leading-relaxed uppercase tracking-wider">
                                            of business failures are preceded by detectable patterns in operational data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-8 space-y-10 text-zinc-600 text-lg lg:text-2xl leading-relaxed font-light">
                                <p className="drop-cap text-zinc-900">
                                    Businesses rarely fail suddenly. Collapse is almost always preceded by a silent accumulation of risk—a compounding series of small decisions that slowly erode operational health and cash runway.
                                </p>
                                <p>
                                    Traditional analytics dashboards show you lagging indicators of performance. They tell you what happened last quarter, but they do not alert you when your current trajectory crosses the threshold into fatal insolvency. By the time the red flags appear on a P&L statement, the inertia of failure is often too great to reverse.
                                </p>
                                <div className="pl-8 lg:pl-12 border-l-4 border-zinc-900 py-4 my-12 bg-zinc-50/50 pr-8 rounded-r-xl">
                                    <p className="text-2xl lg:text-3xl font-display font-medium text-zinc-900 italic tracking-tight text-left">
                                        "FailGuard AI shifts the paradigm from <span className="text-zinc-400 font-serif not-italic">observation</span> to <span className="text-zinc-900 underline decoration-zinc-300 underline-offset-8">prediction</span>."
                                    </p>
                                </div>
                                <p>
                                    We detect early risk signals, trace the causal origin of decline, and provide executable AI recovery plans to course-correct before it's too late. It is not just about seeing the data; it is about understanding the narrative your data is trying to tell you about your future.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-12 lg:py-16 relative z-10 border-t border-zinc-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl lg:max-w-none mb-8 lg:mb-12">
                        <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-24">
                            <div className="lg:max-w-2xl">
                                <h2 className="font-display font-bold text-xs tracking-widest-editorial uppercase text-zinc-500 mb-4 text-center lg:text-left">
                                    Core Capabilities
                                </h2>
                                <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold text-zinc-900 tracking-tighter text-center lg:text-left">
                                    Intelligence for Survival.
                                </h3>
                            </div>
                            <p className="text-zinc-500 lg:max-w-sm text-base leading-relaxed text-center lg:text-left mx-auto lg:mx-0 opacity-80 font-medium">
                                Our system continuously audits your operational health, providing clarity in chaos and foresight in uncertainty.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
                        <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 lg:p-14 relative overflow-hidden group transition-all duration-700 hover:shadow-2xl micro-glow flex flex-col justify-between border-white/80">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-zinc-300/30 transition-colors duration-700"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mb-10 shadow-xl scale-95 group-hover:scale-100 transition-transform">
                                    <span className="material-symbols-outlined text-white text-3xl">bolt</span>
                                </div>
                                <h4 className="font-display font-bold text-3xl lg:text-4xl text-zinc-900 mb-6 tracking-tighter">
                                    Real-Time Failure Prediction
                                </h4>
                                <p className="text-zinc-600 leading-relaxed text-lg lg:text-xl max-w-xl font-light">
                                    Deterministic scoring logic continuously evaluates your live operational metrics against established collapse trajectories to forecast survival probability.
                                </p>
                            </div>
                            <div className="mt-12 relative h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-zinc-900 w-[72%] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"></div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="font-mono text-[10px] lg:text-xs font-bold text-zinc-900 uppercase tracking-[0.2em]">Operational Health Index</span>
                                <span className="font-mono text-[10px] lg:text-xs font-bold text-zinc-400 uppercase tracking-widest">72% Confidence</span>
                            </div>
                        </div>

                        <div className="lg:col-span-1 glass-card rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden group transition-all duration-700 hover:shadow-2xl micro-glow border-white/80">
                            <div className="w-14 h-14 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md transition-shadow">
                                <span className="material-symbols-outlined text-zinc-900 text-3xl font-light">search</span>
                            </div>
                            <h4 className="font-display font-bold text-2xl text-zinc-900 mb-5 tracking-tight">
                                Failure Autopsy Mode
                            </h4>
                            <p className="text-zinc-500 leading-relaxed text-lg font-light">
                                A forensic timeline engine that traces the causal chain of events to pinpoint exactly when, why, and where the decline began.
                            </p>
                            <div className="mt-10 pt-10 border-t border-zinc-100/50">
                                <div className="flex -space-x-4 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white"></div>
                                    <div className="w-10 h-10 rounded-full bg-zinc-300 border-2 border-white"></div>
                                    <div className="w-10 h-10 rounded-full bg-zinc-400 border-2 border-white"></div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 glass-card rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden group transition-all duration-700 hover:shadow-2xl micro-glow border-white/80">
                            <div className="w-14 h-14 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md transition-shadow">
                                <span className="material-symbols-outlined text-zinc-900 text-3xl font-light">science</span>
                            </div>
                            <h4 className="font-display font-bold text-2xl text-zinc-900 mb-5 tracking-tight">
                                What-If Simulator
                            </h4>
                            <p className="text-zinc-500 leading-relaxed text-lg font-light">
                                Test alternate business decisions in a safe sandbox environment to instantly see their impact on your operational survival.
                            </p>
                        </div>

                        <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 lg:p-12 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden group transition-all duration-700 hover:shadow-2xl micro-glow gap-12 border-white/80">
                            <div className="max-w-md text-center sm:text-left">
                                <h4 className="font-display font-bold text-3xl text-zinc-900 mb-4 tracking-tighter">
                                    AI-Driven Recovery
                                </h4>
                                <p className="text-zinc-500 text-lg font-light leading-relaxed">
                                    Receive machine-generated, step-by-step action plans to reverse negative trends before they hit critical thresholds.
                                </p>
                            </div>
                            <div
                                onClick={() => navigate('/dashboard')}
                                className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-900 group-hover:border-zinc-900 group-hover:scale-110 transition-all duration-500 cursor-pointer shadow-sm group-hover:shadow-xl group-active:scale-95"
                            >
                                <span className="material-symbols-outlined text-zinc-400 group-hover:text-white text-4xl transition-colors">arrow_outward</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-24 bg-white border-t border-zinc-200 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <span className="font-display font-bold text-2xl text-zinc-900 tracking-tighter">FailGuard AI</span>
                            </div>
                            <p className="text-lg text-zinc-500 max-w-xs leading-relaxed font-light">
                                Explainable failure intelligence for modern businesses. We help you survive the improbable.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer border border-zinc-100 translate-y-0 hover:-translate-y-1">
                                    <span className="material-symbols-outlined text-xl">share</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer border border-zinc-100 translate-y-0 hover:-translate-y-1">
                                    <span className="material-symbols-outlined text-xl">language</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-12">
                            <div className="flex flex-col gap-6">
                                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] opacity-40">Intelligence</span>
                                <nav className="flex flex-col gap-4 text-base font-medium">
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Real-Time Prediction</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Failure Autopsy</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>What-If Simulator</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Recovery Roadmap</a>
                                </nav>
                            </div>
                            <div className="flex flex-col gap-6">
                                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] opacity-40">Philosophy</span>
                                <nav className="flex flex-col gap-4 text-base font-medium">
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer" href="#about">The Methodology</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer" href="#features">Platform Overview</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Manifesto</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Whitepaper</a>
                                </nav>
                            </div>
                            <div className="flex flex-col gap-6">
                                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] opacity-40">System</span>
                                <nav className="flex flex-col gap-4 text-base font-medium">
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Security</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Privacy Policy</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Terms of Service</a>
                                    <a className="text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Contact Support</a>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">
                            © 2026 FailGuard AI Inc. // PREDICTIVE RISK INTELLIGENCE
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 alert-pulse"></div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Network Operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
