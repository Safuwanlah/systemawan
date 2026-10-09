'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
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

export default function OrdersChart() {
  return (
    <div className="bg-[#151832] border border-[#252946] rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[#F5F7FF] font-semibold text-[16px]">Sales/Revenue</h3>
        </div>
        <select className="bg-[#11142B] border border-[#252946] text-[#858BA8] text-[13px] rounded-md px-3 py-1.5 outline-none focus:border-[#3867FF] cursor-pointer">
          <option>Yearly</option>
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>

      <div className="w-full h-[280px] mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
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
              cursor={{ fill: '#11142B' }}
              contentStyle={{ backgroundColor: '#11142B', borderColor: '#252946', color: '#F5F7FF', borderRadius: '8px', fontSize: '13px' }}
              itemStyle={{ color: '#3867FF', fontWeight: 'bold' }}
              formatter={(value: any) => [`${value}`, 'Sales']}
            />
            <Bar 
              dataKey="value" 
              fill="#3867FF" 
              radius={[2, 2, 0, 0]} 
              barSize={12} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
