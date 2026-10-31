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
    width: 732,
    height: 222,
    customImgClass: 'max-h-12 sm:max-h-14 md:max-h-16',
  },
  {
    name: 'KASEI',
    tagline: 'High-Performance Power Equipment',
    href: '/products?brand=KASEI',
    logo: '/assets/brands/partner_strip/kasei_hd.png',
    width: 800,
    height: 225,
    customImgClass: 'max-h-12 sm:max-h-14 md:max-h-16',
  },
  {
    name: 'OLEO-MAC',
    tagline: 'Italian Technology & Global Reliability',
    href: '/products?brand=OLEO-MAC',
    logo: '/assets/brands/partner_strip/oleo_mac_hd.png',
    width: 1061,
    height: 400,
    customImgClass: 'max-h-12 sm:max-h-14 md:max-h-16',
  },
];

export default function TrustedBrandsShowcase() {
  return (
    <section 
      aria-label="Our Brands"
      className="w-full bg-white pt-10 sm:pt-14 pb-4 sm:pb-6"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Matching Website Formal Typography */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-[#2d7d32] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-green-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d7d32]"></span>
            <span>Authorized Global &amp; In-House Brands</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Our Brands
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl mx-auto leading-relaxed">
            Agrimart works with world-class manufacturers, experienced engineers, and trusted in-house brands to improve productivity for farmers and profitability for our partners.
          </p>
        </div>

        {/* Brand Logos Strip: 3 Authorized Premier Brands in One Clean Balanced Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-center justify-items-center max-w-4xl mx-auto">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group relative flex items-center justify-center w-full px-3 py-2.5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:opacity-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2d7d32]/30"
              title={`${brand.name} — ${brand.tagline}`}
              aria-label={`Explore ${brand.name} equipment and products`}
            >
              <div className="relative h-16 sm:h-20 md:h-24 w-full flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} Logo`}
                  width={brand.width}
                  height={brand.height}
                  className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${brand.customImgClass || 'max-h-12 sm:max-h-14 md:max-h-16'}`}
                  quality={100}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
