import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container max-w-4xl">
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Disclaimer</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-yellow-600 text-xs font-bold uppercase mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Product Accuracy & Operational Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            Disclaimer
          </h1>
          <div className="w-16 h-1 bg-yellow-500 mb-6"></div>

          <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            <p>
              The information and equipment specifications contained on this website are for general guidance and agricultural machinery selection purposes only. While Ratnagiri Impex Pvt. Ltd. makes every effort to keep specifications and imagery current, manufacturers may introduce engineering updates or aesthetic modifications without prior notice.
            </p>
            <h3 className="font-bold text-base text-gray-900 mt-6">Subsidy Program Disclaimer</h3>
            <p>
              Government subsidy figures and eligibility under central or state agricultural mechanization schemes (SMAM, RKVY, etc.) depend upon regional budgetary approvals, land documentation validity, and local agriculture department guidelines. Agrimart assists with technical documentation and invoice generation, but final grant approval rests with the respective government authorities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
