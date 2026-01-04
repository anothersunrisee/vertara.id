
import React, { useState } from 'react';
import { Table, Trash2, CheckCircle, AlertTriangle, ArrowRight, FileSpreadsheet, X } from 'lucide-react';
import { InvoiceData, InvoiceStatus } from '../types';
import { PACKETS } from '../constants';

interface ExcelImporterProps {
  onImport: (invoices: InvoiceData[]) => void;
  onCancel: () => void;
  lastInvoiceNo?: string;
}

const generateId = () => {
  return crypto.randomUUID();
};

const ExcelImporter: React.FC<ExcelImporterProps> = ({ onImport, onCancel, lastInvoiceNo }) => {
  const [rawData, setRawData] = useState('');
  const [preview, setPreview] = useState<Partial<InvoiceData>[]>([]);

  const parseData = () => {
    if (!rawData.trim()) return;
    const rows = rawData.trim().split('\n');
    const newPreview: Partial<InvoiceData>[] = rows.map((row) => {
      const cols = row.split('\t');
      return {
        id: generateId(),
        gunung: cols[0] || '',
        tanggalTrip: cols[1] || '',
        jenisPaket: cols[2] || PACKETS[0],
        namaLengkap: cols[3] || '',
        namaPanggilan: cols[4] || '',
        jenisKelamin: cols[5] || 'Laki-laki',
        wa: cols[6] || '',
        email: cols[7] || '',
        domisili: cols[8] || '',
        usia: parseInt(cols[9], 10) || 0,
        pengalaman: cols[10] || '',
        riwayatPenyakit: cols[11] || '',
        alergi: cols[12] || '',
        sewaAlat: cols[13] || '',
        status: InvoiceStatus.UNPAID,
        subtotal: 0,
        diskon: 0,
        total: 0
      };
    });
    setPreview(newPreview);
  };

  const handleImport = () => {
    const startYear = new Date().getFullYear();
    let currentSeq = 1;
    if (lastInvoiceNo && lastInvoiceNo.startsWith(`VRT-${startYear}`)) {
      currentSeq = parseInt(lastInvoiceNo.split('-')[2], 10) + 1;
    }
    const finalInvoices: InvoiceData[] = preview.map((p, idx) => ({
      ...p as InvoiceData,
      invoiceNo: `VRT-${startYear}-${(currentSeq + idx).toString().padStart(4, '0')}`,
      invoiceDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    }));
    onImport(finalInvoices);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase italic leading-none">
            Bulk <span className="text-emerald-500">Intake</span>
          </h2>
          <p className="text-slate-400 mt-2 font-bold text-xs tracking-widest uppercase">Spreadsheet data sync terminal</p>
        </div>
        <button onClick={onCancel} className="p-4 glass rounded-2xl text-slate-400 hover:text-rose-500 transition-all active:scale-90">
          <X size={24} />
        </button>
      </header>

      <div className="glass p-8 rounded-[32px] border border-white/20 shadow-sm space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 flex items-center gap-3">
          <FileSpreadsheet size={16} className="text-emerald-500" />
          Manifest Data Buffer
        </label>
        <textarea
          className="w-full h-56 p-6 rounded-2xl glass-input outline-none font-bold text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
          placeholder="Tip: Copy entire rows from your spreadsheet (Excel/Google Sheets) and paste them here directly."
          value={rawData}
          onChange={(e) => setRawData(e.target.value)}
        />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest max-w-md leading-relaxed">
            Sequence: Peak, Date, Package, Full Name, Nickname, Gender, WA, Email, City, Age, Experience, Medical, Allergy, Gear
          </p>
          <button
            onClick={parseData}
            disabled={!rawData.trim()}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 text-[10px] uppercase tracking-widest active:scale-95"
          >
            Analyze Buffer Data
          </button>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="space-y-8 animate-fade-in">
          <div className="glass rounded-[32px] border border-white/10 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-emerald-400/60 uppercase tracking-widest">Participant</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-emerald-400/60 uppercase tracking-widest">Target Peak</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-emerald-400/60 uppercase tracking-widest">Medical Notes</th>
                    <th className="px-6 py-4 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/10">
                  {preview.map((p, i) => (
                    <tr key={p.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition group">
                      <td className="px-6 py-5">
                        <p className="font-black text-slate-900 dark:text-slate-200 uppercase tracking-tight italic">{p.namaLengkap}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.wa}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-black text-emerald-600 dark:text-emerald-400 italic uppercase text-sm tracking-tighter">{p.gunung}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.tanggalTrip}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">History: {p.riwayatPenyakit || '-'}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-rose-500/60">Allergy: {p.alergi || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button onClick={() => setPreview(prev => prev.filter((_, idx) => idx !== i))} className="p-2 text-slate-300 hover:text-rose-500 transition-colors active:scale-90">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end items-center gap-6">
            <button onClick={() => setPreview([])} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition">Clear Manifest</button>
            <button
              onClick={handleImport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-3xl font-black transition-all shadow-2xl shadow-emerald-600/30 flex items-center gap-4 text-[10px] uppercase tracking-widest active:scale-95"
            >
              Sync {preview.length} Entries to Registry
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelImporter;
