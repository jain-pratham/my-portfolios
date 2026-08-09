'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'demo';
}

export default function SignupStepsPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Auth Session state
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    // Step 1: Account Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    
    // Step 2: Address Info
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',

    // Step 3: Plan Info
    plan: 'Demo Free', // Default selected
    
    // Step 4: Camera Setup (For Demo Free)
    cameraLocation: 'Main Entrance',
    camerasCount: 1,
    cameraType: 'RTSP Stream',

    // Step 4: Payment Details (For Paid Plans)
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [countdown, setCountdown] = useState(3);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // 1. Fetch current authentication and prefill customer info if exists
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as UserData;
      setUser(parsedUser);
      setToken(storedToken);

      // Fetch customer profile to prefill
      fetch(`${API_URL}/api/customers/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const customer = data.data;
            const nameParts = (customer.user?.name || parsedUser.name || '').split(' ');
            const fName = nameParts[0] || '';
            const lName = nameParts.slice(1).join(' ') || '';

            setFormData((prev) => ({
              ...prev,
              firstName: fName,
              lastName: lName,
              email: customer.user?.email || parsedUser.email,
              phone: customer.phone || '',
              company: customer.company || '',
              addressLine1: customer.addressLine1 || '',
              addressLine2: customer.addressLine2 || '',
              city: customer.city || '',
              state: customer.state || '',
              country: customer.country || 'India',
              pincode: customer.pincode || '',
              plan: customer.plan || 'Demo Free',
              camerasCount: customer.cameras || 1,
            }));
          } else {
            // No customer profile, prefill name and email from User session
            const nameParts = (parsedUser.name || '').split(' ');
            const fName = nameParts[0] || '';
            const lName = nameParts.slice(1).join(' ') || '';
            
            setFormData((prev) => ({
              ...prev,
              firstName: fName,
              lastName: lName,
              email: parsedUser.email,
            }));
          }
        })
        .catch((err) => console.log('Error loading customer:', err))
        .finally(() => setLoading(false));
    } catch (err) {
      router.push('/login');
    }
  }, [router, API_URL]);

  // Handle countdown redirection for Step 5
  useEffect(() => {
    if (step === 5) {
      const timer = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 5 && countdown === 0) {
      router.push('/dashboard');
    }
  }, [countdown, step, router]);

  // Input Change Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step Navigations & Submissions
  const nextStep = () => {
    setErrorMessage(null);

    // Validation for Step 1
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setErrorMessage('First and Last Names are required.');
        return;
      }
      if (!formData.phone.trim()) {
        setErrorMessage('Phone Number is required.');
        return;
      }
      if (!formData.company.trim()) {
        setErrorMessage('Company / Organization Name is required.');
        return;
      }
    }

    // Validation for Step 2
    if (step === 2) {
      if (!formData.addressLine1.trim()) {
        setErrorMessage('Address Line 1 is required.');
        return;
      }
      if (!formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
        setErrorMessage('City, State, and Pincode are required.');
        return;
      }
    }

    // Validation for Step 3 is simple as one plan is always selected

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMessage(null);
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    // Validation for Step 4
    if (formData.plan !== 'Demo Free') {
      // Paid plan card validations
      if (!formData.cardName.trim() || !formData.cardNumber.trim() || !formData.cardExpiry.trim() || !formData.cardCvc.trim()) {
        setErrorMessage('Please fill out all payment details.');
        setIsSubmitting(false);
        return;
      }
      if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        setErrorMessage('Please enter a valid 16-digit card number.');
        setIsSubmitting(false);
        return;
      }
    } else {
      // Demo free camera validations
      if (!formData.cameraLocation.trim()) {
        setErrorMessage('Camera Location Name is required.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // 1. If user selected Demo Free, automatically register their first camera in Next.js backend database
      if (formData.plan === 'Demo Free') {
        try {
          await fetch('/api/cameras', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ locationName: formData.cameraLocation }),
          });
        } catch (err) {
          console.warn('Auto camera provisioning note:', err);
        }
      }

      // 2. Submit customer details to Backend database
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      const res = await fetch(`${API_URL}/api/customers/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName,
          phone: formData.phone.trim(),
          company: formData.company.trim(),
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          pincode: formData.pincode.trim(),
          plan: formData.plan,
          cameras: formData.plan === 'Demo Free' ? Number(formData.camerasCount) : getCamerasCountForPlan(formData.plan),
          status: 'Active', // Setup is complete!
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep(5); // Go to final success screen
      } else {
        setErrorMessage(data.message || 'Failed to complete registration setup. Please check your inputs.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCamerasCountForPlan = (planName: string) => {
    switch (planName) {
      case 'Standard AI': return 8;
      case 'Enterprise Pro': return 16;
      case 'Enterprise Max': return 32;
      default: return 5;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm">Configuring security nodes & profile databases...</p>
        </div>
      </div>
    );
  }

  // Stepper Header Rendering
  const stepsList = [
    { num: 1, label: 'Account Info' },
    { num: 2, label: 'Business Address' },
    { num: 3, label: 'Choose Plan' },
    { num: 4, label: formData.plan === 'Demo Free' ? 'Camera Setup' : 'Payment' },
    { num: 5, label: 'Complete' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden pb-12">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-brown/5 blur-[120px] pointer-events-none"></div>

      {/* Top Header Logo */}
      <div className="max-w-6xl mx-auto pt-8 px-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="CoreWatch" className="h-10 w-auto object-contain" />
          <span className="text-sm font-bold tracking-tight text-foreground uppercase">CoreWatch AI</span>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          SECURE DISPATCH FUNNEL // V2.14
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-10 px-6 z-10 relative">
        
        {/* Main Card */}
        <div className="bg-card/60 border border-border rounded-lg p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Stepper Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-foreground tracking-tight">Create Account</h1>
            <p className="text-xs text-brand-gold-light mt-2 font-mono uppercase tracking-widest">
              Step {step} of 5
            </p>

            {/* Stepper Horizontal Progress Bar */}
            <div className="max-w-2xl mx-auto mt-8 flex items-center justify-between relative px-2">
              
              {/* Connector lines behind circles */}
              <div className="absolute left-6 right-6 top-4 h-0.5 bg-border -z-10"></div>
              <div 
                className="absolute left-6 top-4 h-0.5 bg-brand-gold -z-10 transition-all duration-300"
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              ></div>

              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="flex flex-col items-center space-y-2.5">
                    <div 
                      className={`w-9.5 h-9.5 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-brand-gold border-brand-gold text-[#FAF6EE] shadow-lg shadow-brand-gold/25'
                          : isActive
                            ? 'bg-[#0A0B0E] border-brand-gold text-brand-gold-light ring-4 ring-brand-gold/15 font-black scale-110'
                            : 'bg-background border-border text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? '✓' : s.num}
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${
                      isActive ? 'text-brand-gold-light font-extrabold' : isCompleted ? 'text-foreground/85' : 'text-muted-foreground'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-border my-6" />

          {/* Form Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* WIZARD STEPS */}

          {/* STEP 1: Account Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full"></span>
                1. Account Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Work Email Address</label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card/50 text-muted-foreground text-xs font-semibold focus:outline-none opacity-80 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Mobile Number *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Company / Organization Name *</label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-lg bg-brand-gold hover:bg-brand-gold-light text-[#FAF6EE] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-brand-gold/10"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Address Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full"></span>
                2. Business Address
              </h2>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Address Line 1 *</label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Enter street address, suite, unit"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, building, floor etc."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">City / Town *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">State / Region *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">ZIP / Postal Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg bg-brand-brown hover:bg-brand-navy text-[#FAF6EE] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-lg bg-brand-gold hover:bg-brand-gold-light text-[#FAF6EE] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-brand-gold/10"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Plan */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full"></span>
                3. Select Subscription Plan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Demo Plan Card */}
                <div 
                  onClick={() => setFormData({ ...formData, plan: 'Demo Free' })}
                  className={`p-5 rounded-lg border transition-all cursor-pointer relative ${
                    formData.plan === 'Demo Free'
                      ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20'
                      : 'border-border bg-card hover:border-brand-gold-light/50'
                  }`}
                >
                  <div className="absolute top-4 right-4 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    Recommended
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold mb-2">PROMO TRIAL</div>
                  <h3 className="text-lg font-black text-foreground">Demo Free</h3>
                  <p className="text-[11px] text-muted-foreground mt-2">1-Day trial to inspect safety tools. Supports up to 5 cameras. Zero obligation.</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">$0</span>
                    <span className="text-xs text-muted-foreground/80">/ 1 day</span>
                  </div>
                </div>

                {/* Standard Card */}
                <div 
                  onClick={() => setFormData({ ...formData, plan: 'Standard AI' })}
                  className={`p-5 rounded-lg border transition-all cursor-pointer ${
                    formData.plan === 'Standard AI'
                      ? 'border-brand-gold bg-brand-gold/5 ring-2 ring-brand-gold/20'
                      : 'border-border bg-card hover:border-brand-gold-light/50'
                  }`}
                >
                  <div className="text-xs font-mono text-brand-gold-light font-bold mb-2">POPULAR</div>
                  <h3 className="text-lg font-black text-foreground">Standard AI</h3>
                  <p className="text-[11px] text-muted-foreground mt-2">Perfect for retail and small warehouses. Supports up to 8 cameras.</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">$49</span>
                    <span className="text-xs text-muted-foreground/80">/ month</span>
                  </div>
                </div>

                {/* Pro Card */}
                <div 
                  onClick={() => setFormData({ ...formData, plan: 'Enterprise Pro' })}
                  className={`p-5 rounded-lg border transition-all cursor-pointer ${
                    formData.plan === 'Enterprise Pro'
                      ? 'border-brand-gold bg-brand-gold/5 ring-2 ring-brand-gold/20'
                      : 'border-border bg-card hover:border-brand-gold-light/50'
                  }`}
                >
                  <div className="text-xs font-mono text-brand-gold-light font-bold mb-2">POWERFUL</div>
                  <h3 className="text-lg font-black text-foreground">Enterprise Pro</h3>
                  <p className="text-[11px] text-muted-foreground mt-2">Deep compliance tracking. Safe inspections for up to 16 cameras.</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">$99</span>
                    <span className="text-xs text-muted-foreground/80">/ month</span>
                  </div>
                </div>

                {/* Max Card */}
                <div 
                  onClick={() => setFormData({ ...formData, plan: 'Enterprise Max' })}
                  className={`p-5 rounded-lg border transition-all cursor-pointer ${
                    formData.plan === 'Enterprise Max'
                      ? 'border-brand-gold bg-brand-gold/5 ring-2 ring-brand-gold/20'
                      : 'border-border bg-card hover:border-brand-gold-light/50'
                  }`}
                >
                  <div className="text-xs font-mono text-brand-gold-light font-bold mb-2">UNLIMITED</div>
                  <h3 className="text-lg font-black text-foreground">Enterprise Max</h3>
                  <p className="text-[11px] text-muted-foreground mt-2">Maximum video streams, 24/7 dedicated compute. Up to 32 cameras.</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground">$199</span>
                    <span className="text-xs text-muted-foreground/80">/ month</span>
                  </div>
                </div>

              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg bg-brand-brown hover:bg-brand-navy text-[#FAF6EE] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-lg bg-brand-gold hover:bg-brand-gold-light text-[#FAF6EE] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-brand-gold/10"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Camera Setup OR Payment Form (Conditional) */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              
              {/* CONDITIONAL SUB-WIZARD A: CAMERA SETUP (DEMO PLAN) */}
              {formData.plan === 'Demo Free' ? (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#10B981] rounded-full"></span>
                    4. Setup Your First Camera (Free Demo)
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    CoreWatch runs real-time computer vision models on your RTSP/CCTV streams. Let's configure your initial demo camera.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Camera Location Name *</label>
                    <input
                      type="text"
                      name="cameraLocation"
                      required
                      value={formData.cameraLocation}
                      onChange={handleChange}
                      placeholder="e.g. Front Office, Main Shop Entrance"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Number of Demo Cameras *</label>
                      <select
                        name="camerasCount"
                        value={formData.camerasCount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value={1}>1 Camera</option>
                        <option value={2}>2 Cameras</option>
                        <option value={3}>3 Cameras</option>
                        <option value={4}>4 Cameras</option>
                        <option value={5}>5 Cameras (Max Demo)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Camera Stream Protocol</label>
                      <select
                        name="cameraType"
                        value={formData.cameraType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value="RTSP Stream">RTSP Network Stream (.mp4/h264)</option>
                        <option value="ONVIF Camera">ONVIF IP Network Camera</option>
                        <option value="USB Camera">USB Direct Feed / Web camera</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-foreground text-xs leading-relaxed">
                    💡 **Note:** Once setup is finalized, a secure camera token key (e.g. `CAM-XXXXXX`) will be provisioned so you can link your physical CCTV recorder stream.
                  </div>
                </div>
              ) : (
                
                // CONDITIONAL SUB-WIZARD B: PAYMENT SECURE DETAIL (PAID PLANS)
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-brand-gold rounded-full"></span>
                    4. Secure Checkout
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Secure credit card payment for your chosen plan: <strong className="text-brand-gold-light font-mono font-black">{formData.plan}</strong>.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="e.g. Johnathan Doe"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={(e) => {
                        // Auto format with spaces: XXXX XXXX XXXX XXXX
                        const v = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setFormData((prev) => ({ ...prev, cardNumber: v }));
                      }}
                      placeholder="4111 2222 3333 4444"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Expiration Date *</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        required
                        maxLength={5}
                        value={formData.cardExpiry}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\//g, '');
                          if (v.length >= 2) {
                            setFormData((prev) => ({ ...prev, cardExpiry: `${v.slice(0,2)}/${v.slice(2,4)}` }));
                          } else {
                            setFormData((prev) => ({ ...prev, cardExpiry: v }));
                          }
                        }}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">CVC / Security Code *</label>
                      <input
                        type="password"
                        name="cardCvc"
                        required
                        maxLength={4}
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="•••"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-lg bg-brand-brown hover:bg-brand-navy text-[#FAF6EE] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-2 ${
                    formData.plan === 'Demo Free'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10'
                      : 'bg-brand-gold hover:bg-brand-gold-light shadow-brand-gold/10'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Activating...</span>
                    </>
                  ) : (
                    <span>Complete Account Registration</span>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP 5: Success & Redirect countdown */}
          {step === 5 && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl font-bold shadow-lg shadow-emerald-500/10 animate-bounce">
                ✓
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-foreground tracking-tight">Account Activated!</h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Congratulations, your CoreWatch profile is active. Your compute nodes have been provisioned and your streams are ready for safety check logs.
                </p>
              </div>

              <div className="max-w-xs mx-auto p-4 rounded-lg border border-border bg-background font-mono text-xs text-brand-gold-light flex justify-between items-center">
                <span>REDIRECTING SECURELY:</span>
                <span className="font-bold font-black text-lg animate-pulse">{countdown}s</span>
              </div>

              <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
