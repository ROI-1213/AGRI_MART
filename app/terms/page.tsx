import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container max-w-4xl">
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Terms & Conditions</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-[#2d7d32] text-xs font-bold uppercase mb-2">
            <FileText className="w-4 h-4" />
            <span>Customer Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <div className="w-16 h-1 bg-[#2d7d32] mb-6"></div>

          <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            <p>
              Welcome to <strong>Agrimart</strong>. By accessing or using our website (agrimart.in) and purchasing farm tools or equipment, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">1. Commercial Catalogue & Pricing</h3>
            <p>
              All prices shown on the website are in Indian Rupees (INR) and are inclusive of Goods & Services Tax (GST) unless explicitly noted. We strive to maintain current pricing; however, prices, promotional offers, and inventory levels are subject to confirmation at order placement.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">2. Order Acceptance & Shipping</h3>
            <p>
              Orders are confirmed upon receipt of successful payment or authorized B2B purchase verification. Delivery timelines depend on distance from our regional hubs and availability of road logistics. Door delivery is fulfilled to motorable addresses.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">3. Machinery Operation & Safety</h3>
            <p>
              Power equipment (chainsaws, brush cutters, mistblowers, rotavators) must only be operated in accordance with the provided user manual and safety guidelines. Operators must wear proper protective gear (safety glasses, gloves, boots). Ratnagiri Impex Pvt. Ltd. is not liable for accidents caused by negligent operation.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">4. Jurisdiction</h3>
            <p>
              Any disputes arising out of the use of this website or orders placed through Agrimart are governed by the laws of India and subject to the exclusive jurisdiction of the competent courts in Bangalore, Karnataka.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
