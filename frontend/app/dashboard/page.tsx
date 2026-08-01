'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'demo';
  company?: string;
  token?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  cameras: number;
  plan: string;
  status: 'Active' | 'Pending' | 'Suspended';
}

interface SecurityEvent {
  id: string;
  type: string;
  camera: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  status: 'unread' | 'read';
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // New Customer Form State (Admin)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    company: '',
    cameras: 5,
    plan: 'Enterprise Pro',
  });
  const [customerSuccessMsg, setCustomerSuccessMsg] = useState<string | null>(null);

  // Initial Sample Data
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'CUST-101', name: 'Pratham Jain', email: 'pratham@tieraindia.com', company: 'Tiera India Logistics', cameras: 12, plan: 'Enterprise Pro', status: 'Active' },
    { id: 'CUST-102', name: 'Aarya Sharma', email: 'aarya@visagroup.org', company: 'Aarya Visa Services', cameras: 8, plan: 'Standard AI', status: 'Active' },
    { id: 'CUST-103', name: 'Vikram Mehta', email: 'vikram@mehtatech.io', company: 'Mehta Precision Components', cameras: 24, plan: 'Enterprise Max', status: 'Active' },
    { id: 'CUST-104', name: 'Rohan Gupta', email: 'rohan@guptawarehouse.com', company: 'Gupta Warehousing NCR', cameras: 16, plan: 'Standard AI', status: 'Pending' },
  ]);

  const [events, setEvents] = useState<SecurityEvent[]>([
    { id: 'EVT-901', type: 'No Helmet Violation', camera: 'CAM-03 Warehouse', severity: 'high', time: '10 mins ago', status: 'unread' },
    { id: 'EVT-902', type: 'Unclassified Person Detected', camera: 'CAM-01 Main Gate', severity: 'medium', time: '25 mins ago', status: 'unread' },
    { id: 'EVT-903', type: 'Perimeter Intrusion', camera: 'CAM-04 Fence Line', severity: 'high', time: '1 hour ago', status: 'read' },
    { id: 'EVT-904', type: 'Safety Mask Compliant', camera: 'CAM-02 Dock B', severity: 'low', time: '2 hours ago', status: 'read' },
  ]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Theme detection
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Auth verification
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Verify profile with backend API
      fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setUser({ ...data.data, token: storedToken });
            localStorage.setItem('user', JSON.stringify({ ...data.data, token: storedToken }));
          }
        })
        .catch((err) => console.log('Auth check note:', err))
        .finally(() => setLoading(false));
    } catch {
      router.push('/login');
    }
  }, [router, API_URL]);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleUpgradeDemoToUser = async () => {
    if (!user || user.role !== 'demo') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    setUpgrading(true);
    setUpgradeMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: 'user' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const updatedUser = { ...user, role: 'user' as const };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUpgradeMsg('🎉 Account upgraded successfully from DEMO to USER role!');
      } else {
        setUpgradeMsg(`Upgrade failed: ${data.message || 'Error occurred'}`);
      }
    } catch {
      const updatedUser = { ...user, role: 'user' as const };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUpgradeMsg('🎉 Account upgraded successfully from DEMO to USER role!');
    } finally {
      setUpgrading(false);
    }
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.company) return;

    const createdCust: Customer = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: newCustomer.name,
      email: newCustomer.email,
      company: newCustomer.company,
      cameras: Number(newCustomer.cameras),
      plan: newCustomer.plan,
      status: 'Active',
    };

    setCustomers([createdCust, ...customers]);
    setCustomerSuccessMsg(`Customer ${newCustomer.name} added successfully!`);
    setNewCustomer({ name: '', email: '', company: '', cameras: 5, plan: 'Enterprise Pro' });

    setTimeout(() => setCustomerSuccessMsg(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-mono">Loading CoreWatch Workspace...</p>
        </div>
      </div>
    );
  }

  // Define Navigation Menus for each Role
  const roleMenus = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'add_customer', label: 'Add Customer', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
      { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      { id: 'subscription', label: 'Subscription', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    ],
    user: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'live_camera', label: 'Live Camera', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
      { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      { id: 'subscription_detail', label: 'Subscription Detail', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 'event_history', label: 'Event History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
      { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { id: 'notification', label: 'Notification', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    ],
    demo: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'demo_overview', label: 'Demo Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { id: 'upgrade_account', label: 'Upgrade Account', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    ],
  };

  const currentRole = user?.role || 'user';
  const menuItems = roleMenus[currentRole];

  // Helper for User Badge Styling
  const roleBadgeStyle = {
    admin: { label: 'COMPANY ADMIN', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    user: { label: 'STANDARD USER', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    demo: { label: 'DEMO TESTER', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  }[currentRole];

  const avatarInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CW';

  return (
    <div className={`min-h-screen flex font-sans ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR (Deep Corporate Navy Slate) */}
      {/* ========================================================================= */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-30 select-none shadow-xl`}>
        
        <div>
          {/* Top Brand & Logo */}
          <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            {!sidebarCollapsed ? (
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-wider uppercase">
                {currentRole === 'admin' ? 'CoreWatch Admin' : currentRole === 'demo' ? 'CoreWatch Demo' : 'CoreWatch User'}
              </span>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-sky-500/20 mx-auto">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            )}

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>

          {/* User Profile Card inside Sidebar Header */}
          {!sidebarCollapsed && (
            <div className="p-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-full bg-pink-600 text-white font-black text-sm flex items-center justify-center relative shrink-0 shadow-md">
                {avatarInitials}
                <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </div>
              <div className="truncate">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{user?.role}</div>
              </div>
            </div>
          )}

          {/* Navigation Links Menu */}
          <nav className="px-3 py-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-600 dark:bg-sky-500 dark:text-slate-950 font-bold shadow-sm shadow-sky-500/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/70'
                  }`}
                  title={item.label}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {!sidebarCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {!sidebarCollapsed && (item.id === 'settings' || item.id === 'add_customer') && (
                    <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          {!sidebarCollapsed ? (
            <div className="grid grid-cols-2 gap-1 mb-1">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </button>

              <button
                onClick={() => alert("Password management panel opened.")}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Password</span>
              </button>
            </div>
          ) : null}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* RIGHT MAIN WORKSPACE AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50 capitalize">
              {activeTab.replace('_', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* Theme Toggle (Light / Dark Switch) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Light</span>
              <button
                onClick={toggleTheme}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${
                  theme === 'dark' ? 'bg-sky-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center text-[10px]">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </div>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer relative"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-2xl z-50">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Live Notifications</span>
                    <span className="text-[10px] text-sky-500 dark:text-sky-400 font-bold">2 Unread</span>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="text-xs p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                      🚨 CAM-03 No Helmet alert logged.
                    </div>
                    <div className="text-xs p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400">
                      ✅ System health check 100% OK.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {avatarInitials}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">{user?.role}</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 shadow-2xl z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{user?.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 font-bold hover:bg-red-500/10 rounded-lg mt-1 transition-colors cursor-pointer">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* WORKSPACE CONTENT BODY */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* =================================================================== */}
          {/* 1. ADMIN ROLE TAB VIEWS */}
          {/* =================================================================== */}
          {currentRole === 'admin' && (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Executive Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Enterprise Clients</div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white">128</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ +14% from last month</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active CCTV Camera Nodes</div>
                      <div className="text-3xl font-black text-sky-500 dark:text-sky-400">1,420</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">99.8% Online uptime</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Safety Alerts Processed</div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white">45,892</div>
                      <div className="text-[11px] text-sky-500 dark:text-sky-400 font-semibold">Real-time dispatched</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">System Role Status</div>
                      <div className="text-xl font-black text-red-600 dark:text-red-400 uppercase">SUPER ADMIN</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Full system access privileges</div>
                    </div>
                  </div>

                  {/* Customer Directory Table */}
                  <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">Enterprise Customer Directory</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage client accounts, camera quotas, and billing status.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('add_customer')}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all cursor-pointer shadow-md shadow-sky-600/10"
                      >
                        + Add New Customer
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] bg-slate-50/70 dark:bg-slate-900">
                          <tr>
                            <th className="py-3 px-4">Client ID</th>
                            <th className="py-3 px-4">Name & Email</th>
                            <th className="py-3 px-4">Company</th>
                            <th className="py-3 px-4">Cameras</th>
                            <th className="py-3 px-4">Plan Tier</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                          {customers.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                              <td className="py-3 px-4 font-mono font-bold text-sky-500 dark:text-sky-400">{c.id}</td>
                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900 dark:text-slate-100">{c.name}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">{c.email}</div>
                              </td>
                              <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{c.company}</td>
                              <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{c.cameras} Nodes</td>
                              <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{c.plan}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  c.status === 'Active' ? 'bg-sky-500/20 text-sky-700 dark:text-sky-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'add_customer' && (
                <div className="max-w-2xl mx-auto border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-50">Add Enterprise Customer</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Register a new client organization for CCTV AI inspection.</p>
                  </div>

                  {customerSuccessMsg && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                      ✅ {customerSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Customer Full Name</label>
                      <input
                        type="text"
                        required
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="e.g. Pratham User"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Work Email Address</label>
                      <input
                        type="email"
                        required
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="pratham@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Company / Organization Name</label>
                      <input
                        type="text"
                        required
                        value={newCustomer.company}
                        onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                        placeholder="e.g. Tiera India Ltd"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Camera Licenses</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={newCustomer.cameras}
                          onChange={(e) => setNewCustomer({ ...newCustomer, cameras: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Subscription Tier</label>
                        <select
                          value={newCustomer.plan}
                          onChange={(e) => setNewCustomer({ ...newCustomer, plan: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500"
                        >
                          <option value="Standard AI">Standard AI</option>
                          <option value="Enterprise Pro">Enterprise Pro</option>
                          <option value="Enterprise Max">Enterprise Max</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-sky-600/20"
                    >
                      Save & Provision Customer Account
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Admin System Settings</h2>
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">AI Model Detection Sensitivity</div>
                        <div className="text-slate-500 dark:text-slate-400">Adjust confidence threshold for helmet & safety alerts.</div>
                      </div>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">95% (High Precision)</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">Real-time WhatsApp Webhook Gateway</div>
                        <div className="text-slate-500 dark:text-slate-400">Automated dispatch clips to safety managers.</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">ENABLED</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
                    <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Standard Tier</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">$499 <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Up to 10 Cameras, basic helmet detection.</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-sky-500 bg-sky-500/10 space-y-4 relative shadow-md">
                    <span className="absolute -top-3 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-600 text-white">POPULAR</span>
                    <div className="text-xs font-mono uppercase text-sky-500 dark:text-sky-400 font-bold">Enterprise Pro</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">$1,299 <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Up to 30 Cameras, custom AI rules + WhatsApp alerts.</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
                    <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Custom Max</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">Contact Us</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Unlimited camera nodes & dedicated GPU server cluster.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* =================================================================== */}
          {/* 2. USER ROLE TAB VIEWS */}
          {/* =================================================================== */}
          {currentRole === 'user' && (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Active Cameras</div>
                      <div className="text-3xl font-black text-sky-500 dark:text-sky-400">8 Feeds</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">100% Active stream</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Today's Safety Violations</div>
                      <div className="text-3xl font-black text-red-600 dark:text-red-400">3 Alerts</div>
                      <div className="text-[11px] text-red-600 dark:text-red-400">Action required</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Account Subscription</div>
                      <div className="text-xl font-black text-slate-900 dark:text-white uppercase">ENTERPRISE PRO</div>
                      <div className="text-[11px] text-sky-500 dark:text-sky-400 font-semibold">Active · Renews next month</div>
                    </div>
                  </div>

                  <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">Recent Security Alerts</h2>
                    <div className="space-y-3">
                      {events.map((evt) => (
                        <div key={evt.id} className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950 flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{evt.type}</div>
                            <div className="text-slate-500 dark:text-slate-400 font-mono">{evt.camera} · {evt.time}</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] ${
                            evt.severity === 'high' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                          }`}>
                            {evt.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'live_camera' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Live CCTV Inspection Feeds</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Real-time video analytics with automated bounding boxes.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-mono text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      LIVE FEED
                    </span>
                  </div>

                  <div className="aspect-video w-full max-w-4xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative flex items-center justify-around p-8 shadow-2xl">
                    <div className="absolute top-4 left-4 font-mono text-xs text-slate-400 bg-slate-900/80 px-3 py-1 rounded border border-slate-800">
                      CAM-03 LOGISTICS DOCK · 1080P @ 30FPS
                    </div>

                    <div className="border-2 border-cyan-400 bg-cyan-500/10 p-4 rounded-xl text-center text-xs font-mono">
                      <div className="bg-cyan-400 text-slate-950 text-[10px] px-2 py-0.5 font-bold rounded mb-2">
                        HELMET: OK (98%)
                      </div>
                      <svg className="w-16 h-16 text-cyan-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-slate-300">Staff #012</span>
                    </div>

                    <div className="border-2 border-red-500 bg-red-500/15 p-4 rounded-xl text-center text-xs font-mono animate-pulse">
                      <div className="bg-red-600 text-white text-[10px] px-2 py-0.5 font-bold rounded mb-2 animate-bounce">
                        NO HELMET DETECTED!
                      </div>
                      <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-red-300">Staff #044</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscription_detail' && (
                <div className="max-w-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Subscription Details</h2>
                    <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs">Active Plan</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-1">PLAN NAME</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Enterprise Pro</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-1">CAMERA LICENSES</span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">12 / 20 Allocated</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-1">BILLING CYCLE</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Monthly ($1,299)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-1">RENEWAL DATE</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Sept 01, 2026</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'event_history' && (
                <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Security Event History Log</h2>
                  <div className="space-y-3">
                    {events.map((evt) => (
                      <div key={evt.id} className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{evt.type}</div>
                          <div className="text-slate-500 dark:text-slate-400 font-mono">{evt.camera} · {evt.time}</div>
                        </div>
                        <span className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                          {evt.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">User Account Profile</h2>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Full Name</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{user?.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Email</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Account Role</span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 uppercase">{user?.role}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notification' && (
                <div className="max-w-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Notification Preferences</h2>
                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-emerald-600" />
                      <span>Email Alerts for High Severity Violations</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-emerald-600" />
                      <span>WhatsApp Supervisor Dispatches</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">User Preferences</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Configure workspace display options.</p>
                </div>
              )}
            </>
          )}

          {/* =================================================================== */}
          {/* 3. DEMO ROLE TAB VIEWS */}
          {/* =================================================================== */}
          {currentRole === 'demo' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {upgradeMsg && (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold text-center animate-bounce">
                  {upgradeMsg}
                </div>
              )}

              <div className="border border-amber-500/30 bg-amber-500/10 rounded-2xl p-8 text-center space-y-6 shadow-lg">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  ⚡
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Demo Session Active</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    You are exploring the CoreWatch enterprise console in Demo Preview mode. Click below to upgrade this demo account to a full <strong>USER</strong> account instantly!
                  </p>
                </div>

                <button
                  onClick={handleUpgradeDemoToUser}
                  disabled={upgrading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-black text-xs uppercase tracking-wider hover:from-sky-500 hover:to-cyan-400 transition-all shadow-xl shadow-sky-600/20 cursor-pointer disabled:opacity-50"
                >
                  {upgrading ? 'Upgrading Role...' : '⚡ Upgrade Account to Full USER Role'}
                </button>
              </div>

              <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
                📌 Demo workspace canvas. Additional custom interactive demos will be loaded here.
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
