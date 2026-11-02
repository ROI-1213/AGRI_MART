'use client';

import React, { useState } from 'react';
import { X, Lock, KeyRound, Building, User, Phone, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'otp' | 'register' | 'b2b' | 'admin';
  onClose: () => void;
}

export default function AuthModal({ isOpen, initialMode = 'signin', onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'otp' | 'register' | 'b2b' | 'admin'>(initialMode);
  
  // OTP state
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [mockOtpCode, setMockOtpCode] = useState('');
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);

  // Forms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNo, setGstNo] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtpCode(code);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === mockOtpCode || otp === '123456') {
      setAuthenticatedUser(`User (${mobile})`);
    } else {
      alert('Invalid OTP. Please enter the OTP displayed on screen.');
    }
  };

  const handleGeneralLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'admin') {
      if (email === 'admin@agrimart.in' && password === 'admin123') {
        window.location.href = '/admin';
      } else {
        setAuthenticatedUser('Admin User');
      }
    } else if (mode === 'b2b') {
      setAuthenticatedUser(`Dealer: ${companyName || 'Registered Partner'}`);
    } else {
      setAuthenticatedUser(name || email || 'Customer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#242424] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#0d9749]">
          <div className="flex items-center gap-2">
            {mode === 'admin' ? (
              <Lock className="w-5 h-5 text-red-500" />
            ) : mode === 'b2b' ? (
              <Building className="w-5 h-5 text-yellow-400" />
            ) : mode === 'otp' ? (
              <KeyRound className="w-5 h-5 text-yellow-400" />
            ) : (
              <User className="w-5 h-5 text-green-500" />
            )}
            <h3 className="font-bold text-base">
              {mode === 'admin' && 'Agrimart Admin User Login'}
              {mode === 'b2b' && 'B2B Dealer & Franchise Login'}
              {mode === 'otp' && 'Fast Login Via Mobile OTP'}
              {mode === 'signin' && 'Sign In to Your Account'}
              {mode === 'register' && 'New Customer Registration'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {authenticatedUser ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-gray-900 mb-1">Welcome back!</h4>
              <p className="text-sm text-gray-600 mb-6">
                You are securely logged in as <strong>{authenticatedUser}</strong>.
              </p>
              {mode === 'admin' ? (
                <a href="/admin" className="agri-btn-primary w-full">
                  Proceed to Admin Dashboard →
                </a>
              ) : (
                <button
                  onClick={() => {
                    setAuthenticatedUser(null);
                    onClose();
                  }}
                  className="agri-btn-primary w-full"
                >
                  Continue Shopping
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Tab Switcher */}
              <div className="flex border-b mb-5 text-xs font-semibold overflow-x-auto">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setOtpSent(false); }}
                  className={`pb-2 px-2 border-b-2 whitespace-nowrap ${
                    mode === 'signin' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('otp'); setOtpSent(false); }}
                  className={`pb-2 px-2 border-b-2 whitespace-nowrap ${
                    mode === 'otp' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-500'
                  }`}
                >
                  Login Via OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setOtpSent(false); }}
                  className={`pb-2 px-2 border-b-2 whitespace-nowrap ${
                    mode === 'register' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-500'
                  }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('b2b'); setOtpSent(false); }}
                  className={`pb-2 px-2 border-b-2 whitespace-nowrap ${
                    mode === 'b2b' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-500'
                  }`}
                >
                  B2B Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('admin'); setOtpSent(false); }}
                  className={`pb-2 px-2 border-b-2 whitespace-nowrap ${
                    mode === 'admin' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* MODE: OTP */}
              {mode === 'otp' && (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Registered Mobile Number
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-xs border border-r-0 border-gray-300 bg-gray-100 text-gray-600 rounded-l">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 10-digit number"
                            className="w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                          />
                        </div>
                      </div>
                      <button type="submit" className="agri-btn-primary w-full text-xs">
                        Request OTP SMS
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="bg-green-50 border border-green-200 p-2.5 rounded text-xs text-green-800">
                        OTP SMS sent to <strong>+91 {mobile}</strong>.<br />
                        <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-green-300 text-green-900 font-bold mt-1 inline-block">
                          Sandbox Test OTP: {mockOtpCode}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Enter 6-digit OTP
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-digit OTP"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-green-600"
                        />
                      </div>
                      <button type="submit" className="agri-btn-primary w-full text-xs">
                        Verify & Login
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-xs text-gray-500 hover:text-gray-800 block text-center w-full"
                      >
                        Change Mobile Number
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* MODE: SIGN IN / ADMIN / B2B */}
              {(mode === 'signin' || mode === 'admin' || mode === 'b2b') && (
                <form onSubmit={handleGeneralLogin} className="space-y-4">
                  {mode === 'b2b' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Dealer / Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Registered Enterprise Name"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {mode === 'admin' ? 'Admin Username / Email' : 'Email or Registered Mobile'}
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={mode === 'admin' ? 'admin@agrimart.in' : 'user@example.com'}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                  </div>

                  {mode === 'admin' && (
                    <p className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded">
                      Demo Admin credentials: <code>admin@agrimart.in</code> / <code>admin123</code>
                    </p>
                  )}

                  <button
                    type="submit"
                    className={`w-full text-xs font-bold py-2.5 rounded text-white ${
                      mode === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#0d9749] hover:bg-[#097b3a]'
                    } transition-colors`}
                  >
                    {mode === 'admin' ? 'Access Admin Console' : mode === 'b2b' ? 'B2B Dealer Sign In' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* MODE: REGISTER */}
              {mode === 'register' && (
                <form onSubmit={handleGeneralLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Set Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                  </div>
                  <button type="submit" className="agri-btn-primary w-full text-xs py-2.5">
                    Create Account & Proceed
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
