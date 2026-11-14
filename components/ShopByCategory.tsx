'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import roundCategoriesData from '@/data/import/category_round_manifest.json';

// Human-friendly title formatting helper
function formatCategoryTitle(name: string): string {
  const overrides: Record<string, string> = {
    'SPRAYER': 'Sprayer',
    'BRUSH CUTTER - WEED CUTTER': 'Brush Cutter',
    'ROTAVATOR': 'Rotavator',
    'PUMPSET': 'Pumpset',
    'CHAIN SAW': 'Chain Saw',
    'WOOD CHIPPER': 'Wood Chipper',
    'BLOWER - MISTBLOWER': 'Blower / Mistblower',
    'CHAFF CUTTER / SHREDDER': 'Chaff Cutter',
    'EARTH AUGER': 'Earth Auger',
    'ENGINE': 'Engine',
    'FOGGER ULV & THERMAL': 'Fogger / ULV',
    'GARDEN TOOLS & SPRAYERS': 'Garden Tools',
    'HARVESTER': 'Harvester',
    'HEDGETRIMMER': 'Hedgetrimmer',
    'INTERCULTIVATOR/POWER WEEDER': 'Intercultivator / Power Weeder',
    'IRRIGATION': 'Irrigation',
    'LAWN MOWER': 'Lawn Mower',
    'LUBRICANTS': 'Lubricants',
    'MANUAL SEEDER': 'Manual Seeder',
    'MILKING  MACHINE': 'Milking Machine',
    'POWER CUTTER': 'Power Cutter',
    'PRUNER': 'Pruner',
    'PRESSURE WASHER': 'Pressure Washer',
    'REAPER / HARVESTER': 'Reaper / Harvester',
    'STUBBLE MOWER': 'Stubble Mower',
    'THRESHER': 'Thresher',
    'TRANSPORTER': 'Transporter',
    'MB PLOUGH': 'MB Plough'
  };

  if (overrides[name]) return overrides[name];

  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Prominent order for continuous marquee
const PRIORITY_ORDER = [
  'ROTAVATOR',
  'PUMPSET',
  'CHAIN SAW',
  'WOOD CHIPPER',
  'INTERCULTIVATOR/POWER WEEDER',
  'SPRAYER',
  'BRUSH CUTTER - WEED CUTTER',
  'HARVESTER',
  'LAWN MOWER',
  'CHAFF CUTTER / SHREDDER',
  'EARTH AUGER',
  'ENGINE',
  'BLOWER - MISTBLOWER',
  'FOGGER ULV & THERMAL',
  'GARDEN TOOLS & SPRAYERS',
  'HEDGETRIMMER',
  'IRRIGATION',
  'LUBRICANTS',
  'MANUAL SEEDER',
  'MILKING  MACHINE',
  'POWER CUTTER',
  'PRUNER',
  'PRESSURE WASHER',
  'REAPER / HARVESTER',
  'STUBBLE MOWER',
  'THRESHER',
  'TRANSPORTER',
  'MB PLOUGH'
];

export default function ShopByCategory({
  header
}: {
  header?: { badge?: string; title?: string; subtitle?: string };
} = {}) {
  // Sort categories by priority list
  const sortedCategories = React.useMemo(() => {
    return [...roundCategoriesData].sort((a, b) => {
      const idxA = PRIORITY_ORDER.indexOf(a.name);
      const idxB = PRIORITY_ORDER.indexOf(b.name);
      const posA = idxA === -1 ? 999 : idxA;
      const posB = idxB === -1 ? 999 : idxB;
      return posA - posB;
    });
  }, []);

  // Duplicate for seamless continuous looping
  const marqueeItems = [...sortedCategories, ...sortedCategories];

  return (
    <section 
      aria-label="Shop by Category"
      className="relative w-full py-6 sm:py-8 md:py-10 bg-gradient-to-b from-[#F7FAF7] via-white to-[#F4F9F4] border-b border-emerald-100/70 overflow-hidden select-none"
    >
      {/* Subtle Botanical Leaf Accent (Top Right) */}
      <div className="absolute top-0 right-0 w-28 sm:w-40 md:w-48 h-20 sm:h-28 md:h-36 pointer-events-none z-0 opacity-60 select-none">
        <Image
          src="/assets/categories/showcase_cards/leaves_transparent.png"
          alt="Green Farm Foliage"
          fill
          sizes="(max-width: 768px) 120px, 192px"
          className="object-contain object-top-right select-none"
          priority
        />
      </div>

      <div className="w-full relative z-10">
        
        {/* Compact Formal Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-[#0d9749] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-green-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d9749]"></span>
            <span>{header?.badge || 'Equipment Catalog'}</span>
          </div>

          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {header?.title || 'Shop by Category'}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed font-normal">
            {header?.subtitle || 'Discover our popular categories and find the perfect equipment for your needs.'}
          </p>
        </div>

        {/* Single Row Continuously Sliding Marquee Track */}
        <div className="relative w-full overflow-hidden group/marquee py-2">
          
          {/* Soft Edge Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 bg-gradient-to-r from-[#F7FAF7] via-[#F7FAF7]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 bg-gradient-to-l from-[#F4F9F4] via-[#F4F9F4]/80 to-transparent z-20 pointer-events-none" />

          {/* Continuous Moving Track */}
          <div className="flex gap-6 sm:gap-8 md:gap-10 animate-continuous-marquee items-start flex-nowrap w-max">
            {marqueeItems.map((cat, idx) => {
              const formattedTitle = formatCategoryTitle(cat.name);

              return (
                <Link
                  key={`${cat.id || cat.name}-${idx}`}
                  href={cat.route}
                  className="group flex flex-col items-center text-center cursor-pointer shrink-0 focus:outline-none w-[110px] sm:w-[125px] md:w-[140px]"
                  title={`Shop ${formattedTitle}`}
                  aria-label={`Shop ${formattedTitle}`}
                >
                  {/* Clean Circular Graphic (NO Square Borders) */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 transition-transform duration-300 group-hover:scale-108 group-hover:-translate-y-1">
                    <Image
                      src={cat.roundBadgePath}
                      alt={`${formattedTitle} Machinery`}
                      fill
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                      className="object-contain drop-shadow-md select-none pointer-events-none"
                      priority={idx < 8}
                      quality={90}
                    />
                  </div>

                  {/* Category Name Beneath */}
                  <span className="mt-2.5 sm:mt-3 text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#063B23] transition-colors leading-tight text-center line-clamp-2 px-1">
                    {formattedTitle}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>

      </div>

      {/* Smooth Continuous Marquee Animation */}
      <style jsx>{`
        @keyframes continuousSlideRow {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .animate-continuous-marquee {
          display: flex;
          width: max-content;
          animation: continuousSlideRow 60s linear infinite;
          will-change: transform;
        }

        .animate-continuous-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
