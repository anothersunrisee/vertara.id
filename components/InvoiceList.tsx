
import React, { useState, useMemo } from 'react';
import { Search, Edit2, Eye, Trash2, Calendar, Mountain, DollarSign, Filter, X, ChevronRight, MapPin, MessageCircle } from 'lucide-react';
import { InvoiceData, InvoiceStatus, AppSettings } from '../types';
import { STATUS_COLORS } from '../constants';

interface InvoiceListProps {
  invoices: InvoiceData[];
  onEdit: (inv: InvoiceData) => void;
  onPreview: (inv: InvoiceData) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  settings: AppSettings;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices, onEdit, onPreview, onDelete, searchQuery, setSearchQuery, settings
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    invoices.forEach(inv => {
      const parts = inv.invoiceDate.split(' ');
      if (parts.length >= 3) months.add(`${parts[1]} ${parts[2]}`);
    });
    return Array.from(months).sort();
  }, [invoices]);

  const filtered = invoices.filter(inv => {
    const matchesSearch =
      inv.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.gunung.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchesMonth = monthFilter === 'ALL' || inv.invoiceDate.includes(monthFilter);
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const sendWhatsApp = (inv: InvoiceData) => {
    let message = '';
    const bankDetails = `\n\n💳 *Rekening Pembayaran:*\n${settings.bankName}\n${settings.accountNo}\na.n ${settings.accountName}`;
    const footer = `\n\nSalam lestari! 🏔️\n*VERTARA.ID*`;

    if (inv.status === InvoiceStatus.UNPAID) {
      message = `Halo Kak *${inv.namaLengkap}*,\n\nTerima kasih telah mendaftar trip *${inv.gunung}* (${inv.tanggalTrip}).\n\nBerikut rincian tagihan Anda:\n🔖 No Invoice: *${inv.invoiceNo}*\n💰 Total: *Rp ${inv.total.toLocaleString('id-ID')}*\n🔴 Status: *BELUM LUNAS (UNPAID)*\n\nMohon dapat segera menyelesaikan pembayaran untuk mengamankan slot Anda.${bankDetails}${footer}`;
    } else if (inv.status === InvoiceStatus.DP) {
      message = `Halo Kak *${inv.namaLengkap}*,\n\nTerima kasih pembayaran DP untuk trip *${inv.gunung}* (${inv.tanggalTrip}) sudah kami terima.\n\nBerikut update tagihan Anda:\n🔖 No Invoice: *${inv.invoiceNo}*\n💰 Total Tagihan: *Rp ${inv.total.toLocaleString('id-ID')}*\n🟡 Status: *DP DITERIMA*\n\nMohon kesediaannya untuk melakukan pelunasan sebelum hari keberangkatan.${bankDetails}${footer}`;
    } else {
      // PAID
      message = `Halo Kak *${inv.namaLengkap}*,\n\nPembayaran LUNAS untuk trip *${inv.gunung}* (${inv.tanggalTrip}) telah kami terima. Terima kasih sudah mempercayakan petualangan Anda bersama Vertara.id.\n\n🔖 No Invoice: *${inv.invoiceNo}*\n🟢 Status: *LUNAS (PAID)*\n\nSampai jumpa di meeting point! 🚐💨${footer}`;
    }

    const encoded = encodeURIComponent(message);
    const waNumber = inv.wa.replace(/[^0-9]/g, '');
    const cleanNumber = waNumber.startsWith('0') ? '62' + waNumber.slice(1) : waNumber;
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase italic leading-none">
            Invoicing <span className="text-emerald-500">Manifest</span>
          </h2>
          <p className="text-slate-400 mt-2 font-bold text-xs tracking-widest uppercase">Expedition booking registry</p>
        </div>
        <div className="relative group flex-1 lg:max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search by name, ID, or peak..." className="w-full pl-12 pr-4 py-4 rounded-[20px] glass border outline-none text-slate-900 dark:text-white font-bold text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </header>

      <div className="glass p-2 rounded-[24px] border flex flex-wrap gap-2 items-center">
        <select title="Filter berdasarkan Status Pembayaran" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/50 dark:bg-slate-800/50 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white border-transparent focus:border-emerald-500 outline-none transition">
          <option value="ALL">Status: All</option>
          {Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select title="Filter berdasarkan Bulan Trip" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="bg-white/50 dark:bg-slate-800/50 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white border-transparent focus:border-emerald-500 outline-none transition">
          <option value="ALL">Date: All</option>
          {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        {(statusFilter !== 'ALL' || monthFilter !== 'ALL') && (
          <button title="Reset Semua Filter" onClick={() => { setStatusFilter('ALL'); setMonthFilter('ALL'); }} className="ml-auto mr-2 p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map(inv => (
          <div key={inv.id} className="glass-card p-6 rounded-[32px] flex flex-col sm:flex-row gap-6 relative group border border-white/5">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-[0.2em] bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full uppercase">{inv.invoiceNo}</span>
                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${inv.status === 'PAID' ? 'bg-emerald-500 text-white border-transparent' :
                    inv.status === 'DP' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-700 border-rose-200'
                  }`}>{inv.status}</span>
              </div>
              <div>
                <h4 className="text-2xl font-black text-emerald-950 dark:text-white tracking-tighter leading-none">{inv.namaLengkap}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">
                  <MapPin size={14} className="text-emerald-500" /> <span>{inv.gunung}</span>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Calendar size={14} /> {inv.invoiceDate}</div>
                <div className="flex items-center gap-2 text-xs font-black text-emerald-600">Rp {inv.total.toLocaleString('id-ID')}</div>
              </div>
            </div>

            <div className="flex sm:flex-col justify-end gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-white/5 pt-4 sm:pt-0 sm:pl-4">
              <button onClick={() => onPreview(inv)} title="Pratinjau & Cetak Invoice" className="p-3 bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-xl hover:scale-105 transition"><Eye size={18} /></button>
              <button onClick={() => sendWhatsApp(inv)} title="Kirim Penagihan ke WhatsApp Peserta" className="p-3 bg-emerald-500 text-white rounded-xl hover:scale-105 transition"><MessageCircle size={18} /></button>
              <button onClick={() => onEdit(inv)} title="Edit Data Manifest Peserta" className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:scale-105 transition"><Edit2 size={18} /></button>
              <button onClick={() => onDelete(inv.id)} title="Hapus Data Manifest Permanen" className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl hover:scale-105 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceList;
