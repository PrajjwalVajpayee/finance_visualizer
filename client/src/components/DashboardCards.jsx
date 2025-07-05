import { useEffect, useState } from 'react';
import {
  getTransactions,
  getCategorySummary,
  getRecentTransactions,
} from '@/lib/api';

const StatCard = ({ title, value }) => (
  <div className="rounded-xl border bg-white/70 dark:bg-slate-800/60 backdrop-blur p-4 shadow-sm">
    <h3 className="text-xs tracking-wide text-slate-500 dark:text-slate-400 uppercase">
      {title}
    </h3>
    <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white truncate">
      {value}
    </p>
  </div>
);

export default function DashboardCards() {
  const [total, setTotal] = useState('—');
  const [topCategory, setTopCategory] = useState('—');
  const [recent, setRecent] = useState('—');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, catRes, recentRes] = await Promise.all([
          getTransactions(),
          getCategorySummary(),
          getRecentTransactions(),
        ]);

        const allTxns   = txRes.data?.data    || txRes.data || [];
        const categories = catRes.data?.data  || catRes.data || [];
        const recents    = recentRes.data?.data || recentRes.data || [];

        /* total expenses */
        const totalSum = allTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
        setTotal(`₹${totalSum.toLocaleString()}`);

        /* top category uses `total` now */
        const top = categories.reduce(
          (prev, cur) => (cur.total > (prev.total || 0) ? cur : prev),
          {}
        );
        setTopCategory(
          top.total ? `${top.category} (₹${top.total.toLocaleString()})` : '—'
        );

        /* most recent */
        const latest = recents[0];
        setRecent(
          latest ? `₹${latest.amount} • ${latest.category || 'Other'}` : '—'
        );
      } catch (err) {
        console.error('Dashboard fetch error', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard title="Total Expenses" value={total} />
      <StatCard title="Top Category"   value={topCategory} />
      <StatCard title="Most Recent"    value={recent} />
    </div>
  );
}
