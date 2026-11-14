'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandItem {
  name: string;
  tagline: string;
  href: string;
  logo: string;
  width: number;
  height: number;
  customImgClass?: string;
}

const BRANDS: BrandItem[] = [
  {
    name: 'AGRIMATE',
    tagline: 'Reliable, Powerful Farm Machinery',
    href: '/products?brand=AGRIMATE',
    logo: '/assets/brands/partner_strip/agrimate.png',
    width: 800,
    height: 240,
  },
  {
    name: 'KASEI',
    tagline: 'High-Performance Power Equipment',
    href: '/products?brand=KASEI',
    logo: '/assets/brands/partner_strip/kasei_hd.png',
    width: 800,
    height: 240,
  },
  {
    name: 'OLEO-MAC',
    tagline: 'Italian Technology & Global Reliability',
    href: '/products?brand=OLEO-MAC',
    logo: '/assets/brands/partner_strip/oleo_mac_hd.png',
    width: 800,
    height: 240,
  },
];

export default function TrustedBrandsShowcase({
  header,
  customBrands,
}: {
  header?: { badge?: string; title?: string; subtitle?: string };
  customBrands?: Array<{ name: string; tagline: string; href: string; logo: string }>;
} = {}) {
  const displayBrands = customBrands && customBrands.length > 0 ? customBrands : BRANDS;

  return (
    <section 
      aria-label="Our Brands"
      className="w-full bg-white pt-10 sm:pt-14 pb-4 sm:pb-6"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Matching Website Formal Typography */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-[#0d9749] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-green-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d9749]"></span>
            <span>{header?.badge || 'Authorized Global & In-House Brands'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {header?.title || 'Our Brands'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl mx-auto leading-relaxed">
            {header?.subtitle || 'Agrimart works with world-class manufacturers, experienced engineers, and trusted in-house brands to improve productivity for farmers and profitability for our partners.'}
          </p>
        </div>

        {/* Brand Logos Strip: 3 Authorized Premier Brands in One Clean Balanced Single Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-10 md:gap-16 items-center justify-items-center max-w-4xl mx-auto px-1 sm:px-4">
          {displayBrands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group relative flex items-center justify-center w-full px-1.5 sm:px-3 py-1.5 sm:py-2.5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:opacity-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0d9749]/30"
              title={`${brand.name} — ${brand.tagline}`}
              aria-label={`Explore ${brand.name} equipment and products`}
            >
              <div className="relative h-10 sm:h-18 md:h-24 w-full flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} Logo`}
                  width={800}
                  height={240}
                  unoptimized
                  className="max-h-full max-w-[92%] sm:max-w-[85%] object-contain filter group-hover:scale-105 transition-all duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
