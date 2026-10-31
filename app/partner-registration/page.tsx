'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  User,
  Building2,
  FileCheck2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ShieldCheck,
  Printer,
  Sparkles
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
];

const POPULAR_CATEGORIES = [
  'INTERCULTIVATOR / POWER WEEDER',
  'BRUSH CUTTER - WEED CUTTER',
  'SPRAYER',
  'CHAFF CUTTER / SHREDDER',
  'ENGINE & PUMPSET',
  'CHAIN SAW & PRUNER',
  'EARTH AUGER',
  'HARVESTER & REAPER',
  'GARDEN TOOLS & SPRAYERS',
  'PRESSURE WASHER',
  'ROTAVATOR & TILLER',
  'LUBRICANTS & GENUINE SPARES'
];

export default function PartnerRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    companyName: '',
    businessType: 'Proprietorship',
    address: '',
    state: 'Karnataka',
    city: '',
    pincode: '',
    yearsInBusiness: '1-3 Years',
    gstin: '',
    pan: '',
    categoriesOfInterest: [] as string[],
    existingBrands: '',
    message: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const exists = prev.categoriesOfInterest.includes(category);
      if (exists) {
        return {
          ...prev,
          categoriesOfInterest: prev.categoriesOfInterest.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          categoriesOfInterest: [...prev.categoriesOfInterest, category]
        };
      }
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!formData.email.trim() || !formData.email.includes('@')) {
        newErrors.email = 'A valid email address is required.';
      }
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'A valid 10-digit mobile number is required.';
      }
    }

    if (step === 2) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Dealership / Company Name is required.';
      if (!formData.city.trim()) newErrors.city = 'City or District is required.';
      if (!formData.state.trim()) newErrors.state = 'State is required.';
      const pinDigits = formData.pincode.replace(/\D/g, '');
      if (pinDigits.length < 6) {
        newErrors.pincode = 'Valid 6-digit Pincode is required.';
      }
    }

    if (step === 4) {
      if (!formData.agreedToTerms) {
        newErrors.agreedToTerms = 'You must confirm the dealership application declaration.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/partner-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application. Please check your details and try again.');
      }

      setSubmissionSuccess(data.application || { id: data.applicationId });
      window.scrollTo({ top: 60, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
          <nav className="flex items-center text-sm text-slate-500 space-x-2">
            <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/become-a-partner" className="hover:text-green-700 transition-colors">Become a Partner</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-semibold">Dealer Registration</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        {/* Header Title */}
        <div className="text-center mb-8">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
            Official B2B Channel Application
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Agrimart Dealership Application
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Expand your retail business with India&apos;s leading farm machinery and green-care distributor. Complete the 4-step registration below.
          </p>
        </div>

        {/* Success View */}
        {submissionSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Application Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                Thank You, {formData.fullName}!
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mt-2">
                Your dealership registration has been registered in our official Agrimart Channel Network database.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                <span className="text-slate-500">Application ID:</span>
                <span className="font-mono font-bold text-emerald-800 text-base">{submissionSuccess.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                <span className="text-slate-500">Dealership Name:</span>
                <span className="font-semibold text-slate-800">{formData.companyName}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{formData.city}, {formData.state}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Primary Contact:</span>
                <span className="font-semibold text-slate-800">{formData.phone}</span>
              </div>
            </div>

            {/* Next Steps Timeline */}
            <div className="text-left max-w-lg mx-auto bg-emerald-50/60 rounded-2xl p-6 border border-emerald-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                What happens next?
              </h3>
              <ol className="text-xs sm:text-sm text-slate-600 space-y-3 list-decimal list-inside">
                <li><strong className="text-slate-800">Verification:</strong> Our regional territory manager reviews your location and business profile within 24-48 business hours.</li>
                <li><strong className="text-slate-800">Consultation:</strong> A coordinator calls to align on local demand, initial catalog stocking, and commercial margins.</li>
                <li><strong className="text-slate-800">Dealership Activation:</strong> Onboarding kit, technical manuals, and promotional materials are dispatched.</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Application Summary</span>
              </button>

              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#075C36] hover:bg-[#064e2e] text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>Browse Agrimart Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Step Wizard Progress Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6">
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { step: 1, label: 'Applicant Info', icon: User },
                  { step: 2, label: 'Business Profile', icon: Building2 },
                  { step: 3, label: 'Commercials', icon: Briefcase },
                  { step: 4, label: 'Review & Submit', icon: FileCheck2 },
                ].map((s) => {
                  const Icon = s.icon;
                  const isActive = currentStep === s.step;
                  const isCompleted = currentStep > s.step;

                  return (
                    <div key={s.step} className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                          isCompleted
                            ? 'bg-emerald-700 text-white'
                            : isActive
                            ? 'bg-[#075C36] text-white ring-4 ring-emerald-100 shadow-sm'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs mt-2 font-semibold line-clamp-1 ${
                          isActive ? 'text-[#075C36]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="p-4 bg-red-50 border-b border-red-200 flex items-center gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{submitError}</p>
              </div>
            )}

            {/* Step Content */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
              {/* STEP 1: APPLICANT INFORMATION */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Step 1: Contact Person & Details</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Provide the primary person authorized to represent the dealership.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Ramesh Kumar"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'} focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm`}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300'} focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="Leave blank if same as mobile"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. ramesh@agrienterprises.com"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300'} focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: BUSINESS PROFILE & LOCATION */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Step 2: Dealership Firm & Store Location</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Provide details about your retail store or enterprise.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Dealership / Store / Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sri Balaji Agro Agencies"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.companyName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'} focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm`}
                      />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Business Entity Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm bg-white"
                      >
                        <option value="Proprietorship">Sole Proprietorship</option>
                        <option value="Partnership">Partnership Firm</option>
                        <option value="Private Limited">Private Limited Company</option>
                        <option value="LLP">Limited Liability Partnership (LLP)</option>
                        <option value="Farmer Producer Org">Farmer Producer Org (FPO / FPC)</option>
                        <option value="Individual">Individual / New Entrepreneur</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Years in Business
                      </label>
                      <select
                        name="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm bg-white"
                      >
                        <option value="New Venture">New Venture (Starting Fresh)</option>
                        <option value="1-3 Years">1 to 3 Years</option>
                        <option value="3-5 Years">3 to 5 Years</option>
                        <option value="5-10 Years">5 to 10 Years</option>
                        <option value="10+ Years">Over 10 Years</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Shop / Store Physical Address
                      </label>
                      <textarea
                        rows={2}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Main Road, Near APMC Market, etc."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm bg-white"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        City / District / Taluk <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mandya / Hassan / Shimoga"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-400 bg-red-50/30' : 'border-slate-300'} focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6-digit postal code e.g. 560001"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.pincode ? 'border-red-400 bg-red-50/30' : 'border-slate-300'} focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm`}
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: COMMERCIALS & CATEGORIES */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Step 3: Commercial Details & Product Interests</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Specify tax identifiers and machinery categories you intend to stock.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        GSTIN Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleInputChange}
                        placeholder="15-character GSTIN if registered"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        PAN Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleInputChange}
                        placeholder="10-character Business/Personal PAN"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm uppercase"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Product Categories of Interest (Select all that apply)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {POPULAR_CATEGORIES.map((cat) => {
                          const isSelected = formData.categoriesOfInterest.includes(cat);
                          return (
                            <button
                              type="button"
                              key={cat}
                              onClick={() => handleCategoryToggle(cat)}
                              className={`p-3 rounded-xl text-left text-xs font-medium border flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <span>{cat}</span>
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border ${
                                  isSelected ? 'bg-[#075C36] border-[#075C36] text-white' : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Existing Brands or Machinery Handled (Optional)
                      </label>
                      <input
                        type="text"
                        name="existingBrands"
                        value={formData.existingBrands}
                        onChange={handleInputChange}
                        placeholder="e.g. STIHL, Honda, local sprayers, pumpsets..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Additional Information / Remarks (Optional)
                      </label>
                      <textarea
                        rows={3}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Mention your showroom square footage, target market taluks, or specific questions..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SUBMIT */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Step 4: Review Your Dealership Application</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Please review all submitted information before final transmission.</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 divide-y divide-slate-200/80 text-sm space-y-4">
                    <div className="pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-emerald-700" />
                          <span>Contact Person</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-slate-700 font-semibold">{formData.fullName}</p>
                      <p className="text-slate-500 text-xs">Mobile: {formData.phone} | Email: {formData.email}</p>
                      {formData.whatsapp && (
                        <p className="text-slate-500 text-xs">WhatsApp: {formData.whatsapp}</p>
                      )}
                    </div>

                    <div className="pt-3 pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-emerald-700" />
                          <span>Dealership Profile</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-slate-700 font-semibold">{formData.companyName} ({formData.businessType})</p>
                      <p className="text-slate-500 text-xs">Location: {formData.city}, {formData.state} - {formData.pincode}</p>
                      {formData.address && <p className="text-slate-500 text-xs">Address: {formData.address}</p>}
                      <p className="text-slate-500 text-xs">Experience: {formData.yearsInBusiness}</p>
                    </div>

                    <div className="pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-emerald-700" />
                          <span>Commercials & Interests</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      {formData.gstin && <p className="text-slate-600 text-xs">GSTIN: <span className="font-mono">{formData.gstin}</span></p>}
                      {formData.pan && <p className="text-slate-600 text-xs">PAN: <span className="font-mono">{formData.pan}</span></p>}
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-slate-700">Categories of Interest:</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {formData.categoriesOfInterest.length > 0 ? (
                            formData.categoriesOfInterest.map(c => (
                              <span key={c} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-medium">
                                {c}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs italic">All Agrimart catalog categories</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Declaration Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I confirm that the details provided are true and accurate to the best of my knowledge, and I express genuine commercial interest in exploring an Agrimart Dealership in my region.
                      </span>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="text-red-500 text-xs mt-1.5">{errors.agreedToTerms}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#075C36] hover:bg-[#064e2e] text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#075C36] font-extrabold text-base shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#075C36] border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Dealership Application</span>
                        <Check className="w-5 h-5 stroke-[3]" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
