'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Heart,
  ChevronRight,
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
    image: '/assets/products/ripl038524/img_1_hd.jpg',
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
    image: '/assets/products/ripl019627/img_1.jpg',
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
    image: '/assets/products/ripl010104/img_1.jpg',
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
    image: '/assets/products/ripl036359/img_1.jpg',
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
    image: '/assets/products/ripl026714/img_1.jpg',
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
    image: '/assets/products/ripl038172/img_1.jpg',
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
    image: '/assets/products/ripl027535/img_1.jpg',
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
    image: '/assets/products/ripl037328/img_1.jpg',
    badge: 'Ergonomic Cleanup',
  },
];

interface OurProductsSectionProps {
  onOpenQuote?: (product: Product) => void;
}

export default function OurProductsSection({ onOpenQuote }: OurProductsSectionProps) {
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-16">
        
        {/* ================= SECTION HEADER WITH TOP "SEE ALL PRODUCTS" BUTTON ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 border-b border-gray-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#1b5e20] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 border border-emerald-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#2d7d32] animate-pulse"></span>
              <span>Flagship Machinery &amp; Equipment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              Our Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Explore our top-tier agricultural machinery, heavy-duty 4WD tillers, commercial sprayers, and precision farm solutions built for maximum field productivity.
            </p>
          </div>

          {/* Top "See All Products" Header Button */}
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-[#2d7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 self-start md:self-end shrink-0 group active:scale-95"
            title="Browse Complete Catalog"
          >
            <span>See All Products (227+)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ================= 8 FEATURED PRODUCTS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {FEATURED_PRODUCTS.map((product) => {
            const isWishlisted = wishlistedIds.includes(product.id);
            return (
              <div
                key={product.id}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden p-3.5 sm:p-4 cursor-pointer ${
                  product.isFlagship
                    ? 'border-amber-400/80 shadow-md hover:shadow-2xl ring-2 ring-amber-300/40 bg-gradient-to-b from-amber-50/20 via-white to-white'
                    : 'border-gray-200/90 hover:border-[#2d7d32] shadow-xs hover:shadow-xl'
                }`}
              >
                {/* Visual Glow Spotlight on Hover */}
                <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                {/* Top Row: Wishlist Heart */}
                <div className="relative z-10 flex items-center justify-end mb-2">
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(e, product.id)}
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-gray-100 backdrop-blur-xs flex items-center justify-center shadow-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer border border-gray-100"
                    aria-label="Add to Wishlist"
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 transition-colors ${
                        isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </button>
                </div>

                {/* Center Image Container with Smooth 3D Hover & Subtle Float Animation */}
                <Link
                  href={`/products/${product.id}`}
                  className="relative w-full h-44 sm:h-48 rounded-xl bg-gradient-to-b from-gray-50/60 to-white border border-gray-100/90 flex items-center justify-center p-2.5 overflow-hidden my-1"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      quality={100}
                      loading="lazy"
                      sizes="(max-width: 640px) 560px, (max-width: 1024px) 440px, 560px"
                      className="object-contain p-1 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-sm group-hover:drop-shadow-xl"
                    />
                  </div>

                  {/* Brand Watermark Pill on Bottom-Right of Photo */}
                  <span className="absolute bottom-2 right-2 text-[9px] font-black uppercase tracking-wider text-gray-500 bg-white/95 px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs backdrop-blur-xs">
                    {product.brand}
                  </span>
                </Link>

                {/* Meta Information */}
                <div className="relative z-10 pt-2 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Product Code */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                      <span>Code: <strong className="text-gray-700 font-bold">{product.code}</strong></span>
                      <span className="text-[9px] text-[#2d7d32] font-bold lowercase tracking-normal">verified</span>
                    </div>

                    {/* Product Title */}
                    <Link href={`/products/${product.id}`} className="block group-hover:text-[#2d7d32] transition-colors">
                      <h3 className="font-extrabold text-xs sm:text-[13px] text-gray-900 leading-snug line-clamp-2 uppercase tracking-tight mb-1.5 min-h-[34px]" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>

                    {/* Key Feature Highlight Pill */}
                    <div className="bg-gray-50/90 rounded-lg p-2 border border-gray-100 mb-3">
                      <p className="text-[10px] text-gray-600 font-medium line-clamp-2 leading-relaxed">
                        {product.keyFeature}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="pt-2 border-t border-gray-100 mt-auto flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleRequestQuote(e, product)}
                      className="flex-1 bg-[#2d7d32] hover:bg-[#1b5e20] active:scale-[0.98] text-white text-[11px] font-extrabold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-yellow-300" />
                      <span>Request Quote</span>
                    </button>

                    <Link
                      href={`/products/${product.id}`}
                      className="p-2 rounded-lg border border-gray-200 hover:border-[#2d7d32] text-gray-600 hover:text-[#2d7d32] bg-white transition-colors shrink-0 shadow-2xs"
                      title="View Full Specifications"
                      aria-label="View Full Specifications"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ================= BOTTOM "SEE ALL PRODUCTS" CALLOUT BANNER ================= */}
        <div className="mt-10 sm:mt-12 rounded-2xl bg-gradient-to-r from-[#1b5e20] via-[#2d7d32] to-[#1e6b23] text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 fill-yellow-300" />
              <span>Full Agricultural Machinery Portfolio</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Looking for More Specialized Farming Equipment?
            </h3>
            <p className="text-xs sm:text-sm text-green-100 mt-1 max-w-xl">
              Browse our complete catalog of 227+ power weeders, sprayers, harvesters, augers, and genuine RIPL spare parts.
            </p>
          </div>

          <Link
            href="/products"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#1b5e20] font-black text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 text-center cursor-pointer group"
          >
            <span>See All Products (227+)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
