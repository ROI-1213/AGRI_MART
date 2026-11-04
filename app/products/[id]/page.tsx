'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  Check, 
  FileCheck2, 
  Bell
} from 'lucide-react';
import SubsidyModal from '@/components/SubsidyModal';
import QuoteModal from '@/components/QuoteModal';
import productsData from '@/data/import/products.json';
import { Product } from '@/types';
import { formatProductTitle } from '@/lib/format';

interface SpecItem {
  label: string;
  value: string;
}

function extractProductSpecs(product: Product): SpecItem[] {
  const specs: SpecItem[] = [];
  const desc = product.description || '';
  const name = product.name || '';

  // 1. Existing specs in product.specifications if any
  if (product.specifications && typeof product.specifications === 'object') {
    Object.entries(product.specifications).forEach(([k, v]) => {
      if (v && String(v).trim()) specs.push({ label: k.trim(), value: String(v).trim() });
    });
  }

  // 2. Tank / Liquid / Chemical / Fuel Capacity
  const tankMatch = desc.match(/(?:collection bag capacity|liquid tank capacity|tank capacity|fuel tank capacity|chemical tank capacity|tank|capacity)\s*[:\-]?\s*([0-9.]+\s*(?:ltrs?|l|litres?|kg))/i) ||
                    name.match(/([0-9.]+\s*(?:ltrs?|l|litres?))/i);
  if (tankMatch && !specs.some(s => /tank|bag|capacity/i.test(s.label))) {
    specs.push({ label: 'Tank / Bag Capacity', value: tankMatch[1].trim() });
  }

  // 3. Power (HP / kW / W / V)
  const powerMatch = desc.match(/(?:engine power|rated power|max output|power)\s*[:\-]?\s*([0-9.]+\s*(?:hp|kw|w)(?:[-/][0-9.]+\s*(?:hp|kw|w))?)/i) ||
                     desc.match(/([0-9.]+\s*(?:hp|kw))/i);
  if (powerMatch && !specs.some(s => /power|output/i.test(s.label))) {
    specs.push({ label: 'Power / Output', value: powerMatch[1].trim() });
  }

  // 4. Battery / Voltage
  const batMatch = desc.match(/(?:battery)\s*[:\-]?\s*([0-9]+V(?:\s*\/\s*[0-9]+AH)?)/i) ||
                   name.match(/([0-9]+V\s*\/?\s*[0-9]+AH)/i);
  if (batMatch && !specs.some(s => /battery/i.test(s.label))) {
    specs.push({ label: 'Battery Specification', value: batMatch[1].trim() });
  }

  // 5. Displacement (cc / cm³)
  const dispMatch = desc.match(/(?:displacement|engine displacement)\s*[:\-]?\s*([0-9.]+\s*(?:cc|cm³|cm3))/i) ||
                    name.match(/([0-9.]+\s*cc)/i);
  if (dispMatch && !specs.some(s => /displacement/i.test(s.label))) {
    specs.push({ label: 'Engine Displacement', value: dispMatch[1].trim() });
  }

  // 6. Engine Type / Stroke
  const engineMatch = desc.match(/(?:engine)\s*[:\-]?\s*([^.,\n<]+(?:stroke|cylinder|diesel|petrol|electric|brushless)[^.,\n<]*)/i);
  if (engineMatch && !specs.some(s => /engine/i.test(s.label))) {
    specs.push({ label: 'Engine Type', value: engineMatch[1].trim() });
  }

  // 7. Air Volume / Flow Rate
  const airVolMatch = desc.match(/(?:max\.?\s*air\s*volume|air\s*flow\s*rate|air\s*volume)\s*[:\-]?\s*([0-9.]+\s*(?:m3\/hr|m³\/hr|m³\/min|m3\/min))/i);
  if (airVolMatch && !specs.some(s => /air volume|flow/i.test(s.label))) {
    specs.push({ label: 'Air Flow / Volume', value: airVolMatch[1].trim() });
  }

  // 8. Air Speed
  const airSpeedMatch = desc.match(/(?:max\.?\s*air\s*speed|air\s*speed)\s*[:\-]?\s*([0-9.]+\s*(?:m\/s|km\/h|km\/hr))/i);
  if (airSpeedMatch && !specs.some(s => /speed/i.test(s.label))) {
    specs.push({ label: 'Max Air Speed', value: airSpeedMatch[1].trim() });
  }

  // 9. Weight
  const weightMatch = desc.match(/(?:dry weight|weight|net weight)\s*[:\-]?\s*([0-9.]+\s*(?:kg|kgs?|grams?))/i);
  if (weightMatch && !specs.some(s => /weight/i.test(s.label))) {
    specs.push({ label: 'Weight', value: weightMatch[1].trim() });
  }

  // 10. Working Width / Tilling Width
  const widthMatch = desc.match(/(?:tilling width|working width|width)\s*[:\-]?\s*([0-9.]+\s*(?:mm|cm|meters?|m|inches?))/i);
  if (widthMatch && !specs.some(s => /width/i.test(s.label))) {
    specs.push({ label: 'Working Width', value: widthMatch[1].trim() });
  }

  // 11. Core Standard Identity Specs
  specs.push({ label: 'Brand', value: product.brand || 'Ratnagiri Impex' });
  specs.push({ label: 'Model / RIPL Code', value: product.riplCode || product.id });
  specs.push({ label: 'Category', value: product.category });
  specs.push({ label: 'Government Subsidy', value: 'Eligible under State/Central Farm Mechanization (SMAM)' });
  specs.push({ label: 'Warranty', value: '1 Year Manufacturer / RIPL Authorized Warranty' });

  return specs;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const product = (productsData as unknown as Product[]).find(
    p => p.id === productId || p.slug === productId || p.riplCode.toLowerCase() === productId?.toLowerCase()
  ) || (productsData as unknown as Product[])[0];

  const allSpecs = extractProductSpecs(product);

  // Filter only items with actual, valid content
  const validAccessories = (product.accessories || []).filter(
    (a) => a && a.name && !/^(no information available\.?|na|n\/a|none)$/i.test(a.name.trim())
  );
  const validSpareParts = (product.spareParts || []).filter(
    (sp) => sp && sp.name && !/^(no information available\.?|na|n\/a|none)$/i.test(sp.name.trim())
  );
  const hasAccessoriesOrSpares = validAccessories.length > 0 || validSpareParts.length > 0;
  const validBrochures = (product.brochures || []).filter(
    (b) => b && b.url && b.url.trim() !== ''
  );
  const hasBrochures = validBrochures.length > 0;

  const [selectedImage, setSelectedImage] = useState<string>(product.thumbnailImage || product.images[0] || '/assets/branding/logo.png');
  const [activeTab, setActiveTab] = useState<'desc' | 'accessories' | 'brochure'>('desc');
  const [subsidyModalOpen, setSubsidyModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const handleRequestQuote = () => {
    setQuoteModalOpen(true);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8">
      <div className="agri-container">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 sm:mb-6 flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap no-scrollbar py-0.5">
          <Link href="/" className="hover:text-green-700 shrink-0">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-green-700 shrink-0">Products</Link>
          <span>/</span>
          <Link 
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-green-700 shrink-0"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-normal truncate max-w-xs shrink-0">{formatProductTitle(product.name)}</span>
        </div>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Column */}
            <div>
              {/* Main Image Display */}
              <div className="relative aspect-square w-full bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 flex items-center justify-center p-2">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  unoptimized
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 650px"
                  onError={() => setSelectedImage('/assets/branding/logo.png')}
                  className="object-contain p-1 transition-all duration-300"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails Row */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded border-2 overflow-hidden bg-gray-50 shrink-0 ${
                        selectedImage === img ? 'border-[#0d9749]' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Buying Column */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Brand & Category badges */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-green-50 text-[#0d9749] border border-green-200 uppercase tracking-wide">
                    {product.brand}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    Category: {product.category}
                  </span>
                </div>

                {/* Product Name (Unbolded, clean readable display, unified format) */}
                <h1 className="text-xl sm:text-2xl font-normal text-gray-900 leading-snug mb-2">
                  {formatProductTitle(product.name)}
                </h1>

                {/* Product Code */}
                <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded inline-block mb-6">
                  <span className="text-xs text-gray-500 font-mono">
                    Code: <strong className="text-gray-900 text-sm font-bold">{product.riplCode}</strong>
                  </span>
                </div>

                {/* Primary Call-to-Action: Request a Quote */}
                <div className="pt-2 mb-4">
                  <button
                    onClick={handleRequestQuote}
                    className="w-full bg-[#0d9749] hover:bg-[#097b3a] text-white font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg text-sm sm:text-base cursor-pointer active:scale-[0.99]"
                  >
                    <FileText className="w-5 h-5 text-yellow-300" />
                    <span>Request a Quote</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Detail Tabs: Product description, Accessories, Brochure, Video */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50 text-xs sm:text-sm font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-3.5 px-6 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'desc'
                  ? 'border-[#0d9749] text-[#0d9749] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Product Description
            </button>

            {hasAccessoriesOrSpares && (
              <button
                onClick={() => setActiveTab('accessories')}
                className={`py-3.5 px-6 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'accessories'
                    ? 'border-[#0d9749] text-[#0d9749] bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {validAccessories.length > 0 && validSpareParts.length > 0
                  ? 'Accessories & Spare Parts'
                  : validAccessories.length > 0
                  ? `Included Accessories (${validAccessories.length})`
                  : `Spare Parts (${validSpareParts.length})`}
              </button>
            )}

            {hasBrochures && (
              <button
                onClick={() => setActiveTab('brochure')}
                className={`py-3.5 px-6 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'brochure'
                    ? 'border-[#0d9749] text-[#0d9749] bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Brochures &amp; Leaflets ({validBrochures.length})
              </button>
            )}
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 sm:p-8">
            {/* 1. DESCRIPTION TAB */}
            {activeTab === 'desc' && (
              <div className="space-y-6">
                <div
                  className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                {/* Technical Specifications Table */}
                {allSpecs.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#0d9749]"></span>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Technical Specifications
                      </h3>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden text-xs shadow-2xs">
                      <table className="w-full text-left divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-100">
                          {allSpecs.map((spec, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/70 hover:bg-gray-100/60' : 'bg-white hover:bg-gray-50/50'}>
                              <td className="px-4 py-2.5 font-bold text-gray-700 w-1/3 sm:w-1/4 border-r border-gray-100">
                                {spec.label}
                              </td>
                              <td className="px-4 py-2.5 text-gray-900 font-medium">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. ACCESSORIES & SPARE PARTS TAB */}
            {activeTab === 'accessories' && hasAccessoriesOrSpares && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                  {validAccessories.length > 0 && validSpareParts.length > 0
                    ? 'Compatible Accessories & Genuine RIPL Spare Parts'
                    : validAccessories.length > 0
                    ? 'Included Standard Accessories'
                    : 'Recommended Genuine RIPL Spare Parts'}
                </h3>
                <div className={`grid gap-4 ${validAccessories.length > 0 && validSpareParts.length > 0 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-xl'}`}>
                  {validAccessories.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-2xs">
                      <h4 className="font-bold text-xs text-[#0d9749] uppercase mb-3">
                        Included Accessories ({validAccessories.length})
                      </h4>
                      <ul className="space-y-2 text-xs text-gray-700">
                        {validAccessories.map((acc, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600 shrink-0" />
                            <span>{acc.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validSpareParts.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-2xs">
                      <h4 className="font-bold text-xs text-amber-700 uppercase mb-3">
                        Recommended Spare Parts ({validSpareParts.length})
                      </h4>
                      <ul className="space-y-2 text-xs text-gray-700">
                        {validSpareParts.map((sp, idx) => (
                          <li key={idx} className="flex items-center justify-between border-b border-gray-100 pb-1">
                            <span>{sp.name}</span>
                            <span className="font-mono text-gray-500 font-bold">{sp.partNo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. MULTILINGUAL BROCHURE TAB */}
            {activeTab === 'brochure' && hasBrochures && (
              <div className="space-y-3">
                {validBrochures.map((b, idx) => {
                    const cleanTitle = (b.name || '').replace(/^(view\s*)+/i, '').trim() || b.language || `${product.name} Brochure`;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-600 transition-colors gap-3"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-red-600 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-gray-900">
                              {cleanTitle}
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              Language: <strong>{b.language}</strong> • Official Ratnagiri Impex Document
                            </p>
                          </div>
                        </div>

                        <a
                          href={b.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs bg-[#0d9749] hover:bg-green-800 text-white font-bold px-4 py-2 rounded transition-colors self-start sm:self-auto cursor-pointer"
                        >
                          <span>{b.language || 'Download'}</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
            )}
          </div>
        </div>

        {/* Bulk Enquiry & Technical Assistance Banner */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-600" />
              Need Institutional Quantities or Custom Spare Part Assistance?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Contact our product specialists directly for enterprise quotes, distributor pricing, or technical assistance.
            </p>
          </div>
          <Link
            href="/contact"
            className="agri-btn-secondary text-xs px-5 py-2.5 font-bold whitespace-nowrap"
          >
            Submit Enquiry →
          </Link>
        </div>
      </div>

      {/* Subsidy Modal */}
      <SubsidyModal
        product={product}
        isOpen={subsidyModalOpen}
        onClose={() => setSubsidyModalOpen(false)}
      />

      {/* Quote Request Modal */}
      <QuoteModal
        product={product}
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}
