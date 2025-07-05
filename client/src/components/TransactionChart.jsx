import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getMonthlySummary } from '@/lib/api';

const COLORS = [
  '#0ea5e9','#10b981','#facc15',
  '#f87171','#a78bfa','#fb923c'
];

export default function TransactionChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMonthlySummary().then(res => setData(res.data.data));
  }, []);

  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];

  const chartData = data.map((d,i)=>({ name: months[i], total: d.total }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip />
        <Bar dataKey="total" radius={[4,4,0,0]}>
          {chartData.map((_,i)=>
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
