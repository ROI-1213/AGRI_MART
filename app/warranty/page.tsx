import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Wrench, CheckCircle2 } from 'lucide-react';

export default function WarrantyPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container max-w-4xl">
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Warranty Policy</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-[#0d9749] text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Service & Manufacturer Guarantee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            Warranty Policy & Service Guidelines
          </h1>
          <div className="w-16 h-1 bg-[#0d9749] mb-6"></div>

          <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            <p>
              Every new agricultural machine purchased through Agrimart is backed by a <strong>1-Year Limited Manufacturer Warranty</strong> covering material and manufacturing defects when operated in accordance with factory guidelines.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">1. What Is Covered</h3>
            <p>
              Engine mechanical failure, structural casting defects, carburetor manufacturing faults, and electrical starter assembly failures occurring under normal operational load during the first 12 months from delivery.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">2. Routine Wear & Consumables</h3>
            <p>
              Wearable parts subject to friction and continuous operational use (blades, trimmer heads, nylon lines, spark plugs, filters, drive belts, chains, and hoses) are consumable items and excluded from standard warranty except for initial manufacturing defects upon unboxing.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">3. Claiming Warranty Service</h3>
            <p>
              To initiate a warranty request or schedule inspection at one of our 750+ service centers, please keep your invoice copy and RIPL serial number ready and contact our national service desk at <strong>7393 938 938</strong> or email <strong>ask@agrimart.in</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
