'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  FileText, 
  ExternalLink
} from 'lucide-react';
import { Product } from '@/types';
import { formatProductTitle } from '@/lib/format';

export interface FeaturedProductItem {
  id: string;
  name: string;
  code: string;
  brand: string;
  category: string;
  keyFeature: string;
  image: string;
  secondaryImage?: string;
  badge: string;
  isFlagship?: boolean;
}

const FEATURED_PRODUCTS: FeaturedProductItem[] = [
  // 1. Agrimate Pro-Classic Intercultivator & Power Weeder (RIPL038521)
  {
    id: 'am-rtp-7212-pro-classic-inter-cultivator-power-weeder',
    name: 'AM-RTP-7212 Pro-Classic Intercultivator & Power Weeder',
    code: 'RIPL038521',
    brand: 'AGRIMATE',
    category: 'INTERCULTIVATOR/POWER WEEDER',
    keyFeature: '212 CC Petrol Engine • 3600 RPM • 550-750-1000mm Tilling Width',
    image: '/assets/products/ripl038521/img_1.jpg',
    secondaryImage: '/assets/products/ripl038521/img_2.jpg',
    badge: '★ Flagship Power Weeder',
    isFlagship: true,
  },
  // 2. Agrimate Multi-Crop Harvester (RIPL036440)
  {
    id: 'am-400-bch-4s-ms-crop-harvester',
    name: 'AM-400-BCH-4S-MS+ Multi-Crop Harvester',
    code: 'RIPL036440',
    brand: 'AGRIMATE',
    category: 'BRUSH CUTTER - WEED CUTTER',
    keyFeature: '35.8 CC 4-Stroke Engine • 6500 RPM • Multi-Crop Harvester Attachment',
    image: '/assets/products/ripl036440/img_1.jpg',
    secondaryImage: '/assets/products/ripl036440/img_2.jpg',
    badge: 'Precision Crop Harvester',
  },
  // 3. Kasei Brush Cutter Kasei Plus (RIPL037692)
  {
    id: 'kz-4000bc-2s-delite-brush-cutter-kasei-plus',
    name: 'KZ-4000BC-2S-DELITE Brush Cutter Kasei Plus',
    code: 'RIPL037692',
    brand: 'KASEI',
    category: 'BRUSH CUTTER - WEED CUTTER',
    keyFeature: '40.2 CC 2-Stroke • 10000 RPM High-Speed Recoil • Heavy Weeding',
    image: '/assets/products/ripl037692/img_1.jpg',
    secondaryImage: '/assets/products/ripl037692/img_2.jpg',
    badge: 'Japanese Technology',
  },
  // 4. Agrimate 20L Knapsack Power Sprayer (RIPL036461)
  {
    id: 'am708-2s-al-ms-20l-knapsack-power-sprayer',
    name: 'AM-708-2S-AL-MS+ 20L Knapsack Power Sprayer',
    code: 'RIPL036461',
    brand: 'AGRIMATE',
    category: 'SPRAYER',
    keyFeature: '25.6 CC 2-Stroke • 20L Chemical Tank • 35 kg/cm² Pressure',
    image: '/assets/products/ripl036461/img_1.jpg',
    secondaryImage: '/assets/products/ripl036461/img_2.jpg',
    badge: 'Heavy Plant Protection',
  },
  // 5. Agrimate Back Rotary Intercultivator (RIPL037320)
  {
    id: 'am-mptc-6600-9p-intercultivator-power-weeder-back-rotary',
    name: 'AM-MPTC-6600-9P Back Rotary Intercultivator & Power Weeder',
    code: 'RIPL037320',
    brand: 'AGRIMATE',
    category: 'INTERCULTIVATOR/POWER WEEDER',
    keyFeature: '301 CC 177FP Engine • 1800 RPM • Back Rotary Ditching & Weeding',
    image: '/assets/products/ripl037320/img_3.jpg',
    secondaryImage: '/assets/products/ripl037320/img_1.jpg',
    badge: 'Back Rotary Weeder',
  },
  // 6. Agrimate Champion 16L Battery Sprayer (RIPL026669)
  {
    id: 'am-champion-16-ltrs-12v-8ah-battery-sprayer',
    name: 'AM Champion 16L 12V/8Ah Commercial Battery Sprayer',
    code: 'RIPL026669',
    brand: 'AGRIMATE',
    category: 'SPRAYER',
    keyFeature: '16L PP Tank • 12V/8AH Battery • 7.5 L/min Discharge • 0.55 MPa',
    image: '/assets/products/ripl026669/img_1.jpg',
    secondaryImage: '/assets/products/ripl026669/img_2.jpg',
    badge: 'High-Efficiency Battery Sprayer',
  },
  // 7. Agrimate Elite Chaff Cutter with Copper Motor (RIPL036956)
  {
    id: 'am-ccmg-400-3hp-elite-chaff-cutter-with-copper-motor',
    name: 'AM-CCMG-400-3HP Elite Chaff Cutter with Copper Motor',
    code: 'RIPL036956',
    brand: 'AGRIMATE',
    category: 'CHAFF CUTTER / SHREDDER',
    keyFeature: '3 HP Copper Motor • 2800 RPM • 6 Blades (5 Rotating + 1 Fixed)',
    image: '/assets/products/ripl036956/img_1.jpg',
    secondaryImage: '/assets/products/ripl036956/img_2.jpg',
    badge: 'Copper Motor Chaff Cutter',
  },
  // 8. Agrimate Heavy Wheel Trolley & Transporter (RIPL036445)
  {
    id: 'am-mt-320m-wt-wheel-trolley-transporter',
    name: 'AM-MT-320M-WT Heavy Wheel Trolley & Transporter',
    code: 'RIPL036445',
    brand: 'AGRIMATE',
    category: 'TRANSPORTER',
    keyFeature: '7 HP / 212 CC Engine • 350 KG Max Load • 3 Forward + 1 Reverse',
    image: '/assets/products/ripl036445/img_1.jpg',
    badge: 'Heavy Farm Transporter',
  },
];

