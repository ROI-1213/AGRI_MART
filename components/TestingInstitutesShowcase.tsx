'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export interface TestingInstitute {
  id: string;
  code: string;
  name: string;
  logo: string;
}

export const TESTING_INSTITUTES: TestingInstitute[] = [
  {
    id: 'ciae',
    code: 'ICAR - CIAE',
    name: 'ICAR - Central Institute of Agricultural Engineering',
    logo: '/assets/recognition/ciae_hd.png',
  },
  {
    id: 'srfmtti',
    code: 'SRFMTTI',
    name: 'Southern Region Farm Machinery Training & Testing Institute',
    logo: '/assets/recognition/srfmtti_hd.png',
  },
  {
    id: 'uas',
    code: 'UAS',
    name: 'University of Agricultural Sciences, Bangalore',
    logo: '/assets/recognition/uas_hd.png',
  },
  {
    id: 'nerfmtti',
    code: 'NERFMTTI',
    name: 'North Eastern Region Farm Machinery Training & Testing Institute',
    logo: '/assets/recognition/nerfmtti_hd.png',
  },
  {
    id: 'nrfmtti',
    code: 'NRFMTTI',
    name: 'Northern Region Farm Machinery Training & Testing Institute',
    logo: '/assets/recognition/nrfmtti_hd.png',
  },
  {
    id: 'tnau',
    code: 'TNAU',
    name: 'Tamil Nadu Agricultural University',
    logo: '/assets/recognition/tnau_hd.png',
  },
  {
    id: 'angrau',
    code: 'ANGRAU',
    name: 'Acharya N.G. Ranga Agricultural University',
    logo: '/assets/recognition/angrau_hd.png',
  },
];

export default function TestingInstitutesShowcase() {
  const total = TESTING_INSTITUTES.length;
  // Double the list for seamless infinite circular sliding
  const carouselItems = [...TESTING_INSTITUTES, ...TESTING_INSTITUTES];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(3);

  // Responsive items count
  useEffect(() => {
    const updateItemsVisible = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setItemsVisible(1);
      } else if (window.innerWidth < 1024) {
        setItemsVisible(2);
      } else {
        setItemsVisible(3);
      }
    };

    updateItemsVisible();
    window.addEventListener('resize', updateItemsVisible);
    return () => window.removeEventListener('resize', updateItemsVisible);
  }, []);

  // Auto-slide every 2 seconds exactly as requested
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Seamless jump reset when passing the first full loop
  useEffect(() => {
    if (currentIndex >= total) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 550); // After the 500ms transition finishes
      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex, total]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(total);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(total - 1);
        });
      });
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Active indicator dot index (0 to total - 1)
  const activeDot = currentIndex % total;

  return (
    <section 
      aria-label="Tested & Approved by Premier Agricultural Universities & FM&TTI Institutes"
      className="w-full bg-[#fbfdfa] border-t border-b border-gray-200/80 py-10 sm:py-14 overflow-hidden select-none"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-green-50 text-[#0d9749] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-green-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0d9749]"></span>
              <span>Institutional Validation</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Tested &amp; Approved by Premier Agricultural Universities &amp; FM&amp;TTI Institutes
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              Every Agrimart machine undergoes rigorous institutional testing to guarantee maximum durability, fuel efficiency, and farmer safety.
            </p>
          </div>

          {/* Indicator dots for the 7 institutes */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            {TESTING_INSTITUTES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeDot 
                    ? 'w-7 bg-[#0d9749]' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to institute ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Container Displaying Cards in Seamless Motion */}
        <div className="relative overflow-hidden px-1 sm:px-2 py-2">
          {/* Sliding Track */}
          <div 
            className="flex"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsVisible)}%)`,
              transition: isTransitioning ? 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
          >
            {carouselItems.map((inst, index) => (
              <div
                key={`${inst.id}-${index}`}
                className="shrink-0 px-1.5 sm:px-3"
                style={{
                  width: `${100 / itemsVisible}%`,
                }}
              >
                <div
                  className="group relative aspect-[4/3] sm:aspect-[16/9] rounded-2xl bg-white border-2 border-gray-200/80 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-3 sm:p-6 cursor-pointer"
                  title={inst.name}
                >
                  {/* Clean Centered Logo Image */}
                  <div className="relative w-28 h-28 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={inst.logo}
                      alt={`${inst.code} Logo`}
                      fill
                      sizes="(max-width: 640px) 120px, (max-width: 1024px) 180px, 200px"
                      className="object-contain"
                      quality={100}
                    />
                  </div>

                  {/* Institute Code Label */}
                  <span className="text-xs sm:text-base md:text-lg font-extrabold text-gray-800 mt-2 text-center group-hover:text-emerald-700 transition-colors tracking-wide uppercase">
                    {inst.code}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Circular Next Arrow Button on Right Edge */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white shadow-xl border border-gray-200/90 flex items-center justify-center text-gray-800 hover:text-emerald-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Next Institution"
            aria-label="Next Institution"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </button>

          {/* Floating Circular Prev Arrow Button on Left Edge */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white shadow-xl border border-gray-200/90 flex items-center justify-center text-gray-800 hover:text-emerald-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Previous Institution"
            aria-label="Previous Institution"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </section>
  );
}
