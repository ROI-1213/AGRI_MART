'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  FileText 
} from 'lucide-react';
import productsData from '@/data/import/products.json';
import { Product } from '@/types';
import { getLocalizedBrochure } from '@/lib/brochureData';

export default function ProductBrochurePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const paramLang = searchParams.get('lang') || 'English';

  const [currentLang, setCurrentLang] = useState<string>(paramLang);

  useEffect(() => {
    if (paramLang) {
      setCurrentLang(paramLang);
    }
  }, [paramLang]);

  const productId = resolvedParams.id;
  const product = (productsData as unknown as Product[]).find(
    p => p.id === productId || p.slug === productId || p.riplCode.toLowerCase() === productId?.toLowerCase()
  ) || (productsData as unknown as Product[])[0];

  const data = getLocalizedBrochure(product, currentLang);

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
    <div className="bg-[#f1f5f9] min-h-screen py-4 sm:py-8 print:py-0 print:bg-white">
      {/* Top Navigation Bar (Hidden during print) */}
      <div className="max-w-4xl mx-auto px-4 mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/products/${product.slug || product.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-green-700 transition-colors bg-white px-3 py-2 rounded-lg shadow-xs border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Details</span>
        </Link>

        {/* Language Switcher */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setCurrentLang('English')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              currentLang.toLowerCase() === 'english'
                ? 'bg-[#0d9749] text-white shadow-xs'
                : 'text-gray-700 hover:text-green-800'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setCurrentLang('Kannada')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              currentLang.toLowerCase() === 'kannada'
                ? 'bg-[#0d9749] text-white shadow-xs'
                : 'text-gray-700 hover:text-green-800'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
          <button
            type="button"
            onClick={() => setCurrentLang('Telugu')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              currentLang.toLowerCase() === 'telugu'
                ? 'bg-[#0d9749] text-white shadow-xs'
                : 'text-gray-700 hover:text-green-800'
            }`}
          >
            తెలుగు (Telugu)
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-[#0d9749] hover:bg-green-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 print:border-none print:shadow-none print:rounded-none overflow-hidden p-6 sm:p-10 space-y-6">
        
        {/* Document Header */}
        <div className="border-b-2 border-[#0d9749] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative h-12 sm:h-14 w-auto flex items-center">
              <Image
                src="/assets/branding/logo.png"
                alt="Agrimart Logo"
                width={170}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain object-left"
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

          <div className="text-right text-[11px] text-gray-600 sm:border-l sm:border-gray-200 sm:pl-4 space-y-0.5">
            <p className="font-bold text-gray-900">{data.footerNotice.helplineLabel}: {data.footerNotice.helpline}</p>
            <p>{data.footerNotice.email}</p>
            <p>{data.footerNotice.web}</p>
          </div>
        </div>

        {/* Product Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start">
          {/* Left: Product Image & Badges */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-center">
              <Image
                src={mainImage}
                alt={data.productTitle}
                fill
                className="object-contain p-2"
                sizes="260px"
                priority
              />
            </div>

            <div className="mt-3 w-full space-y-1.5 text-center">
              <div className="bg-green-50 text-[#0d9749] border border-green-200 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide">
                {data.codeLabel}: {data.riplCode}
              </div>
              <div className="text-xs text-gray-600 font-semibold">
                {data.brandLabel}: <span className="font-bold text-gray-900">{data.brand}</span>
              </div>
            </div>
          </div>

          {/* Right: Product Identification & Key Info */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
              <span>{data.categoryLabel}</span>
              <span className="text-green-700 font-bold">• {data.langBadge}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
              {data.productTitle}
            </h1>

            {data.description && (
              <div className="bg-gray-50 p-3.5 rounded-md border border-gray-200 text-xs text-gray-700 leading-relaxed font-normal">
                <p className="font-bold text-gray-900 mb-1 text-[11px] uppercase tracking-wide text-[#0d9749]">
                  {data.overviewTitle}
                </p>
                <p>{data.description}</p>
              </div>
            )}

            {/* Commercial Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 bg-green-50/70 border border-green-200 rounded-md">
                <p className="text-[10px] uppercase font-bold text-green-800">{data.commercial.mrpLabel}</p>
                <p className="text-sm font-extrabold text-gray-900">{data.commercial.mrpValue}</p>
                <p className="text-[9px] text-green-700 font-medium">{data.commercial.mrpSub}</p>
              </div>

              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-md">
                <p className="text-[10px] uppercase font-bold text-blue-800">{data.commercial.availLabel}</p>
                <p className="text-xs font-bold text-gray-900">{data.commercial.availVal}</p>
                <p className="text-[9px] text-blue-700 font-medium">{data.commercial.availSub}</p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-2.5 bg-amber-50/70 border border-amber-200 rounded-md">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0d9749]">
              {data.featuresTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {data.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 bg-gray-50/80 rounded border border-gray-200">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-gray-800 leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Specifications Sheet */}
        {data.specs && data.specs.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0d9749]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                {data.specsTitle}
              </h2>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-gray-100">
                  {data.specs.map((s, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-gray-50/80' : 'bg-white'}
                    >
                      <td className="px-4 py-2.5 font-bold text-gray-700 w-1/3 sm:w-1/4 border-r border-gray-100">
                        {s.label}
                      </td>
                      <td className="px-4 py-2.5 text-gray-900 font-medium">
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
          <div className="space-y-2 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0d9749]">
              {data.accessoriesTitle} ({validAccessories.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {validAccessories.map((acc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 text-xs text-gray-800"
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
          <div className="space-y-2 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700">
              {data.sparesTitle} ({validSpareParts.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {validSpareParts.map((sp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 text-gray-800"
                >
                  <span>{sp.name}</span>
                  <span className="font-mono text-gray-500 font-bold text-[11px]">{sp.partNo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Footer Notice */}
        <div className="pt-4 border-t border-gray-200 text-[10px] text-gray-500 flex flex-col sm:flex-row justify-between gap-3 bg-gray-50 p-3 rounded-lg">
          <div className="space-y-0.5">
            <p className="font-bold text-gray-900">
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

      </main>
    </div>
  );
}
