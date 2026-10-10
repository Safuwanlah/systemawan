'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface DataProps {
  Yearly: ChartData[];
  Monthly: ChartData[];
  Weekly: ChartData[];
}

export default function RevenueChart({ data: propData, totalValue = '$245,479' }: { data?: DataProps, totalValue?: string }) {
  const [filter, setFilter] = useState<'Yearly' | 'Monthly' | 'Weekly'>('Yearly');
  const data = propData ? propData[filter] : [
    { name: 'Jan', value: 185 },
    { name: 'Feb', value: 210 },
    { name: 'Mar', value: 198 },
    { name: 'Apr', value: 235 },
    { name: 'May', value: 220 },
    { name: 'Jun', value: 268 },
    { name: 'Jul', value: 251 },
    { name: 'Aug', value: 285 },
    { name: 'Sep', value: 302 },
    { name: 'Oct', value: 291 },
    { name: 'Nov', value: 335 },
    { name: 'Dec', value: 378 },
  ];
  return (
    <div className="bg-accent border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-foreground font-semibold text-[16px]">{filter === 'Yearly' ? 'Yearly' : filter === 'Monthly' ? 'This Month' : 'Last 7 Days'} Stats</h3>
          <p className="text-[24px] font-bold text-foreground mt-1">{totalValue}</p>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="bg-card border border-border text-muted-foreground text-[13px] rounded-md px-3 py-1.5 outline-none focus:border-[#3867FF] cursor-pointer"
        >
          <option value="Yearly">Yearly</option>
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
        </select>
      </div>

      <div className="w-full h-[280px] mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--muted-foreground)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--muted-foreground)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px', fontSize: '13px' }}
              itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
              formatter={(value: any) => [`$${value}M`, 'Revenue']}
            />
            <Area 
              type="natural" 
              dataKey="value" 
              stroke="var(--primary)" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--accent)', strokeWidth: 3 }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
