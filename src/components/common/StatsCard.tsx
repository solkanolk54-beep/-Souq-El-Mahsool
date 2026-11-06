import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: 'emerald' | 'amber' | 'gold' | 'blue' | 'red';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'emerald'
}) => {
  const accentBorder = {
    emerald: 'border-emerald-500/25 hover:border-emerald-500/50',
    amber: 'border-amber-500/25 hover:border-amber-500/50',
    gold: 'border-yellow-400/30 hover:border-yellow-400/60',
    blue: 'border-cyan-500/25 hover:border-cyan-500/50',
    red: 'border-red-500/25 hover:border-red-500/50',
  }[accentColor];

  const iconBg = {
    emerald: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
    gold: 'bg-yellow-950/80 text-yellow-300 border-yellow-400/40',
    blue: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/30',
    red: 'bg-red-950/80 text-red-400 border-red-500/30',
  }[accentColor];

  return (
    <div className={`glass-card p-5 rounded-2xl border transition-all duration-300 shadow-xl ${accentBorder}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${iconBg} shadow-inner`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs">
          <span className={`font-bold flex items-center gap-1 ${trend.isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
            <span>{trend.value}</span>
          </span>
          {trend.label && (
            <span className="text-[11px] text-slate-400">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
};
