
import React, { useState, useRef } from 'react';
import { AppSettings, InvoiceData, InvoiceStatus } from '../types';
import { Save, Banknote, Globe, Image as ImageIcon, Trash2, Upload, FileText, LayoutTemplate, ShieldCheck, Mail, Instagram, Phone, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import InvoicePreview from './InvoicePreview';
import { PACKETS } from '../constants';

interface SettingsPanelProps {
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
}

const MOCK_PREVIEW_DATA: InvoiceData = {
  id: 'preview',
  invoiceNo: 'VRT-2026-0001',
  invoiceDate: '15 Mei 2026',
  status: InvoiceStatus.PAID,
  namaLengkap: 'Budi Santoso',
  namaPanggilan: 'Budi',
  jenisKelamin: 'Laki-laki',
  usia: 25,
  domisili: 'Jakarta Selatan',
  wa: '0812-3456-7890',
  email: 'budi.traveler@example.com',
  gunung: 'Gunung Rinjani',
  tanggalTrip: '20-24 Mei 2026',
  jenisPaket: PACKETS[1],
  pengalaman: 'Merapi, Semeru',
  riwayatPenyakit: 'Sehat',
  alergi: 'Tidak ada',
  sewaAlat: 'Tenda Dome (1)',
  subtotal: 3500000,
  diskon: 200000,
  total: 3300000
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [zoom, setZoom] = useState(0.5); // Default zoom 50%
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 mb-1.5 block";
  const inputClass = "w-full p-3 rounded-2xl glass-input outline-none text-sm font-bold transition-all focus:ring-4 focus:ring-emerald-500/5 text-slate-900 dark:text-white";
  const cardClass = "glass p-8 rounded-[32px] border border-white/20 shadow-sm transition-all hover:shadow-md";

  return (
    <div className="pb-32 animate-fade-in">
      <header className="mb-12">
        <h2 className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase italic leading-none">
          Brand <span className="text-emerald-500">Center</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 font-bold text-xs tracking-widest uppercase">System configuration hub</p>
      </header>

      <div className="flex flex-col xl:grid xl:grid-cols-2 gap-10 items-start">
        <div className="w-full space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className={cardClass}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight italic">Corporate Visuals</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Logo & Branding</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative w-full aspect-[4/2] bg-slate-50/50 dark:bg-black/20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all overflow-hidden"
                >
                  {formData.logo ? (
                    <>
                      <img src={formData.logo} alt="Preview" className="w-full h-full object-contain p-8" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <Upload className="text-white" size={32} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-slate-400 group-hover:text-emerald-500" size={24} />
                      </div>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Click to upload brand asset</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
                {formData.logo && (
                  <button type="button" onClick={removeLogo} className="w-full flex items-center justify-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest py-3 hover:bg-rose-50 dark:hover:bg-rose-500/5 rounded-xl transition">
                    <Trash2 size={14} /> Remove Brand Asset
                  </button>
                )}
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                  <Banknote size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight italic">Payment Channels</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Settlement Details</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Institution</label>
                  <input name="bankName" value={formData.bankName} onChange={handleChange} className={inputClass} placeholder="BCA / Mandiri" required />
                </div>
                <div>
                  <label className={labelClass}>Account Ledger No.</label>
                  <input name="accountNo" value={formData.accountNo} onChange={handleChange} className={`${inputClass} font-mono`} placeholder="Numbers only" required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Beneficiary Name</label>
                  <input name="accountName" value={formData.accountName} onChange={handleChange} className={inputClass} placeholder="A/N Name" required />
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight italic">Communication</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Contact Points</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="relative group">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                   <input name="whatsappContact" value={formData.whatsappContact} onChange={handleChange} className={`${inputClass} pl-12`} placeholder="WhatsApp Number" required />
                </div>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                   <input name="emailContact" value={formData.emailContact} onChange={handleChange} className={`${inputClass} pl-12`} placeholder="Official Email" required />
                </div>
                <div className="relative group">
                   <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                   <input name="instagramContact" value={formData.instagramContact} onChange={handleChange} className={`${inputClass} pl-12`} placeholder="Instagram Handle" required />
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-500/10 rounded-2xl flex items-center justify-center text-slate-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight italic">Legal Note</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terms & Conditions Disclaimer</p>
                </div>
              </div>
              <div className="space-y-4">
                <textarea 
                    name="footerNote" 
                    value={formData.footerNote || ''} 
                    onChange={handleChange} 
                    className={`${inputClass} h-40 resize-none leading-relaxed`}
                    placeholder="Enter the terms and conditions displayed at the bottom of the invoice..."
                />
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/60 italic">Markdown Tip: Wrap text in double asterisks for **bold** emphasis.</p>
              </div>
            </div>

            <div className="sticky bottom-10 z-20">
              <button type="submit" className="w-full py-5 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all shadow-2xl shadow-emerald-600/20 flex items-center justify-center gap-4 active:scale-[0.98] uppercase tracking-[0.2em] text-xs">
                {saved ? <ShieldCheck size={20} className="animate-bounce" /> : <Save size={20} />}
                {saved ? 'System Synchronized' : 'Update Brand Config'}
              </button>
            </div>
          </form>
        </div>

        {/* Master Template Preview with Interactive Controls */}
        <div className="w-full xl:sticky xl:top-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-4">
                <div className="flex items-center gap-3">
                    <LayoutTemplate className="text-emerald-500" size={20} />
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Master Template Preview</h3>
                </div>
                
                {/* Zoom Control Bar */}
                <div className="flex items-center gap-4 bg-white/50 dark:bg-black/20 p-2 rounded-2xl border border-white/10">
                    <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} className="p-2 hover:bg-white/20 rounded-lg text-slate-500 transition" title="Zoom Out">
                        <ZoomOut size={16} />
                    </button>
                    <input 
                      type="range" 
                      min="0.2" 
                      max="1.5" 
                      step="0.05" 
                      value={zoom} 
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-24 accent-emerald-500"
                    />
                    <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-2 hover:bg-white/20 rounded-lg text-slate-500 transition" title="Zoom In">
                        <ZoomIn size={16} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1"></div>
                    <button onClick={() => setZoom(0.5)} className="text-[9px] font-black uppercase px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition">
                        Reset
                    </button>
                </div>
            </div>
            
            {/* Scrollable Viewport */}
            <div className="glass rounded-[40px] border border-white/20 shadow-2xl overflow-auto bg-slate-200/50 dark:bg-emerald-950/20 max-h-[85vh] relative custom-scrollbar">
                {/* 
                  Wrapper div that expands based on zoom.
                  Its size is (1000 * zoom) x (1414 * zoom).
                  The InvoicePreview itself is always 1000px but scaled.
                */}
                <div 
                  className="flex justify-center p-10"
                  style={{ 
                    minWidth: '100%',
                    width: `${1000 * zoom + 80}px`, // +80 for padding
                    height: `${1414 * zoom + 80}px`
                  }}
                >
                    <div 
                      className="origin-top shadow-2xl transition-transform duration-200 ease-out bg-white"
                      style={{ 
                        width: '1000px',
                        transform: `scale(${zoom})`
                      }}
                    >
                        <InvoicePreview data={MOCK_PREVIEW_DATA} settings={formData} />
                    </div>
                </div>
            </div>
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 italic">
                Zoom: {Math.round(zoom * 100)}% • Use scrollbars to navigate the full document.
            </p>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
};

export default SettingsPanel;
