import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendText: string;
  isPositive: boolean;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendText, 
  isPositive,
  iconColor,
  iconBg
}: StatCardProps) {
  return (
    <div className="bg-accent rounded-xl p-6 shadow-sm border border-border relative overflow-hidden group hover:border-[#3867FF]/50 transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[14px] font-medium text-foreground">{title}</h2>
          <p className="text-[28px] font-bold text-foreground tracking-tight">{value}</p>
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
      </div>
      <div className="flex items-center text-[13px] font-medium mt-2">
        <span className={`${isPositive ? 'text-[#20C997]' : 'text-[#FF4D67]'}`}>
          {trend}
        </span>
        <span className="text-muted-foreground ml-2 font-normal">{trendText}</span>
      </div>
    </div>
  );
}
