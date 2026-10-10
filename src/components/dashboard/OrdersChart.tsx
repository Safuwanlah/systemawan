'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface DataProps {
  Yearly: ChartData[];
  Monthly: ChartData[];
  Weekly: ChartData[];
}

export default function OrdersChart({ data: propData }: { data?: DataProps }) {
  const [filter, setFilter] = useState<'Yearly' | 'Monthly' | 'Weekly'>('Yearly');
  const data = propData ? propData[filter] : [
    { name: 'Jan', value: 450 },
    { name: 'Feb', value: 680 },
    { name: 'Mar', value: 550 },
    { name: 'Apr', value: 620 },
    { name: 'May', value: 780 },
    { name: 'Jun', value: 600 },
    { name: 'Jul', value: 580 },
    { name: 'Aug', value: 700 },
    { name: 'Sep', value: 900 },
    { name: 'Oct', value: 850 },
    { name: 'Nov', value: 880 },
    { name: 'Dec', value: 920 },
  ];
  return (
    <div className="bg-accent border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-foreground font-semibold text-[16px]">Sales/Revenue ({filter})</h3>
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
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
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
              cursor={{ fill: 'var(--card)' }}
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px', fontSize: '13px' }}
              itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
              formatter={(value: any) => [`${value}`, 'Sales']}
            />
            <Bar 
              dataKey="value" 
              fill="var(--primary)" 
              radius={[2, 2, 0, 0]} 
              barSize={12}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
