import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <div 
      className={`
        bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 
        shadow-xl transition-all duration-500 hover:border-electricGreen/30 
        hover:bg-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700
        ${className}
      `}
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
};

export default GlassCard;