interface OurProductsSectionProps {
  onOpenQuote?: (product: Product) => void;
}

export default function OurProductsSection({ onOpenQuote }: OurProductsSectionProps) {
  const handleRequestQuote = (e: React.MouseEvent, item: FeaturedProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenQuote) {
      onOpenQuote({
        id: item.id,
        name: item.name,
        category: item.category,
        brand: item.brand,
        riplCode: item.code,
        price: 'Price on Request',
        images: [item.image],
        description: item.keyFeature,
      } as unknown as Product);
    }
  };

  return (
    <section 
      aria-label="Our Products"
      className="w-full bg-[#f8faf8]/70 py-12 sm:py-16 border-t border-b border-gray-200/80 select-none"
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center mb-8 sm:mb-10 border-b border-gray-200/80 pb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            Our Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-2xl mx-auto leading-relaxed">
            Explore our top-tier agricultural machinery, heavy-duty 4WD tillers, commercial sprayers, and precision farm solutions built for maximum field productivity.
          </p>
        </div>

        {/* ================= 8 FEATURED PRODUCTS GRID: 2x2 ON MOBILE, 4-COL ON DESKTOP ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-7">
          {FEATURED_PRODUCTS.map((product) => {
            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200/70 shadow-2xs hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Visual Glow Spotlight on Hover */}
                <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl pointer-events-none" />

                {/* Full-Bleed Top Image Container: Machine Fills the Upper Card Cleanly */}
                <div className="relative w-full h-40 sm:h-72 lg:h-80 bg-white overflow-hidden flex items-center justify-center select-none">
                  {/* Clickable Image Showcase */}
                  <Link
                    href={`/products/${product.id}`}
                    className="relative w-full h-full flex items-center justify-center p-2 z-1 group/img"
                  >
                    {/* Subtle radial spotlight glow behind machine */}
                    <div className="absolute inset-0 bg-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

                    {/* Multi-Angle Machine Showcase (Auto-zoomed to fill card without empty space) */}
                    <div className="relative w-full h-full flex items-center justify-center [perspective:1000px]">
                      {/* Primary Image: Multi-angle switch if 2nd image exists, smooth 3D flip animation if single image */}
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        quality={100}
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className={
                          product.secondaryImage
                            ? "object-contain p-2 sm:p-2.5 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95"
                            : "object-contain p-2 sm:p-2.5 product-image-flip"
                        }
                      />

                      {/* Secondary Angle Revealed on Hover */}
                      {product.secondaryImage && (
                        <Image
                          src={product.secondaryImage}
                          alt={`${product.name} alternate angle`}
                          fill
                          unoptimized
                          quality={100}
                          loading="lazy"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-2 sm:p-2.5 transition-all duration-500 ease-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-105"
                        />
                      )}
                    </div>

                  </Link>
                </div>

                {/* Lower Meta Information & Actions Container */}
                <div className="relative z-10 p-2.5 sm:p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    {/* Product Code & Brand */}
                    <div className="flex flex-wrap items-center justify-between text-[9px] sm:text-[11px] uppercase mb-1 sm:mb-1.5 gap-x-1.5 gap-y-0.5">
                      <span className="font-mono text-gray-500 whitespace-nowrap text-[9px] min-[360px]:text-[10px] sm:text-xs">
                        Code: <strong className="text-gray-700 font-bold tracking-tight">{product.code}</strong>
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-black text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 shadow-2xs shrink-0">
                        {product.brand}
                      </span>
                    </div>

                    {/* Product Title (Elegant, clean typography matching site) */}
                    <Link href={`/products/${product.id}`} className="block group-hover:text-[#0d9749] transition-colors">
                      <h3 className="font-medium text-xs sm:text-[14px] md:text-[15px] text-gray-900 leading-snug line-clamp-2 mb-2 min-h-[34px] sm:min-h-[42px] tracking-tight" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="pt-1 mt-auto flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleRequestQuote(e, product)}
                      className="w-full sm:flex-1 bg-[#0d9749] hover:bg-[#097b3a] active:scale-[0.98] text-white text-[11px] sm:text-sm font-extrabold py-2 sm:py-2.5 px-2 sm:px-3.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300 shrink-0" />
                      <span className="truncate">Request Quote</span>
                    </button>

                    <Link
                      href={`/products/${product.id}`}
                      className="hidden sm:inline-flex p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-gray-200 hover:border-[#0d9749] text-gray-600 hover:text-[#0d9749] bg-white transition-colors shrink-0 shadow-2xs items-center justify-center"
                      title="View Full Specifications"
                      aria-label="View Full Specifications"
                    >
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ================= SINGLE "VIEW ALL PRODUCTS" BUTTON ================= */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2.5 bg-[#0d9749] hover:bg-[#097b3a] text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
