
import React, { useState, useEffect, useRef } from 'react';
import { Plus, LayoutDashboard, FileText, Settings as SettingsIcon, Download, Trash2, Edit2, Search, Table, Printer, Image as ImageIcon, Loader2, X, Wallet, BarChart3, LogOut, Sun, Moon, Sparkles, Mountain, FolderKanban, UploadCloud, Database, Menu } from 'lucide-react';
import { InvoiceData, InvoiceStatus, AppSettings, Expense } from './types';
import { DEFAULT_SETTINGS } from './constants';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import ExcelImporter from './components/ExcelImporter';
import InvoicePreview from './components/InvoicePreview';
import SettingsPanel from './components/SettingsPanel';
import ExpenseManager from './components/ExpenseManager';
import DashboardHome from './components/DashboardHome';
import TripGroups from './components/TripGroups';
import Login from './components/Login';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { supabase } from './src/utils/supabaseClient';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<'dashboard' | 'invoices' | 'form' | 'import' | 'preview' | 'settings' | 'expenses' | 'manifests'>('dashboard');
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('vertara_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('vertara_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem('vertara_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data from Supabase
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const { data: invoicesData } = await supabase.from('invoices').select('*');
        if (invoicesData) setInvoices(invoicesData);

        const { data: expensesData } = await supabase.from('expenses').select('*');
        if (expensesData) setExpenses(expensesData);

        const { data: settingsData } = await supabase.from('settings').select('*').single();
        if (settingsData) setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleBackup = () => {
    const data = { invoices, expenses, settings, version: '1.0', timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VERTARA_DB_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.invoices) setInvoices(data.invoices);
        if (data.expenses) setExpenses(data.expenses);
        if (data.settings) setSettings(data.settings);
        alert('Database restored successfully!');
      } catch (err) { alert('Invalid backup file'); }
    };
    reader.readAsText(file);
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('vertara_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('vertara_auth');
    setView('dashboard');
    setCurrentInvoice(null);
    setIsMobileMenuOpen(false);
  };

  const saveInvoice = async (data: InvoiceData) => {
    setInvoices(prev => {
      const exists = prev.find(inv => inv.id === data.id);
      if (exists) return prev.map(inv => inv.id === data.id ? data : inv);
      return [data, ...prev];
    });
    setView('invoices');
    const { error } = await supabase.from('invoices').upsert(data);
    if (error) console.error("Error saving invoice:", error);
  };

  const handlePreviewInvoice = (inv: InvoiceData) => {
    setCurrentInvoice(inv);
    setView('preview');
  };

  const handleEditInvoice = (inv: InvoiceData) => {
    setCurrentInvoice(inv);
    setView('form');
  };

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) console.error("Error deleting invoice:", error);
    }
  };

  const handleAddExpense = async (exp: Expense) => {
    setExpenses(prev => [exp, ...prev]);
    const { error } = await supabase.from('expenses').insert(exp);
    if (error) console.error("Error adding expense:", error);
  };

  const handleEditExpense = async (exp: Expense) => {
    setExpenses(prev => prev.map(e => e.id === exp.id ? exp : e));
    const { error } = await supabase.from('expenses').upsert(exp);
    if (error) console.error("Error editing expense:", error);
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) console.error("Error deleting expense:", error);
    }
  };

  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    const settingsToSave = { ...newSettings, id: newSettings.id || '1' };
    const { error } = await supabase.from('settings').upsert(settingsToSave);
    if (error) console.error("Error saving settings:", error);
  };

  const bulkSave = async (newInvoices: InvoiceData[]) => {
    setInvoices(prev => [...newInvoices, ...prev]);
    setView('invoices');
    await supabase.from('invoices').upsert(newInvoices);
  };

  const generateCanvas = async () => {
    if (!invoiceRef.current) return null;
    return await html2canvas(invoiceRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1000,
    });
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error("Canvas capture failed");

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = 210; // A4 width mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [imgWidth, imgHeight]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${currentInvoice?.invoiceNo}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPNG = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error("Canvas capture failed");

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Invoice_${currentInvoice?.invoiceNo}.png`;
      link.click();
    } catch (error) {
      console.error(error);
      alert("Failed to generate PNG. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  const NavigationContent = () => (
    <>
      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          {settings.logo ? <img src={settings.logo} className="w-full h-full object-contain p-2" /> : <Mountain className="text-white" size={24} />}
        </div>
        <div>
          <h1 className="text-xl font-black italic uppercase dark:text-white text-emerald-900 leading-none">VERTARA<span className="text-emerald-500">.ID</span></h1>
          <p className="text-[9px] uppercase tracking-[0.4em] font-black opacity-40 dark:text-emerald-400 mt-2">Adventure OS</p>
        </div>
      </div>

      <ul className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {[
          { id: 'dashboard', icon: BarChart3, label: 'Analytics' },
          { id: 'invoices', icon: FileText, label: 'All Invoices' },
          { id: 'manifests', icon: FolderKanban, label: 'Trip Groups' },
          { id: 'expenses', icon: Wallet, label: 'Ledger' },
          { id: 'import', icon: Table, label: 'Bulk Import' },
          { id: 'settings', icon: SettingsIcon, label: 'Brand Center' }
        ].map((item) => (
          <li key={item.id}>
            <button
              onClick={() => { setView(item.id as any); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${view === item.id ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10' : 'text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'}`}
              title={`Buka Halaman ${item.label}`}
            >
              <item.icon size={18} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-emerald-900/30 space-y-3">
        <div className="flex gap-2">
          <button onClick={handleBackup} title="Unduh Cadangan Database (JSON)" className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-emerald-500 hover:text-white transition flex justify-center"><Database size={18} /></button>
          <label title="Pulihkan Database dari File Backup" className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-blue-500 hover:text-white transition flex justify-center cursor-pointer">
            <UploadCloud size={18} />
            <input type="file" onChange={handleRestore} className="hidden" accept=".json" />
          </label>
          <button onClick={toggleTheme} title="Ganti Mode Gelap/Terang" className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 transition flex justify-center">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-emerald-400" />}
          </button>
        </div>
        <button onClick={() => { setCurrentInvoice(null); setView('form'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-600/10 transition hover:-translate-y-1 active:scale-95 text-[10px] uppercase tracking-widest" title="Tambah Manifest Peserta Baru">
          <Plus size={18} /> New Manifest
        </button>
        <button
          onClick={handleLogout}
          title="Keluar dari Sistem Admin"
          className="w-full py-3 text-slate-400 hover:text-rose-500 transition text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group"
        >
          <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
          Logout System
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-500">
      {/* Mobile Top Bar */}
      <div className="md:hidden glass p-4 flex justify-between items-center sticky top-0 z-[60] border-b">
        <div className="flex items-center gap-3">
          <Mountain className="text-emerald-600" size={24} />
          <h1 className="text-lg font-black italic uppercase dark:text-white text-emerald-900 leading-none">VERTARA<span className="text-emerald-500">.ID</span></h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 glass rounded-xl text-emerald-600" title="Menu Navigasi">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar Navigation */}
      <nav className="w-full md:w-72 glass no-print hidden md:flex flex-col border-r sticky top-0 h-screen z-50 p-6 overflow-hidden">
        <NavigationContent />
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] md:hidden no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <nav className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm glass bg-white dark:bg-slate-950 p-6 flex flex-col shadow-2xl animate-slide-in">
            <NavigationContent />
          </nav>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-14 no-print relative">
        <div className="max-w-7xl mx-auto">
          {view === 'dashboard' && <DashboardHome invoices={invoices} expenses={expenses} theme={theme} />}
          {view === 'manifests' && <TripGroups invoices={invoices} onPreview={handlePreviewInvoice} />}
          {view === 'invoices' && (
            <InvoiceList invoices={invoices} onEdit={handleEditInvoice} onDelete={handleDeleteInvoice} onPreview={handlePreviewInvoice} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          )}
          {view === 'expenses' && <ExpenseManager expenses={expenses} onAdd={handleAddExpense} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />}
          {view === 'form' && <InvoiceForm initialData={currentInvoice} onSave={saveInvoice} onCancel={() => setView('invoices')} lastInvoiceNo={invoices[0]?.invoiceNo} />}
          {view === 'import' && <ExcelImporter onImport={bulkSave} onCancel={() => setView('invoices')} lastInvoiceNo={invoices[0]?.invoiceNo} />}
          {view === 'settings' && <SettingsPanel settings={settings} onSave={handleSaveSettings} />}
        </div>
      </main>

      {view === 'preview' && currentInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex flex-col items-center p-4 z-[100] overflow-y-auto no-print">
          <div className="max-w-5xl w-full flex flex-col md:flex-row justify-between items-center mb-8 glass p-4 rounded-[28px] shadow-2xl gap-4 mt-4 border border-white/20">
            <div className="flex items-center gap-6">
              <button onClick={() => setView('invoices')} title="Tutup Pratinjau" className="text-white p-3 hover:bg-white/10 rounded-2xl transition"><X size={24} /></button>
              <div>
                <h4 className="font-black text-emerald-400 text-sm">{currentInvoice.invoiceNo}</h4>
                <p className="text-xs text-white/60 font-bold uppercase">{currentInvoice.namaLengkap}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDownloadPNG} disabled={isGenerating} title="Unduh sebagai Gambar (PNG)" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-6 py-3.5 rounded-2xl font-black flex items-center gap-3 active:scale-95 text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />} PNG
              </button>
              <button onClick={handleDownloadPDF} disabled={isGenerating} title="Unduh Invoice dalam format PDF" className="bg-white text-slate-950 px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 active:scale-95 text-[10px] uppercase tracking-widest">
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} PDF Export
              </button>
            </div>
          </div>
          <div className="w-full max-w-4xl bg-white shadow-2xl rounded-sm p-0 mb-32" ref={invoiceRef}>
            <InvoicePreview data={currentInvoice} settings={settings} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
