'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar, { NavItem } from '../../components/layout/Sidebar';
import { LayoutDashboard, Users, UserPlus, Settings, CreditCard, Video, History, UserCircle, Bell, Eye, ArrowUpCircle, Map } from 'lucide-react';

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


const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard?tab=dashboard', icon: LayoutDashboard, roles: ['admin', 'user', 'demo'] },
  { label: 'Customers', href: '/dashboard?tab=all_customers', icon: Users, roles: ['admin'], children: [
    { label: 'All Customers', href: '/dashboard?tab=all_customers', icon: Users },
    { label: 'Add Customer', href: '/dashboard?tab=add_customer', icon: UserPlus }
  ]},
  { label: 'Settings', href: '/dashboard?tab=settings', icon: Settings, roles: ['admin', 'user'] },
  { label: 'Subscription', href: '/dashboard?tab=subscription', icon: CreditCard, roles: ['admin'] },
  { label: 'Live Camera', href: '/dashboard?tab=live_camera', icon: Video, roles: ['user'] },
  { label: 'Security Zones', href: '/dashboard?tab=zones', icon: Map, roles: ['user'] },
  { label: 'Subscription Detail', href: '/dashboard?tab=subscription_detail', icon: CreditCard, roles: ['user'] },
  { label: 'Event History', href: '/dashboard?tab=event_history', icon: History, roles: ['user'] },
  { label: 'Profile', href: '/dashboard?tab=profile', icon: UserCircle, roles: ['user'] },
  { label: 'Notification', href: '/dashboard?tab=notification', icon: Bell, roles: ['user'] },
  { label: 'Demo Overview', href: '/dashboard?tab=demo_overview', icon: Eye, roles: ['demo'] },
  { label: 'Upgrade Account', href: '/dashboard?tab=upgrade_account', icon: ArrowUpCircle, roles: ['demo'] },
];

