
import React, { useMemo, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Mountain, ArrowUpRight, ArrowDownRight, Sparkles, Activity, Target, ShieldCheck, Zap, ChevronDown } from 'lucide-react';
import { InvoiceData, Expense, InvoiceStatus } from '../types';

interface DashboardHomeProps {
  invoices: InvoiceData[];
  expenses: Expense[];
  theme: 'light' | 'dark';
}

type TimeRange = '24h' | '7d' | '30d' | '90d' | '180d' | '1y' | 'all';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#f43f5e'];

const parseDate = (dateStr: string) => {
  const monthsID: {[key: string]: number} = {
    'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
    'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
  };
  const monthsEN: {[key: string]: number} = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  try {
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      let month = monthsID[parts[1]] ?? monthsEN[parts[1]];
      const year = parseInt(parts[2]);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) return new Date(year, month, day);
    }
    const standardDate = new Date(dateStr);
    if (!isNaN(standardDate.getTime())) return standardDate;
  } catch (e) { return new Date(); }
  return new Date();
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ invoices, expenses, theme }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const stats = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalParticipants = invoices.length;
    
    // Dynamic Health Metrics
    const paidInvoices = invoices.filter(inv => inv.status === InvoiceStatus.PAID).length;
    const collectionRate = invoices.length > 0 ? (paidInvoices / invoices.length) * 100 : 0;
    const financialEfficiency = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const yieldPerPax = totalParticipants > 0 ? netProfit / totalParticipants : 0;
    const burnRate = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

    // Time-based chart grouping
    const now = new Date();
    const chartDataMap: {[key: string]: {name: string, income: number, expense: number}} = {};

    let daysToLookBack = 30;
    let labelStep = 4;
    let groupingFormat: 'day' | 'month' | 'hour' = 'day';

    switch(timeRange) {
      case '24h': daysToLookBack = 1; groupingFormat = 'hour'; break;
      case '7d': daysToLookBack = 7; labelStep = 1; break;
      case '30d': daysToLookBack = 30; labelStep = 5; break;
      case '90d': daysToLookBack = 90; labelStep = 15; break;
      case '180d': daysToLookBack = 180; groupingFormat = 'month'; break;
      case '1y': daysToLookBack = 365; groupingFormat = 'month'; break;
      case 'all': 
        const allDates = [...invoices.map(i => parseDate(i.invoiceDate)), ...expenses.map(e => new Date(e.date))];
        if (allDates.length > 0) {
          const earliest = new Date(Math.min(...allDates.map(d => d.getTime())));
          daysToLookBack = Math.ceil((now.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        }
        groupingFormat = daysToLookBack > 365 ? 'month' : 'day';
        break;
    }

    if (groupingFormat === 'hour') {
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0') + ':00';
        chartDataMap[i] = { name: hour, income: 0, expense: 0 };
      }
    } else if (groupingFormat === 'month') {
      const monthsToShow = Math.ceil(daysToLookBack / 30);
      for (let i = monthsToShow; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        chartDataMap[key] = { name: label, income: 0, expense: 0 };
      }
    } else {
      // Daily grouping with steps
      for (let i = daysToLookBack; i >= 0; i -= (timeRange === 'all' ? Math.max(1, Math.floor(daysToLookBack/10)) : labelStep)) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const key = d.toISOString().split('T')[0];
        chartDataMap[key] = { name: label, income: 0, expense: 0 };
      }
    }

    // Fill data
    invoices.forEach(inv => {
      const date = parseDate(inv.invoiceDate);
      if (groupingFormat === 'hour') {
        if (date.toDateString() === now.toDateString()) {
          // Since we don't have hours in standard invoiceDate, we'll skip or use mock hour
          // If real app has timestamps, use date.getHours()
        }
      } else if (groupingFormat === 'month') {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (chartDataMap[key]) chartDataMap[key].income += inv.total;
      } else {
        const key = date.toISOString().split('T')[0];
        const keys = Object.keys(chartDataMap).sort();
        const closestKey = keys.find(k => k >= key) || keys[keys.length - 1];
        if (closestKey && chartDataMap[closestKey]) chartDataMap[closestKey].income += inv.total;
      }
    });

    expenses.forEach(exp => {
      const date = new Date(exp.date);
      if (groupingFormat === 'hour') {
        // Skip for mock/incomplete hour data
      } else if (groupingFormat === 'month') {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (chartDataMap[key]) chartDataMap[key].expense += exp.amount;
      } else {
        const key = date.toISOString().split('T')[0];
        const keys = Object.keys(chartDataMap).sort();
        const closestKey = keys.find(k => k >= key) || keys[keys.length - 1];
        if (closestKey && chartDataMap[closestKey]) chartDataMap[closestKey].expense += exp.amount;
      }
    });

    const monthlyChartData = Object.values(chartDataMap);

    const mountainMap: {[key: string]: number} = {};
    invoices.forEach(inv => {
      const mtn = inv.gunung.split('-')[0].trim() || 'Unknown';
      mountainMap[mtn] = (mountainMap[mtn] || 0) + 1;
    });

    const mountainChartData = Object.entries(mountainMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { 
      totalRevenue, totalExpenses, netProfit, totalParticipants, 
      monthlyChartData, mountainChartData,
      collectionRate, financialEfficiency, yieldPerPax, burnRate
    };
  }, [invoices, expenses, timeRange]);

  const maxMountainValue = useMemo(() => {
    return Math.max(...stats.mountainChartData.map(d => d.value), 1);
  }, [stats.mountainChartData]);

  const cardStyle = "glass-card p-6 rounded-[28px] border border-white/5 relative overflow-hidden group hover:bg-white/5 transition-all duration-500";

  return (
    <div className="space-y-10 pb-20 font-dm">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase italic leading-none">
            Overview <span className="text-emerald-500/50">Analytics</span>
          </h2>
          <p className="text-slate-400 mt-3 font-bold text-[10px] tracking-[0.4em] uppercase opacity-60 italic">Real-time Performance Hub</p>
        </div>
      </header>

      {/* Modern Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Yield', value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Burn', value: `Rp ${stats.totalExpenses.toLocaleString('id-ID')}`, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Net Profit', value: `Rp ${stats.netProfit.toLocaleString('id-ID')}`, icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Participants', value: `${stats.totalParticipants} Pax`, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((item, i) => (
          <div key={i} className={cardStyle}>
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                  <item.icon size={18} />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 truncate">
              {item.value}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cashflow Trend Area Chart (Income vs Expense) */}
        <div className="lg:col-span-8 glass p-8 rounded-[40px] border border-white/5 shadow-2xl shadow-emerald-950/5 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
               <h3 className="text-lg font-black text-emerald-950 dark:text-white tracking-tight uppercase italic flex items-center gap-2">
                 <Activity size={18} className="text-emerald-500" />
                 Cashflow Trend
               </h3>
               <div className="flex gap-4 mt-1">
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Income</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Expense</span>
                 </div>
               </div>
            </div>
            
            {/* Enhanced Time Range Selector with Dropdown for extended ranges */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-white/5">
               <div className="hidden sm:flex gap-1">
                 {(['24h', '7d', '30d'] as const).map(t => (
                   <button 
                    key={t} 
                    onClick={() => setTimeRange(t)}
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${timeRange === t ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                  >
                     {t}
                   </button>
                 ))}
               </div>
               
               <div className="relative group/range">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-white/50 dark:bg-black/20 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors border border-transparent group-hover/range:border-emerald-500/20">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                      {['90d', '180d', '1y', 'all'].includes(timeRange) ? timeRange : 'Extended'}
                    </span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </div>
                  
                  <div className="absolute right-0 top-full mt-2 w-32 glass rounded-2xl border border-white/10 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/range:opacity-100 group-hover/range:translate-y-0 group-hover/range:pointer-events-auto transition-all z-50 overflow-hidden">
                    <div className="p-1">
                       <button onClick={() => setTimeRange('24h')} className="sm:hidden w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white rounded-xl transition">24h</button>
                       <button onClick={() => setTimeRange('7d')} className="sm:hidden w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white rounded-xl transition">7d</button>
                       <button onClick={() => setTimeRange('30d')} className="sm:hidden w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white rounded-xl transition">30d</button>
                       <button onClick={() => setTimeRange('90d')} className="w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white rounded-xl transition">90 Days</button>
                       <button onClick={() => setTimeRange('180d')} className="w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white rounded-xl transition">180 Days</button>
                       <button onClick={() => setTimeRange('1y')} className="w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white rounded-xl transition">1 Year</button>
                       <button onClick={() => setTimeRange('all')} className="w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white rounded-xl transition border-t border-white/5 mt-1">All Time</button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyChartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'black', textTransform: 'uppercase'}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'black'}} 
                  tickFormatter={(v) => v >= 1000000 ? `${v/1000000}M` : `${v/1000}K`}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(16, 185, 129, 0.1)', strokeWidth: 2 }}
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    backgroundColor: theme === 'dark' ? '#0b120f' : '#fff',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    padding: '16px'
                  }}
                  itemStyle={{fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', padding: '4px 0'}}
                  labelStyle={{fontWeight: '900', fontSize: '10px', color: '#64748b', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#f43f5e" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Circular Distribution Status */}
        <div className="lg:col-span-4 glass p-8 rounded-[40px] border border-white/5 flex flex-col items-center justify-center relative">
          <h3 className="absolute top-8 left-8 text-sm font-black text-emerald-950 dark:text-white tracking-tight uppercase italic flex items-center gap-2">
            <Target size={18} className="text-blue-500" />
            Trip Distribution
          </h3>
          <div className="relative w-full aspect-square flex items-center justify-center">
             <div className="absolute flex flex-col items-center text-center pt-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalParticipants}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Pax</span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.mountainChartData.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="85%"
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationBegin={200}
                >
                  {stats.mountainChartData.slice(0, 5).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {stats.mountainChartData.slice(0, 2).map((mtn, i) => (
                  <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight truncate">{mtn.name}</span>
                      <span className="ml-auto text-[10px] font-black text-slate-900 dark:text-white">{mtn.value}</span>
                  </div>
              ))}
          </div>
        </div>

        {/* Top Destinations Section */}
        <div className="lg:col-span-7 glass p-8 rounded-[40px] border border-white/5 flex flex-col">
          <h3 className="text-lg font-black text-emerald-950 dark:text-white tracking-tight uppercase italic mb-8 flex items-center gap-2">
            <Mountain size={18} className="text-amber-500" />
            Top Destinations
          </h3>
          <div className="space-y-7">
             {stats.mountainChartData.slice(0, 5).map((mtn, i) => (
               <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                       <span className="text-emerald-500/30">#0{i+1}</span> {mtn.name}
                    </span>
                    <span className="text-slate-900 dark:text-white">{mtn.value} Pax</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        style={{ width: `${(mtn.value / maxMountainValue) * 100}%` }}
                     ></div>
                  </div>
               </div>
             ))}
             {stats.mountainChartData.length === 0 && (
                <p className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs italic">No summit data yet</p>
             )}
          </div>
        </div>

        {/* Dynamic System Stats Hub */}
        <div className="lg:col-span-5 glass p-8 rounded-[40px] border border-white/5 flex flex-col">
           <h3 className="text-lg font-black text-emerald-950 dark:text-white tracking-tight uppercase italic mb-8 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            System Health
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
             <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Zap size={10} className="text-amber-500" /> Efficiency
                   </p>
                   <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {stats.financialEfficiency.toFixed(1)}%
                      </span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full mt-2">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.financialEfficiency}%` }}></div>
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Yield / Pax</p>
                   <div className="flex items-end gap-2">
                      <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Rp {Math.round(stats.yieldPerPax/1000)}K
                      </span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full mt-2">
                      <div className="h-full w-[65%] bg-blue-500 rounded-full"></div>
                   </div>
                </div>
             </div>
             <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Collection</p>
                   <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {stats.collectionRate.toFixed(0)}%
                      </span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full mt-2">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${stats.collectionRate}%` }}></div>
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Burn Rate</p>
                   <div className="flex items-end gap-2 text-rose-500">
                      <span className="text-2xl font-black tracking-tighter">
                        {stats.burnRate.toFixed(1)}%
                      </span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full mt-2">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${stats.burnRate}%` }}></div>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="mt-auto pt-8 border-t border-white/5">
             <div className="flex items-center gap-3 text-slate-400">
                <Sparkles size={14} className="text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Operational status: Optimal</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
