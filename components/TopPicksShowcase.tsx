'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ChevronRight,
  ExternalLink,
  Pause,
  Play
} from 'lucide-react';
import { Product } from '@/types';

export interface BrandShowcaseItem {
  id: string;
  brand: string;
  tagline: string;
  brandLogo: string;
  brandSubtitle: string;
  category: string;
  leadTitle: string;
  leadSubtitle: string;
  priceRange: string;
  specs: string;
  bannerImage: string;
  badge: string;
  route: string;
}

const BRAND_PICKS: BrandShowcaseItem[] = [
  // 1. AGRIMATE
  {
    id: 'brand_agrimate',
    brand: 'AGRIMATE',
    tagline: 'Apnalo Munafa Badalo',
    brandLogo: '/assets/brands/partner_strip/agrimate.png',
    brandSubtitle: 'Ratnagiri Impex • Flagship Brand',
    category: 'POWER WEEDER & TILLERS',
    leadTitle: 'Agrimate Heavy-Duty Power Weeder & Tiller',
    leadSubtitle: 'Powerful diesel engines & multi-crop rotavators engineered for tough Indian farms.',
    priceRange: 'Price on Request',
    specs: 'Commercial Diesel Engine • Multi-Crop Rotavator Tillers • SMAM Subsidy',
    bannerImage: '/assets/toppicks_banners/brand_agrimate.png',
    badge: 'FLAGSHIP FARM MECHANIZATION',
    route: '/products?brand=AGRIMATE',
  },

  // 2. KASEI
  {
    id: 'brand_kasei',
    brand: 'KASEI',
    tagline: 'Advanced Technology',
    brandLogo: '/assets/brands/partner_strip/kasei_hd.png',
    brandSubtitle: 'Global Technology Partner',
    category: 'TEA HARVESTERS & POWER EQUIPMENT',
    leadTitle: 'KASEI Professional Tea Harvester & Cutters',
    leadSubtitle: 'Precision high-velocity agricultural machinery & commercial tea harvesters built for peak field efficiency.',
    priceRange: 'Price on Request',
    specs: 'High Air-Flow Engine • Precision Cutting Blades • Plantation Grade',
    bannerImage: '/assets/toppicks_banners/brand_kasei.png',
    badge: 'ADVANCED JAPANESE TECHNOLOGY',
    route: '/products?brand=KASEI',
  },

  // 3. OLEO-MAC
  {
    id: 'brand_oleomac',
    brand: 'OLEO-MAC',
    tagline: 'Our Power, Your Passion',
    brandLogo: '/assets/brands/partner_strip/oleo_mac_hd.png',
    brandSubtitle: 'Italy • Germany • USA Engineered',
    category: 'PROSINT LUBRICANTS & SPECIAL OILS',
    leadTitle: 'Oleo-Mac Prosint 2 EVO Synthetic Lubricants',
    leadSubtitle: 'Special 50:1 2% synthetic lubricant oil for high-performance 2-stroke agricultural engines.',
    priceRange: 'Price on Request',
    specs: '100% Synthetic Formula • Anti-Wear Protection • Italian Quality',
    bannerImage: '/assets/toppicks_banners/brand_oleomac.png',
    badge: 'EUROPEAN PRECISION SERIES',
    route: '/products?brand=OLEO-MAC',
  },
];

interface TopPicksShowcaseProps {
  onOpenSubsidy?: (product: Product) => void;
}

