import * as React from 'react';
import { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { getEvaluations, type EvaluationRecord } from '../services/evaluationDatabase';
import { BarChart3, Activity, Target, ArrowUpRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const DeepAnalytics: React.FC = () => {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvaluations(200).then(setEvaluations).finally(() => setLoading(false));
  }, []);

  const byDecision = evaluations.reduce((acc, e) => {
    acc[e.decision] = (acc[e.decision] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskBucketsFixed = [
    { range: '0-20', count: evaluations.filter((e) => e.risk_score >= 0 && e.risk_score <= 20).length },
    { range: '21-40', count: evaluations.filter((e) => e.risk_score > 20 && e.risk_score <= 40).length },
    { range: '41-60', count: evaluations.filter((e) => e.risk_score > 40 && e.risk_score <= 60).length },
    { range: '61-80', count: evaluations.filter((e) => e.risk_score > 60 && e.risk_score <= 80).length },
    { range: '81-100', count: evaluations.filter((e) => e.risk_score > 80).length },
  ];

  const greenBuckets = [
    { range: '0-25', count: evaluations.filter((e) => e.sustainability_score >= 0 && e.sustainability_score <= 25).length },
    { range: '26-50', count: evaluations.filter((e) => e.sustainability_score > 25 && e.sustainability_score <= 50).length },
    { range: '51-75', count: evaluations.filter((e) => e.sustainability_score > 50 && e.sustainability_score <= 75).length },
    { range: '76-100', count: evaluations.filter((e) => e.sustainability_score > 75).length },
  ];

  const byMonth = React.useMemo(() => {
    const map: Record<string, { approved: number; rejected: number; review: number; total: number }> = {};
    evaluations.forEach((e) => {
      const d = new Date(e.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { approved: 0, rejected: 0, review: 0, total: 0 };
      map[key].total++;
      if (e.decision === 'Approved') map[key].approved++;
      else if (e.decision === 'Rejected') map[key].rejected++;
      else map[key].review++;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, v]) => ({ month, ...v }));
  }, [evaluations]);

  const avgRisk = evaluations.length ? (evaluations.reduce((s, e) => s + e.risk_score, 0) / evaluations.length).toFixed(1) : '—';
  const avgGreen = evaluations.length ? (evaluations.reduce((s, e) => s + e.sustainability_score, 0) / evaluations.length).toFixed(1) : '—';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyberCyan/10 rounded-xl text-cyberCyan">
              <BarChart3 size={22} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Runs</p>
              <p className="text-2xl font-bold text-white mono">{evaluations.length}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Avg Risk Score</p>
              <p className="text-2xl font-bold text-white mono">{avgRisk}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-electricGreen/10 rounded-xl text-electricGreen">
              <Target size={22} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Avg Green Score</p>
              <p className="text-2xl font-bold text-white mono">{avgGreen}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.25}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl text-white">
              <ArrowUpRight size={22} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Approval Rate</p>
              <p className="text-2xl font-bold text-white mono">
                {evaluations.length ? ((byDecision['Approved'] || 0) / evaluations.length * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard delay={0.3}>
          <h3 className="text-lg font-bold text-white tracking-tight mb-6">Risk Score Distribution</h3>
          {loading ? (
            <div className="h-[260px] flex items-center justify-center"><div className="w-8 h-8 border-2 border-cyberCyan/40 border-t-cyberCyan rounded-full animate-spin" /></div>
          ) : (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskBucketsFixed} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="range" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#00D9FF" radius={[4, 4, 0, 0]} name="Evaluations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-slate-500 text-xs mt-2">Insight: concentration in lower buckets indicates healthier default probability distribution.</p>
        </GlassCard>

        <GlassCard delay={0.35}>
          <h3 className="text-lg font-bold text-white tracking-tight mb-6">Green Score Distribution</h3>
          {loading ? (
            <div className="h-[260px] flex items-center justify-center"><div className="w-8 h-8 border-2 border-electricGreen/40 border-t-electricGreen rounded-full animate-spin" /></div>
          ) : (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={greenBuckets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="range" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#00F5A0" radius={[4, 4, 0, 0]} name="Evaluations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-slate-500 text-xs mt-2">Insight: shift toward 76–100 range signals stronger ESG alignment in the pipeline.</p>
        </GlassCard>
      </div>

      <GlassCard delay={0.4}>
        <h3 className="text-lg font-bold text-white tracking-tight mb-6">Trend: Decisions Over Time</h3>
        {loading || byMonth.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">
            {loading ? <div className="w-8 h-8 border-2 border-electricGreen/40 border-t-electricGreen rounded-full animate-spin" /> : 'Run evaluations to see trends by month.'}
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="approved" stroke="#00F5A0" strokeWidth={2} dot={{ fill: '#00F5A0' }} name="Approved" />
                <Line type="monotone" dataKey="review" stroke="#FBBF24" strokeWidth={2} dot={{ fill: '#FBBF24' }} name="Under Review" />
                <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} name="Rejected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="text-slate-500 text-xs mt-2">Deep analytics: track how approval and review volumes evolve to tune thresholds and policy.</p>
      </GlassCard>

      <GlassCard delay={0.45}>
        <h3 className="text-lg font-bold text-white tracking-tight mb-4">Analytics Insight</h3>
        <div className="p-4 bg-cyberCyan/5 rounded-xl border border-cyberCyan/20">
          <p className="text-slate-300 text-sm leading-relaxed">
            Risk score distribution shows where your evaluated applications sit on default probability. Green score distribution reflects sustainability strength. 
            Use <strong className="text-cyberCyan">trends over time</strong> to spot seasonal patterns or the impact of policy changes. A rising approval rate with stable or improving average green score indicates a healthy, ESG-aligned pipeline.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default DeepAnalytics;
