'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Download, 
  Check, 
  FileCheck, 
  Maximize2 
} from 'lucide-react';
import { Product } from '@/types';
import { getLocalizedBrochure } from '@/lib/brochureData';

interface BrochureModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  brochureTitle?: string;
  initialLanguage?: string;
  brochureUrl?: string;
  specs?: Array<{ label: string; value: string }>;
}

export default function BrochureModal({
  product,
  isOpen,
  onClose,
  brochureTitle,
  initialLanguage = 'English',
  brochureUrl
}: BrochureModalProps) {
  const [currentLang, setCurrentLang] = useState<string>(initialLanguage);
  const [activeUrl, setActiveUrl] = useState<string>(brochureUrl || '');
  const [viewMode, setViewMode] = useState<'document' | 'datasheet'>('document');
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  // Sync state on open or prop change
  useEffect(() => {
    if (isOpen) {
      setCurrentLang(initialLanguage || 'English');
      setActiveUrl(brochureUrl || '');
      setViewMode(brochureUrl ? 'document' : 'datasheet');
      setIsPdfLoading(true);
    }
  }, [isOpen, initialLanguage, brochureUrl]);

  // When language changes, update activeUrl if multilingual brochures exist
  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    if (product.brochures && product.brochures.length > 0) {
      const match = product.brochures.find(
        (b) => b.language && b.language.toLowerCase() === lang.toLowerCase()
      );
      if (match && match.url) {
        setActiveUrl(match.url);
        setIsPdfLoading(true);
      }
    }
  };

  if (!isOpen) return null;

  const data = getLocalizedBrochure(product, currentLang, brochureTitle);

  const validAccessories = (product.accessories || []).filter(
    (a) => a && a.name && !/^(no information available\.?|na|n\/a|none)$/i.test(a.name.trim())
  );
  const validSpareParts = (product.spareParts || []).filter(
    (sp) => sp && sp.name && !/^(no information available\.?|na|n\/a|none)$/i.test(sp.name.trim())
  );

  const mainImage = product.thumbnailImage || product.images?.[0] || '/assets/branding/logo.png';

  const ext = (activeUrl || '').split('?')[0].split('.').pop()?.toLowerCase() || '';
  const isImageBrochure = ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp';
  const hasDocument = Boolean(activeUrl);

  const documentApiUrl = activeUrl
    ? `/api/brochures?url=${encodeURIComponent(activeUrl)}&id=${encodeURIComponent(product.slug || product.id)}&lang=${encodeURIComponent(currentLang)}&filename=${encodeURIComponent((brochureTitle || product.name || 'brochure').replace(/\s+/g, '_') + '.' + (ext || 'pdf'))}`
    : '';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      {/* Backdrop click handler */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col h-[94vh] print:h-auto print:shadow-none print:rounded-none">
        
        {/* Sticky Action Toolbar (Hidden during print) */}
        <div className="bg-[#0d9749] text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden select-none border-b border-green-700">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-white/90 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold tracking-tight line-clamp-1">
                {brochureTitle || data.docType}
              </h3>
              <p className="text-[11px] text-white/80 hidden sm:block">
                Language: <strong>{data.langBadge}</strong> • Official Ratnagiri Impex Document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* View Mode Toggle (when official document exists) */}
            {hasDocument && (
              <div className="flex items-center bg-green-950/40 p-0.5 rounded-lg border border-green-700/60 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('document')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'document'
                      ? 'bg-white text-[#0d9749] shadow-xs'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Official Brochure
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('datasheet')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'datasheet'
                      ? 'bg-white text-[#0d9749] shadow-xs'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Datasheet
                </button>
              </div>
            )}

            {/* Language Selector Pills */}
            <div className="flex items-center bg-green-950/40 p-0.5 rounded-lg border border-green-700/60 text-xs">
              <button
                type="button"
                onClick={() => handleLanguageChange('English')}
                className={`px-2 sm:px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentLang.toLowerCase() === 'english'
                    ? 'bg-white text-[#0d9749] shadow-xs'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('Kannada')}
                className={`px-2 sm:px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentLang.toLowerCase() === 'kannada'
                    ? 'bg-white text-[#0d9749] shadow-xs'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('Telugu')}
                className={`px-2 sm:px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  currentLang.toLowerCase() === 'telugu'
                    ? 'bg-white text-[#0d9749] shadow-xs'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Direct Open in Full Tab */}
            {hasDocument && documentApiUrl && (
              <a
                href={documentApiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1 bg-white text-[#0d9749] hover:bg-green-50 px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer shadow-xs"
                title="Open original document in full browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Tab</span>
              </a>
            )}

            {/* Print or Save as PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 bg-green-800 hover:bg-green-900 text-white px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Close Modal */}
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

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 flex flex-col">
          
          {/* 1. OFFICIAL DOCUMENT VIEW (PDF or High-Res Image Leaflet) */}
          {viewMode === 'document' && hasDocument ? (
            <div className="flex-1 flex flex-col h-full bg-[#525659] relative">
              {isImageBrochure ? (
                /* High-Res Image Brochure View */
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={documentApiUrl}
                    alt={brochureTitle || product.name}
                    className="max-w-full max-h-[82vh] object-contain shadow-2xl rounded"
                  />
                </div>
              ) : (
                /* Embedded Official PDF View */
                <div className="flex-1 flex flex-col w-full h-full relative">
                  <iframe
                    src={`${documentApiUrl}#toolbar=1&navpanes=0&view=FitH`}
                    className="w-full flex-1 border-0 min-h-[75vh]"
                    title={brochureTitle || product.name}
                    onLoad={() => setIsPdfLoading(false)}
                  />
                </div>
              )}

              {/* Bottom Helpful Info Bar */}
              <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between text-gray-600 gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-green-600" />
                  <span>
                    Official Document: <strong>{activeUrl.split('/').pop()}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={documentApiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in new tab</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setViewMode('datasheet')}
                    className="text-gray-700 hover:text-green-800 font-semibold underline cursor-pointer"
                  >
                    Switch to Datasheet Table
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 2. STRUCTURED PRINTABLE TECHNICAL DATASHEET VIEW */
            <div className="p-4 sm:p-8 space-y-6 print:p-4 text-gray-800 bg-white max-w-4xl mx-auto w-full shadow-sm my-4 rounded-lg">
              
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

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                    <span>{data.categoryLabel}</span>
                    <span className="text-green-700 font-bold">• {data.langBadge}</span>
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
          )}

        </div>

      </div>
    </div>
  );
}