export default function TopPicksShowcase({ onOpenSubsidy }: TopPicksShowcaseProps) {
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentBrand = BRAND_PICKS[activeBrandIndex];
  const nextBrand = BRAND_PICKS[(activeBrandIndex + 1) % BRAND_PICKS.length];

  // Auto-slide to the next brand every 2 seconds
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveBrandIndex((prev) => (prev + 1) % BRAND_PICKS.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNextBrand = () => {
    setActiveBrandIndex((prev) => (prev + 1) % BRAND_PICKS.length);
  };

  const handleOpenQuoteModal = (e: React.MouseEvent, item: BrandShowcaseItem) => {
    e.preventDefault();
    if (onOpenSubsidy) {
      onOpenSubsidy({
        id: item.id,
        name: item.leadTitle,
        category: item.category,
        brand: item.brand,
        riplCode: item.brandSubtitle.split('• ')[1] || 'RIPL',
        price: 'Price on Request',
        images: [item.bannerImage],
        description: item.leadSubtitle,
      } as unknown as Product);
    }
  };

  return (
    <section 
      aria-label="Agrimart's Brand Showcase"
      className="w-full bg-white pt-2 sm:pt-4 pb-12 sm:pb-16 overflow-hidden select-none border-b border-gray-100"
    >
      {/* Generous left and right margins/padding leaving ample space on the left */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-12 lg:px-20">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-[#2d7d32] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-green-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d7d32]"></span>
            <span>Authorized Brand Portfolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Agrimart&apos;s Top Picks
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Explore top agricultural machinery and high-efficiency equipment with us
          </p>
        </div>

        {/* ================= MAIN BRAND CARD & PEEKING NEXT BRAND CARD ================= */}
        <div className="relative flex items-stretch gap-4 sm:gap-5">
          
          {/* Main Card (Height constrained to marked place: md:h-[260px]) */}
          <div 
            className="w-full flex-1 min-w-0 rounded-3xl bg-gradient-to-br from-[#f5fbf6] via-[#fbfdfb] to-[#edf7ee] border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-stretch relative md:h-[260px]"
          >
            {/* Dynamic Accent Progress Line on Top Border */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gray-100 z-30">
              <div 
                key={activeBrandIndex}
                className="h-full bg-gradient-to-r from-[#2d7d32] via-[#4ade80] to-[#f59e0b] transition-all duration-[2000ms] ease-linear"
                style={{ width: isPlaying ? '100%' : '50%' }}
              />
            </div>

            {/* Left Column: Brand Info & Action Buttons (Compact to fit 260px height) */}
            <div className="w-full md:w-[260px] lg:w-[280px] shrink-0 flex flex-col justify-between p-3.5 sm:p-4 z-10">
              
              <div>
                {/* Brand Logo & Name Box */}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="relative h-9 min-w-[58px] px-1.5 rounded-lg bg-white shadow-2xs border border-gray-100 flex items-center justify-center shrink-0">
                    <Image
                      src={currentBrand.brandLogo}
                      alt={`${currentBrand.brand} Logo`}
                      width={56}
                      height={30}
                      className="max-h-7 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">
                      {currentBrand.brand}
                    </p>
                    <Link
                      href={currentBrand.route}
                      className="text-[10px] font-bold text-[#2d7d32] hover:underline flex items-center gap-0.5"
                    >
                      <span>View Products</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>

                {/* Badge */}
                <span className="inline-block text-[8px] font-black uppercase tracking-wider text-[#2d7d32] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 mb-1">
                  {currentBrand.badge}
                </span>

                {/* Machine Headline */}
                <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight leading-snug line-clamp-1">
                  {currentBrand.leadTitle}
                </h3>

                {/* Tagline / Subtitle */}
                <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                  {currentBrand.leadSubtitle}
                </p>

                {/* Price & Specs */}
                <div className="mt-1.5 pt-1.5 border-t border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-[#1b5e20]">
                      {currentBrand.priceRange}
                    </span>
                    <span className="text-[9px] text-amber-800 bg-amber-50 border border-amber-200 font-bold px-1.5 py-0.2 rounded-full">
                      Subsidy Eligible
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-600 font-medium mt-0.5 line-clamp-1">
                    {currentBrand.specs}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-2 pt-1.5 border-t border-gray-200/60 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => handleOpenQuoteModal(e, currentBrand)}
                  className="flex-1 bg-[#2d7d32] hover:bg-[#1b5e20] active:scale-[0.98] text-white font-extrabold text-xs py-2 px-3 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <Link
                  href={currentBrand.route}
                  className="p-2 rounded-xl border border-gray-200 hover:border-[#2d7d32] text-gray-600 hover:text-[#2d7d32] bg-white transition-colors shrink-0 shadow-2xs"
                  title={`View ${currentBrand.brand} Products`}
                  aria-label={`View ${currentBrand.brand} Products`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

            {/* Right Column: FULL LANDSCAPE BRAND BANNER IN EXACT MARKED HEIGHT ON DESKTOP, PERFECT ASPECT RATIO ON MOBILE */}
            <div className="w-full md:flex-1 relative aspect-[1024/426] md:aspect-auto md:h-full overflow-hidden group bg-white flex items-center justify-center p-1 sm:p-1.5">
              
              {/* Top-Right Circular Pause/Play Button on Photo */}
              <div className="absolute top-2.5 right-2.5 z-30">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  aria-label={isPlaying ? 'Pause auto-slide' : 'Play auto-slide'}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>

              {/* Preloaded Landscape Banners with Instant Smooth Cross-Fade */}
              <Link 
                href={currentBrand.route} 
                className="relative block w-full h-full cursor-pointer rounded-2xl overflow-hidden shadow-2xs"
              >
                {BRAND_PICKS.map((brand, bIdx) => (
                  <div
                    key={brand.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      bIdx === activeBrandIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={brand.bannerImage}
                      alt={`${brand.brand} - ${brand.tagline}`}
                      fill
                      priority
                      unoptimized
                      quality={100}
                      sizes="(max-width: 768px) 100vw, 850px"
                      className="object-contain w-full h-full select-none"
                    />
                  </div>
                ))}
              </Link>
            </div>

          </div>

          {/* Right Peeking Next Brand Card (Matching md:h-[260px] Height) */}
          <div 
            onClick={handleNextBrand}
            className="hidden md:flex w-[130px] lg:w-[150px] shrink-0 rounded-3xl bg-gradient-to-br from-[#f5fbf6] via-[#fbfdfb] to-[#edf7ee] border border-gray-200 p-2.5 sm:p-3 flex-col justify-between opacity-90 hover:opacity-100 transition-all duration-300 cursor-pointer shadow-sm hover:shadow select-none group md:h-[260px]"
            title={`Next: ${nextBrand.brand}`}
          >
            <div>
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="relative h-8 min-w-[42px] px-1 rounded-lg bg-white shadow-2xs border border-gray-100 flex items-center justify-center shrink-0">
                  <Image
                    src={nextBrand.brandLogo}
                    alt={`${nextBrand.brand} Logo`}
                    width={42}
                    height={26}
                    className="max-h-6 w-auto object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-900 leading-tight truncate">
                    {nextBrand.brand}
                  </p>
                  <span className="text-[9px] text-gray-400 font-medium block truncate">
                    {nextBrand.tagline}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-[11px] font-bold text-gray-900 group-hover:text-[#2d7d32] transition-colors line-clamp-2 leading-snug">
                {nextBrand.leadTitle}
              </h4>

              {/* Mini Banner Preview (Exact Aspect Ratio 1024/426) */}
              <div className="relative w-full aspect-[1024/426] my-1.5 rounded-lg overflow-hidden border border-gray-200/80 bg-white shadow-2xs">
                <Image
                  src={nextBrand.bannerImage}
                  alt={nextBrand.brand}
                  fill
                  unoptimized
                  quality={100}
                  sizes="150px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Specs */}
              <div className="pt-1 border-t border-gray-200/60">
                <span className="text-[10px] font-black text-[#1b5e20] block">
                  {nextBrand.priceRange}
                </span>
                <span className="text-[8px] text-gray-500 block truncate mt-0.5">
                  {nextBrand.specs}
                </span>
              </div>
            </div>

            {/* Peeking Next Card Button */}
            <div className="pt-1.5 border-t border-gray-200/60">
              <div className="w-full bg-[#2d7d32] group-hover:bg-[#1b5e20] text-white font-extrabold text-[10px] py-1.5 px-1.5 rounded-xl text-center shadow-xs transition-colors flex items-center justify-center gap-1">
                <span className="truncate">View {nextBrand.brand}</span>
                <ArrowRight className="w-2.5 h-2.5 shrink-0" />
              </div>
            </div>
          </div>

          {/* Floating Next Arrow on Boundary Between Cards */}
          <button
            type="button"
            onClick={handleNextBrand}
            className="hidden md:flex absolute right-[115px] lg:right-[135px] top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white shadow-xl border border-gray-200 items-center justify-center text-gray-800 hover:text-[#2d7d32] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Next Brand"
            aria-label="Next Brand"
          >
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>

        </div>

      </div>
    </section>
  );
}
