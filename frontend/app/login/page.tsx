'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setLoginSuccess(true);
        setUserRole(data.data.role);

        // Store JWT token and authenticated user details
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));

        // Auto redirect after brief success indicator
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        setErrorMessage(data.message || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      console.error('Authentication network error:', err);
      setErrorMessage('Unable to connect to authentication server. Please ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark text-slate-100 bg-slate-950' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-300 relative`}>
      {/* Grid Background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      {/* LEFT FORM COLUMN */}
      <div className="w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-12 z-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-900/60 shadow-xl overflow-y-auto">
        
        {/* Navigation Bar inside panel */}
        <div className="flex justify-between items-center w-full mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <svg className="w-4 h-4 text-zinc-400 group-hover:text-sky-500 transition-colors transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
              Back to home
            </span>
          </Link>

          {/* Theme switcher */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707-.707M6.343 4.343l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Auth Box Center Container */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="CoreWatch Logo" 
                className="h-12 w-auto object-contain shrink-0"
              />
              <span className="text-md font-bold tracking-tight text-zinc-900 dark:text-zinc-50">CoreWatch</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">Login In to Dashboard</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Enter your credentials to access your enterprise role workspace.</p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium leading-relaxed">
              ⚠️ {errorMessage}
            </div>
          )}

          {!loginSuccess ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400" htmlFor="login-email">Work Email</label>
                <input 
                  id="login-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400" htmlFor="login-password">Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset request sent to administrator."); }} className="text-[11px] font-semibold text-sky-500 dark:text-sky-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input 
                  id="login-password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input 
                  id="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500 dark:bg-zinc-950 dark:border-zinc-800"
                />
                <label htmlFor="remember-me" className="text-xs text-zinc-500 dark:text-zinc-400 select-none">
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-600 to-cyan-500 text-white hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Sign In'
                )}
              </button>

            </form>
          ) : (
            <div className="py-8 text-center space-y-4 border border-sky-500/20 bg-sky-500/5 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
                ✓
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Authenticated</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Role classified: <span className="font-bold text-sky-400 uppercase">{userRole}</span>. Loading dashboard...
              </p>
              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

          {/* Footnotes Redirect */}
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2">
            Don't have an enterprise account?{' '}
            <Link href="/signup" className="font-bold text-sky-500 dark:text-sky-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-8">
          CoreWatch Enterprise Auth Security v2.14 · DPDP Compliant
        </div>

      </div>

      {/* RIGHT PREVIEW COLUMN */}
      <div className="hidden lg:flex lg:w-7/12 bg-slate-100 dark:bg-zinc-950 flex-col justify-between p-16 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -left-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top visual detail */}
        <div className="flex justify-between items-center text-xs tracking-wider text-slate-500 dark:text-zinc-500 font-mono z-10">
          <div>// REGION: INBOUND NCR NETWORK</div>
          <div>STATUS: 100% DISPATCH SECURE</div>
        </div>

        {/* Center Mockup representation of core watch dashboard */}
        <div className="max-w-xl w-full mx-auto z-10 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-sky-500 dark:text-sky-400 tracking-widest block font-mono">COREWATCH CONSOLE MOCKUP</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">AI video analytics that turn ordinary cameras into intelligent inspectors</h2>
          </div>

          {/* Interactive Bounding box diagram container */}
          <div className="border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center text-xs font-mono text-slate-600 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                CAM 03 FEED - ACTIVE MONITORING
              </span>
              <span>1080P · 30 FPS</span>
            </div>

            {/* Simulated Stream Grid */}
            <div className="aspect-video w-full bg-zinc-950 rounded-xl border border-zinc-800/80 overflow-hidden relative flex items-center justify-around">
              <div className="absolute inset-0 bg-radial-[circle_at_center,#111827_20%,#030712_85%] opacity-90"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff0003_1px,transparent_1px),linear-gradient(to_bottom,#00ff0003_1px,transparent_1px)] bg-[size:8px_8px]"></div>

              {/* Bounding box mock worker */}
              <div className="border border-cyan-400 bg-cyan-500/10 p-3 rounded text-center text-xs text-white max-w-[120px] font-mono">
                <div className="bg-cyan-400 text-zinc-950 text-[9px] px-1 font-bold rounded mb-1">
                  HELMET: OK (98%)
                </div>
                <svg className="w-10 h-10 text-cyan-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] text-zinc-300">Staff #012</span>
              </div>

              {/* Bounding box mock alert */}
              <div className="border border-red-500 bg-red-500/15 p-3 rounded text-center text-xs text-white max-w-[120px] font-mono animate-pulse">
                <div className="bg-red-600 text-white text-[9px] px-1 font-bold rounded mb-1 animate-bounce">
                  NO HELMET! (99%)
                </div>
                <svg className="w-10 h-10 text-red-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-[10px] text-red-300">Staff #044</span>
              </div>
            </div>
            
            {/* Live event logs */}
            <div className="mt-4 font-mono text-[9px] text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-950/40 border border-red-500/20 dark:border-red-900/50 p-2.5 rounded-lg">
              🚨 ALERT: Safety policy violation detected. Dispatch supervisor notification clip via WhatsApp.
            </div>
          </div>
        </div>

        {/* Bottom Testimonial */}
        <div className="max-w-xl w-full mx-auto z-10 border-t border-slate-200 dark:border-zinc-800/80 pt-6">
          <blockquote className="space-y-2">
            <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed italic">
              "CoreWatch turned our existing security cameras into a proactive risk-prevention engine. Setup was seamless, and alerts integrate straight into our managers' mobile feeds."
            </p>
            <footer className="text-xs font-mono text-slate-500 dark:text-zinc-500">
              — VP Operations, Gurgaon Manufacturing Hub
            </footer>
          </blockquote>
        </div>

      </div>

    </div>
  );
}
