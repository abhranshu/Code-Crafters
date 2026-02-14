import React from 'react';
import { LayoutDashboard, ShieldCheck, PieChart, BarChart3, Settings, Leaf } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'evaluate', label: 'Evaluation Engine', icon: ShieldCheck },
    { id: 'portfolio', label: 'Green Portfolio', icon: PieChart },
    { id: 'analytics', label: 'Deep Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Setup', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-navy/80 backdrop-blur-xl border-r border-white/5 z-40 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-electricGreen to-cyberCyan rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,245,160,0.3)]">
          <Leaf className="text-navy w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-white uppercase">
          SustainScore
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-electricGreen/10 text-electricGreen shadow-inner' : 'text-slate-500 hover:text-white hover:bg-white/5'}
              `}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-electricGreen' : ''}`} />
              <span className="text-sm font-semibold">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-4 bg-electricGreen rounded-full shadow-[0_0_10px_rgba(0,245,160,0.8)] animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10" />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Enterprise User</p>
            <p className="text-[10px] text-slate-500 font-medium truncate">Tier 1 Access</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;