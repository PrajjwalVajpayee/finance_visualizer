import DashboardCards     from '@/components/DashboardCards';
import CategoryPieChart   from '@/components/CategoryPieChart';
import RecentTransactions from '@/components/RecentTransactions';

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Dashboard
      </h2>

      <DashboardCards />

      {/* two‑column grid: total + pie chart */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* total card now inside DashboardCards, so only pie here */}
        <CategoryPieChart />
      </div>

      {/* recent transactions full‑width */}
      <RecentTransactions />
    </main>
  );
}
