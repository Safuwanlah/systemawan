'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 250 },
  { name: 'Feb', value: 400 },
  { name: 'Mar', value: 300 },
  { name: 'Apr', value: 500 },
  { name: 'May', value: 650 },
  { name: 'Jun', value: 550 },
  { name: 'Jul', value: 600 },
  { name: 'Aug', value: 350 },
  { name: 'Sep', value: 550 },
  { name: 'Oct', value: 500 },
  { name: 'Nov', value: 700 },
  { name: 'Dec', value: 900 },
];

export default function TrendChart() {
  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
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
            domain={[0, 1200]}
            ticks={[0, 200, 400, 600, 800, 1000, 1200]}
          />
          <Tooltip 
            cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '5 5' }}
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
          />
          <Area 
            type="natural" 
            dataKey="value" 
            stroke="var(--primary)" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 3 }}
            style={{ filter: 'url(#glow)' }}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
