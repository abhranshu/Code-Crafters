import * as React from 'react';
import { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { getEvaluations, type EvaluationRecord } from '../services/evaluationDatabase';
import { PieChart, Leaf, TrendingUp, CheckCircle2, AlertTriangle, XCircle, Recycle, Zap } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#00F5A0', '#00D9FF', '#FBBF24', '#EF4444'];

const GreenPortfolio: React.FC = () => {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvaluations(100).then(setEvaluations).finally(() => setLoading(false));
  }, []);

  const approved = evaluations.filter((e) => e.decision === 'Approved').length;
  const underReview = evaluations.filter((e) => e.decision === 'Under Review').length;
  const rejected = evaluations.filter((e) => e.decision === 'Rejected').length;
  const avgGreen = evaluations.length
    ? Math.round(evaluations.reduce((s, e) => s + e.sustainability_score, 0) / evaluations.length)
    : 0;
  const totalExposure = evaluations.reduce((s, e) => s + Number(e.loan_amount || 0), 0);

  const pieData = [
    { name: 'Approved', value: approved, color: COLORS[0] },
    { name: 'Under Review', value: underReview, color: COLORS[1] },
    { name: 'Rejected', value: rejected, color: COLORS[2] },
  ].filter((d) => d.value > 0);
  if (pieData.length === 0) pieData.push({ name: 'No data yet', value: 1, color: '#475569' });

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const formatMoney = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : `$${n}`);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-electricGreen/10 rounded-xl text-electricGreen">
              <Leaf size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Portfolio Positions</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter mono">{evaluations.length}</h4>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500">Evaluations in your green portfolio</p>
        </GlassCard>

        <GlassCard delay={0.15}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyberCyan/10 rounded-xl text-cyberCyan">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Avg Green Score</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter mono">{avgGreen}</h4>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500">Sustainability strength across positions</p>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-electricGreen/10 rounded-xl text-electricGreen">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Approved</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter mono">{approved}</h4>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500">Green-lighted for deployment</p>
        </GlassCard>

        <GlassCard delay={0.25}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl text-white">
              <Recycle size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Exposure</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter mono">{formatMoney(totalExposure)}</h4>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500">Cumulative loan amount evaluated</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard delay={0.3} className="lg:col-span-1">
          <h3 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-electricGreen" />
            Decision Mix
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(value: number) => [value, 'Count']}
                />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <p className="text-slate-500 text-xs mt-2">Portfolio insight: balance approved vs review helps manage capital allocation.</p>
        </GlassCard>

        <GlassCard delay={0.35} className="lg:col-span-2">
          <h3 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyberCyan" />
            Portfolio Insight
          </h3>
          <div className="p-4 bg-electricGreen/5 rounded-xl border border-electricGreen/20 mb-6">
            <p className="text-slate-300 text-sm leading-relaxed">
              Your green portfolio aggregates all evaluations run through the Engine. Each position reflects a loan application assessed on financial and ESG metrics. 
              <strong className="text-electricGreen"> Higher average green scores</strong> indicate stronger sustainability alignment across the book. Use the decision mix to track approval rates and adjust risk appetite; approved positions are ready for deployment while under-review cases may need collateral or re-evaluation.
            </p>
          </div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recent positions</h4>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-electricGreen/40 border-t-electricGreen rounded-full animate-spin" />
            </div>
          ) : evaluations.length === 0 ? (
            <p className="text-slate-500 text-sm py-8">Run evaluations from the Evaluation Engine to see positions here.</p>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {evaluations.slice(0, 12).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {e.decision === 'Approved' && <CheckCircle2 className="w-4 h-4 text-electricGreen shrink-0" />}
                    {e.decision === 'Under Review' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                    {e.decision === 'Rejected' && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-white">{formatMoney(Number(e.loan_amount))} · {e.risk_level || '—'}</p>
                      <p className="text-[10px] text-slate-500">{formatDate(e.created_at)} · Green {e.sustainability_score}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${e.decision === 'Approved' ? 'bg-electricGreen/20 text-electricGreen' : e.decision === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {e.decision}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default GreenPortfolio;
