import React from 'react';
import Link from 'next/link';
import { AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export default function LegalNoticePage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container max-w-4xl">
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Legal Notice</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-[#0d9749] text-xs font-bold uppercase mb-2">
            <Scale className="w-4 h-4" />
            <span>Statutory Declaration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            Legal Notice
          </h1>
          <div className="w-16 h-1 bg-[#0d9749] mb-6"></div>

          <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            <p>
              This website is published and managed by <strong>Ratnagiri Impex Pvt. Ltd.</strong>, having its registered office at:
            </p>
            <div className="bg-gray-50 border p-4 rounded text-xs text-gray-800">
              <strong>Annapurna House</strong>, #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.<br />
              Corporate Identity & Trademark: AGRIMART®, AGRIMATE®
            </div>
            <h3 className="font-bold text-base text-gray-900 mt-6">Intellectual Property Rights</h3>
            <p>
              All trademarks, product designs, brand logos (including KASEI, OLEO-MAC, AGRIMATE, GREEN PANTHER), brochures, schematics, and text appearing on this website are the intellectual property of Ratnagiri Impex Pvt. Ltd. or used under authorized license. Unauthorized reproduction or commercial distribution without written consent is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
