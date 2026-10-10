'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
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

export default function RevenueChart() {
  return (
    <div className="bg-accent border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-foreground font-semibold text-[16px]">Yearly Stats</h3>
          <p className="text-[24px] font-bold text-foreground mt-1">$245,479</p>
        </div>
        <select className="bg-card border border-border text-muted-foreground text-[13px] rounded-md px-3 py-1.5 outline-none focus:border-[#3867FF] cursor-pointer">
          <option>Yearly</option>
          <option>Monthly</option>
          <option>Weekly</option>
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
                <stop offset="5%" stopColor="#3867FF" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3867FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252946" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#858BA8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#858BA8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              cursor={{ stroke: '#3867FF', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ backgroundColor: '#11142B', borderColor: '#252946', color: '#F5F7FF', borderRadius: '8px', fontSize: '13px' }}
              itemStyle={{ color: '#3867FF', fontWeight: 'bold' }}
              formatter={(value: any) => [`$${value}M`, 'Revenue']}
            />
            <Area 
              type="natural" 
              dataKey="value" 
              stroke="#3867FF" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, fill: '#3867FF', stroke: '#151832', strokeWidth: 3 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
