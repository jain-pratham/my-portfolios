"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, User as UserIcon, Loader2, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const res = await apiClient("/auth/login", {
          method: "POST",
          body: { email, password },
        });
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        }));

        setMessage({ type: "success", text: "Logged in successfully! Redirecting..." });
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        const res = await apiClient("/auth/register", {
          method: "POST",
          body: { name, email, password, role },
        });

        setMessage({
          type: "success",
          text: `Account created successfully! Log in to continue.`,
        });
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSeed = async () => {
    setSeeding(true);
    setMessage(null);
    try {
      // Connects to /api/seed
      const res = await fetch("http://localhost:5000/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({
          type: "success",
          text: "Database seeded successfully! Try logging in with the credentials below.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Database already contains users.",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: "Could not connect to backend server. Make sure backend is running.",
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black z-0" />
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md px-6 py-12 z-10">
        
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 p-[1px] shadow-lg shadow-indigo-500/20 mb-4 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center w-full h-full bg-zinc-950 rounded-2xl">
              <Shield className="w-7 h-7 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            CoreWatch CRM
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Security SaaS Lead Management & Dashboard
          </p>
        </div>

        {/* Card Panel */}
        <div className="bg-zinc-950/45 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl shadow-black/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Account Role</label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors">
                    <span className="text-sm text-zinc-300">Sales User</span>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === "user"}
                      onChange={() => setRole("user")}
                      className="accent-violet-500"
                    />
                  </label>
                  <label className="flex-1 flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors">
                    <span className="text-sm text-zinc-300">Admin</span>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === "admin"}
                      onChange={() => setRole("admin")}
                      className="accent-violet-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Error / Success message */}
            {message && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-medium leading-relaxed ${
                  message.type === "success"
                    ? "bg-emerald-950/20 border-emerald-800/80 text-emerald-400"
                    : "bg-rose-950/20 border-rose-800/80 text-rose-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {loading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center text-xs">
            <span className="text-zinc-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
              }}
              className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer transition-colors"
            >
              {isLogin ? "Create one now" : "Sign in here"}
            </button>
          </div>
        </div>

        {/* Database Seeder Controls for demo convenience */}
        <div className="mt-6 bg-zinc-950/25 border border-zinc-900 rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Setup Demo Accounts
          </div>
          <p className="text-[11px] text-zinc-500 mb-3 leading-normal">
            Fresh database? Click the seed button below to automatically create dummy leads, Admin, and User accounts.
          </p>
          <button
            onClick={handleQuickSeed}
            disabled={seeding}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-medium border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            {seeding ? <Loader2 className="w-3 h-3 animate-spin" /> : "Seed Database"}
          </button>

          <div className="mt-3.5 grid grid-cols-2 gap-3 text-[11px] text-left border-t border-zinc-900 pt-3">
            <div>
              <p className="font-semibold text-zinc-400 mb-0.5">Admin Account:</p>
              <code className="text-zinc-500 block">admin@corewatch.com</code>
              <code className="text-zinc-500 block">password123</code>
            </div>
            <div>
              <p className="font-semibold text-zinc-400 mb-0.5">Sales User Account:</p>
              <code className="text-zinc-500 block">agent@corewatch.com</code>
              <code className="text-zinc-500 block">password123</code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
