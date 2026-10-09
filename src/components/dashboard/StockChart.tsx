'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3867FF" stopOpacity={1}/>
              <stop offset="95%" stopColor="#3867FF" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#252946" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#858BA8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
          />
          <YAxis stroke="#858BA8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: '#11142B' }}
            contentStyle={{ backgroundColor: '#11142B', borderColor: '#252946', color: '#F5F7FF', borderRadius: '8px' }}
            itemStyle={{ color: '#3867FF', fontWeight: 'bold' }}
          />
          <Bar 
            dataKey="stock" 
            fill="url(#colorStock)" 
            radius={[6, 6, 0, 0]} 
            barSize={36} 
            isAnimationActive={true}
            animationDuration={1500} 
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
