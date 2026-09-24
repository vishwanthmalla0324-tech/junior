import React from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  User, 
  Building2, 
  ShieldAlert, 
  Globe, 
  Sparkles,
  HelpCircle,
  TrendingUp,
  LogIn,
  CheckCircle2
} from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';

export default function Header({ 
  currentPersona, 
  setCurrentPersona, 
  language, 
  setLanguage, 
  pendingAdminCount,
  onOpenDemoGuide,
  totalJobsCount,
  verifiedHiresCount,
  user,
  onOpenAuth
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-sky-900/90 via-slate-900 to-amber-900/90 py-1.5 px-4 text-xs font-medium border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> ₹499 Verification Gate
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline">Employer pays ₹499 → Admin Verifies Worker ID → Phone & Map Route Unlocked</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <button
            onClick={onOpenDemoGuide}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-md border border-amber-500/40 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{t.demoGuide}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Auth */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight font-sans">
                  Job<span className="text-sky-400">Connect</span>
                </h1>
                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Verified Hiring
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">{t.tagline}</p>
            </div>
          </div>

          {/* User Auth Trigger */}
          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-sky-500/40 text-xs text-white font-semibold transition-all cursor-pointer shadow-md"
              >
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-6 h-6 rounded-full object-cover border border-sky-400"
                />
                <span className="hidden sm:inline font-bold truncate max-w-[120px]">{user.displayName}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer border border-slate-200"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google Login</span>
              </button>
            )}

            {/* Mobile language & guide trigger */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={onOpenDemoGuide}
                className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-2 py-1 bg-slate-800 text-sky-400 rounded-lg text-xs font-semibold"
              >
                {language === 'en' ? 'HI' : 'EN'}
              </button>
            </div>
          </div>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner w-full md:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 font-semibold px-3 hidden lg:inline">{t.switchPersona}</span>

          {/* Worker Switch */}
          <button
            onClick={() => setCurrentPersona('worker')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentPersona === 'worker'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/30 border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-sky-300" />
            <span>{t.workerMode}</span>
          </button>

          {/* Employer Switch */}
          <button
            onClick={() => setCurrentPersona('employer')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentPersona === 'employer'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-300" />
            <span>{t.employerMode}</span>
          </button>

          {/* Admin Switch */}
          <button
            onClick={() => setCurrentPersona('admin')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
              currentPersona === 'admin'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>{t.adminMode}</span>

            {pendingAdminCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] animate-bounce">
                {pendingAdminCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

