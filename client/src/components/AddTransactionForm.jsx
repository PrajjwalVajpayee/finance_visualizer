import { useEffect, useState } from 'react';
import {
  
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from '@/components/ui/select'; 
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'               // adjust imports if you split
import { toast }       from 'sonner';
import {
  createTransaction, updateTransaction, getCategories
} from '@/lib/api';

const EMPTY = { amount: '', date: '', description: '', category: '' };

export default function AddTransactionForm({ edit = null, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);

  /* fetch categories once */
  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data.data))
      .catch(()   => setCategories(['Food','Travel','Shopping','Bills','Other']));
  }, []);

  /* if edit mode, pre‑fill */
  useEffect(() => {
    if (edit) {
      setForm({
        ...edit,
        date: edit.date.slice(0, 10)   // ISO → yyyy‑mm‑dd
      });
    } else {
      setForm(EMPTY);
    }
  }, [edit]);

  /* handlers */
  const handleChange = (k) => (e) =>
    setForm(prev => ({ ...prev, [k]: e.target?.value ?? e }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (edit) {
        await updateTransaction(edit._id, form);
        toast.success('Transaction updated');
      } else {
        await createTransaction(form);
        toast.success('Transaction added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    }
  };

  /* UI */
  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-md border bg-white/70
                 dark:bg-slate-800/50 backdrop-blur p-6 shadow"
    >
      <Input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange('amount')}
        required
      />
      <Input
        type="date"
        value={form.date}
        onChange={handleChange('date')}
        required
      />
      <Input
        placeholder="Description"
        value={form.description}
        onChange={handleChange('description')}
      />
      <Select value={form.category} onValueChange={handleChange('category')}>
        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
        <SelectContent>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button>{edit ? 'Update' : 'Add'}</Button>
      </div>
    </form>
  );
}
