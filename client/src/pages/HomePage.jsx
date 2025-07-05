import { useEffect, useState } from 'react';
import {
  getTransactions
} from '@/lib/api';
import AddTransactionForm  from '@/components/AddTransactionForm';
import TransactionList     from '@/components/TransactionList';
import TransactionChart    from '@/components/TransactionChart';
import { Button }          from '@/components/ui/button';

export default function HomePage() {
  const [txs,   setTxs]   = useState([]);
  const [open,  setOpen]  = useState(false);
  const [edit,  setEdit]  = useState(null);

  /* fetch all */
  const refresh = () =>
    getTransactions().then(r => setTxs(r.data.data));

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getTransactions();
      setTxs(res.data.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  fetchData(); // Call the async function
}, []);


  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Transactions</h2>
        <Button onClick={() => { setOpen(true); setEdit(null); }}>
          Add Transaction +
        </Button>
      </div>

      {/* conditional form */}
      {open && (
        <AddTransactionForm
          edit={edit}
          onSaved={refresh}
          onClose={() => { setOpen(false); setEdit(null); }}
        />
      )}

      {/* list */}
      <TransactionList
        data={txs}
        onRefresh={refresh}
        onEdit={(tx) => { setEdit(tx); setOpen(true); }}
      />

      {/* chart */}
      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">
          Monthly Expense Overview
        </h2>
        <div className="rounded-md border bg-white/70
                        dark:bg-slate-800/50 backdrop-blur p-4 shadow">
          <TransactionChart />
        </div>
      </section>
    </main>
  );
}
