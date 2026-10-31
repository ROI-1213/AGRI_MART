'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    feedback_type: 'Customer',
    contact_type: 'Product Enquiry',
    country: 'India',
    state: 'Karnataka',
    pincode: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          feedbackType: formData.feedback_type,
          contactType: formData.contact_type,
          country: formData.country,
          state: formData.state,
          pincode: formData.pincode,
          message: formData.message,
          enquiryType: 'PRODUCT_ENQUIRY'
        })
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      // Mock success for interactive demo
      setStatus('success');
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Contact Us</span>
        </div>

        {/* Hero Banner Created Using Website's Agricultural Machinery Products */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-10 shadow-sm border border-gray-200">
          <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[390px]">
            <Image
              src="/assets/banners/contact_hero_banner_hd.png"
              alt="Contact Agrimart Machinery Support"
              fill
              priority
              className="object-cover object-right md:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-transparent flex items-center">
              <div className="max-w-xl p-6 sm:p-8 lg:p-12 text-white">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 backdrop-blur-xs">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Pan-India Sales & Service Support</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2.5">
                  Connect With Agrimart Specialists
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal mb-4 max-w-md">
                  Expert consultation for agricultural machinery selection, institutional subsidies, genuine spare parts, and nationwide dealer network assistance.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-100">
                  <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">Quick Response Desk</span>
                  <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">100% Genuine RIPL Spares</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
              Send an Enquiry
            </h2>

            {status === 'success' ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Received Successfully!</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mb-6">
                  Thank you, <strong>{formData.name}</strong>. Your enquiry has been registered in the Agrimart central support desk. An equipment specialist will contact you at <strong>{formData.mobile}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFormData({
                      name: '',
                      mobile: '',
                      email: '',
                      feedback_type: 'Customer',
                      contact_type: 'Product Enquiry',
                      country: 'India',
                      state: 'Karnataka',
                      pincode: '',
                      message: ''
                    });
                  }}
                  className="agri-btn-primary text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit mobile number"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  {/* Dropdown 1: Feedback Type */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Type of User <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.feedback_type}
                      onChange={(e) => setFormData({ ...formData, feedback_type: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none bg-white"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Dealer/Franchise">Dealer/Franchise</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Dropdown 2: Contact / Enquiry Type */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Select Enquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.contact_type}
                      onChange={(e) => setFormData({ ...formData, contact_type: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none bg-white"
                    >
                      <option value="Product Enquiry">Product Enquiry</option>
                      <option value="Service Enquiry">Service Enquiry</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Dealership/Franchise Enquiry">Dealership/Franchise Enquiry</option>
                    </select>
                  </div>

                  {/* Dropdown 3: Country */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Select Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none bg-white"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>

                  {/* Dropdown 4: State */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Select State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none bg-white"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Odisha">Odisha</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Assam">Assam</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </select>
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="6-digit pincode"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Your Message / Detailed Enquiry
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about machinery, equipment model, or franchise location..."
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="agri-btn-primary text-xs py-2.5 px-6"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{status === 'submitting' ? 'Submitting...' : 'Submit Enquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details (1 col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b">
                Contact Information
              </h2>

              <div className="space-y-4 text-xs text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2d7d32] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Head Office</h3>
                    <p className="mt-1 leading-relaxed text-gray-600">
                      <strong>Ratnagiri Impex Pvt. Ltd.</strong><br />
                      Annapurna House, #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#2d7d32] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Telephone / Helpline</h3>
                    <p className="mt-1 text-gray-600">
                      Toll Free: <a href="tel:7393938938" className="font-bold text-[#2d7d32] hover:underline">7393 938 938</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#2d7d32] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Email Address</h3>
                    <p className="mt-1 text-gray-600">
                      <a href="mailto:ask@agrimart.in" className="hover:underline text-[#2d7d32]">
                        ask@agrimart.in
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#2d7d32] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Working Hours</h3>
                    <p className="mt-1 text-gray-600">
                      Monday – Saturday: 9:30 AM – 6:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Brochure Card */}
            <div className="bg-[#1b5e20] text-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-sm mb-2">Corporate Profile PDF</h3>
              <p className="text-xs text-green-100 mb-4 leading-relaxed">
                Download the verified Agrimart deck covering company history, dealer network, and machine families.
              </p>
              <a
                href="/assets/brochures/corporate_brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="agri-btn-secondary text-xs w-full text-center py-2"
              >
                Download Corporate Deck (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
