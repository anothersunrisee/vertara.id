
import React, { useState, useEffect } from 'react';
import { Save, X, Info, User, Mountain, CreditCard, ShieldAlert, Sparkles } from 'lucide-react';
import { InvoiceData, InvoiceStatus } from '../types';
import { PACKETS } from '../constants';

interface InvoiceFormProps {
  initialData: InvoiceData | null;
  onSave: (data: InvoiceData) => void;
  onCancel: () => void;
  lastInvoiceNo?: string;
}

const generateId = () => {
  return crypto.randomUUID();
};

const generateInvoiceNo = (lastNo?: string) => {
  const year = new Date().getFullYear();
  if (!lastNo || !lastNo.startsWith(`VRT-${year}`)) {
    return `VRT-${year}-0001`;
  }
  const parts = lastNo.split('-');
  const seq = parseInt(parts[2], 10) + 1;
  return `VRT-${year}-${seq.toString().padStart(4, '0')}`;
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSave, onCancel, lastInvoiceNo }) => {
  const [formData, setFormData] = useState<InvoiceData>({
    id: generateId(),
    invoiceNo: generateInvoiceNo(lastInvoiceNo),
    invoiceDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: InvoiceStatus.UNPAID,
    namaLengkap: '',
    namaPanggilan: '',
    jenisKelamin: 'Laki-laki',
    usia: 0,
    domisili: '',
    wa: '',
    email: '',
    gunung: '',
    tanggalTrip: '',
    jenisPaket: PACKETS[0],
    pengalaman: '',
    riwayatPenyakit: '',
    alergi: '',
    sewaAlat: '',
    subtotal: 0,
    diskon: 0,
    total: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      total: Math.max(0, prev.subtotal - prev.diskon)
    }));
  }, [formData.subtotal, formData.diskon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const inputClass = "w-full p-3.5 rounded-2xl glass-input outline-none text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white";
  const labelClass = "text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 mb-1.5 block";
  const sectionClass = "glass p-8 rounded-[32px] border border-white/20 shadow-sm transition-all hover:shadow-md";

  return (
    <div className="max-w-5xl mx-auto pb-32 animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase italic leading-none">
            {initialData ? 'Edit' : 'Create'} <span className="text-emerald-500">Manifest</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-bold text-xs tracking-widest uppercase">Expedition Registration Terminal</p>
        </div>
        <button onClick={onCancel} className="p-4 glass rounded-2xl text-slate-400 hover:text-rose-500 transition-all active:scale-90">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Row 1: Quick Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-[24px] border border-white/20">
            <label className={labelClass}>Invoice Identifier</label>
            <input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} className={inputClass} required />
          </div>
          <div className="glass p-6 rounded-[24px] border border-white/20">
            <label className={labelClass}>Generation Date</label>
            <input name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} className={inputClass} required />
          </div>
          <div className="glass p-6 rounded-[24px] border border-white/20">
            <label className={labelClass}>Current Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass} required>
              {Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Participant Manifest */}
        <div className={sectionClass}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight italic">Personal Profile</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Participant Identity Verification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Full Identity Name</label>
              <input name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} className={inputClass} placeholder="Full name as per ID card" required />
            </div>
            <div>
              <label className={labelClass}>Preferred Name</label>
              <input name="namaPanggilan" value={formData.namaPanggilan} onChange={handleChange} className={inputClass} placeholder="Nickname" />
            </div>
            <div>
              <label className={labelClass}>Gender Identity</label>
              <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className={inputClass}>
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Biological Age</label>
              <input type="number" name="usia" value={formData.usia || ''} onChange={handleChange} className={inputClass} placeholder="Years" />
            </div>
            <div>
              <label className={labelClass}>Current Base (City)</label>
              <input name="domisili" value={formData.domisili} onChange={handleChange} className={inputClass} placeholder="e.g. Jakarta" />
            </div>
            <div>
              <label className={labelClass}>WhatsApp Line</label>
              <input name="wa" value={formData.wa} onChange={handleChange} className={inputClass} placeholder="08..." required />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="operator@vertara.id" required />
            </div>
          </div>
        </div>

        {/* Expedition Details */}
        <div className={sectionClass}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
              <Mountain size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight italic">Expedition Details</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Summit Target & Logistics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className={labelClass}>Peak Destination</label>
              <input name="gunung" value={formData.gunung} onChange={handleChange} className={inputClass} placeholder="e.g. Gunung Merbabu" required />
            </div>
            <div>
              <label className={labelClass}>Deployment Date</label>
              <input name="tanggalTrip" value={formData.tanggalTrip} onChange={handleChange} className={inputClass} placeholder="12-15 Oct 2025" required />
            </div>
            <div>
              <label className={labelClass}>Service Tier</label>
              <select name="jenisPaket" value={formData.jenisPaket} onChange={handleChange} className={inputClass}>
                {PACKETS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="lg:col-span-4">
              <label className={labelClass}>Previous Ascents (Experience)</label>
              <textarea name="pengalaman" value={formData.pengalaman} onChange={handleChange} className={`${inputClass} h-20 resize-none`} placeholder="Mention summits reached..." />
            </div>
          </div>
        </div>

        {/* Health & Financials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={sectionClass}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-600">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight italic">Medical Alert</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Safety First Protocol</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Clinical History</label>
                <textarea name="riwayatPenyakit" value={formData.riwayatPenyakit} onChange={handleChange} className={`${inputClass} h-24 resize-none`} placeholder="Asthma, Vertigo, etc..." />
              </div>
              <div>
                <label className={labelClass}>Allergies</label>
                <textarea name="alergi" value={formData.alergi} onChange={handleChange} className={`${inputClass} h-24 resize-none`} placeholder="Specific food or drugs..." />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight italic">Financial Summary</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset & Transaction Ledger</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Gear Logistics (Rental)</label>
                <textarea name="sewaAlat" value={formData.sewaAlat} onChange={handleChange} className={`${inputClass} h-24 resize-none`} placeholder="Items to be rented..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Base Price (IDR)</label>
                  <input type="number" name="subtotal" value={formData.subtotal || ''} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Courtesy Discount (IDR)</label>
                  <input type="number" name="diskon" value={formData.diskon || ''} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="pt-4">
                <div className="bg-emerald-500/10 dark:bg-emerald-500/5 p-6 rounded-[24px] flex justify-between items-center border border-emerald-500/20">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Net Total</span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Expedition Fee</span>
                  </div>
                  <span className="text-3xl font-black text-emerald-600 font-mono">
                    Rp {formData.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Save Bar */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 max-w-lg w-full px-6 z-50">
          <div className="glass p-3 rounded-[32px] border border-white/30 shadow-2xl flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 py-4 glass rounded-2xl font-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition uppercase tracking-widest text-[10px]">
              Cancel
            </button>
            <button type="submit" className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] active:scale-95 group">
              <Save size={18} className="group-hover:rotate-12 transition-transform" />
              Finalize Manifest
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InvoiceForm;
