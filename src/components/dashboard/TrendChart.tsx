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
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#25292D" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#8A9098" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#8A9098" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dx={-10}
            domain={[0, 1200]}
            ticks={[0, 200, 400, 600, 800, 1000, 1200]}
          />
          <Tooltip 
            cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }}
            contentStyle={{ backgroundColor: '#171A1D', borderColor: '#25292D', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#3B82F6', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            activeDot={{ r: 6, fill: '#3B82F6', stroke: '#171A1D', strokeWidth: 2 }}
            style={{ filter: 'url(#glow)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
