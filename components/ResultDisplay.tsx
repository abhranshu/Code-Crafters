import * as React from 'react';
import { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import { LoanEvaluationResult } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Leaf, ChevronRight, TrendingUp, Download, Loader2, BarChart3, Zap, Droplets, Recycle } from 'lucide-react';

const ResultDisplay: React.FC<{ result: LoanEvaluationResult; onReset: () => void }> = ({ result, onReset }) => {
  const [riskCounter, setRiskCounter] = useState(0);
  const [greenCounter, setGreenCounter] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const riskInterval = setInterval(() => {
      setRiskCounter(prev => prev < result.riskScore ? prev + 1 : result.riskScore);
    }, 20);
    const greenInterval = setInterval(() => {
      setGreenCounter(prev => prev < result.sustainabilityScore ? prev + 1 : result.sustainabilityScore);
    }, 20);
    return () => {
      clearInterval(riskInterval);
      clearInterval(greenInterval);
    };
  }, [result]);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('ECOCRED Intelligence Report has been generated and scheduled for secure delivery to your registered corporate endpoint.');
    }, 2000);
  };

  const decisionStyles = {
    'Approved': {
      icon: CheckCircle2,
      color: 'text-electricGreen',
      bg: 'bg-electricGreen/10',
      border: 'border-electricGreen/50',
      glow: 'shadow-[0_0_30px_rgba(0,245,160,0.4)]'
    },
    'Under Review': {
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/50',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]'
    },
    'Rejected': {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]'
    }
  };

  const style = decisionStyles[result.decision];
  const DecisionIcon = style.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-1000 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard delay={0.1} className="flex flex-col items-center text-center">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Default Probability</h3>
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
              <circle
                cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8"
                className="text-cyberCyan transition-all duration-1000 ease-out"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * riskCounter) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold mono">{result.riskScore}%</span>
            </div>
          </div>
          <p className="text-slate-300 text-sm">Risk Level: <span className="text-cyberCyan">{result.riskLevel || (result.riskScore < 30 ? 'Low' : result.riskScore < 60 ? 'Medium' : 'High')}</span></p>
        </GlassCard>

        <GlassCard delay={0.2} className="flex flex-col items-center text-center">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Sustainability Strength</h3>
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
              <circle
                cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8"
                className="text-electricGreen transition-all duration-1000 ease-out"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * greenCounter) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="text-electricGreen w-10 h-10 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-300 text-sm">Green Score: <span className="text-electricGreen font-bold mono">{greenCounter}</span></p>
        </GlassCard>

        <GlassCard delay={0.3} className={`flex flex-col items-center justify-center border-2 ${style.border} ${style.glow} ${style.bg}`}>
          <DecisionIcon className={`w-16 h-16 ${style.color} mb-4`} />
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Final Decision</h3>
          <h2 className={`text-4xl font-black uppercase tracking-tighter ${style.color}`}>
            {result.decision}
          </h2>
          {result.exactDecision && result.exactDecision !== result.decision && (
            <p className={`text-sm font-bold mt-2 ${style.color} opacity-80 uppercase tracking-widest`}>
              ({result.exactDecision})
            </p>
          )}
        </GlassCard>
      </div>

      <GlassCard delay={0.4}>
        <div className="flex items-start gap-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <ShieldCheck className="w-10 h-10 text-cyberCyan" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-3">AI Reasoning Engine Output</h3>
            <p className="text-slate-400 leading-relaxed text-lg italic">
              "{result.aiExplanation}"
            </p>
          </div>
        </div>
      </GlassCard>

      {result.analysis && (
        <GlassCard delay={0.35}>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyberCyan" />
            Data Analysis
          </h3>
          <p className="text-slate-300 text-sm mb-6">{result.analysis.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-cyberCyan/5 rounded-xl border border-cyberCyan/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-electricGreen" />
                <span className="text-xs font-bold uppercase text-slate-400">Renewable (40%)</span>
              </div>
              <p className="text-2xl font-bold text-white">{result.analysis.green_breakdown.renewable_usage}%</p>
              <p className="text-slate-500 text-xs mt-1">Contribution: +{result.analysis.green_breakdown.renewable_contribution} pts</p>
            </div>
            <div className="p-4 bg-cyberCyan/5 rounded-xl border border-cyberCyan/20">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-cyberCyan" />
                <span className="text-xs font-bold uppercase text-slate-400">Emission (40%)</span>
              </div>
              <p className="text-2xl font-bold text-white">{result.analysis.green_breakdown.emission_reduction}%</p>
              <p className="text-slate-500 text-xs mt-1">Contribution: +{result.analysis.green_breakdown.emission_contribution} pts</p>
            </div>
            <div className="p-4 bg-cyberCyan/5 rounded-xl border border-cyberCyan/20">
              <div className="flex items-center gap-2 mb-2">
                <Recycle className="w-4 h-4 text-electricGreen" />
                <span className="text-xs font-bold uppercase text-slate-400">Waste (20%)</span>
              </div>
              <p className="text-2xl font-bold text-white">{result.analysis.green_breakdown.waste_management}%</p>
              <p className="text-slate-500 text-xs mt-1">Contribution: +{result.analysis.green_breakdown.waste_contribution} pts</p>
            </div>
          </div>
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs font-bold uppercase text-slate-500 mb-2">Risk & decision drivers</p>
            <ul className="space-y-1.5 text-slate-300 text-sm">
              {result.analysis.risk_drivers.map((driver, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyberCyan mt-0.5">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard delay={0.5}>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-electricGreen w-5 h-5" />
            Recommended Improvements
          </h3>
          <div className="space-y-4">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-colors hover:border-white/20">
                <div className="w-6 h-6 rounded-full bg-electricGreen/20 flex items-center justify-center text-electricGreen text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-slate-300 text-sm">{rec}</p>
                <ChevronRight className="w-4 h-4 text-slate-500 ml-auto" />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.6}>
          <h3 className="text-lg font-bold text-white mb-6">Risk vs Sustainability Ratio</h3>
          <div className="h-48 flex items-end justify-around px-8">
            <div className="w-12 bg-cyberCyan/40 rounded-t-lg transition-all duration-1000" style={{ height: `${result.riskScore}%` }}>
              <div className="h-full w-full flex items-center justify-center -rotate-90 text-[10px] font-bold text-cyberCyan">RISK</div>
            </div>
            <div className="w-12 bg-electricGreen/40 rounded-t-lg transition-all duration-1000" style={{ height: `${result.sustainabilityScore}%` }}>
              <div className="h-full w-full flex items-center justify-center -rotate-90 text-[10px] font-bold text-electricGreen">SUSTAIN</div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <button
              onClick={onReset}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              Evaluate Another
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`px-8 py-3 rounded-full font-bold transition-all text-sm flex items-center justify-center gap-2 ${isDownloading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-electricGreen text-navy hover:scale-105 active:scale-95'
                }`}
            >
              {isDownloading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Finalizing Report...</>
              ) : (
                <><Download className="w-4 h-4" /> Download Full PDF</>
              )}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ResultDisplay;