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
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={1}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#25292D" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#8A9098" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
          />
          <YAxis stroke="#8A9098" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: '#1C2024' }}
            contentStyle={{ backgroundColor: '#171A1D', borderColor: '#25292D', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ color: '#3B82F6', fontWeight: 'bold' }}
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
