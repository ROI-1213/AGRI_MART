'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trophy, Award } from 'lucide-react';

export interface AwardItem {
  id: number;
  title: string;
  organization: string;
  image: string;
}

export const AWARDS: AwardItem[] = [
  {
    id: 1,
    title: 'Lifetime Achievement to our CMD by Franchise India',
    organization: 'Franchise India',
    image: '/assets/awards/hd_trophies/trophy_1_rgba.png',
  },
  {
    id: 2,
    title: 'Agri Business of the Year 2011',
    organization: 'Annual Agri Excellence',
    image: '/assets/awards/hd_trophies/trophy_2_rgba.png',
  },
  {
    id: 3,
    title: 'Best Innovative Retail Concept for Agriculture Equipments & Sprayers - TOI',
    organization: 'Times of India',
    image: '/assets/awards/hd_trophies/trophy_3_rgba.png',
  },
  {
    id: 4,
    title: 'ET Business Excellence 2019',
    organization: 'The Economic Times',
    image: '/assets/awards/hd_trophies/trophy_4_rgba.png',
  },
  {
    id: 5,
    title: 'Innovative Retail Concept - CMO Asia',
    organization: 'CMO Asia',
    image: '/assets/awards/hd_trophies/trophy_5_rgba.png',
  },
  {
    id: 6,
    title: 'Retail Excellence under Rural Impact & CSR Category Asia - ET Now',
    organization: 'ET Now',
    image: '/assets/awards/hd_trophies/trophy_6_rgba.png',
  },
  {
    id: 7,
    title: 'Top 100 Franchise Opportunities by Franchise World',
    organization: 'Franchise World',
    image: '/assets/awards/hd_trophies/trophy_7_rgba.png',
  },
];

export default function AwardsShowcase() {
  const [isPaused, setIsPaused] = useState(false);

  // Triple the items for a completely seamless, gap-free infinite scroll
  const slidingAwards = [...AWARDS, ...AWARDS, ...AWARDS];

  return (
    <section 
      aria-label="Awards & Recognition"
      className="relative w-full bg-white py-12 sm:py-16 border-t border-b border-gray-100 overflow-hidden select-none"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 text-center">
        {/* Top Recognition Badge */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-[#b45309] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 border border-amber-200/80 shadow-2xs">
          <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Prestigious Accolades &amp; Honors</span>
        </div>

        {/* Section Heading with Golden Laurel Icon */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          <span className="text-2xl sm:text-3xl text-amber-500 select-none">🌿</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            Awards
          </h2>
          <span className="text-2xl sm:text-3xl text-amber-500 select-none transform scale-x-[-1]">🌿</span>
        </div>

        {/* Decorative Golden Underline Bar */}
        <div className="w-12 h-1 bg-[#eab308] rounded-full mx-auto my-2"></div>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
          Recognition for our commitment to a stronger, greener tomorrow
        </p>
      </div>

      {/* ================= CONTINUOUS INFINITE SLIDING CAROUSEL ================= */}
      <div 
        className="relative w-full overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Smooth Edge Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 md:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 md:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Continuous Sliding Track */}
        <div 
          className="animate-awards-slide py-4 flex gap-4 sm:gap-6 items-center"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {slidingAwards.map((award, idx) => (
            <div
              key={`${award.id}-${idx}`}
              className="relative shrink-0 w-[240px] sm:w-[260px] md:w-[280px] h-[370px] sm:h-[400px] rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-amber-400/90 transition-all duration-300 hover:-translate-y-2 p-4 sm:p-5 flex flex-col items-center justify-between cursor-pointer group/card overflow-hidden"
              title={award.title}
            >
              {/* Subtle Ambient Radial Highlight on Hover */}
              <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

              {/* Award Trophy HD Visual */}
              <div className="relative w-full flex-1 min-h-[190px] flex items-center justify-center p-1">
                <Image
                  src={award.image}
                  alt={award.title}
                  fill
                  unoptimized
                  quality={100}
                  sizes="(max-width: 640px) 480px, 600px"
                  className="object-contain drop-shadow-sm group-hover/card:scale-108 transition-transform duration-500"
                />
              </div>

              {/* Award Text: 100% Crisp Vector HTML (Never Blurry on Any Display) */}
              <div className="w-full flex flex-col items-center text-center pt-2.5 border-t border-gray-100/90 mt-auto">
                <h3 className="text-xs sm:text-[13px] font-extrabold text-gray-900 leading-snug line-clamp-2 min-h-[34px] flex items-center justify-center px-1">
                  {award.title}
                </h3>

                {/* Golden Underline Bar */}
                <div className="w-8 h-0.5 bg-[#eab308] rounded-full my-2 group-hover/card:w-14 transition-all duration-300" />

                {/* Organization */}
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {award.organization}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
