'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Zap, 
  Leaf, 
  Star, 
  Flame, 
  Sparkles, 
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

// 1. Badge Generator (Top-Left of Visual)
function getProductBadge(product: Product): { text: string; icon: React.ReactNode; bgClass: string } {
  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (name.includes('battery') || desc.includes('battery') || desc.includes('12v') || desc.includes('ah')) {
    return {
      text: 'Battery',
      icon: <Zap className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300 shrink-0" />,
      bgClass: 'bg-[#15803d]'
    };
  }
  if (name.includes('manual') || desc.includes('manual')) {
    return {
      text: 'Manual',
      icon: <Leaf className="w-2.5 h-2.5 text-emerald-300 shrink-0" />,
      bgClass: 'bg-[#15803d]'
    };
  }
  if (name.includes('pro') || name.includes('heavy') || cat.includes('brush') || cat.includes('harvester') || cat.includes('weed')) {
    return {
      text: 'Pro',
      icon: <Star className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300 shrink-0" />,
      bgClass: 'bg-[#15803d]'
    };
  }
  if (name.includes('petrol') || name.includes('4s') || name.includes('2s') || desc.includes('engine') || cat.includes('saw') || cat.includes('intercultivator')) {
    return {
      text: 'Petrol',
      icon: <Flame className="w-2.5 h-2.5 text-orange-300 fill-orange-300 shrink-0" />,
      bgClass: 'bg-[#15803d]'
    };
  }
  return {
    text: product.brand || 'RIPL',
    icon: <Sparkles className="w-2.5 h-2.5 text-emerald-300 shrink-0" />,
    bgClass: 'bg-[#15803d]'
  };
}

// 2. High-Precision Specification Extractor
interface CleanSpec {
  icon: 'tank' | 'power' | 'gear' | 'check' | 'tool';
  label: string;
  value: string;
}

