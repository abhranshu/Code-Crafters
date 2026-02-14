import React from 'react';
import GlassCard from './GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Leaf, ShieldAlert } from 'lucide-react';

const data = [
  { name: 'Jan', value: 4000, green: 2400 },
  { name: 'Feb', value: 3000, green: 1398 },
  { name: 'Mar', value: 2000, green: 6800 },
  { name: 'Apr', value: 2780, green: 3908 },
  { name: 'May', value: 1890, green: 4800 },
  { name: 'Jun', value: 2390, green: 5800 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyberCyan/10 rounded-xl text-cyberCyan">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Evaluated</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter mono">1,284</h4>
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-electricGreen">
            <span className="mr-1">↑ 12.4%</span>
            <span className="text-slate-600">vs prev period</span>
          </div>
        </GlassCard>

        <GlassCard delay={0.15}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-electricGreen/10 rounded-xl text-electricGreen">
              <Leaf size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Avg Eco Score</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter mono">74.2</h4>
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-electricGreen">
            <span className="mr-1">↑ 3.5</span>
            <span className="text-slate-600">score delta</span>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pending Review</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter mono">42</h4>
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-500/60">
            <span className="mr-1">! 8</span>
            <span className="text-slate-600">Critical cases</span>
          </div>
        </GlassCard>

        <GlassCard delay={0.25}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl text-white">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Partners</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter mono">12</h4>
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-electricGreen">
            <span className="mr-1">NEW 2</span>
            <span className="text-slate-600">Active funds</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard delay={0.3} className="lg:col-span-2 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white tracking-tight">Institutional Impact Growth</h3>
            <select className="bg-navy border border-white/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg text-slate-400 outline-none hover:border-electricGreen/30 transition-all cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00F5A0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00F5A0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="green" stroke="#00F5A0" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard delay={0.4}>
          <h3 className="text-lg font-bold text-white tracking-tight mb-8">Sector Risk Matrix</h3>
          <div className="space-y-6">
            {[
              { label: 'Energy Grid', val: 78, color: 'bg-electricGreen' },
              { label: 'Renewable Mfg', val: 45, color: 'bg-cyberCyan' },
              { label: 'Precision Agri', val: 92, color: 'bg-electricGreen' },
              { label: 'Bio-Logistics', val: 32, color: 'bg-amber-500' },
              { label: 'Green Infra', val: 61, color: 'bg-cyberCyan' },
            ].map((sector) => (
              <div key={sector.label}>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-slate-500">{sector.label}</span>
                  <span className="text-white mono">{sector.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${sector.color} rounded-full transition-all duration-1000`} 
                    style={{ width: `${sector.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-all">
              View Detailed Matrix
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;