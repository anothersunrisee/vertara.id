
import React from 'react';
import { Mail, Phone, Instagram, ShieldAlert, CreditCard, CheckCircle2, Mountain } from 'lucide-react';
import { InvoiceData, AppSettings } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  settings: AppSettings;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, settings }) => {
  // Helper to render bold text from **text** pattern
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-slate-700">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const footerText = settings.footerNote || 'This invoice serves as a binding confirmation. Please contact admin for details.';

  return (
    <div id="invoice-preview" className="bg-white text-slate-800 p-10 md:p-16 mx-auto shadow-none print:shadow-none min-h-[1414px] flex flex-col font-dm relative overflow-hidden" style={{ width: '1000px' }}>

      {/* Decorative Background Element */}
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Brand Header */}
      <header className="flex justify-between items-start border-b-2 border-slate-100 pb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-900 rounded-3xl flex items-center justify-center shadow-xl overflow-hidden shrink-0">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-2.5" />
            ) : (
              <Mountain className="text-white" size={40} />
            )}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-emerald-900 tracking-tighter leading-none italic uppercase">
              VERTARA<span className="text-emerald-500">.ID</span>
            </h1>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.4em]">Adventure Tourism Specialist</p>
              <div className="flex flex-col gap-1 text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-2"><Phone size={10} className="text-emerald-600" /> <span>{settings.whatsappContact}</span></div>
                <div className="flex items-center gap-2"><Mail size={10} className="text-emerald-600" /> <span>{settings.emailContact}</span></div>
                <div className="flex items-center gap-2"><Instagram size={10} className="text-emerald-600" /> <span>{settings.instagramContact}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right space-y-4">
          <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black tracking-[0.3em] rounded-full uppercase mb-2">
            Official Booking
          </div>
          <div className="space-y-1">
            <h2 className="text-5xl font-black text-slate-200 uppercase tracking-tighter leading-none">INVOICE</h2>
            <p className="text-emerald-700 font-mono text-xl font-black tracking-tight">{data.invoiceNo}</p>
          </div>
          <div className="pt-2">
            <span className={`text-[12px] font-bold px-5 py-2 rounded-full border-2 transition-colors ${data.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' :
                data.status === 'DP' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
              {data.status} • {data.invoiceDate}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 mt-12 space-y-12 relative z-10">

        {/* Row 1: Manifest & Participant */}
        <div className="grid grid-cols-12 gap-10">
          {/* Left Column: Participant Information */}
          <div className="col-span-7 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-slate-100"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Participant Profile</h3>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div className="col-span-2 group">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Participant Name</label>
                  <div className="text-xl font-bold text-slate-900 pb-1">{data.namaLengkap}</div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Call Name</label>
                  <div className="font-semibold text-slate-700">{data.namaPanggilan}</div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Identity</label>
                  <div className="font-semibold text-slate-700">{data.jenisKelamin}, {data.usia} yrs</div>
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Domicile</label>
                  <div className="font-semibold text-slate-700">{data.domisili}</div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">WA Contact</label>
                  <div className="font-bold text-emerald-700">{data.wa}</div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Reference</label>
                  <div className="font-semibold text-slate-500 truncate">{data.email}</div>
                </div>
              </div>
            </section>

            {/* Health Section */}
            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-slate-400">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Medical Record & Safety</h3>
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <span className="font-black text-slate-400 uppercase text-[8px]">Medical History</span>
                  <p className="font-medium text-slate-700 leading-relaxed">{data.riwayatPenyakit || 'Clear medical history reported.'}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-black text-slate-400 uppercase text-[8px]">Allergies</span>
                  <p className="font-medium text-slate-700 leading-relaxed">{data.alergi || 'No known allergies reported.'}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Trip Manifest */}
          <div className="col-span-5 space-y-8">
            <section className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl shadow-emerald-900/10 relative overflow-hidden">
              <div className="absolute bottom-[-20px] right-[-10px] opacity-10 pointer-events-none">
                <Mountain size={120} />
              </div>

              <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-8">Trip Manifest</h3>

              <div className="space-y-8">
                <div>
                  <label className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Destination Peak</label>
                  <div className="text-2xl font-black leading-tight">{data.gunung}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Expedition Date</label>
                    <div className="text-sm font-bold">{data.tanggalTrip}</div>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Service Tier</label>
                    <div className="text-sm font-bold">{data.jenisPaket}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-800">
                  <label className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Hiking Background</label>
                  <p className="text-[12px] leading-relaxed italic opacity-80">"{data.pengalaman || 'Entry level enthusiast'}"</p>
                </div>
              </div>
            </section>

            <section className="px-2">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Additional Gear Rentals</h3>
              <div className="bg-slate-50 p-5 rounded-xl border-l-4 border-emerald-500 text-[12px] font-medium text-slate-600 leading-relaxed shadow-sm min-h-[100px]">
                {data.sewaAlat ? (
                  <div className="whitespace-pre-line">{data.sewaAlat}</div>
                ) : (
                  <span className="italic text-slate-400">Standard equipment only (No extra rentals).</span>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Row 2: Financial Ledger */}
        <div className="bg-white rounded-3xl border-2 border-slate-50 overflow-hidden shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row border-t-emerald-600 border-t-4">
          <div className="flex-1 p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CreditCard size={18} />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Payment Disbursement</h3>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Financial Institution</div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">{settings.bankName}</div>
                </div>
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Reference Holder</div>
                  <div className="text-sm font-bold text-slate-600">{settings.accountName}</div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="text-[8px] text-emerald-600 uppercase font-black tracking-widest mb-1">Account Number</div>
                <div className="text-2xl font-black font-mono tracking-tighter text-emerald-800 py-1">{settings.accountNo}</div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-96 bg-slate-900 text-white p-10 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-slate-500 text-[9px] uppercase font-black tracking-widest">
                <span>Service Subtotal</span>
                <span className="font-mono text-sm">Rp {data.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-rose-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-800 pb-6">
                <span>Loyalty Discount</span>
                <span className="font-mono text-sm">- Rp {data.diskon.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex flex-col pt-4">
                <span className="text-[10px] uppercase font-black text-emerald-400 mb-3 tracking-[0.3em]">Payable Amount</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-emerald-500 font-bold text-sm uppercase">IDR</span>
                  <span className="text-5xl font-black tracking-tighter text-white font-mono leading-none">
                    {data.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="mt-14 space-y-8">
        <div className="p-10 border-2 border-slate-50 rounded-3xl bg-slate-50/30">
          <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Participant Agreement & Terms
          </h4>
          <div className="text-[12px] text-slate-500 leading-relaxed font-medium italic">
            {renderFormattedText(footerText)}
          </div>
        </div>
      </div>

      {/* Footer Branded Bar */}
      <footer className="mt-auto pt-12 flex justify-between items-center border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-900 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
            {settings.logo ? (
              <img src={settings.logo} alt="Vertara" className="w-full h-full object-contain p-1.5" />
            ) : (
              <Mountain className="text-white" size={24} />
            )}
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">VERTARA.ID</p>
            <p className="text-[10px] text-emerald-600 uppercase tracking-[0.3em] font-black mt-1">Summit Bound Experiences</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-8 py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-black italic shadow-sm transform rotate-[-2deg]">
          <CheckCircle2 size={24} />
          <span className="text-lg tracking-tight uppercase">Let's Hit the Trail!</span>
        </div>
      </footer>
    </div>
  );
};

export default InvoicePreview;
