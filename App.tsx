import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EvaluateLoan from './components/EvaluateLoan';
import ResultDisplay from './components/ResultDisplay';
import LandingPage from './components/LandingPage';
import { Page, LoanEvaluationResult } from './types';
import { Leaf, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [evaluationResult, setEvaluationResult] = useState<LoanEvaluationResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Ensure user always starts at the top when navigating
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, evaluationResult]);

  const renderContent = () => {
    if (currentPage === 'evaluate') {
      if (evaluationResult) {
        return <ResultDisplay result={evaluationResult} onReset={() => setEvaluationResult(null)} />;
      }
      return <EvaluateLoan onComplete={setEvaluationResult} />;
    }
    
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'portfolio':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
                <div className="w-10 h-10 border-2 border-electricGreen/20 border-t-electricGreen rounded-full animate-spin" />
             </div>
             <h2 className="text-2xl font-bold text-white">Portfolio View Locked</h2>
             <p className="text-slate-500 max-w-sm">Accessing high-security enterprise archives. This module will be available in the version 2.0 release.</p>
          </div>
        );
      case 'analytics':
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <div className="w-6 h-6 border-2 border-cyberCyan/40 border-t-cyberCyan rounded-full animate-spin" />
             </div>
             <h2 className="text-xl font-bold text-white uppercase tracking-widest">Module Initializing</h2>
             <p className="text-slate-500 max-w-xs text-sm">System synchronization in progress. Advanced logic gates are being calibrated for your account.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const pageTitles: Record<Page, string> = {
    landing: 'Home',
    dashboard: 'Executive Overview',
    evaluate: 'Loan Risk Intelligence',
    portfolio: 'Institutional Portfolio',
    analytics: 'Advanced Analytics',
    settings: 'System Configuration'
  };

  if (!isLoaded) return null;

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen relative overflow-hidden bg-mesh">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.4
            }} 
          />
        ))}

        <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between max-w-[1440px] mx-auto bg-navy/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-electricGreen to-cyberCyan rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,245,160,0.3)]">
              <Leaf className="text-navy w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">SustainScore</h1>
          </div>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="text-sm font-bold text-white uppercase tracking-widest hover:text-electricGreen transition-colors flex items-center gap-2 group"
          >
            Launch Platform <LayoutDashboard className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </header>

        <LandingPage onEnter={() => setCurrentPage('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-mesh">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="particle" 
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDuration: `${Math.random() * 15 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.4
          }} 
        />
      ))}

      <Sidebar currentPage={currentPage} setPage={(p) => {
        setCurrentPage(p);
        setEvaluationResult(null);
      }} />

      <main className="ml-64 p-8 pt-12 min-h-screen relative z-10 transition-all duration-1000 ease-in-out">
        <header className="mb-12 flex items-end justify-between">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">
              {evaluationResult ? 'Evaluation Result' : pageTitles[currentPage]}
            </h1>
            <p className="text-slate-500 text-sm">
              {evaluationResult ? 'Automated AI response based on real-time ESG metrics' : 'Where sustainability meets financial precision.'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-electricGreen animate-pulse" />
              <span className="text-electricGreen">Live</span> System Status: <span className="text-white">Optimal</span>
            </div>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="ml-4 px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 hover:border-white/30 text-slate-400 hover:text-white transition-all text-[10px] font-black"
            >
              EXIT TO WEB
            </button>
          </div>
        </header>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {renderContent()}
        </div>
      </main>

      <footer className="fixed bottom-0 left-64 right-0 p-4 text-center text-[10px] text-slate-600 bg-navy/80 backdrop-blur-md border-t border-white/5 z-50 pointer-events-none">
        &copy; 2025 SUSTAINSCORE INTELLIGENCE SYSTEMS | SECURED BY QUANTUM ENCRYPTION
      </footer>
    </div>
  );
};

export default App;