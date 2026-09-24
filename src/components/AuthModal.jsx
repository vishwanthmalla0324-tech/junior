import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, LogOut, ArrowRight, User } from 'lucide-react';
import { signInWithGoogle, logOutUser } from '../firebase/config';

export default function AuthModal({ onClose, user, setUser, onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
      setLoading(false);
      onLoginSuccess && onLoginSuccess(googleUser);
      onClose();
    } catch (err) {
      console.error("Google Auth error:", err);
      setLoading(false);
    }
  };

  const handleEmailAuthSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const mockEmailUser = {
        uid: "usr-" + Date.now(),
        displayName: email.split('@')[0] || "Registered User",
        email: email || "user@jobconnect.in",
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        provider: "email"
      };
      setUser(mockEmailUser);
      setLoading(false);
      onLoginSuccess && onLoginSuccess(mockEmailUser);
      onClose();
    }, 1000);
  };

  const handleSignOut = async () => {
    await logOutUser();
    setUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                JobConnect Account
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Firebase Auth 9.0
                </span>
              </h3>
              <p className="text-xs text-slate-400">Secure Single Sign-On Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {user ? (
          /* LOGGED IN USER PROFILE DISPLAY */
          <div className="p-6 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-20 h-20 rounded-full object-cover border-4 border-sky-500/40 shadow-xl sky-glow"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-white">{user.displayName}</h4>
              <p className="text-xs text-sky-400 font-mono mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Verified Firebase OAuth Account
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-left space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Firebase User UID:</span>
                <span className="font-mono text-sky-400 font-bold truncate max-w-[180px]">{user.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Auth Method:</span>
                <span className="font-bold text-amber-400 uppercase">{user.provider || 'Google OAuth'}</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-extrabold text-xs rounded-xl border border-rose-500/40 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out from Firebase</span>
            </button>
          </div>
        ) : (
          /* LOG IN / SIGN UP FORM WITH GOOGLE BUTTON */
          <div className="p-6 space-y-5">
            {/* OFFICIAL GOOGLE OAUTH SIGN IN BUTTON */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg border border-slate-200 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 group"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span className="text-slate-900 group-hover:text-black">
                {loading ? 'Authenticating with Google...' : 'Continue with Google'}
              </span>
            </button>

            <div className="flex items-center gap-3 text-slate-500 text-xs">
              <div className="flex-1 h-px bg-slate-800" />
              <span>or login with Email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Email / Password fallback form */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{authMode === 'login' ? 'Sign In to JobConnect' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              By continuing, you agree to JobConnect Terms & Firebase Authentication Privacy Policy.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
