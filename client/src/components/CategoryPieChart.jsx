import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getCategorySummary } from '@/lib/api';

const COLORS = [
  '#6366F1','#10B981','#F59E0B','#EF4444',
  '#06B6D4','#A855F7','#F97316','#14B8A6'
];

export default function CategoryPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getCategorySummary();
      /* map total -> totalAmount for chart’s dataKey */
      const mapped = res.data.data.map(d => ({
        category: d.category,
        total:    d.total   // keep same key
      }));
      setData(mapped);
    })();
  }, []);

  if (!data.length) return null;

  return (
    <div className="rounded-xl border bg-white/70 dark:bg-slate-800/60 backdrop-blur p-4 shadow">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
        Expenses by Category
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ category }) => category}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
