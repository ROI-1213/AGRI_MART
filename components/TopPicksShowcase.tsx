'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Product } from '@/types';

export interface BrandShowcaseItem {
  id: string;
  brand: string;
  tagline: string;
  bannerImage: string;
  route: string;
  category: string;
  leadTitle: string;
}

const BRAND_PICKS: BrandShowcaseItem[] = [
  // 1. AGRIMATE
  {
    id: 'brand_agrimate',
    brand: 'AGRIMATE',
    tagline: 'Apnalo Munafa Badalo • Reliable Farm Equipment',
    bannerImage: '/assets/toppicks_banners/brand_agrimate.png',
    route: '/products?brand=AGRIMATE',
    category: 'POWER WEEDER & TILLERS',
    leadTitle: 'Agrimate Heavy-Duty Farm Equipment',
  },

  // 2. KASEI
  {
    id: 'brand_kasei',
    brand: 'KASEI',
    tagline: 'Advanced Japanese Technology • Precision Harvesters',
    bannerImage: '/assets/toppicks_banners/brand_kasei.png',
    route: '/products?brand=KASEI',
    category: 'TEA HARVESTERS & POWER EQUIPMENT',
    leadTitle: 'KASEI High-Performance Agricultural Machinery',
  },

  // 3. OLEO-MAC
  {
    id: 'brand_oleomac',
    brand: 'OLEO-MAC',
    tagline: 'Our Power, Your Passion • European Precision',
    bannerImage: '/assets/toppicks_banners/brand_oleomac.png',
    route: '/products?brand=OLEO-MAC',
    category: 'PROSINT LUBRICANTS & SPECIAL OILS',
    leadTitle: 'Oleo-Mac Special Engine Lubricants & Machinery',
  },
];

interface TopPicksShowcaseProps {
  onOpenSubsidy?: (product: Product) => void;
}

export default function TopPicksShowcase({ onOpenSubsidy }: TopPicksShowcaseProps) {
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentBrand = BRAND_PICKS[activeBrandIndex];

  // Auto-slide to next brand every 3.5 seconds when playing and not hovered
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveBrandIndex((prev) => (prev + 1) % BRAND_PICKS.length);
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, activeBrandIndex]);

  const handleNextBrand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveBrandIndex((prev) => (prev + 1) % BRAND_PICKS.length);
  };

  const handlePrevBrand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveBrandIndex((prev) => (prev - 1 + BRAND_PICKS.length) % BRAND_PICKS.length);
  };

  const handleBrandSelect = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBrandIndex(idx);
  };

  return (
    <section 
      aria-label="Agrimart's Brand Showcase"
      className="w-full bg-white pt-2 sm:pt-4 pb-12 sm:pb-16 overflow-hidden select-none border-b border-gray-100"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* ================= SECTION HEADER (CENTER ALIGNED) ================= */}
        <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-7">
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-[#0d9749] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-green-200/60 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d9749] animate-pulse"></span>
            <span>Authorized Brand Portfolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Agrimart&apos;s Top Picks
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl mx-auto leading-relaxed">
            Explore top agricultural machinery and high-efficiency equipment with us
          </p>
        </div>

        {/* ================= BRAND QUICK TABS (TOP BAR) ================= */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          {BRAND_PICKS.map((brand, bIdx) => {
            const isActive = bIdx === activeBrandIndex;
            return (
              <button
                key={brand.id}
                type="button"
                onClick={(e) => handleBrandSelect(bIdx, e)}
                className={`relative px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer border ${
                  isActive
                    ? 'bg-[#0d9749] text-white border-[#0d9749] shadow-sm shadow-green-600/30 scale-[1.02]'
                    : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-gray-200/80 hover:border-gray-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                <span>{brand.brand}</span>
              </button>
            );
          })}
        </div>

        {/* ================= FULL SCREEN / FULL WIDTH SHOWCASE BANNER ================= */}
        <div 
          className="relative w-full aspect-[2048/852] min-h-[200px] sm:min-h-[280px] md:min-h-[380px] lg:min-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-200/80 bg-neutral-900 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top Progress Bar for Slide Advance */}
          <div className="absolute top-0 inset-x-0 h-1 bg-black/20 z-30">
            <div 
              key={activeBrandIndex}
              className="h-full bg-gradient-to-r from-[#0d9749] via-[#4ade80] to-[#f59e0b] transition-all duration-[3500ms] ease-linear"
              style={{ width: isPlaying && !isHovered ? '100%' : '50%' }}
            />
          </div>

          {/* Full Screen HD Brand Banners */}
          {BRAND_PICKS.map((brand, bIdx) => (
            <Link
              key={brand.id}
              href={brand.route}
              aria-label={`View ${brand.brand} Products`}
              className={`absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer select-none ${
                bIdx === activeBrandIndex 
                  ? 'opacity-100 z-10' 
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={brand.bannerImage}
                alt={`${brand.brand} - ${brand.tagline}`}
                fill
                priority={bIdx === 0}
                unoptimized
                quality={100}
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover object-center w-full h-full select-none"
              />
            </Link>
          ))}

          {/* Floating Left Navigation Arrow */}
          <button
            type="button"
            onClick={handlePrevBrand}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-xl border border-gray-200/80 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs group-hover:opacity-100"
            aria-label="Previous Brand Banner"
            title="Previous Brand"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
          </button>

          {/* Floating Right Navigation Arrow */}
          <button
            type="button"
            onClick={handleNextBrand}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-xl border border-gray-200/80 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs group-hover:opacity-100"
            aria-label="Next Brand Banner"
            title="Next Brand"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
          </button>

          {/* Top Right Pause / Play Control */}
          <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-30">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer border border-white/20"
              aria-label={isPlaying ? 'Pause auto-slide' : 'Play auto-slide'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Bottom Center Indicator Dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
            {BRAND_PICKS.map((brand, bIdx) => (
              <button
                key={brand.id}
                type="button"
                onClick={(e) => handleBrandSelect(bIdx, e)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  bIdx === activeBrandIndex
                    ? 'w-7 sm:w-9 h-2 bg-[#0d9749]'
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${bIdx + 1} (${brand.brand})`}
              />
            ))}
          </div>

          {/* Floating Action Button (Bottom Right) */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-5 z-30 hidden sm:block">
            <Link
              href={currentBrand.route}
              className="inline-flex items-center gap-1.5 bg-[#0d9749] hover:bg-[#097b3a] text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all backdrop-blur-xs border border-green-400/30"
            >
              <span>Explore {currentBrand.brand}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
