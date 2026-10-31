'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trophy, Award, Pause, Play, Sparkles } from 'lucide-react';

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
    image: '/assets/awards/clean_cards/award_card_1.png',
  },
  {
    id: 2,
    title: 'Agri Business of the Year 2011',
    organization: 'Annual Agri Excellence',
    image: '/assets/awards/clean_cards/award_card_2.png',
  },
  {
    id: 3,
    title: 'Best Innovative Retail Concept for Agriculture Equipments & Sprayers - TOI',
    organization: 'Times of India',
    image: '/assets/awards/clean_cards/award_card_3.png',
  },
  {
    id: 4,
    title: 'ET Business Excellence 2019',
    organization: 'The Economic Times',
    image: '/assets/awards/clean_cards/award_card_4.png',
  },
  {
    id: 5,
    title: 'Innovative Retail Concept - CMO Asia',
    organization: 'CMO Asia',
    image: '/assets/awards/clean_cards/award_card_5.png',
  },
  {
    id: 6,
    title: 'Retail Excellence under Rural Impact & CSR Category Asia - ET Now',
    organization: 'ET Now',
    image: '/assets/awards/clean_cards/award_card_6.png',
  },
  {
    id: 7,
    title: 'Top 100 Franchise Opportunities by Franchise World',
    organization: 'Franchise World',
    image: '/assets/awards/clean_cards/award_card_7.png',
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
              className="relative shrink-0 w-[210px] sm:w-[240px] md:w-[260px] aspect-[370/446] rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-amber-400/90 transition-all duration-300 hover:-translate-y-2 p-2 sm:p-2.5 flex items-center justify-center cursor-pointer group/card overflow-hidden"
              title={award.title}
            >
              {/* Subtle Ambient Radial Highlight on Hover */}
              <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

              {/* Award Card Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={award.image}
                  alt={award.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 210px, (max-width: 1024px) 240px, 260px"
                  className="object-contain drop-shadow-2xs group-hover/card:scale-102 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Helper Indicator / Pause Control */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 text-xs text-gray-600 font-medium">
        <button
          type="button"
          onClick={() => setIsPaused(prev => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors cursor-pointer text-[11px]"
          aria-label={isPaused ? "Resume continuous sliding" : "Pause sliding"}
        >
          {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
          <span>{isPaused ? 'Resume Sliding' : 'Pause on Hover or Click'}</span>
        </button>
        <span className="hidden sm:inline-block text-gray-500">•</span>
        <span className="hidden sm:inline-block text-[11px] text-gray-600 font-medium">Hover over any award to examine details</span>
      </div>
    </section>
  );
}
