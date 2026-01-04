
import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Edit2, Wallet } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseManagerProps {
  expenses: Expense[];
  onAdd: (exp: Expense) => void;
  onEdit: (exp: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({ expenses, onAdd, onEdit, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Expense>>({
    title: '',
    category: 'Logistik',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const categories = ['Logistik', 'Transportasi', 'Fee Guide/Porter', 'Tiket Masuk', 'P3K', 'Marketing', 'Lainnya'];

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Logistik',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.amount) {
      const expenseData: Expense = {
        id: editingId || crypto.randomUUID(),
        title: formData.title,
        category: formData.category || 'General',
        amount: Number(formData.amount),
        date: formData.date || new Date().toISOString().split('T')[0],
        notes: formData.notes
      };

      if (editingId) {
        onEdit(expenseData);
      } else {
        onAdd(expenseData);
      }
      resetForm();
    }
  };

  const handleEditClick = (exp: Expense) => {
    setFormData({
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      date: exp.date,
      notes: exp.notes
    });
    setEditingId(exp.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputClass = "w-full p-3 rounded-xl glass-input outline-none text-sm transition-all text-slate-900 dark:text-white font-bold";
  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 ml-1";

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase italic leading-none">
            Operational <span className="text-emerald-500">Ledger</span>
          </h2>
          <p className="text-slate-400 mt-2 font-bold text-xs tracking-widest uppercase">Trip expenditure monitoring</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            title={isAdding ? 'Batal Tambah Data' : 'Tambah Catatan Pengeluaran Baru'}
            className={`flex-1 md:flex-none px-6 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95 text-[10px] uppercase tracking-widest shadow-lg ${isAdding ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-emerald-600 text-white shadow-emerald-600/10'
              }`}
          >
            {isAdding ? <X size={16} /> : <Plus size={16} />}
            {isAdding ? 'Cancel' : 'Add Expense'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="glass p-8 rounded-[32px] border border-white/20 shadow-sm animate-fade-in relative overflow-hidden">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className={labelClass}>Description / Merchant</label>
              <input className={inputClass} placeholder="e.g. Sewa Hiace Keberangkatan" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div>
              <label className={labelClass}>Classification</label>
              <select className={inputClass} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Amount (IDR)</label>
              <input type="number" className={inputClass} value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })} required />
            </div>
            <div>
              <label className={labelClass}>Transaction Date</label>
              <input type="date" className={inputClass} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
            </div>
            <div className="lg:col-span-3">
              <label className={labelClass}>Internal Notes (Optional)</label>
              <input className={inputClass} placeholder="Add more details..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/10 active:scale-95" title="Simpan Catatan Pengeluaran ke Sistem">
                <Save size={16} />
                {editingId ? 'Update Entry' : 'Post Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-[32px] border border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-emerald-400/60 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-emerald-400/60 uppercase tracking-widest">Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-emerald-400/60 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-emerald-400/60 uppercase tracking-widest text-right">Amount</th>
                <th className="px-8 py-5 text-right w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/10">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic text-sm font-medium">No financial records found in the ledger.</td>
                </tr>
              ) : (
                expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exp => (
                  <tr key={exp.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition group">
                    <td className="px-8 py-6 text-xs font-bold text-slate-400 font-mono">{exp.date}</td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900 dark:text-slate-200 uppercase tracking-tight italic group-hover:text-emerald-600 transition-colors">{exp.title}</p>
                      {exp.notes && <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-widest">{exp.notes}</p>}
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/5">{exp.category}</span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      Rp {exp.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(exp)} title="Ubah Catatan Pengeluaran" className="p-3 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl transition active:scale-90">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(exp.id)} title="Hapus Catatan Pengeluaran Permanen" className="p-3 bg-rose-50 dark:bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition active:scale-90">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
