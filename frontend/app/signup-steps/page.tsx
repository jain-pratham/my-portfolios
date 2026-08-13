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
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Step Navigations & Submissions
  const nextStep = () => {
    setErrorMessage(null);
    const newErrors: Record<string, string> = {};

    // Validation for Step 1
    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Mobile number is required';
      }
      if (!formData.company.trim()) {
        newErrors.company = 'Company name is required';
      }
    }

    // Validation for Step 2
    if (step === 2) {
      if (!formData.addressLine1.trim()) {
        newErrors.addressLine1 = 'Address Line 1 is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Postal code is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMessage(null);
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setErrorMessage(null);
    const newErrors: Record<string, string> = {};
    setIsSubmitting(true);

    // Validation for Step 4
    if (formData.plan !== 'Demo Free') {
      // Paid plan card validations
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiration date is required';
      }
      if (!formData.cardCvc.trim()) {
        newErrors.cardCvc = 'CVC is required';
      }
    } else {
      // Demo free camera validations
      if (!formData.cameraLocation.trim()) {
        newErrors.cameraLocation = 'Camera location name is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

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
    <div className="h-screen max-h-screen bg-background text-foreground font-sans relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

      {/* Decorative Glow */}
      <div className="absolute top-0 w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 w-[500px] h-[500px] rounded-full bg-brand-brown/5 blur-[120px] pointer-events-none"></div>

      {/* Centered Top Header Logo */}
      <div className="w-full max-w-4xl px-4 z-10 relative flex flex-col items-center justify-center my-auto">
        {/* Centered Logo */}
        <div className="flex flex-col items-center gap-1 mb-3">
          <img src="/logo.png" alt="CoreWatch" className="h-10 w-auto object-contain" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Create Account</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Step {step} of 5</p>
        </div>

        {/* Stepper Horizontal Progress Bar */}
        <div className="w-full max-w-2xl mb-6 flex items-center justify-between relative px-2">
          {/* Connector lines behind circles */}
          <div className="absolute left-6 right-6 top-4.5 h-0.5 bg-border -z-10"></div>
          <div 
            className="absolute left-6 top-4.5 h-0.5 bg-primary -z-10 transition-all duration-300"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          ></div>

          {stepsList.map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div key={s.num} className="flex flex-col items-center space-y-1 select-none">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-[#FAF6EE] shadow-md shadow-brand-gold/15'
                      : isActive
                        ? 'bg-primary border-primary text-[#FAF6EE] ring-4 ring-primary/20 font-extrabold scale-110'
                        : 'bg-card border-border text-muted-foreground'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className={`text-[8px] uppercase font-bold tracking-wider hidden sm:block ${
                  isActive ? 'text-primary font-extrabold' : isCompleted ? 'text-foreground/80' : 'text-muted-foreground/60'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="w-full bg-card/65 border border-border rounded-xl p-4 md:p-5 shadow-xl backdrop-blur-xl">
          
          {/* Form Error Message */}
          {errorMessage && (
            <div className="mb-3 p-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-[10px] font-semibold flex items-center gap-2">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* WIZARD STEPS */}

          {/* STEP 1: Account Information */}
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-xs md:text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-1 h-3 bg-primary rounded-full"></span>
                1. Account Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                      errors.firstName 
                        ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                      errors.lastName 
                        ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Work Email Address</label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card/50 text-muted-foreground text-xs font-semibold focus:outline-none opacity-80 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Mobile Number *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                      errors.phone 
                        ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Company / Organization Name *</label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                    errors.company 
                      ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                      : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
                {errors.company && (
                  <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.company}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Address Information */}
          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-xs md:text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-1 h-3 bg-primary rounded-full"></span>
                2. Business Address
              </h2>

              <div className="space-y-0.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Address Line 1 *</label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Enter street address, suite, unit"
                  className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                    errors.addressLine1 
                      ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                      : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
                {errors.addressLine1 && (
                  <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.addressLine1}</p>
                )}
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, building, floor etc."
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">City / Town *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                      errors.city 
                        ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.city}</p>
                  )}
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">State / Region *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                      errors.state 
                        ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.state && (
                    <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">ZIP / Postal Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                    className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                      errors.pincode 
                        ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.pincode}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Plan */}
          {step === 3 && (
            <div className="space-y-3">
              <h2 className="text-xs md:text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-1 h-3 bg-primary rounded-full"></span>
                3. Select Subscription Plan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                
                {/* Demo Plan Card */}
                <div 
                  onClick={() => setFormData({ ...formData, plan: 'Demo Free' })}
                  className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                    formData.plan === 'Demo Free'
                      ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="absolute top-2 right-2 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                    Recommended
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 font-bold mb-0.5">PROMO TRIAL</div>
                  <h3 className="text-sm font-black text-foreground">Demo Free</h3>
                  <p className="text-[9px] text-muted-foreground mt-0.5">1-Day trial to inspect safety tools. Supports up to 5 cameras. Zero obligation.</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-black text-foreground">$0</span>
                    <span className="text-[9px] text-muted-foreground/80">/ 1 day</span>
                  </div>
                </div>

                {/* Standard Card */}
                <div 
                  onClick={() => setFormData({ ...formData, plan: 'Standard AI' })}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.plan === 'Standard AI'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="text-[9px] font-mono text-primary font-bold mb-0.5">POPULAR</div>
                  <h3 className="text-sm font-black text-foreground">Standard AI</h3>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Perfect for retail and small warehouses. Supports up to 8 cameras.</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-black text-foreground">$49</span>
                    <span className="text-[9px] text-muted-foreground/80">/ month</span>
                  </div>
                </div>

                {/* Pro Card */}
                <div 
                  onClick={() => setFormData({ ...formData, plan: 'Enterprise Pro' })}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.plan === 'Enterprise Pro'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="text-[9px] font-mono text-primary font-bold mb-0.5">POWERFUL</div>
                  <h3 className="text-sm font-black text-foreground">Enterprise Pro</h3>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Deep compliance tracking. Safe inspections for up to 16 cameras.</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-black text-foreground">$99</span>
                    <span className="text-[9px] text-muted-foreground/80">/ month</span>
                  </div>
                </div>

                {/* Max Card */}
                <div 
                  onClick={() => setFormData({ ...formData, plan: 'Enterprise Max' })}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.plan === 'Enterprise Max'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="text-[9px] font-mono text-primary font-bold mb-0.5">UNLIMITED</div>
                  <h3 className="text-sm font-black text-foreground">Enterprise Max</h3>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Maximum video streams, 24/7 dedicated compute. Up to 32 cameras.</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-black text-foreground">$199</span>
                    <span className="text-[9px] text-muted-foreground/80">/ month</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: Camera Setup OR Payment Form (Conditional) */}
          {step === 4 && (
            <div className="space-y-3">
              
              {/* CONDITIONAL SUB-WIZARD A: CAMERA SETUP (DEMO PLAN) */}
              {formData.plan === 'Demo Free' ? (
                <div className="space-y-3">
                  <h2 className="text-xs md:text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                    4. Setup Your First Camera (Free Demo)
                  </h2>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    CoreWatch runs real-time computer vision models on your RTSP/CCTV streams. Let's configure your initial demo camera.
                  </p>

                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Camera Location Name *</label>
                    <input
                      type="text"
                      name="cameraLocation"
                      required
                      value={formData.cameraLocation}
                      onChange={handleChange}
                      placeholder="e.g. Front Office, Main Shop Entrance"
                      className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                        errors.cameraLocation 
                          ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                          : 'border-border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    />
                    {errors.cameraLocation && (
                      <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.cameraLocation}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Number of Demo Cameras *</label>
                      <select
                        name="camerasCount"
                        value={formData.camerasCount}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value={1}>1 Camera</option>
                        <option value={2}>2 Cameras</option>
                        <option value={3}>3 Cameras</option>
                        <option value={4}>4 Cameras</option>
                        <option value={5}>5 Cameras (Max Demo)</option>
                      </select>
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Camera Stream Protocol</label>
                      <select
                        name="cameraType"
                        value={formData.cameraType}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value="RTSP Stream">RTSP Network Stream (.mp4/h264)</option>
                        <option value="ONVIF Camera">ONVIF IP Network Camera</option>
                        <option value="USB Camera">USB Direct Feed / Web camera</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-foreground text-[10px] leading-relaxed">
                    💡 **Note:** Once setup is finalized, a secure camera token key (e.g. `CAM-XXXXXX`) will be provisioned so you can link your physical CCTV recorder stream.
                  </div>
                </div>
              ) : (
                
                // CONDITIONAL SUB-WIZARD B: PAYMENT SECURE DETAIL (PAID PLANS)
                <div className="space-y-3">
                  <h2 className="text-xs md:text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-1 h-3 bg-primary rounded-full"></span>
                    4. Secure Checkout
                  </h2>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Secure credit card payment for your chosen plan: <strong className="text-primary font-mono font-black">{formData.plan}</strong>.
                  </p>

                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="e.g. Johnathan Doe"
                      className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                        errors.cardName 
                          ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                          : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                    />
                    {errors.cardName && (
                      <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Card Number *</label>
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
                        if (errors.cardNumber) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.cardNumber;
                            return next;
                          });
                        }
                      }}
                      placeholder="4111 2222 3333 4444"
                      className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                        errors.cardNumber 
                          ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                          : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Expiration Date *</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        required
                        maxLength={5}
                        value={formData.cardExpiry}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\//g, '');
                          let newVal = v;
                          if (v.length >= 2) {
                            newVal = `${v.slice(0,2)}/${v.slice(2,4)}`;
                          }
                          setFormData((prev) => ({ ...prev, cardExpiry: newVal }));
                          if (errors.cardExpiry) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.cardExpiry;
                              return next;
                            });
                          }
                        }}
                        placeholder="MM/YY"
                        className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                          errors.cardExpiry 
                            ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                        }`}
                      />
                      {errors.cardExpiry && (
                        <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.cardExpiry}</p>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">CVC / Security Code *</label>
                      <input
                        type="password"
                        name="cardCvc"
                        required
                        maxLength={4}
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="•••"
                        className={`w-full px-3 py-1.5 rounded-lg border bg-background text-foreground text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 ${
                          errors.cardCvc 
                            ? 'border-destructive focus:ring-1 focus:ring-destructive/30' 
                            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                        }`}
                      />
                      {errors.cardCvc && (
                        <p className="text-[9px] text-destructive mt-0 font-semibold">{errors.cardCvc}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Success & Redirect countdown */}
          {step === 5 && (
            <div className="py-2 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold shadow-lg shadow-emerald-500/10 animate-bounce">
                ✓
              </div>
              
              <div className="space-y-0.5">
                <h2 className="text-lg font-black text-foreground tracking-tight">Account Activated!</h2>
                <p className="text-[10px] text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Congratulations, your CoreWatch profile is active. Your compute nodes have been provisioned and your streams are ready for safety check logs.
                </p>
              </div>

              <div className="max-w-xs mx-auto p-2 rounded-lg border border-border bg-background font-mono text-[10px] text-primary flex justify-between items-center">
                <span>REDIRECTING SECURELY:</span>
                <span className="font-bold font-black text-sm animate-pulse">{countdown}s</span>
              </div>

              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

        </div>

        {/* Action Buttons Row - outside the card */}
        {step < 5 && (
          <div className="w-full mt-3 flex gap-3 select-none">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="w-1/3 md:w-1/4 py-2 rounded-lg border border-border bg-card text-foreground text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                Back
              </button>
            )}
            
            {step === 4 ? (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className={`flex-1 py-2 rounded-lg text-[#FAF6EE] text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                  formData.plan === 'Demo Free'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10'
                    : 'bg-primary hover:bg-brand-gold-light shadow-primary/10'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Activating...</span>
                  </>
                ) : (
                  <span>Complete Registration</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-2 rounded-lg bg-primary hover:bg-brand-gold-light text-[#FAF6EE] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center justify-center"
              >
                Next
              </button>
            )}
          </div>
        )}

        {/* Footnote Redirect - below buttons */}
        {step < 5 && (
          <p className="text-center text-[10px] text-muted-foreground mt-3">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline transition-colors">
              Login
            </Link>
          </p>
        )}

      </div>
    </div>
  );
}
