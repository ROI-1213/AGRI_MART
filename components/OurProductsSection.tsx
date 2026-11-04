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
  // 1. Agrimate Tractor (Mandatory flagship featured item)
  {
    id: 'am-mptc-1100-12d-4wheel-electric-start-with-battery-with-led-light',
    name: 'AM-MPTC-1100-12D 4-Wheel Commercial Tractor',
    code: 'RIPL038524',
    brand: 'AGRIMATE',
    category: 'POWER WEEDER & TILLERS',
    keyFeature: '12 HP Commercial Diesel • 4WD Traction • Steering & Seat',
    image: '/assets/products/showroom_hd/tractor_1.jpg',
    secondaryImage: '/assets/products/showroom_hd/tractor_2.jpg',
    badge: '★ Flagship 4WD Tractor',
    isFlagship: true,
  },
  // 2. Kasei Professional Backpack Mist Blower
  {
    id: 'kz-6300-bbp-pro-2s-kasei-blower-professional-backpack',
    name: 'KZ-6300 BBP-PRO 2S Professional Backpack Blower',
    code: 'RIPL019627',
    brand: 'KASEI',
    category: 'BLOWER - MISTBLOWER',
    keyFeature: '63.3 CC 2-Stroke • High-Velocity Air Flow • Orchard Grade',
    image: '/assets/products/showroom_hd/blower_1.jpg',
    secondaryImage: '/assets/products/showroom_hd/blower_2.jpg',
    badge: 'Japanese Technology',
  },
  // 3. Oleo-Mac Commercial Intercultivator
  {
    id: 'mh-180rk-oleo-mac-intercultivator-w-o-wheel-petrol',
    name: 'MH-180RK Oleo-Mac Commercial Intercultivator',
    code: 'RIPL010104',
    brand: 'OLEO-MAC',
    category: 'INTERCULTIVATOR',
    keyFeature: 'High-Torque Petrol Engine • Multi-Crop Rotavator Tillers',
    image: '/assets/products/showroom_hd/tiller_1.jpg',
    secondaryImage: '/assets/products/showroom_hd/tiller_2.jpg',
    badge: 'Italian Precision',
  },
  // 4. Agrimate Heavy HTP Power Sprayer with Engine
  {
    id: 'am-22k-ms-htp-power-sprayer-with-engine',
    name: 'AM-22K-MS+ Heavy HTP Power Sprayer with Engine',
    code: 'RIPL036359',
    brand: 'AGRIMATE',
    category: 'SPRAYER',
    keyFeature: 'Heavy-Duty 4-Stroke Engine • High-Pressure Triple Piston Pump',
    image: '/assets/products/showroom_hd/sprayer_1.jpg',
    secondaryImage: '/assets/products/showroom_hd/sprayer_2.jpg',
    badge: 'Heavy Plant Protection',
  },
  // 5. Kasei Commercial Earth Auger
  {
    id: 'kz-5000ea-2s-kasei-earth-auger-with-bit',
    name: 'KZ-5000EA-2S Heavy Earth Auger with Bit',
    code: 'RIPL026714',
    brand: 'KASEI',
    category: 'EARTH AUGER',
    keyFeature: '51.7 CC High-Torque Motor • Precision Post-Hole Drilling Bit',
    image: '/assets/products/showroom_hd/auger_1.jpg',
    secondaryImage: '/assets/products/showroom_hd/auger_2.jpg',
    badge: 'Heavy Plantation Drill',
  },
  // 6. Agrimate 22" Commercial Chain Saw
  {
    id: 'am-cs-6022k-pro-agrimate-chain-saw-22-bar',
    name: 'AM-CS-6022K-PRO Heavy Chain Saw 22" Bar',
    code: 'RIPL038172',
    brand: 'AGRIMATE',
    category: 'CHAIN SAW',
    keyFeature: '60 CC High-Power Engine • 22" Solid Alloy Bar • Low-Vibration',
    image: '/assets/products/showroom_hd/chainsaw_1.jpg',
    secondaryImage: '/assets/products/showroom_hd/chainsaw_2.jpg',
    badge: 'Commercial Forestry',
  },
  // 7. Agrimate 4-in-1 Turbo Mist Blower
  {
    id: 'am-mbd-5650-turbo-mist-blower-4-in-1',
    name: 'AM-MBD-5650 Turbo Mist Blower 4-in-1',
    code: 'RIPL027535',
    brand: 'AGRIMATE',
    category: 'MIST BLOWER',
    keyFeature: '56.5 CC 2-Stroke • 14L Tank • Dusting, Misting & Spraying',
    image: '/assets/products/showroom_hd/mistblower_1.jpg',
    secondaryImage: '/assets/products/showroom_hd/mistblower_2.jpg',
    badge: '4-in-1 Versatility',
  },
  // 8. Agrimate Commercial Handheld Blower
  {
    id: 'bv-250-blower-handheld',
    name: 'BV 250 Commercial Handheld High-Velocity Blower',
    code: 'RIPL037328',
    brand: 'AGRIMATE',
    category: 'BLOWER - MISTBLOWER',
    keyFeature: '25.4 CC High Velocity • 720 m³/hr Air Volume • Ergonomic',
    image: '/assets/products/showroom_hd/handblower_1.jpg',
    secondaryImage: '/assets/products/showroom_hd/handblower_2.jpg',
    badge: 'Ergonomic Cleanup',
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
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Primary Image: Zoomed & Centered to Fill the Full Container */}
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        quality={100}
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-1.5 sm:p-2 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95 drop-shadow-md scale-105 sm:scale-110"
                      />

                      {/* Secondary Angle Revealed on Hover with Magnified Zoom */}
                      {product.secondaryImage && (
                        <Image
                          src={product.secondaryImage}
                          alt={`${product.name} alternate angle`}
                          fill
                          unoptimized
                          quality={100}
                          loading="lazy"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-1.5 sm:p-2 transition-all duration-500 ease-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-115 drop-shadow-2xl"
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

                    {/* Product Title */}
                    <Link href={`/products/${product.id}`} className="block group-hover:text-[#0d9749] transition-colors">
                      <h3 className="font-extrabold text-xs sm:text-[15px] text-gray-900 leading-snug line-clamp-2 uppercase tracking-tight mb-2 min-h-[32px] sm:min-h-[40px]" title={product.name}>
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
