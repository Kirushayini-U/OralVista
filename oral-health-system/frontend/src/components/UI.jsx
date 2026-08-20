import React from 'react';

export function StatCard({ icon: Icon, label, value, delta }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-bold text-ink">{value}</p>
        {delta && <p className="text-[11px] text-brand-600 font-medium">{delta}</p>}
      </div>
    </div>
  );
}

export function SectionCard({ title, action, children, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="font-semibold text-ink text-sm">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Badge({ status }) {
  const map = {
    Active: 'bg-emerald-50 text-emerald-600',
    Blocked: 'bg-red-50 text-red-500',
    Pending: 'bg-amber-50 text-amber-600',
    Sent: 'bg-emerald-50 text-emerald-600',
    Draft: 'bg-slate-100 text-slate-500',
    Scheduled: 'bg-blue-50 text-blue-600',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  );
}

export function MiniBarChart({ data, labels, color = '#279791', height = 140 }) {
  const max = Math.max(...data) || 1;
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md transition-all"
            style={{ height: `${(v / max) * (height - 24)}px`, backgroundColor: color, opacity: 0.85 }}
          />
          <span className="text-[11px] text-slate-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function MiniLineChart({ data, color = '#279791', height = 140 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 300;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 20) - 10}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const [x, y] = points.split(' ')[i].split(',');
        return <circle key={i} cx={x} cy={y} r="3.5" fill={color} />;
      })}
    </svg>
  );
}

export function DonutChart({ segments, size = 140 }) {
  const total = segments.reduce((s, seg) => s + seg.percent, 0);
  let cumulative = 0;
  const radius = size / 2;
  const stroke = 18;
  const r = radius - stroke / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const dash = (seg.percent / total) * circumference;
        const offset = (cumulative / total) * circumference;
        cumulative += seg.percent;
        return (
          <circle
            key={i}
            cx={radius}
            cy={radius}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        );
      })}
    </svg>
  );
}
