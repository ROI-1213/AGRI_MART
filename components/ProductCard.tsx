'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  Scale, 
  Settings, 
  CheckCircle2, 
  Wrench, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import { Product } from '@/types';
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
  const primaryImg = product.thumbnailImage || (product.images && product.images[0]) || '/assets/branding/logo.png';
  const secondaryImg = (product.images && product.images.length > 1) ? product.images[1] : null;
  const [imgSrc, setImgSrc] = useState(primaryImg);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Sync image source whenever product changes or filters are applied
  useEffect(() => {
    const nextImg = product.thumbnailImage || (product.images && product.images[0]) || '/assets/branding/logo.png';
    setImgSrc(nextImg);
  }, [product.id, product.thumbnailImage, product.images]);

  const handleImageError = () => {
    if (product.images && product.images.length > 1 && imgSrc === product.images[0]) {
      setImgSrc(product.images[1]);
    } else if (imgSrc !== '/assets/branding/logo.png') {
      setImgSrc('/assets/branding/logo.png');
    }
  };

  // Sync wishlist state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`agrimart_wishlist_${product.id}`);
      if (saved === 'true') setIsWishlisted(true);
    } catch {}
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isWishlisted;
    setIsWishlisted(next);
    try {
      localStorage.setItem(`agrimart_wishlist_${product.id}`, String(next));
    } catch {}
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
        <div className="group relative bg-white rounded-lg sm:rounded-xl border border-gray-200/90 hover:border-[#2d7d32] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-row items-stretch overflow-hidden h-[135px] sm:h-[148px]">
          {/* Left: Product Visual Thumbnail */}
          <div className="relative w-[38%] sm:w-[40%] shrink-0 bg-white border-r border-gray-100 flex items-center justify-center p-2 overflow-hidden">
            {/* Top-Right Heart Wishlist Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-white/90 hover:bg-gray-100 flex items-center justify-center shadow-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Save to Wishlist"
            >
              <Heart 
                className={`w-3 h-3 transition-colors ${
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                }`} 
              />
            </button>

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
              {/* Product Name (Bold, Prominent) */}
              <Link href={`/products/${product.id}`} className="block group-hover:text-[#2d7d32] transition-colors">
                <h3 className="font-extrabold text-[12px] sm:text-[13px] md:text-sm text-gray-900 leading-snug truncate uppercase tracking-tight" title={product.name}>
                  {product.name}
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
                className="bg-green-50 hover:bg-[#2d7d32] text-[#2d7d32] hover:text-white border border-green-200/90 text-[10px] sm:text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors duration-150 flex items-center gap-1 cursor-pointer"
                title="Request a Quote"
              >
                <FileText className="w-3 h-3" />
                <span>Request Quote</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= COMPACT 4x4 / 3x3 VERTICAL CARD STYLE ================= */
        <div className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 hover:border-[#2d7d32] shadow-2xs hover:shadow-md transition-all duration-200 p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden">
          
          {/* Top: Product Visual with Image Zoom & 3D Flip / Secondary Image Reveal */}
          <div className="relative w-full h-44 sm:h-48 rounded-lg sm:rounded-xl bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 border border-gray-100 flex items-center justify-center p-2 overflow-hidden [perspective:1000px]">
            {/* Top-Right Heart Wishlist Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute top-2 right-2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-gray-100 backdrop-blur-xs flex items-center justify-center shadow-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Save to Wishlist"
            >
              <Heart 
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                }`} 
              />
            </button>

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
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 520px"
                    className="object-contain p-1 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95 drop-shadow-sm"
                  />
                  <Image
                    src={secondaryImg}
                    alt={`${product.name} alternate view`}
                    fill
                    unoptimized
                    quality={100}
                    loading="lazy"
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 520px"
                    className="object-contain p-1 transition-all duration-500 ease-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-110 drop-shadow-md"
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
                      sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 520px"
                      className="object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-sm"
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
                      sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 520px"
                      className="object-contain p-1 scale-x-[-1] transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-md"
                    />
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Middle: Details & Specs */}
          <div className="flex-1 flex flex-col justify-between pt-2.5">
            <div>
              {/* Product Code */}
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-0.5">
                Code: <strong className="text-gray-700 font-bold">{product.riplCode}</strong>
              </span>

              {/* Product Title */}
              <Link href={`/products/${product.id}`} className="block group-hover:text-[#2d7d32] transition-colors">
                <h3 className="font-extrabold text-[12px] sm:text-[13px] text-gray-900 leading-snug line-clamp-2 uppercase tracking-tight mb-2 min-h-[32px]">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Bottom: Request a Quote Action */}
            <div className="pt-2 border-t border-gray-100 mt-auto">
              <button
                type="button"
                onClick={handleRequestQuote}
                className="w-full bg-[#2d7d32] hover:bg-[#1e6b23] active:scale-[0.98] text-white text-[11px] sm:text-xs font-bold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group/btn"
              >
                <FileText className="w-3 h-3 text-yellow-300" />
                <span>Request a Quote</span>
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
