// src/components/RecentTransactions.jsx
import { useEffect, useState } from 'react';
import { getRecentTransactions } from '@/lib/api';
import { Card } from '@/components/ui/card';

export default function RecentTransactions() {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getRecentTransactions();   // 5 latest
      setTxns(res.data);
    })();
  }, []);

  if (!txns.length) {
    return (
      <p className="text-sm text-muted-foreground">No recent transactions.</p>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">
        Recent Transactions
      </h3>

      <div className="space-y-2">
        {txns.map((t) => (
          <Card
            key={t._id}
            /*   grid with 4 columns: amount | description | date | category   */
            className="grid grid-cols-[90px_1fr_100px_90px] items-center gap-4
                       rounded-xl border bg-white/70 dark:bg-slate-800/50
                       backdrop-blur-md border-slate-200 dark:border-slate-700
                       px-4 py-2 shadow-sm"
          >
            {/* col‑1  amount */}
            <div className="font-semibold text-rose-600 dark:text-rose-400">
              ₹{t.amount}
            </div>

            {/* col‑2  description — truncate so it never wraps */}
            <div className="truncate text-sm text-slate-700 dark:text-slate-300">
              {t.description || '—'}
            </div>

            {/* col‑3  date */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(t.date).toLocaleDateString()}
            </div>

            {/* col‑4  category badge */}
            <span className="rounded-full bg-blue-100 text-blue-800
                             dark:bg-blue-800/30 dark:text-blue-300
                             px-2 py-0.5 text-xs text-center">
              {t.category || 'Other'}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
