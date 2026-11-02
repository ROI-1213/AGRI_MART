import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container max-w-4xl">
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Privacy Policy</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-[#0d9749] text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Legal Notice & Data Protection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <div className="w-16 h-1 bg-[#0d9749] mb-6"></div>

          <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            <p>
              At <strong>Agrimart (Ratnagiri Impex Pvt. Ltd.)</strong>, accessible from https://agrimart.in, one of our main priorities is the privacy of our visitors and customers. This Privacy Policy document contains types of information that is collected and recorded by Agrimart and how we use it.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">1. Information We Collect</h3>
            <p>
              When you register for an account, request a subsidy consultation, or make an equipment purchase, we may ask for contact information including: Full Name, Company / Farm Name, Address, Email Address, Mobile Number, WhatsApp Number, Land Acreage, Crop Type, and Pin Code.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">2. How We Use Your Information</h3>
            <p>
              We use the collected information to process machine orders, facilitate shipping and doorstep delivery, provide One Time Password (OTP) verification for secure login, dispatch government subsidy application details to authorized agricultural officers, and keep you informed of warranty updates and seasonal discounts.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">3. Payment Security</h3>
            <p>
              All online financial transactions are processed securely through certified payment gateways (such as Razorpay) complying with PCI-DSS regulations. Agrimart does not store credit card CVVs or net banking passwords on our local servers.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">4. Contact Us</h3>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>ask@agrimart.in</strong> or call our toll-free customer helpline at <strong>7393 938 938</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
