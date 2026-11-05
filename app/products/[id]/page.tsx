'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  Check, 
  FileCheck2,
  Eye,
  Download,
  Printer,
  Bell
} from 'lucide-react';
import SubsidyModal from '@/components/SubsidyModal';
import QuoteModal from '@/components/QuoteModal';
import BrochureModal from '@/components/BrochureModal';
import productsData from '@/data/import/products.json';
import { Product } from '@/types';
import { formatProductTitle, getDefaultCategoryImage } from '@/lib/format';
import { extractProductSpecs, parseProductDescription } from '@/lib/productSpecs';

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
  const hasBrochures = true;

  const fallbackImg = getDefaultCategoryImage(product.category);
  const [selectedImage, setSelectedImage] = useState<string>(product.thumbnailImage || product.images[0] || fallbackImg);
  const [activeTab, setActiveTab] = useState<'desc' | 'accessories' | 'brochure' | 'video'>('desc');
  const descriptionFields = parseProductDescription(product.description || '');
  const [subsidyModalOpen, setSubsidyModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [selectedBrochureTitle, setSelectedBrochureTitle] = useState('');

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
                  onError={() => setSelectedImage(fallbackImg)}
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
                <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded inline-block mb-4">
                  <span className="text-xs text-gray-500 font-mono">
                    Code: <strong className="text-gray-900 text-sm font-bold">{product.riplCode}</strong>
                  </span>
                </div>

                {/* Price on Request Notice */}
                <div className="border-t border-b border-gray-100 py-3.5 mb-4 bg-gray-50/75 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0d9749] inline-block animate-pulse"></span>
                    <span className="text-xl sm:text-2xl font-bold text-[#097b3a]">
                      Price on Request
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Official quotation inclusive of GST, localized delivery logistics, after-sales service, and government subsidy assistance.
                  </p>
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden mb-8">
          {/* Authentic Tab Navigation matching exact reference design */}
          <div className="flex items-center border-b border-gray-200 overflow-x-auto px-4 pt-4 sm:px-6 sm:pt-6 bg-white gap-2 sm:gap-3 no-scrollbar">
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-2 px-5 rounded-t-md text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'bg-[#0d9749] text-white shadow-xs'
                  : 'bg-transparent text-gray-600 hover:text-gray-900 font-semibold'
              }`}
            >
              Product Description
            </button>

            <button
              onClick={() => setActiveTab('accessories')}
              className={`py-2 px-5 rounded-t-md text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'accessories'
                  ? 'bg-[#0d9749] text-white shadow-xs'
                  : 'bg-transparent text-gray-600 hover:text-gray-900 font-semibold'
              }`}
            >
              Accessories
            </button>

            <button
              onClick={() => setActiveTab('brochure')}
              className={`py-2 px-5 rounded-t-md text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'brochure'
                  ? 'bg-[#0d9749] text-white shadow-xs'
                  : 'bg-transparent text-gray-600 hover:text-gray-900 font-semibold'
              }`}
            >
              Brochure
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`py-2 px-5 rounded-t-md text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'video'
                  ? 'bg-[#0d9749] text-white shadow-xs'
                  : 'bg-transparent text-gray-600 hover:text-gray-900 font-semibold'
              }`}
            >
              Video
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-5 sm:p-7">
            {/* 1. PRODUCT DESCRIPTION TAB (Exact inline bold label + value display) */}
            {activeTab === 'desc' && (
              <div className="text-xs sm:text-[13px] leading-relaxed">
                {descriptionFields && descriptionFields.length > 0 ? (
                  <div className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-5 gap-y-2">
                    {descriptionFields.map((field, idx) => (
                      <span key={idx} className="inline-flex items-baseline gap-1.5">
                        {field.key && (
                          <strong className="font-bold text-gray-900">{field.key}:</strong>
                        )}
                        <span className="text-gray-700 font-normal">{field.value}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No additional product description available.</p>
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
            {activeTab === 'brochure' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {validBrochures.length > 0 ? (
                    validBrochures.map((b, idx) => {
                      const cleanTitle = (b.name || '').replace(/^(view\s*)+/i, '').trim() || b.language || `${product.name} Leaflet`;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-600 transition-colors gap-3 bg-white shadow-2xs"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-red-600 shrink-0" />
                            <div>
                              <h4 className="font-bold text-xs text-gray-900">
                                {cleanTitle}
                              </h4>
                              <p className="text-[11px] text-gray-500">
                                Language: <strong>{b.language || 'English'}</strong> • Official Ratnagiri Impex Document
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBrochureTitle(cleanTitle);
                                setBrochureModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs bg-[#0d9749] hover:bg-green-800 text-white font-bold px-3.5 py-2 rounded transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Leaflet</span>
                            </button>

                            <Link
                              href={`/products/${product.slug || product.id}/brochure?print=1`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 py-2 rounded transition-colors cursor-pointer border border-gray-300"
                            >
                              <Printer className="w-3.5 h-3.5 text-gray-600" />
                              <span>Print / PDF</span>
                            </Link>

                            <a
                              href={`/api/brochures?url=${encodeURIComponent(b.url)}&id=${encodeURIComponent(product.slug || product.id)}&filename=${encodeURIComponent(cleanTitle.toLowerCase().replace(/\s+/g, '_') + '.pdf')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-green-700 hover:text-green-800 font-semibold px-2 py-1 underline"
                              title="Download document"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-600 transition-colors gap-3 bg-white shadow-2xs">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-red-600 shrink-0" />
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">
                            {product.name} - Technical Leaflet
                          </h4>
                          <p className="text-[11px] text-gray-500">
                            Language: <strong>English</strong> • Official Ratnagiri Impex Document
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBrochureTitle(`${product.name} Leaflet`);
                            setBrochureModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs bg-[#0d9749] hover:bg-green-800 text-white font-bold px-3.5 py-2 rounded transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Leaflet</span>
                        </button>

                        <Link
                          href={`/products/${product.slug || product.id}/brochure?print=1`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 py-2 rounded transition-colors cursor-pointer border border-gray-300"
                        >
                          <Printer className="w-3.5 h-3.5 text-gray-600" />
                          <span>Print / PDF</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. VIDEO TAB */}
            {activeTab === 'video' && (
              <div className="py-2">
                {product.videos && product.videos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.videos.map((vid, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
                        <h4 className="font-bold text-xs text-gray-900 mb-2">{vid.title}</h4>
                        <a
                          href={vid.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-700 hover:underline font-semibold"
                        >
                          Watch Demonstration Video →
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50/80 rounded-lg border border-gray-200 text-xs text-gray-600">
                    <p className="font-semibold text-gray-800 mb-1">Demonstration &amp; Operational Video</p>
                    <p>Official video demonstrations for this model can be requested through our product support team or viewed on our official YouTube channel. For live video assistance, call our helpline at <strong>7393 938 938</strong>.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bulk Enquiry & Technical Assistance Banner */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 shadow-2xs">
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-600 shrink-0" />
              <span>Need Institutional Quantities or Custom Spare Part Assistance?</span>
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

      {/* Brochure Viewer Modal */}
      <BrochureModal
        product={product}
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
        brochureTitle={selectedBrochureTitle}
        specs={allSpecs}
      />

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
