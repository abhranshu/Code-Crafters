
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { FinancialData, SustainabilityData, LoanEvaluationResult } from '../types';
import { evaluateLoan } from '../services/geminiService';
// Added missing Leaf import
import { AlertCircle, Zap, TrendingUp, Info, Leaf } from 'lucide-react';

const EvaluateLoan: React.FC<{ onComplete: (res: LoanEvaluationResult) => void }> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [financial, setFinancial] = useState<FinancialData>({
    annualRevenue: 5000000,
    creditScore: 720,
    existingDebt: 1200000,
    yearsInBusiness: 8,
  });

  const [sustainability, setSustainability] = useState<SustainabilityData>({
    renewableEnergyUsage: 45,
    estimatedCarbonReduction: 250,
    esgComplianceScore: 68,
    wasteManagement: 'B-Advanced',
  });

  const handleRunAI = async () => {
    setLoading(true);
    // Artifical delay for "Neural Sphere" effect to be felt
    setTimeout(async () => {
      const result = await evaluateLoan(financial, sustainability);
      setLoading(false);
      onComplete(result);
    }, 3000);
  };

  const InputField = ({ label, value, onChange, icon: Icon, suffix = '' }: any) => (
    <div className="relative group mb-6">
      <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold group-focus-within:text-electricGreen transition-colors">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-navy/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-electricGreen/50 focus:ring-1 focus:ring-electricGreen/20 transition-all mono"
        />
        <div className="absolute right-4 text-slate-500 text-sm mono">{suffix}</div>
      </div>
      <div className="h-[1px] w-0 bg-electricGreen group-focus-within:w-full transition-all duration-500 mt-1" />
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative w-48 h-48 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-electricGreen/20 animate-ping" />
          <div className="absolute inset-4 rounded-full border-2 border-cyberCyan/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 border-b-2 border-electricGreen rounded-full animate-spin" />
          </div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-electricGreen w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Activating AI Risk Engine</h2>
        <p className="text-slate-400 animate-pulse">Scanning global sustainability benchmarks & financial patterns...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-cyberCyan w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Financial Intelligence</h2>
          </div>
          
          <InputField 
            label="Annual Revenue" 
            value={financial.annualRevenue} 
            onChange={(v: number) => setFinancial(p => ({ ...p, annualRevenue: v }))}
            suffix="$"
          />
          <InputField 
            label="Credit Score" 
            value={financial.creditScore} 
            onChange={(v: number) => setFinancial(p => ({ ...p, creditScore: v }))}
          />
          <InputField 
            label="Existing Debt" 
            value={financial.existingDebt} 
            onChange={(v: number) => setFinancial(p => ({ ...p, existingDebt: v }))}
            suffix="$"
          />
          <InputField 
            label="Years in Business" 
            value={financial.yearsInBusiness} 
            onChange={(v: number) => setFinancial(p => ({ ...p, yearsInBusiness: v }))}
            suffix="YRS"
          />

          <div className="p-4 bg-cyberCyan/5 rounded-xl border border-cyberCyan/20 flex gap-3 mt-6">
            <Info className="w-5 h-5 text-cyberCyan shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Financial indicators are weighed against regional industry averages to determine liquidity risk.
            </p>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3 mb-8">
            <Leaf className="text-electricGreen w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Sustainability Impact Metrics</h2>
          </div>

          <div className="mb-6">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-4 block font-bold">
              Renewable Energy Usage ({sustainability.renewableEnergyUsage}%)
            </label>
            <input 
              type="range" min="0" max="100" 
              value={sustainability.renewableEnergyUsage}
              onChange={(e) => setSustainability(p => ({ ...p, renewableEnergyUsage: Number(e.target.value) }))}
              className="w-full accent-electricGreen h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <InputField 
            label="Carbon Reduction Estimate" 
            value={sustainability.estimatedCarbonReduction} 
            onChange={(v: number) => setSustainability(p => ({ ...p, estimatedCarbonReduction: v }))}
            suffix="TONS/YR"
          />

          <div className="mb-8">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-4 block font-bold">
              ESG Compliance Score ({sustainability.esgComplianceScore}/100)
            </label>
            <input 
              type="range" min="0" max="100" 
              value={sustainability.esgComplianceScore}
              onChange={(e) => setSustainability(p => ({ ...p, esgComplianceScore: Number(e.target.value) }))}
              className="w-full accent-cyberCyan h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="relative group">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 block font-bold">
              Waste Management Category
            </label>
            <select 
              value={sustainability.wasteManagement}
              onChange={(e) => setSustainability(p => ({ ...p, wasteManagement: e.target.value }))}
              className="w-full bg-navy/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-electricGreen/50 focus:ring-1 focus:ring-electricGreen/20 transition-all cursor-pointer"
            >
              <option value="A-Elite">A-Elite (Zero Waste)</option>
              <option value="B-Advanced">B-Advanced (Recycling Focus)</option>
              <option value="C-Standard">C-Standard (Compliance Only)</option>
              <option value="D-Basic">D-Basic (Minimal Controls)</option>
            </select>
          </div>

          <div className="p-4 bg-electricGreen/5 rounded-xl border border-electricGreen/20 flex gap-3 mt-10">
            <AlertCircle className="w-5 h-5 text-electricGreen shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Higher ESG scores can unlock "Impact Discounts" reducing effective interest rates by up to 125bps.
            </p>
          </div>
        </GlassCard>
      </div>

      <div className="flex justify-center mt-12 pb-20">
        <button
          onClick={handleRunAI}
          className="group relative px-12 py-4 rounded-full bg-gradient-to-r from-electricGreen to-cyberCyan text-navy font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,245,160,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Run AI Evaluation <Zap className="w-5 h-5 fill-navy" />
          </span>
          <div className="absolute inset-0 bg-white/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        </button>
      </div>
    </div>
  );
};

export default EvaluateLoan;