function extractCleanSpecs(product: Product): CleanSpec[] {
  const desc = product.description || '';
  const name = product.name || '';
  const specs: CleanSpec[] = [];

  // A. Tank Capacity
  const capMatch = desc.match(/(?:tank capacity|capacity|tank)\s*[:\-]?\s*([0-9.]+\s*(?:ltrs?|l|kg|litres?))/i) || 
                   name.match(/([0-9.]+\s*(?:ltrs?|l|litres?))/i);
  if (capMatch) {
    specs.push({ icon: 'tank', label: 'Tank', value: capMatch[1].trim() });
  }

  // B. Power / Battery / Motor / Fuel
  const batMatch = desc.match(/battery\s*[:\-]?\s*([0-9]+V(?:\s*\/\s*[0-9]+AH)?)/i) || 
                   name.match(/([0-9]+V\s*\/?\s*[0-9]+AH)/i);
  if (batMatch) {
    specs.push({ icon: 'power', label: 'Power', value: batMatch[1].trim() });
  } else if (/manual/i.test(name) || /manual/i.test(desc)) {
    specs.push({ icon: 'power', label: 'Power', value: 'Manual' });
  } else {
    const powerMatch = desc.match(/power\s*[:\-]?\s*([0-9.]+\s*(?:hp|kw))/i);
    if (powerMatch) {
      specs.push({ icon: 'power', label: 'Power', value: powerMatch[1].trim() });
    }
  }

  // C. Engine / Displacement
  const dispMatch = desc.match(/displacement\s*[:\-]?\s*([0-9.]+\s*(?:cc|cm³))/i) ||
                    name.match(/([0-9.]+\s*cc)/i);
  if (dispMatch) {
    specs.push({ icon: 'gear', label: 'Displacement', value: dispMatch[1].trim() });
  }

  // Fallbacks if empty
  if (specs.length === 0) {
    if (product.brand) {
      specs.push({ icon: 'check', label: 'Brand', value: product.brand });
    }
    if (product.category) {
      specs.push({ icon: 'tool', label: 'Category', value: product.category });
    }
  }

  return specs.slice(0, 2);
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

  const badge = getProductBadge(product);
  const specs = extractCleanSpecs(product);

  return (
    <>
      {layout === 'horizontal' ? (
        /* ================= HORIZONTAL CARD STYLE (MATCHING REFERENCE IMAGE 2) ================= */
        <div className="group relative bg-white rounded-lg sm:rounded-xl border border-gray-200/90 hover:border-[#2d7d32] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-row items-stretch overflow-hidden h-[135px] sm:h-[148px]">
          {/* Left: Product Visual Thumbnail */}
          <div className="relative w-[38%] sm:w-[40%] shrink-0 bg-white border-r border-gray-100 flex items-center justify-center p-2 overflow-hidden">
            {/* Top-Left Feature Pill Badge */}
            <div className="absolute top-1.5 left-1.5 z-10">
              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-white text-[8px] sm:text-[9px] font-bold shadow-xs ${badge.bgClass}`}>
                {badge.icon}
                <span className="leading-none">{badge.text}</span>
              </div>
            </div>

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
                loading="lazy"
                onError={handleImageError}
                sizes="(max-width: 640px) 130px, 160px"
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

              {/* Sub-label (by Brand / RIPL Code, exactly like 'by Memco Skyline...') */}
              <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                by <strong className="text-gray-700">{product.brand || 'Ratnagiri Impex'}</strong> <span className="text-gray-300">•</span> <span className="font-mono text-[10px] text-gray-400">RIPL: {product.riplCode}</span>
              </p>

              {/* Specifications / Category (exactly like 'Studio Studio Apartment Begur, Bengaluru') */}
              <p className="text-[10px] sm:text-[11px] text-gray-600 line-clamp-2 mt-1 leading-tight">
                {specs.length > 0 
                  ? specs.map(s => `${s.label}: ${s.value}`).join(' • ')
                  : (product.category || 'Agricultural Machinery')}
              </p>
            </div>

            {/* Bottom Row: Price / Quote (matches '₹68.5 L') & Action Buttons */}
            <div className="flex items-center justify-between pt-1.5 border-t border-gray-100/80 mt-auto gap-1">
              <div>
                <span className="font-black text-xs sm:text-[13px] text-[#1b5e20] block leading-tight">
                  Price on Request
                </span>
                <button
                  type="button"
                  onClick={handleOpenSubsidyModal}
                  className="text-[9px] text-[#b45309] font-bold hover:underline leading-tight block mt-0.5 cursor-pointer"
                >
                  Subsidy Eligible
                </button>
              </div>

              <button
                type="button"
                onClick={handleRequestQuote}
                className="bg-green-50 hover:bg-[#2d7d32] text-[#2d7d32] hover:text-white border border-green-200/90 text-[10px] sm:text-[11px] font-bold py-1 px-2 rounded transition-colors duration-150 flex items-center gap-1 cursor-pointer shrink-0"
                title="Request a Quote"
              >
                <FileText className="w-2.5 h-2.5" />
                <span>Quote</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ================= COMPACT 4x4 / 3x3 VERTICAL CARD STYLE ================= */
        <div className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 hover:border-[#2d7d32] shadow-2xs hover:shadow-md transition-all duration-200 p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden">
          
          {/* Top: Compact Product Visual (Fixed height ~140-160px so it is NEVER oversized) */}
          <div className="relative w-full h-36 sm:h-40 rounded-lg sm:rounded-xl bg-white border border-gray-100 flex items-center justify-center p-1.5 overflow-hidden">
            {/* Top-Left Feature Pill Badge */}
            <div className="absolute top-2 left-2 z-10">
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[9px] sm:text-[10px] font-bold shadow-xs ${badge.bgClass}`}>
                {badge.icon}
                <span className="leading-none">{badge.text}</span>
              </div>
            </div>

            {/* Top-Right Heart Wishlist Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute top-2 right-2 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-gray-100 backdrop-blur-xs flex items-center justify-center shadow-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
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
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                unoptimized
                loading="lazy"
                onError={handleImageError}
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 260px"
                className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Middle: Details & Specs */}
          <div className="flex-1 flex flex-col justify-between pt-2.5">
            <div>
              {/* RIPL Code */}
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-0.5">
                RIPL: <strong className="text-gray-700 font-bold">{product.riplCode}</strong>
              </span>

              {/* Product Title */}
              <Link href={`/products/${product.id}`} className="block group-hover:text-[#2d7d32] transition-colors">
                <h3 className="font-extrabold text-[12px] sm:text-[13px] text-gray-900 leading-snug line-clamp-2 uppercase tracking-tight mb-1.5 min-h-[32px]">
                  {product.name}
                </h3>
              </Link>

              {/* Clean Compact Specifications */}
              {specs.length > 0 && (
                <div className="space-y-1 mb-2 bg-gray-50/80 rounded-md p-1.5 border border-gray-100/80 text-[10px] sm:text-[11px] text-gray-600">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="text-gray-400 shrink-0 font-medium">{spec.label}:</span>
                      <strong className="text-gray-800 font-semibold truncate">{spec.value}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom: Request a Quote & Subsidy Action */}
            <div className="pt-2 border-t border-gray-100 mt-auto">
              <div className="flex items-center justify-between mb-2 text-[10px] sm:text-[11px]">
                <span className="font-bold text-[#1b5e20] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2d7d32]"></span>
                  Price on Request
                </span>
                <button
                  type="button"
                  onClick={handleOpenSubsidyModal}
                  className="font-bold text-[#b45309] hover:underline cursor-pointer"
                >
                  Subsidy
                </button>
              </div>

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
