'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  Check, 
  ShieldCheck, 
  Truck, 
  FileCheck2, 
  Bell
} from 'lucide-react';
import SubsidyModal from '@/components/SubsidyModal';
import QuoteModal from '@/components/QuoteModal';
import productsData from '@/data/import/products.json';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const product = (productsData as unknown as Product[]).find(
    p => p.id === productId || p.slug === productId || p.riplCode.toLowerCase() === productId?.toLowerCase()
  ) || (productsData as unknown as Product[])[0];

  const [selectedImage, setSelectedImage] = useState<string>(product.thumbnailImage || product.images[0] || '/assets/branding/logo.png');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'accessories' | 'brochure'>('desc');
  const [subsidyModalOpen, setSubsidyModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  
  // Notification form state
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const handleRequestQuote = () => {
    setQuoteModalOpen(true);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifySuccess(true);
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
          <span className="text-gray-900 font-semibold truncate max-w-xs shrink-0">{product.name}</span>
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
                        selectedImage === img ? 'border-[#2d7d32]' : 'border-gray-200 hover:border-gray-300'
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
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-green-50 text-[#2d7d32] border border-green-200 uppercase tracking-wide">
                    {product.brand}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    Category: {product.category}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-2">
                  {product.name}
                </h1>

                {/* RIPL Code */}
                <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded inline-block mb-4">
                  <span className="text-xs text-gray-500 font-mono">
                    RIPL Code: <strong className="text-gray-900 text-sm font-bold">{product.riplCode}</strong>
                  </span>
                </div>

                {/* Price on Request Notice */}
                <div className="border-t border-b border-gray-100 py-3.5 mb-4 bg-gray-50/75 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2d7d32] inline-block animate-pulse"></span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1b5e20]">
                      Price on Request
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Official quotation inclusive of GST, localized delivery logistics, warranty coverage, and government subsidy assistance.
                  </p>
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-2 text-xs font-semibold mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-800">
                    Status: {product.availability} ({product.stockQuantity} Units In Stock)
                  </span>
                </div>

                {/* Quantity Selector & Action Buttons */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-4">
                    <label className="text-xs font-bold text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-sm font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleRequestQuote}
                      className="w-full bg-[#2d7d32] hover:bg-[#1b5e20] text-white font-bold py-3.5 px-6 rounded-md flex items-center justify-center gap-2 transition-colors shadow-md text-sm cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-yellow-300" />
                      <span>Request a Quote</span>
                    </button>
                  </div>
                </div>

                {/* Government Subsidy Trigger Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Govt. Subsidy Scheme Available</span>
                    </h4>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Eligible for state &amp; central farm mechanization subsidies up to 50%.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubsidyModalOpen(true)}
                    className="w-full sm:w-auto shrink-0 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded transition-colors text-center cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-600 pt-6 mt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                  <span>1 Year Genuine Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Safe Pan-India Logistics</span>
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
                  ? 'border-[#2d7d32] text-[#2d7d32] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('accessories')}
              className={`py-3.5 px-6 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'accessories'
                  ? 'border-[#2d7d32] text-[#2d7d32] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Accessories & Spare Parts
            </button>
            <button
              onClick={() => setActiveTab('brochure')}
              className={`py-3.5 px-6 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'brochure'
                  ? 'border-[#2d7d32] text-[#2d7d32] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Brochures &amp; Leaflets ({product.brochures?.length || 1})
            </button>
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
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Technical Specifications
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-100">
                        {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-2.5 font-semibold text-gray-700 w-1/3">{key}</td>
                            <td className="px-4 py-2.5 text-gray-900">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ACCESSORIES & SPARE PARTS TAB */}
            {activeTab === 'accessories' && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                  Compatible Accessories & Genuine RIPL Spare Parts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-xs text-[#2d7d32] uppercase mb-3">
                      Included Accessories
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {(product.accessories || []).map((acc, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>{acc.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-xs text-amber-700 uppercase mb-3">
                      Recommended Spare Parts
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {(product.spareParts || []).map((sp, idx) => (
                        <li key={idx} className="flex items-center justify-between border-b pb-1">
                          <span>{sp.name}</span>
                          <span className="font-mono text-gray-500 font-bold">{sp.partNo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MULTILINGUAL BROCHURE TAB */}
            {activeTab === 'brochure' && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Official Technical Brochure & Catalogue Downloads
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Download authentic product brochures with detailed engineering schematics, power ratings, and maintenance guidelines.
                </p>

                <div className="space-y-3">
                  {product.brochures && product.brochures.length > 0 ? (
                    product.brochures.map((b, idx) => {
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
                            className="inline-flex items-center text-xs bg-[#2d7d32] hover:bg-green-800 text-white font-bold px-4 py-2 rounded transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <span>{b.language || 'Download'}</span>
                          </a>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-red-600 shrink-0" />
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">
                            Agrimart Full Corporate & Equipment Catalogue
                          </h4>
                          <p className="text-[11px] text-gray-500">Language: English • 6 Pages</p>
                        </div>
                      </div>
                      <a
                        href="/assets/brochures/corporate_brochure.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs bg-[#2d7d32] hover:bg-green-800 text-white font-bold px-4 py-2 rounded cursor-pointer"
                      >
                        <span>Download PDF</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Out of Stock / Product Information Enquiry Banner */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-600" />
              Need Bulk Quantities or Custom Spare Part Assistance?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Contact our product specialists directly for enterprise quotes, distributor pricing, or stock alerts.
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
