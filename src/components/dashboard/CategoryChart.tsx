'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CategoryChart({ data }: { data: { name: string, value: number }[] }) {
  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#14B8A6', '#6366F1'];

  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{ backgroundColor: '#171A1D', borderColor: '#25292D', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#A7ADB4' }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
