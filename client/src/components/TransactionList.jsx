
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteTransaction } from "@/lib/api";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 7;         

export default function TransactionList({ data, onRefresh, onEdit }) {
  const [page, setPage] = useState(1);

  if (!data.length) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
        No transactions yet. Start adding!
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = data.slice(start, start + ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    toast.success("Transaction deleted");
    onRefresh();
  };

  return (
    <>
      <div className="space-y-3 mt-6">
        {paginated.map((tx) => (
          <Card
            key={tx._id}
            className="w-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-md
                       border border-slate-200 dark:border-slate-700 rounded-xl
                       px-4 py-3 shadow-md hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
              {/* Amount */}
              <div className="text-lg font-semibold text-slate-800 dark:text-white min-w-[80px]">
                ₹{tx.amount}
              </div>

              {/* Description + Date */}
              <div className="flex-1 flex flex-col text-sm min-w-[150px]">
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                  {tx.description || (
                    <span className="italic text-slate-400">No description</span>
                  )}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(tx.date).toLocaleDateString()}
                </span>
              </div>

              {/* Category */}
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800
                               dark:bg-blue-800/20 dark:text-blue-300
                               min-w-[70px] text-center">
                {tx.category || "Other"}
              </span>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs px-3"
                  onClick={() => onEdit(tx)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="text-xs px-3"
                  onClick={() => handleDelete(tx._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <span className="text-sm text-slate-600 dark:text-slate-300">
            Page {page} / {totalPages}
          </span>

          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
