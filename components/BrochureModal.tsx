'use client';

import React from 'react';
import Image from 'next/image';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Phone, Mail, Globe, MapPin, FileText } from 'lucide-react';
import { Product } from '@/types';
import { formatCategoryName } from '@/lib/format';

interface BrochureModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  brochureTitle?: string;
  specs: Array<{ label: string; value: string }>;
}

export default function BrochureModal({
  product,
  isOpen,
  onClose,
  brochureTitle,
  specs
}: BrochureModalProps) {
  if (!isOpen) return null;

  const validAccessories = (product.accessories || []).filter(
    (a) => a && a.name && !/^(no information available\.?|na|n\/a|none)$/i.test(a.name.trim())
  );
  const validSpareParts = (product.spareParts || []).filter(
    (sp) => sp && sp.name && !/^(no information available\.?|na|n\/a|none)$/i.test(sp.name.trim())
  );

  const mainImage = product.thumbnailImage || product.images?.[0] || '/assets/logo/agrimart_logo.png';

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
        <div className="bg-[#0d9749] text-white px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 print:hidden select-none">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-white/90" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {brochureTitle || 'Official Product Leaflet & Brochure'}
              </h3>
              <p className="text-[11px] text-white/80">
                Ratnagiri Impex Official Equipment Datasheet
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-white text-[#0d9749] hover:bg-green-50 px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save as PDF</span>
            </button>

            <a
              href="/assets/brochures/agrimart_brochure.pdf"
              download="agrimart_equipment_catalog.pdf"
              className="inline-flex items-center gap-1.5 bg-green-800 hover:bg-green-900 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
              title="Download Full Agrimart Catalog"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Master Catalog (PDF)</span>
            </a>

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
              <div className="relative w-36 h-12">
                <Image
                  src="/assets/logo/agrimart_logo.png"
                  alt="Agrimart Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="border-l border-gray-300 pl-3">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  RATNAGIRI IMPEX PVT. LTD.
                </p>
                <p className="text-xs font-extrabold text-[#0d9749] uppercase">
                  Product Technical Leaflet
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-gray-500 sm:border-l sm:border-gray-200 sm:pl-4">
              <p className="font-bold text-gray-800">Helpline: 7393 938 938</p>
              <p>Email: customercare@ratnagiriimpex.com</p>
              <p>Web: www.agrimart.in</p>
            </div>
          </div>

          {/* Product Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
            {/* Left: Product Image & Badges */}
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  sizes="240px"
                  priority
                />
              </div>

              <div className="mt-3 w-full space-y-1.5 text-center">
                <div className="inline-block bg-green-50 text-[#0d9749] border border-green-200 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide w-full">
                  CODE: {product.riplCode}
                </div>
                <div className="text-[11px] text-gray-500 font-semibold">
                  Brand: <span className="font-bold text-gray-800">{product.brand}</span>
                </div>
              </div>
            </div>

            {/* Right: Product Identification & Key Info */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                <span>{formatCategoryName(product.category)}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h2>

              {product.description && (
                <div className="bg-gray-50/80 p-3 rounded-md border border-gray-200/80 text-xs text-gray-700 leading-relaxed font-normal">
                  <p className="font-bold text-gray-900 mb-1 text-[11px] uppercase tracking-wide text-[#0d9749]">
                    Product Overview & Specifications
                  </p>
                  <p>{product.description}</p>
                </div>
              )}

              {/* Commercial & Subsidy Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 bg-green-50/60 border border-green-100 rounded-md">
                  <p className="text-[10px] uppercase font-bold text-green-800">MRP</p>
                  <p className="text-sm font-extrabold text-gray-900">
                    {product.mrp > 0 ? `₹${product.mrp.toLocaleString('en-IN')}` : 'Price on Request'}
                  </p>
                  <p className="text-[9px] text-green-700 font-medium">Incl. all taxes</p>
                </div>

                <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-md">
                  <p className="text-[10px] uppercase font-bold text-blue-800">Availability</p>
                  <p className="text-xs font-bold text-gray-900">{product.availability || 'In Stock'}</p>
                  <p className="text-[9px] text-blue-700 font-medium">Pan-India Delivery</p>
                </div>

                <div className="col-span-2 sm:col-span-1 p-2.5 bg-amber-50/60 border border-amber-100 rounded-md">
                  <p className="text-[10px] uppercase font-bold text-amber-800">Govt. Subsidy</p>
                  <p className="text-xs font-bold text-gray-900">SMAM Eligible</p>
                  <p className="text-[9px] text-amber-700 font-medium">Central/State Subsidy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Sheet */}
          {specs && specs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 border-b border-gray-200 pb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0d9749]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Technical Specifications
                </h3>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-gray-100">
                    {specs.map((s, idx) => (
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
                Included Standard Accessories ({validAccessories.length})
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
                Genuine Spare Parts Available ({validSpareParts.length})
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
                RATNAGIRI IMPEX PVT. LTD. (AGRIMART)
              </p>
              <p>Annapurneshwari Complex, Survey No. 28/1, Doddakallasandra, Kanakapura Main Road, Bengaluru - 560062</p>
              <p>All specifications and technical data are authentic manufacturer specifications.</p>
            </div>
            <div className="sm:text-right space-y-0.5 shrink-0">
              <p><strong>Toll Free:</strong> 7393 938 938</p>
              <p><strong>Email:</strong> info@ratnagiriimpex.com</p>
              <p><strong>Website:</strong> https://agrimart.in</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
