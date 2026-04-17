import * as React from 'react';
import { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { getEvaluations } from '../services/evaluationDatabase';
import { Settings, Server, Database, Download, CheckCircle2, XCircle, Cpu, Shield } from 'lucide-react';

const SystemSetup: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [evalCount, setEvalCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            financial_features: [5000000, 5, 500000],
            renewable: 50,
            emission: 50,
            waste: 50,
          }),
        });
        if (!cancelled) setBackendStatus(res.ok ? 'ok' : 'error');
      } catch {
        if (!cancelled) setBackendStatus('error');
      }
    };
    check();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    getEvaluations(5000).then((list) => setEvalCount(list.length)).catch(() => setEvalCount(0));
  }, []);

  const handleExportJSON = async () => {
    const list = await getEvaluations(5000);
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ecocred-evaluations-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExportCSV = async () => {
    const list = await getEvaluations(5000);
    const headers = ['id', 'created_at', 'annual_revenue', 'years_in_business', 'loan_amount', 'renewable_energy_usage', 'estimated_carbon_reduction', 'waste_score', 'risk_score', 'risk_level', 'sustainability_score', 'decision'];
    const rows = list.map((e) => [
      e.id,
      e.created_at,
      e.annual_revenue,
      e.years_in_business,
      e.loan_amount,
      e.renewable_energy_usage,
      e.estimated_carbon_reduction,
      e.waste_score,
      e.risk_score,
      e.risk_level ?? '',
      e.sustainability_score,
      e.decision,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ecocred-evaluations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyberCyan/10 rounded-xl text-cyberCyan">
              <Server size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Evaluation API</p>
              <div className="flex items-center gap-2">
                {backendStatus === 'checking' && <span className="text-slate-400 text-sm">Checking…</span>}
                {backendStatus === 'ok' && <><CheckCircle2 className="w-4 h-4 text-electricGreen" /><span className="text-electricGreen text-sm font-medium">Connected</span></>}
                {backendStatus === 'error' && <><XCircle className="w-4 h-4 text-red-500" /><span className="text-red-400 text-sm font-medium">Unavailable</span></>}
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500">Backend at /api/predict (port 5000)</p>
        </GlassCard>

        <GlassCard delay={0.15}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-electricGreen/10 rounded-xl text-electricGreen">
              <Database size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Database</p>
              <p className="text-lg font-bold text-white">Supabase</p>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500">Table: loan_evaluations</p>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl text-white">
              <Cpu size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Model</p>
              <p className="text-sm font-bold text-white">Credit Default</p>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500">XGBoost / stub fallback</p>
        </GlassCard>

        <GlassCard delay={0.25}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Stored Evaluations</p>
              <p className="text-2xl font-bold text-white mono">{evalCount !== null ? evalCount : '—'}</p>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500">In database</p>
        </GlassCard>
      </div>

      <GlassCard delay={0.3}>
        <h3 className="text-lg font-bold text-white tracking-tight mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyberCyan" />
          System Insight
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          ECOCRED runs the Evaluation Engine on a Flask backend; the frontend proxies /api to port 5000. Evaluations are stored in Supabase (loan_evaluations).
          Ensure the backend is running and the database schema is applied for full functionality. Export options below let you download evaluation data for audit or external analysis.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
          >
            <Download className="w-4 h-4" />
            Export as JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-3 bg-electricGreen/10 hover:bg-electricGreen/20 border border-electricGreen/30 rounded-xl text-sm font-medium text-electricGreen transition-all"
          >
            <Download className="w-4 h-4" />
            Export as CSV
          </button>
        </div>
      </GlassCard>

      <GlassCard delay={0.35}>
        <h3 className="text-lg font-bold text-white tracking-tight mb-4">Configuration Checklist</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-3 text-slate-300">
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">1</span>
            Backend: run <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyberCyan">python app.py</code> from the backend folder (port 5000).
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">2</span>
            Supabase: run <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyberCyan">database/evaluation_engine_schema.sql</code> in the SQL Editor.
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">3</span>
            Environment: set <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyberCyan">VITE_SUPABASE_URL</code> and <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyberCyan">VITE_SUPABASE_ANON_KEY</code> in .env.local.
          </li>
        </ul>
      </GlassCard>
    </div>
  );
};

export default SystemSetup;