import { Suspense } from 'react';
import ZoneManagementView from '../../components/zones/ZoneManagementView';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get('tab');
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<string>(urlTab || 'dashboard');

  useEffect(() => {
    if (urlTab) setActiveTab(urlTab);
  }, [urlTab]);
  const [tabLoaded, setTabLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Escape key press handler for mobile menu drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Next.js MongoDB multi-tenant camera & alert state
  const [cameras, setCameras] = useState<any[]>([]);
  const [dbAlerts, setDbAlerts] = useState<any[]>([]);
  const [activeCameraKey, setActiveCameraKey] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    customers: true,
  });

  // New Customer Form State (Admin)
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    cameras: 5,
    plan: 'Enterprise Pro',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
  });
  const [customerSuccessMsg, setCustomerSuccessMsg] = useState<string | null>(null);
  const [customerErrorMsg, setCustomerErrorMsg] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [isSubmittingCustomer, setIsSubmittingCustomer] = useState(false);

  // Initial Sample Data (Admin/Fallback)
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'CUST-101', name: 'Pratham Jain', email: 'pratham@tieraindia.com', company: 'Tiera India Logistics', cameras: 12, plan: 'Enterprise Pro', status: 'Active' },
    { id: 'CUST-102', name: 'Aarya Sharma', email: 'aarya@visagroup.org', company: 'Aarya Visa Services', cameras: 8, plan: 'Standard AI', status: 'Active' },
    { id: 'CUST-103', name: 'Vikram Mehta', email: 'vikram@mehtatech.io', company: 'Mehta Precision Components', cameras: 24, plan: 'Enterprise Max', status: 'Active' },
    { id: 'CUST-104', name: 'Rohan Gupta', email: 'rohan@guptawarehouse.com', company: 'Gupta Warehousing NCR', cameras: 16, plan: 'Standard AI', status: 'Pending' },
  ]);


  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // 1. Initial User Authentication Check
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
      setUser({ ...parsedUser, token: storedToken });

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
            const freshUser = data.data;
            setUser({ ...freshUser, token: storedToken });
            localStorage.setItem('user', JSON.stringify({ ...freshUser, token: storedToken }));

            if (freshUser.role !== 'admin') {
              // Fetch customer profile to check if setup is complete
              fetch(`${API_URL}/api/customers/me`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${storedToken}`,
                },
              })
                .then((cRes) => cRes.json())
                .then((cData) => {
                  if (cData.success && cData.data && cData.data.status === 'Active') {
                    // Allowed to enter dashboard
                    setLoading(false);
                  } else {
                    // Pending status or no customer profile: redirect to wizard
                    router.push('/signup-steps');
                  }
                })
                .catch(() => {
                  router.push('/signup-steps');
                });
            } else {
              setLoading(false);
            }
          } else {
            router.push('/login');
          }
        })
        .catch((err) => {
          console.log('Auth check note:', err);
          setLoading(false);
        });
    } catch {
      router.push('/login');
    }
  }, [router, API_URL]);

  // Persist active tab selection across refreshes
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
    setTabLoaded(true);
  }, []);

  useEffect(() => {
    if (tabLoaded) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab, tabLoaded]);

  // 2. Fetch Cameras and Poll Alerts from MongoDB (scoped to user)
  useEffect(() => {
    if (!user || !user.token) return;
    const token = user.token;

    const provisionFirstCamera = async () => {
      try {
        const res = await fetch('/api/cameras', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ locationName: "Main Shop" })
        });
        const data = await res.json();
        if (data.success && data.data) {
          setCameras([data.data]);
          setActiveCameraKey(data.data.cameraKey);
        }
      } catch (err) {
        console.log("Failed to provision default camera:", err);
      }
    };

    const loadCameras = async () => {
      try {
        const res = await fetch('/api/cameras', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setCameras(data.data);
          if (data.data.length > 0) {
            setActiveCameraKey(data.data[0].cameraKey);
          } else {
            // No camera provisioned yet, create one automatically
            await provisionFirstCamera();
          }
        }
      } catch (err) {
        console.log("Failed to load cameras:", err);
      }
    };

    const loadAlerts = async () => {
      try {
        const res = await fetch('/api/alerts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setDbAlerts(data.data);
        }
      } catch (err) {
        console.log("Failed to load alerts:", err);
      }
    };

    const loadCustomers = async () => {
      if (user?.role !== 'admin') return;
      try {
        const res = await fetch(`${API_URL}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setCustomers(data.data);
        }
      } catch (err) {
        console.log("Failed to load customers list:", err);
      }
    };

    loadCameras();
    loadAlerts();
    loadCustomers();

    // Poll Next.js Alerts API every 3 seconds
    const interval = setInterval(loadAlerts, 3000);
    return () => clearInterval(interval);

  }, [user]);


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

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setCustomerSuccessMsg(null);
    setCustomerErrorMsg(null);
    const errors: Record<string, string> = {};
    
    if (!newCustomer.firstName.trim()) {
      errors.firstName = 'First Name is required.';
    }
    if (!newCustomer.lastName.trim()) {
      errors.lastName = 'Last Name is required.';
    }
    
    if (!newCustomer.email.trim()) {
      errors.email = 'Work Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    
    const digitsOnly = newCustomer.phone.replace(/\D/g, '');
    if (!newCustomer.phone.trim()) {
      errors.phone = 'Phone Number is required.';
    } else if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      errors.phone = 'Please enter a valid phone number (8 to 15 digits).';
    }
    
    if (!newCustomer.company.trim()) {
      errors.company = 'Company / Organization Name is required.';
    }
    
    if (!newCustomer.addressLine1.trim()) {
      errors.addressLine1 = 'Address Line 1 is required.';
    }
    
    if (!newCustomer.country.trim()) {
      errors.country = 'Country is required.';
    }
    
    if (!newCustomer.state.trim()) {
      errors.state = 'State / Region is required.';
    }
    
    if (!newCustomer.city.trim()) {
      errors.city = 'City is required.';
    }
    
    const pinTrimmed = newCustomer.pincode.trim();
    if (!pinTrimmed) {
      errors.pincode = 'ZIP / Postal Code is required.';
    } else if (!/^[A-Za-z0-9\s\-]{4,10}$/.test(pinTrimmed)) {
      errors.pincode = 'Please enter a valid ZIP / Postal Code.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      
      // Smooth scroll to the first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstErrorField}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Try focusing the inner input element
        const inputEl = element.querySelector('input, select');
        if (inputEl) {
          setTimeout(() => {
            (inputEl as HTMLElement).focus();
          }, 300);
        }
      }
      return;
    }

    setFormErrors({});
    setIsSubmittingCustomer(true);

    try {
      const customerToSubmit = {
        ...newCustomer,
        phone: `${selectedCountryCode} ${newCustomer.phone.trim()}`.trim(),
      };

      const res = await fetch(`${API_URL}/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(customerToSubmit),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCustomerSuccessMsg(`Customer ${newCustomer.firstName} ${newCustomer.lastName} added successfully! Setup email sent.`);
        setNewCustomer({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          cameras: 5,
          plan: 'Enterprise Pro',
          addressLine1: '',
          addressLine2: '',
          country: '',
          state: '',
          city: '',
          pincode: '',
        });
        setSelectedCountryCode('+91');

        // Reload customer directory
        if (user?.token) {
          const resList = await fetch(`${API_URL}/api/customers`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const dataList = await resList.json();
          if (dataList.success && dataList.data) {
            setCustomers(dataList.data);
          }
        }
      } else {
        setCustomerErrorMsg(data.message || "Failed to create customer.");
        document.getElementById('add-customer-header')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      setCustomerErrorMsg("Network error: failed to submit customer information.");
      document.getElementById('add-customer-header')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      setIsSubmittingCustomer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-xs font-mono">Loading CoreWatch Workspace...</p>
        </div>
      </div>
    );
  }

  // Define Navigation Menus for each Role
  const roleMenus: Record<string, any[]> = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      {
        id: 'customers',
        label: 'Customers',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        subItems: [
          { id: 'all_customers', label: 'All Customers', icon: 'M4 6h16M4 12h16M4 18h16' },
          { id: 'add_customer', label: 'Add Customer', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' }
        ]
      },
      { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      { id: 'subscription', label: 'Subscription', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    ],
    user: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'live_camera', label: 'Live Camera', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
      { id: 'zones', label: 'Security Zones', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
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
    user: { label: 'STANDARD USER', color: 'bg-brand-blue/20 text-brand-blue dark:text-brand-light-blue border-brand-blue/30' },
    demo: { label: 'DEMO TESTER', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  }[currentRole];

  const avatarInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CW';

  return (
    <div className={`h-screen overflow-hidden flex font-sans bg-background text-foreground transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      <Sidebar
        items={NAVIGATION_ITEMS}
        user={{ firstName: user?.name, email: user?.email, role: currentRole }}
        logoIcon={LayoutDashboard}
        logoTitle="COREWATCH"
        logoSubtitle="Control Center"
        profileHref="/dashboard?tab=profile"
        changePasswordHref="/dashboard?tab=profile"
        twoFactorHref="/dashboard?tab=profile"
        mobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        onLogout={() => { localStorage.clear(); router.push('/login'); }}
      />
      {/* ========================================================================= */}
      {/* RIGHT MAIN WORKSPACE AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
           {/* TOP HEADER BAR */}
        <header className="h-16 border-b border-border bg-sidebar/90 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              title="Open Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
<h1 className="text-lg font-bold text-foreground capitalize">
              {activeTab.replace('_', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Theme Toggle (Light / Dark Switch) */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className={`relative w-12 h-6.5 rounded-full p-1 transition-all duration-300 ease-in-out cursor-pointer flex items-center border border-border shadow-inner ${
                  theme === 'dark' ? 'bg-[#0E0F12]' : 'bg-muted'
                }`}
              >
                <div 
                  className={`w-4.5 h-4.5 rounded-full bg-[#3E160C] dark:bg-brand-gold shadow-md flex items-center justify-center transition-all duration-300 ease-in-out ${
                    theme === 'dark' ? 'translate-x-5 rotate-[360deg]' : 'translate-x-0 rotate-0'
                  }`}
                >
                  {theme === 'dark' ? (
                    <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10C2.2 6.8 6.5 2.5 12 2.2c.4 0 .7.2.9.5.2.3.2.7 0 1-.8 1.4-1.2 3.1-1.2 4.8 0 4.7 3.8 8.5 8.5 8.5 1.7 0 3.4-.4 4.8-1.2.3-.2.7-.2 1 0 .3.2.5.5.5.9-.3 5.5-4.6 9.8-10.2 9.8zm.9-17.6c-4.2.4-7.5 3.8-7.5 8.1 0 4.4 3.6 8 8 8 4.3 0 7.7-3.3 8.1-7.5-1.1.6-2.4.9-3.8.9-5.8 0-10.5-4.7-10.5-10.5 0-1.4.3-2.7.9-3.8z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-[#FAF6EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707-.707M6.343 4.343l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer relative"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl z-50">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-xs font-bold text-foreground">Live Notifications</span>
                    <span className="text-[10px] text-brand-gold-light dark:text-[#C0A06E] font-bold">2 Unread</span>
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#785D32] text-white font-black text-[10px] flex items-center justify-center">
                  {avatarInitials}
                </div>
                <span className="text-xs font-bold text-foreground uppercase">{user?.role}</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-2xl z-50 text-xs">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="font-bold text-foreground">{user?.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
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
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">Total Enterprise Clients</div>
                      <div className="text-3xl font-black text-foreground">128</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ +14% from last month</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">Active CCTV Camera Nodes</div>
                      <div className="text-3xl font-black text-brand-blue dark:text-brand-light-blue">1,420</div>
                      <div className="text-[11px] text-muted-foreground">99.8% Online uptime</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">AI Safety Alerts Processed</div>
                      <div className="text-3xl font-black text-foreground">45,892</div>
                      <div className="text-[11px] text-brand-blue dark:text-brand-light-blue font-semibold">Real-time dispatched</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">System Role Status</div>
                      <div className="text-xl font-black text-red-600 dark:text-red-400 uppercase">SUPER ADMIN</div>
                      <div className="text-[11px] text-muted-foreground">Full system access privileges</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'all_customers' && (
                <div className="space-y-6">
                  {/* Customer Directory Table */}
                  <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-base font-bold text-foreground">Enterprise Customer Directory</h2>
                        <p className="text-xs text-muted-foreground">Manage client accounts, camera quotas, and billing status.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('add_customer')}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white transition-all cursor-pointer shadow-md shadow-brand-blue/10"
                      >
                        + Add New Customer
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-border text-muted-foreground uppercase font-mono text-[10px] bg-muted/50">
                          <tr>
                            <th className="py-3 px-4">Client ID</th>
                            <th className="py-3 px-4">Name & Email</th>
                            <th className="py-3 px-4">Company</th>
                            <th className="py-3 px-4">Cameras</th>
                            <th className="py-3 px-4">Plan Tier</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium">
                          {customers.map((c) => (
                            <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-brand-blue dark:text-brand-light-blue">{c.id}</td>
                              <td className="py-3 px-4">
                                <div className="font-bold text-foreground">{c.name}</div>
                                <div className="text-[10px] text-muted-foreground">{c.email}</div>
                              </td>
                              <td className="py-3 px-4 text-foreground/80">{c.company}</td>
                              <td className="py-3 px-4 font-bold text-foreground/90">{c.cameras} Nodes</td>
                              <td className="py-3 px-4 text-foreground/80">{c.plan}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  c.status === 'Active' ? 'bg-brand-blue/20 text-brand-blue dark:text-brand-light-blue' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
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
                <div className="w-full space-y-6">
                  {/* Page Header */}
                  <div id="add-customer-header" className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">Add New Enterprise Customer</h2>
                      <p className="text-xs text-muted-foreground">Register a new client organization and provision CCTV AI inspection licenses.</p>
                    </div>
                  </div>

                  {customerSuccessMsg && (
                    <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{customerSuccessMsg}</span>
                    </div>
                  )}

                  {customerErrorMsg && (
                    <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{customerErrorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddCustomerSubmit} noValidate className="space-y-6">
                     {/* Panel 1: Account Information */}
                    <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                        <div className="w-6 h-6 rounded-full bg-brand-gold text-[#FAF6EE] text-xs font-bold flex items-center justify-center shrink-0">
                          1
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">Account Information</h3>
                          <p className="text-[10px] text-muted-foreground">Primary administrative contact details for the customer account.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div id="field-firstName" className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">First Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={newCustomer.firstName}
                            onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                            placeholder="John"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.firstName && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.firstName}
                            </p>
                          )}
                        </div>

                        <div id="field-lastName" className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Last Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={newCustomer.lastName}
                            onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                            placeholder="Doe"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.lastName && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.lastName}
                            </p>
                          )}
                        </div>

                        <div id="field-email" className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Work Email Address <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            placeholder="john.doe@company.com"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.email && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.email}
                            </p>
                          )}
                        </div>

                        <div id="field-phone" className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Phone Number <span className="text-red-500">*</span></label>
                          <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden focus-within:ring-2 focus-within:ring-brand-gold/20 focus-within:border-brand-gold transition-all duration-200">
                            <div className="relative flex items-center bg-card/50 border-r border-border shrink-0">
                              <select
                                value={selectedCountryCode}
                                onChange={(e) => setSelectedCountryCode(e.target.value)}
                                className="pl-3 pr-7 py-2.5 bg-transparent text-xs font-bold text-muted-foreground focus:outline-none appearance-none cursor-pointer"
                              >
                                <option value="+91">🇮🇳 +91</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+44">🇬🇧 +44</option>
                                <option value="+971">🇦🇪 +971</option>
                                <option value="+65">🇸🇬 +65</option>
                                <option value="+61">🇦🇺 +61</option>
                                <option value="+49">🇩🇪 +49</option>
                              </select>
                              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-muted-foreground">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            <input
                              type="tel"
                              value={newCustomer.phone}
                              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                              placeholder="99999 99999"
                              className="w-full px-3 py-2.5 bg-transparent text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none border-none outline-none"
                            />
                          </div>
                          {formErrors.phone && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.phone}
                            </p>
                          )}
                        </div>

                        <div id="field-company" className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Company / Organization Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={newCustomer.company}
                            onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                            placeholder="Tiera India Logistics"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.company && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Panel 2: Address Information */}
                    <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                        <div className="w-6 h-6 rounded-full bg-brand-gold text-[#FAF6EE] text-xs font-bold flex items-center justify-center shrink-0">
                          2
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">Address Details</h3>
                          <p className="text-[10px] text-muted-foreground">Physical location details for safety inspection deployments.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div id="field-addressLine1" className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Address Line 1 <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={newCustomer.addressLine1}
                            onChange={(e) => setNewCustomer({ ...newCustomer, addressLine1: e.target.value })}
                            placeholder="Plot No, Street Name, Industry Area"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.addressLine1 && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.addressLine1}
                            </p>
                          )}
                        </div>

                        <div id="field-addressLine2" className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Address Line 2</label>
                          <input
                            type="text"
                            value={newCustomer.addressLine2}
                            onChange={(e) => setNewCustomer({ ...newCustomer, addressLine2: e.target.value })}
                            placeholder="Suite, Block, Landmark, etc."
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                        </div>

                        <div id="field-country" className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Country <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={newCustomer.country}
                            onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
                            placeholder="India"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.country && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.country}
                            </p>
                          )}
                        </div>

                        <div id="field-state" className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">State / Region <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={newCustomer.state}
                            onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                            placeholder="Delhi"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.state && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.state}
                            </p>
                          )}
                        </div>

                        <div id="field-city" className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">City <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={newCustomer.city}
                            onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                            placeholder="New Delhi"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.city && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.city}
                            </p>
                          )}
                        </div>

                        <div id="field-pincode" className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">ZIP / Postal Code <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={newCustomer.pincode}
                            onChange={(e) => setNewCustomer({ ...newCustomer, pincode: e.target.value })}
                            placeholder="110001"
                            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-200"
                          />
                          {formErrors.pincode && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 animate-fadeIn">
                              ⚠️ {formErrors.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSubmittingCustomer}
                        className="px-6 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-gold-light disabled:bg-brand-gold/50 text-[#FAF6EE] font-semibold text-xs tracking-wider transition-all duration-200 cursor-pointer shadow-sm transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      >
                        {isSubmittingCustomer ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-[#FAF6EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span>Add Customer</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-3xl border border-border bg-card rounded-2xl p-6 space-y-6 shadow-sm">
                  <h2 className="text-lg font-bold text-foreground">Admin System Settings</h2>
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <div>
                        <div className="font-bold text-foreground">AI Model Detection Sensitivity</div>
                        <div className="text-muted-foreground">Adjust confidence threshold for helmet & safety alerts.</div>
                      </div>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">95% (High Precision)</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <div>
                        <div className="font-bold text-foreground">Real-time WhatsApp Webhook Gateway</div>
                        <div className="text-muted-foreground">Automated dispatch clips to safety managers.</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">ENABLED</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                    <div className="text-xs font-mono uppercase text-muted-foreground">Standard Tier</div>
                    <div className="text-2xl font-black text-foreground">$499 <span className="text-xs text-muted-foreground font-normal">/ mo</span></div>
                    <p className="text-xs text-muted-foreground">Up to 10 Cameras, basic helmet detection.</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-brand-blue bg-brand-blue/10 space-y-4 relative shadow-md">
                    <span className="absolute -top-3 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-blue text-white">POPULAR</span>
                    <div className="text-xs font-mono uppercase text-brand-blue dark:text-brand-light-blue font-bold">Enterprise Pro</div>
                    <div className="text-2xl font-black text-foreground">$1,299 <span className="text-xs text-muted-foreground font-normal">/ mo</span></div>
                    <p className="text-xs text-muted-foreground">Up to 30 Cameras, custom AI rules + WhatsApp alerts.</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                    <div className="text-xs font-mono uppercase text-muted-foreground">Custom Max</div>
                    <div className="text-2xl font-black text-foreground">Contact Us</div>
                    <p className="text-xs text-muted-foreground">Unlimited camera nodes & dedicated GPU server cluster.</p>
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
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
                      <div className="text-xs text-muted-foreground">Active Cameras</div>
                      <div className="text-3xl font-black text-brand-blue dark:text-brand-light-blue">{cameras.length} Feeds</div>
                      <div className="text-[11px] text-muted-foreground">100% Active stream</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
                      <div className="text-xs text-muted-foreground">Today's Safety Violations</div>
                      <div className="text-3xl font-black text-red-600 dark:text-red-400">{dbAlerts.length} Alerts</div>
                      <div className="text-[11px] text-red-600 dark:text-red-400">Action required</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
                      <div className="text-xs text-muted-foreground">Account Subscription</div>
                      <div className="text-xl font-black text-foreground uppercase">{user?.role === 'admin' ? 'Enterprise Max' : 'Enterprise Pro'}</div>
                      <div className="text-[11px] text-brand-blue dark:text-brand-light-blue font-semibold">Active · Renews next month</div>
                    </div>

                    {/* Camera Key Card (Main Dashboard View) */}
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3 col-span-1 sm:col-span-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-bold block">Your Active Camera Key</span>
                        <span className="text-[10px] text-muted-foreground">Configure this key in your AI Service .env file (CAMERA_KEY)</span>
                      </div>
                      {activeCameraKey ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={activeCameraKey}
                            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-mono font-bold focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(activeCameraKey);
                              setCopySuccess(true);
                              setTimeout(() => setCopySuccess(false), 2000);
                            }}
                            className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-blue hover:bg-brand-blue/90 text-white transition-all cursor-pointer shadow-md"
                          >
                            {copySuccess ? "Copied!" : "Copy Key"}
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground font-mono">Generating key...</div>
                      )}
                    </div>
                  </div>

                  <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-foreground">Recent Security Alerts (Live Feed)</h2>
                    <div className="space-y-3">
                      {dbAlerts.length > 0 ? (
                        dbAlerts.slice(0, 10).map((alert) => (
                          <div key={alert._id} className="p-4 rounded-xl border border-border bg-background/60 flex gap-4 items-center text-xs">
                            {alert.imageUrl && (
                              <img 
                                src={alert.imageUrl} 
                                alt="Alert Snapshot" 
                                className="w-16 h-12 object-cover rounded-lg border border-border shrink-0" 
                              />
                            )}
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="font-bold text-foreground truncate">{alert.message}</div>
                              <div className="text-muted-foreground font-mono truncate">
                                Camera: {alert.cameraKey} · {new Date(alert.timestamp).toLocaleTimeString()} ({new Date(alert.timestamp).toLocaleDateString()})
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded font-bold uppercase text-[10px] bg-red-500/20 text-red-600 dark:text-red-400 shrink-0">
                              HIGH
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                          No alerts received yet. Please configure your camera settings.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'live_camera' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Live CCTV Inspection Feeds</h2>
                      <p className="text-xs text-muted-foreground">Real-time video analytics with automated bounding boxes.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-mono text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      LIVE FEED
                    </span>
                  </div>

                  <div className="aspect-video w-full max-w-4xl mx-auto bg-background rounded-lg border border-border overflow-hidden relative flex items-center justify-around p-8 shadow-2xl">
                    <div className="absolute top-4 left-4 font-mono text-xs text-[#FAF6EE]/80 bg-black/40 px-3 py-1 rounded border border-border">
                      CAM-03 LOGISTICS DOCK · 1080P @ 30FPS
                    </div>

                    <div className="border-2 border-cyan-400 bg-cyan-500/10 p-4 rounded-xl text-center text-xs font-mono">
                      <div className="bg-cyan-400 text-black text-[10px] px-2 py-0.5 font-bold rounded mb-2">
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

              {activeTab === 'zones' && (
                <ZoneManagementView
                  user={user}
                  cameras={cameras}
                  activeCameraKey={activeCameraKey}
                  setActiveCameraKey={setActiveCameraKey}
                  apiUrl={API_URL}
                />
              )}

              {activeTab === 'subscription_detail' && (
                <div className="max-w-2xl border border-border bg-card rounded-lg p-6 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-foreground">Subscription Details</h2>
                    <span className="px-3 py-1 rounded bg-brand-gold/20 text-[#C0A06E] font-bold text-xs">Active Plan</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                     <div>
                       <span className="text-muted-foreground block mb-1">PLAN NAME</span>
                       <span className="font-bold text-sm text-foreground">Enterprise Pro</span>
                     </div>
                     <div>
                       <span className="text-muted-foreground block mb-1">CAMERA LICENSES</span>
                       <span className="font-bold text-sm text-brand-gold-light">12 / 20 Allocated</span>
                     </div>
                     <div>
                       <span className="text-muted-foreground block mb-1">BILLING CYCLE</span>
                       <span className="font-bold text-sm text-foreground">Monthly ($1,299)</span>
                     </div>
                     <div>
                       <span className="text-muted-foreground block mb-1">RENEWAL DATE</span>
                       <span className="font-bold text-sm text-foreground">Sept 01, 2026</span>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'event_history' && (
                <div className="border border-border bg-card rounded-lg p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-foreground">Security Event History Log</h2>
                  <div className="space-y-3">
                    {dbAlerts.length > 0 ? (
                      dbAlerts.map((alert) => (
                        <div key={alert._id} className="p-4 rounded-lg border border-border bg-background/60 flex gap-4 items-center text-xs">
                          {alert.imageUrl && (
                            <img 
                              src={alert.imageUrl} 
                              alt="Alert Snapshot" 
                              className="w-16 h-12 object-cover rounded-lg border border-border shrink-0" 
                            />
                          )}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="font-bold text-foreground truncate">{alert.message}</div>
                            <div className="text-muted-foreground font-mono truncate">
                              Camera: {alert.cameraKey} · {new Date(alert.timestamp).toLocaleTimeString()} ({new Date(alert.timestamp).toLocaleDateString()})
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded bg-brand-navy border border-border font-bold text-muted-foreground shrink-0">
                            RECEIVED
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                        No historical events found.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-lg border border-border bg-card rounded-lg p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-foreground">User Account Profile</h2>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Full Name</span>
                      <span className="font-bold text-sm text-foreground">{user?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Email</span>
                      <span className="font-bold text-sm text-foreground">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Account Role</span>
                      <span className="font-bold text-sm text-brand-gold uppercase">{user?.role}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notification' && (
                <div className="max-w-lg border border-border bg-card rounded-lg p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-bold text-foreground">Notification Preferences</h2>
                  <div className="space-y-3 text-xs text-foreground/80">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-brand-gold bg-background border-border text-brand-gold" />
                      <span>Email Alerts for High Severity Violations</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-brand-gold bg-background border-border text-brand-gold" />
                      <span>WhatsApp Supervisor Dispatches</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-xl border border-border bg-card rounded-2xl p-6 space-y-6 shadow-sm">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Camera Configuration</h2>
                    <p className="text-xs text-muted-foreground">Connect your Python camera stream to this account.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground block">Your Unique Camera Access Key</label>
                    {activeCameraKey ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={activeCameraKey}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono font-bold focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeCameraKey);
                            setCopySuccess(true);
                            setTimeout(() => setCopySuccess(false), 2000);
                          }}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-blue hover:bg-brand-blue/90 text-white transition-all cursor-pointer shadow-md"
                        >
                          {copySuccess ? "Copied!" : "Copy Key"}
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Generating camera access key...</div>
                    )}
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Instructions: Copy this key and paste it inside the `CAMERA_KEY` configuration of your AI Service environment variable.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border space-y-4">
                    <h3 className="text-xs font-bold text-foreground">Register Another Camera Location</h3>
                    <button
                      onClick={async () => {
                        const name = prompt("Enter location name (e.g. Back Alley, Main Entrance):");
                        if (!name) return;
                        try {
                          const res = await fetch('/api/cameras', {
                            method: 'POST',
                            headers: { 
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${user?.token}` 
                            },
                            body: JSON.stringify({ locationName: name })
                          });
                          const data = await res.json();
                          if (data.success && data.data) {
                            setCameras([data.data, ...cameras]);
                            setActiveCameraKey(data.data.cameraKey);
                            alert(`Successfully provisioned new key: ${data.data.cameraKey}`);
                          }
                        } catch (err) {
                          alert("Failed to provision new camera key.");
                        }
                      }}
                      className="px-4 py-2 text-xs font-bold border border-border hover:bg-muted rounded-xl transition-all cursor-pointer text-foreground"
                    >
                      + Add Camera Location
                    </button>

                    {cameras.length > 1 && (
                      <div className="space-y-1 pt-2">
                        <span className="text-[10px] font-bold text-muted-foreground block">Switch Active Camera Key:</span>
                        <select
                          value={activeCameraKey}
                          onChange={(e) => setActiveCameraKey(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-blue"
                        >
                          {cameras.map((cam) => (
                            <option key={cam._id} value={cam.cameraKey}>
                              {cam.locationName} ({cam.cameraKey})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
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
                  <h2 className="text-2xl font-black text-foreground">Demo Session Active</h2>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    You are exploring the CoreWatch enterprise console in Demo Preview mode. Click below to upgrade this demo account to a full <strong>USER</strong> account instantly!
                  </p>
                </div>

                <button
                  onClick={handleUpgradeDemoToUser}
                  disabled={upgrading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-light-gold text-brand-navy font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-brand-gold/20 cursor-pointer disabled:opacity-50"
                >
                  {upgrading ? 'Upgrading Role...' : '⚡ Upgrade Account to Full USER Role'}
                </button>
              </div>

              <div className="border border-dashed border-border rounded-2xl p-12 text-center text-xs text-muted-foreground font-mono">
                📌 Demo workspace canvas. Additional custom interactive demos will be loaded here.
              </div>

            </div>
          )}
        </main>
      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}


