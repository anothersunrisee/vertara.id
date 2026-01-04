
import React, { useMemo } from 'react';
import { Mountain, Users, Calendar, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { InvoiceData, InvoiceStatus } from '../types';

interface TripGroupsProps {
  invoices: InvoiceData[];
  onPreview: (inv: InvoiceData) => void;
}

const TripGroups: React.FC<TripGroupsProps> = ({ invoices, onPreview }) => {
  const groups = useMemo(() => {
    const map: Record<string, { gunung: string, tanggal: string, participants: InvoiceData[] }> = {};
    invoices.forEach(inv => {
      const key = `${inv.gunung}-${inv.tanggalTrip}`;
      if (!map[key]) map[key] = { gunung: inv.gunung, tanggal: inv.tanggalTrip, participants: [] };
      map[key].participants.push(inv);
    });
    return Object.values(map).sort((a, b) => a.gunung.localeCompare(b.gunung));
  }, [invoices]);

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div>
        <h2 className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase italic leading-none">
          Trip <span className="text-emerald-500">Manifests</span>
        </h2>
        <p className="text-slate-400 mt-2 font-bold text-xs tracking-widest uppercase">Grup Organiser by Destination</p>
      </div>

      {groups.length === 0 ? (
        <div className="glass p-20 rounded-[40px] text-center border-dashed border-2">
            <p className="text-slate-400 font-bold uppercase tracking-widest italic">No trip manifests detected.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {groups.map((group, idx) => {
            const paidCount = group.participants.filter(p => p.status === InvoiceStatus.PAID).length;
            const progress = (paidCount / group.participants.length) * 100;

            return (
              <div key={idx} className="glass-card p-8 rounded-[40px] border border-white/10 group">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Mountain size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-emerald-950 dark:text-white uppercase italic tracking-tighter">{group.gunung}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><Calendar size={14}/> {group.tanggal}</span>
                        <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest"><Users size={14}/> {group.participants.length} Participants</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-72 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">Payment Status</span>
                       <span className="text-emerald-500">{paidCount}/{group.participants.length} Paid</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.participants.map(p => (
                    <div key={p.id} onClick={() => onPreview(p)} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-transparent hover:border-emerald-500/30 cursor-pointer transition-all active:scale-[0.98]">
                       <div className="flex items-center gap-3">
                          {p.status === InvoiceStatus.PAID ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Clock size={16} className="text-amber-500" />}
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{p.namaLengkap}</span>
                       </div>
                       <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TripGroups;
