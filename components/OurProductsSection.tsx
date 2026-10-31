'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  FileText, 
  Heart,
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
        
        {/* ================= SECTION HEADER ================= */}
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

                {/* Top Row: Flagship Badge & Wishlist Heart */}
                <div className="relative z-10 flex items-center justify-between mb-2 min-h-[28px]">
                  {product.isFlagship ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-md shadow-2xs">
                      <span>★</span> Flagship 4WD Tractor
                    </span>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(e, product.id)}
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-gray-100 backdrop-blur-xs flex items-center justify-center shadow-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer border border-gray-100 shrink-0"
                    aria-label="Add to Wishlist"
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 transition-colors ${
                        isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </button>
                </div>

                {/* Center Image Container: Enlarged Showroom Display with Zoom & Dual-Angle Reveal */}
                <Link
                  href={`/products/${product.id}`}
                  className="relative w-full h-52 sm:h-56 rounded-2xl bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 border border-gray-100 flex items-center justify-center p-2 overflow-hidden my-1 shadow-inner/5 group/img"
                >
                  {/* Subtle radial spotlight glow behind machine */}
                  <div className="absolute inset-0 bg-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

                  {/* Multi-Angle Machine Showcase (Auto-zoomed to fill card without empty space) */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Primary Image: Zoomed & Centered */}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      quality={100}
                      loading="lazy"
                      sizes="(max-width: 640px) 560px, (max-width: 1024px) 440px, 560px"
                      className="object-contain p-1 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95 drop-shadow-sm scale-102"
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
                        sizes="(max-width: 640px) 560px, (max-width: 1024px) 440px, 560px"
                        className="object-contain p-1 transition-all duration-500 ease-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-110 drop-shadow-xl"
                      />
                    )}

                    {/* Uniform Interactive View Badge */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/65 backdrop-blur-md text-white text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border border-white/10 shadow-xs transition-all pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-amber-400 animate-pulse" />
                      <span className="group-hover:hidden tracking-wider uppercase text-[8.5px]">Front View</span>
                      <span className="hidden group-hover:inline tracking-wider uppercase text-[8.5px] text-amber-300">Angle 2 • Zoomed</span>
                    </div>
                  </div>

                  {/* Brand Watermark Pill on Bottom-Right of Photo */}
                  <span className="absolute bottom-2 right-2 text-[9px] font-black uppercase tracking-wider text-gray-500 bg-white/95 px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs backdrop-blur-xs z-10 pointer-events-none">
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

        {/* ================= SINGLE "VIEW ALL PRODUCTS" BUTTON ================= */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2.5 bg-[#2d7d32] hover:bg-[#1b5e20] text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
