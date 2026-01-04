
import React, { useState } from 'react';
import { Mountain, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === 'vertara.id') {
        onLogin(true);
      } else {
        setError('Verification failed. Invalid admin credentials.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-dm">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>
      
      {/* Container dioptimalkan ke max-w-lg agar pas di layar */}
      <div className="max-w-lg w-full relative z-10 animate-fade-in py-4">
        {/* Main Login Card - Padding disesuaikan (p-8 md:p-14) */}
        <div className="bg-slate-900/90 backdrop-blur-3xl p-8 md:p-14 rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.7)] border border-white/10 relative overflow-hidden">
          {/* Top Decorative Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
          
          <div className="relative z-10">
            {/* Header Section - Skala lebih proporsional */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-[28px] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] transform rotate-2 hover:rotate-0 transition-all duration-500 group">
                <Mountain className="text-slate-950 group-hover:scale-110 transition-transform" size={40} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
                VERTARA<span className="text-emerald-400">.ID</span>
              </h1>
              <div className="flex items-center gap-2 mt-3 opacity-80">
                <div className="h-px w-6 bg-emerald-500/30"></div>
                <p className="text-[9px] uppercase tracking-[0.4em] font-black text-emerald-400">Command Center</p>
                <div className="h-px w-6 bg-emerald-500/30"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field - py-5 (Optimal Height) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/60 ml-2">Operator ID</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/30 group-focus-within:text-emerald-400 transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter ID"
                    className="w-full pl-15 pr-6 py-5 rounded-2xl bg-slate-950/60 border border-white/5 focus:border-emerald-500/40 focus:bg-slate-950 outline-none transition-all font-bold text-white placeholder:text-slate-700 text-base"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/60 ml-2">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/30 group-focus-within:text-emerald-400 transition-colors" size={20} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-15 pr-15 py-5 rounded-2xl bg-slate-950/60 border border-white/5 focus:border-emerald-500/40 focus:bg-slate-950 outline-none transition-all font-bold text-white placeholder:text-slate-700 text-base"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-400 transition-colors p-2"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-400 animate-shake">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <p className="text-[11px] font-bold uppercase tracking-tight">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 rounded-2xl shadow-[0_15px_35px_-10px_rgba(16,185,129,0.4)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span className="text-[11px] uppercase tracking-[0.2em]">Enter System</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform opacity-70" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer Badges - Dikecilkan agar tidak mendorong form ke atas */}
        <div className="mt-8 flex flex-col items-center gap-5">
           <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
              <Sparkles size={12} className="text-emerald-400" />
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
                Secure Protocol Active
              </p>
           </div>
           <div className="flex gap-3 opacity-10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder {
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 10px;
          font-weight: 800;
          opacity: 0.3;
        }
        .pl-15 { padding-left: 3.75rem; }
        .pr-15 { padding-right: 3.75rem; }
      `}</style>
    </div>
  );
};

export default Login;
