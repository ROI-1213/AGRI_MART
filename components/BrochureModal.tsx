'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Printer, CheckCircle2, ShieldCheck, FileText, Globe, Check } from 'lucide-react';
import { Product } from '@/types';
import { getLocalizedBrochure } from '@/lib/brochureData';

interface BrochureModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  brochureTitle?: string;
  initialLanguage?: string;
  specs?: Array<{ label: string; value: string }>;
}

export default function BrochureModal({
  product,
  isOpen,
  onClose,
  brochureTitle,
  initialLanguage = 'English'
}: BrochureModalProps) {
  const [currentLang, setCurrentLang] = useState<string>(initialLanguage);

  useEffect(() => {
    if (initialLanguage) {
      setCurrentLang(initialLanguage);
    }
  }, [initialLanguage, isOpen]);

  if (!isOpen) return null;

  const data = getLocalizedBrochure(product, currentLang, brochureTitle);

  const validAccessories = (product.accessories || []).filter(
    (a) => a && a.name && !/^(no information available\.?|na|n\/a|none)$/i.test(a.name.trim())
  );
  const validSpareParts = (product.spareParts || []).filter(
    (sp) => sp && sp.name && !/^(no information available\.?|na|n\/a|none)$/i.test(sp.name.trim())
  );

  const mainImage = product.thumbnailImage || product.images?.[0] || '/assets/branding/logo.png';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      {/* Backdrop click handler */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:rounded-none">
        
        {/* Sticky Action Toolbar (Hidden during print) */}
        <div className="bg-[#0d9749] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden select-none">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-white/90 shrink-0" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {data.docType}
              </h3>
              <p className="text-[11px] text-white/80">
                Language: <strong>{data.langBadge}</strong> • Ratnagiri Impex Official Document
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector Pills */}
            <div className="flex items-center bg-green-900/60 p-0.5 rounded-lg border border-green-700/60 text-xs">
              <button
                type="button"
                onClick={() => setCurrentLang('English')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentLang.toLowerCase() === 'english'
                    ? 'bg-white text-[#0d9749] shadow-xs'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang('Kannada')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentLang.toLowerCase() === 'kannada'
                    ? 'bg-white text-[#0d9749] shadow-xs'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                ಕನ್ನಡ (Kannada)
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang('Telugu')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentLang.toLowerCase() === 'telugu'
                    ? 'bg-white text-[#0d9749] shadow-xs'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-white text-[#0d9749] hover:bg-green-50 px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors ml-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Leaflet Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 print:p-4 print:overflow-visible text-gray-800">
          
          {/* Printable Leaflet Header */}
          <div className="border-b-2 border-[#0d9749] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-auto flex items-center">
                <Image
                  src="/assets/branding/logo.png"
                  alt="Agrimart Logo"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain object-left"
                  priority
                  unoptimized
                />
              </div>
              <div className="border-l border-gray-300 pl-3">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  {data.companyName}
                </p>
                <p className="text-xs font-extrabold text-[#0d9749]">
                  {data.docType}
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-gray-500 sm:border-l sm:border-gray-200 sm:pl-4 space-y-0.5">
              <p className="font-bold text-gray-800">{data.footerNotice.helplineLabel}: {data.footerNotice.helpline}</p>
              <p>{data.footerNotice.email}</p>
              <p>{data.footerNotice.web}</p>
            </div>
          </div>

          {/* Product Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
            {/* Left: Product Image & Badges */}
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                <Image
                  src={mainImage}
                  alt={data.productTitle}
                  fill
                  className="object-contain p-2"
                  sizes="240px"
                  priority
                />
              </div>

              <div className="mt-3 w-full space-y-1.5 text-center">
                <div className="inline-block bg-green-50 text-[#0d9749] border border-green-200 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide w-full">
                  {data.codeLabel}: {data.riplCode}
                </div>
                <div className="text-[11px] text-gray-500 font-semibold">
                  {data.brandLabel}: <span className="font-bold text-gray-800">{data.brand}</span>
                </div>
              </div>
            </div>

            {/* Right: Product Identification & Key Info */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                <span>{data.categoryLabel}</span>
                <span className="text-green-700">• {data.langBadge}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                {data.productTitle}
              </h2>

              {data.description && (
                <div className="bg-gray-50/80 p-3.5 rounded-md border border-gray-200/80 text-xs text-gray-700 leading-relaxed font-normal">
                  <p className="font-bold text-gray-900 mb-1 text-[11px] uppercase tracking-wide text-[#0d9749]">
                    {data.overviewTitle}
                  </p>
                  <p>{data.description}</p>
                </div>
              )}

              {/* Commercial & Subsidy Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 bg-green-50/60 border border-green-100 rounded-md">
                  <p className="text-[10px] uppercase font-bold text-green-800">{data.commercial.mrpLabel}</p>
                  <p className="text-sm font-extrabold text-gray-900">{data.commercial.mrpValue}</p>
                  <p className="text-[9px] text-green-700 font-medium">{data.commercial.mrpSub}</p>
                </div>

                <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-md">
                  <p className="text-[10px] uppercase font-bold text-blue-800">{data.commercial.availLabel}</p>
                  <p className="text-xs font-bold text-gray-900">{data.commercial.availVal}</p>
                  <p className="text-[9px] text-blue-700 font-medium">{data.commercial.availSub}</p>
                </div>

                <div className="col-span-2 sm:col-span-1 p-2.5 bg-amber-50/60 border border-amber-100 rounded-md">
                  <p className="text-[10px] uppercase font-bold text-amber-800">{data.commercial.subsidyLabel}</p>
                  <p className="text-xs font-bold text-gray-900">{data.commercial.subsidyVal}</p>
                  <p className="text-[9px] text-amber-700 font-medium">{data.commercial.subsidySub}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          {data.features && data.features.length > 0 && (
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0d9749]">
                {data.featuresTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {data.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50/80 rounded border border-gray-200/60">
                    <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-gray-800">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications Sheet */}
          {data.specs && data.specs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 border-b border-gray-200 pb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0d9749]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  {data.specsTitle}
                </h3>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-gray-100">
                    {data.specs.map((s, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-gray-50/80' : 'bg-white'}
                      >
                        <td className="px-3.5 py-2 font-bold text-gray-700 w-1/3 sm:w-1/4 border-r border-gray-100">
                          {s.label}
                        </td>
                        <td className="px-3.5 py-2 text-gray-900 font-medium">
                          {s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Included Accessories */}
          {validAccessories.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0d9749]">
                {data.accessoriesTitle} ({validAccessories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {validAccessories.map((acc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200/60 text-xs text-gray-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>{acc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Genuine Spare Parts */}
          {validSpareParts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {data.sparesTitle} ({validSpareParts.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {validSpareParts.map((sp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200/60 text-gray-800"
                  >
                    <span>{sp.name}</span>
                    <span className="font-mono text-gray-500 font-bold text-[11px]">{sp.partNo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Footer Notice */}
          <div className="pt-4 border-t border-gray-200 text-[10px] text-gray-500 flex flex-col sm:flex-row justify-between gap-3 bg-gray-50/50 p-3 rounded-lg">
            <div className="space-y-0.5">
              <p className="font-bold text-gray-800">
                {data.footerNotice.company}
              </p>
              <p>{data.footerNotice.address}</p>
              <p>{data.footerNotice.note}</p>
            </div>
            <div className="sm:text-right space-y-0.5 shrink-0">
              <p><strong>{data.footerNotice.helplineLabel}:</strong> {data.footerNotice.helpline}</p>
              <p><strong>Email:</strong> {data.footerNotice.email}</p>
              <p><strong>Website:</strong> https://agrimart.in</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
