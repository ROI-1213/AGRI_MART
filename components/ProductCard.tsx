'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Scale, 
  Settings, 
  CheckCircle2, 
  Wrench, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import { Product } from '@/types';
import { formatProductTitle, getDefaultCategoryImage } from '@/lib/format';
import QuoteModal from './QuoteModal';
import SubsidyModal from './SubsidyModal';

interface ProductCardProps {
  product: Product;
  onOpenSubsidy?: (product: Product) => void;
  onOpenQuote?: (product: Product) => void;
  layout?: 'vertical' | 'horizontal';
}

export default function ProductCard({ 
  product, 
  onOpenSubsidy, 
  onOpenQuote,
  layout = 'vertical'
}: ProductCardProps) {
  const [internalQuoteOpen, setInternalQuoteOpen] = useState(false);
  const [internalSubsidyOpen, setInternalSubsidyOpen] = useState(false);
  const fallbackImg = getDefaultCategoryImage(product.category);
  const primaryImg = product.thumbnailImage || (product.images && product.images[0]) || fallbackImg;
  const secondaryImg = (product.images && product.images.length > 1) ? product.images[1] : null;
  const [imgSrc, setImgSrc] = useState(primaryImg);

  // Sync image source whenever product changes or filters are applied
  useEffect(() => {
    const nextImg = product.thumbnailImage || (product.images && product.images[0]) || fallbackImg;
    setImgSrc(nextImg);
  }, [product.id, product.thumbnailImage, product.images, fallbackImg]);

  const handleImageError = () => {
    if (product.images && product.images.length > 1 && imgSrc === product.images[0]) {
      setImgSrc(product.images[1]);
    } else if (imgSrc !== fallbackImg) {
      setImgSrc(fallbackImg);
    } else if (imgSrc !== '/assets/branding/logo.png') {
      setImgSrc('/assets/branding/logo.png');
    }
  };

  const handleRequestQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenQuote) {
      onOpenQuote(product);
    } else {
      setInternalQuoteOpen(true);
    }
  };

  const handleOpenSubsidyModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenSubsidy) {
      onOpenSubsidy(product);
    } else {
      setInternalSubsidyOpen(true);
    }
  };

  return (
    <>
      {layout === 'horizontal' ? (
        /* ================= HORIZONTAL CARD STYLE (MATCHING REFERENCE IMAGE 2) ================= */
        <div className="group relative bg-white rounded-lg sm:rounded-xl border-0 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-row items-stretch overflow-hidden h-[135px] sm:h-[148px]">
          {/* Left: Product Visual Thumbnail */}
          <div className="relative w-[38%] sm:w-[40%] shrink-0 bg-white border-r border-gray-100 flex items-center justify-center p-2 overflow-hidden">
            {/* Central Product Image */}
            <Link 
              href={`/products/${product.id}`}
              className="relative w-full h-full flex items-center justify-center z-1"
            >
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                unoptimized
                quality={100}
                loading="lazy"
                onError={handleImageError}
                sizes="(max-width: 640px) 260px, 320px"
                className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Right: Details, Subtitle, Specs & Price (Exact Structure as Image 2) */}
          <div className="flex-1 p-2.5 sm:p-3 flex flex-col justify-between min-w-0 bg-white">
            <div>
              {/* Product Name (Normal weight, unified Title Case) */}
              <Link href={`/products/${product.id}`} className="block group-hover:text-[#0d9749] transition-colors">
                <h3 className="font-normal text-[12px] sm:text-[13px] md:text-sm text-gray-800 leading-snug truncate" title={product.name}>
                  {formatProductTitle(product.name)}
                </h3>
              </Link>

              {/* Sub-label (by Brand / Code) */}
              <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                by <strong className="text-gray-700">{product.brand || 'Ratnagiri Impex'}</strong> <span className="text-gray-300">•</span> <span className="font-mono text-[10px] text-gray-400">Code: {product.riplCode}</span>
              </p>

              {/* Category */}
              <p className="text-[10px] sm:text-[11px] text-gray-500 truncate mt-1 leading-tight">
                {product.category || 'Agricultural Machinery'}
              </p>
            </div>

            {/* Bottom Row: Action Button */}
            <div className="flex items-center justify-end pt-1.5 border-t border-gray-100/80 mt-auto">
              <button
                type="button"
                onClick={handleRequestQuote}
                className="bg-green-50 hover:bg-[#0d9749] text-[#0d9749] hover:text-white border border-green-200/90 text-[10px] sm:text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors duration-150 flex items-center gap-1 cursor-pointer"
                title="Request a Quote"
              >
                <FileText className="w-3 h-3" />
                <span>Request Quote</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 3x3 LARGER VERTICAL CARD STYLE ================= */
        <div className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200/70 shadow-2xs hover:shadow-xl transition-all duration-300 p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
          
          {/* Top: Product Visual (Standardized aspect-square with even padding for balanced image scale) */}
          <div className="relative w-full aspect-square bg-white flex items-center justify-center p-2.5 sm:p-3.5 overflow-hidden [perspective:1000px]">
            {/* Central HD Product Photo */}
            <Link 
              href={`/products/${product.id}`}
              className="relative w-full h-full flex items-center justify-center z-1"
            >
              {secondaryImg ? (
                /* Multi-image: crossfade to next image with zoom on hover */
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    unoptimized
                    quality={100}
                    loading="lazy"
                    onError={handleImageError}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-1 sm:p-1.5 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95"
                  />
                  <Image
                    src={secondaryImg}
                    alt={`${product.name} alternate view`}
                    fill
                    unoptimized
                    quality={100}
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-1 sm:p-1.5 transition-all duration-500 ease-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-105"
                  />
                </div>
              ) : (
                /* Single-image: 3D flip card effect on hover */
                <div className="relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
                    <Image
                      src={imgSrc}
                      alt={product.name}
                      fill
                      unoptimized
                      quality={100}
                      loading="lazy"
                      onError={handleImageError}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-1 sm:p-1.5 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <Image
                      src={imgSrc}
                      alt={`${product.name} flipped`}
                      fill
                      unoptimized
                      quality={100}
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-1 sm:p-1.5 scale-x-[-1] transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Middle: Details & Specs */}
          <div className="flex-1 flex flex-col justify-between pt-2.5 sm:pt-3">
            <div>
              {/* Product Code & Brand */}
              <div className="flex flex-wrap items-center justify-between text-[9px] min-[360px]:text-[10px] sm:text-xs font-mono text-gray-500 uppercase mb-1.5 gap-x-1.5 gap-y-0.5">
                <span className="whitespace-nowrap text-[9px] min-[360px]:text-[10px] sm:text-xs">
                  Code: <strong className="text-gray-800 font-bold tracking-tight">{product.riplCode}</strong>
                </span>
                {product.brand && (
                  <span className="text-[8px] min-[360px]:text-[8.5px] sm:text-[10px] font-black text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 shrink-0">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Product Title (Normal, unbolded text, unified format) */}
              <Link href={`/products/${product.id}`} className="block group-hover:text-[#0d9749] transition-colors">
                <h3 className="font-normal text-xs sm:text-[15px] text-gray-800 leading-snug line-clamp-2 mb-2.5 min-h-[34px] sm:min-h-[42px]" title={product.name}>
                  {formatProductTitle(product.name)}
                </h3>
              </Link>
            </div>

            {/* Bottom: Request a Quote Action (Clean, evenly spaced, no dividing border line) */}
            <div className="pt-1 mt-auto">
              <button
                type="button"
                onClick={handleRequestQuote}
                className="w-full bg-[#0d9749] hover:bg-[#097b3a] active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold py-2.5 sm:py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer group/btn"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300 shrink-0" />
                <span className="truncate">Request Quote</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Internal Quote Modal fallback */}
      {!onOpenQuote && (
        <QuoteModal
          product={product}
          isOpen={internalQuoteOpen}
          onClose={() => setInternalQuoteOpen(false)}
        />
      )}

      {/* Internal Subsidy Modal fallback */}
      {!onOpenSubsidy && (
        <SubsidyModal
          product={product}
          isOpen={internalSubsidyOpen}
          onClose={() => setInternalSubsidyOpen(false)}
        />
      )}
    </>
  );
}
