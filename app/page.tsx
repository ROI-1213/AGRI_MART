'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Wrench,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import ShopByCategory from '@/components/ShopByCategory';
import TrustedBrandsShowcase from '@/components/TrustedBrandsShowcase';
import TopPicksShowcase from '@/components/TopPicksShowcase';
import TestingInstitutesShowcase from '@/components/TestingInstitutesShowcase';
import OurProductsSection from '@/components/OurProductsSection';
import SubsidyModal from '@/components/SubsidyModal';
import QuoteModal from '@/components/QuoteModal';
import { Product } from '@/types';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isPromoPaused, setIsPromoPaused] = useState(false);
  const [selectedSubsidyProduct, setSelectedSubsidyProduct] = useState<Product | null>(null);
  const [subsidyModalOpen, setSubsidyModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<Product | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const heroBanners = [
    {
      id: 1,
      image: '/assets/banners/hero_trusted_farmers_ultrahd.png',
      alt: 'Trusted by Farmers Across India — 20 Years of Agricultural Excellence | Agrimart',
      buttonStyle: { left: '6.35%', top: '75.1%', width: '15.33%', height: '8.8%' }
    },
    {
      id: 2,
      image: '/assets/banners/hero_reliable_equipment_ultrahd.png',
      alt: 'Reliable Farm Equipment for a Better Tomorrow — Supporting Farmers Across India | Agrimart',
      buttonStyle: { left: '5.86%', top: '70.1%', width: '13.38%', height: '9.68%' }
    }
  ];

  const promoBanners = [
    {
      id: 1,
      title: 'Become a Partner',
      subtitle: 'GROW TOGETHER',
      description: '1,200+ partners across India are already making profit. Partner with us today!',
      buttonText: 'Partner With Us',
      link: '/become-a-partner',
      photo: '/assets/branding/promo_photo_partner.png',
      bgGradient: 'from-[#f2f8f3] via-[#ffffff] to-[#f4f9f5]',
    },
    {
      id: 2,
      title: 'Buy, Earn and Rent',
      subtitle: 'MORE VALUE FOR YOU',
      description: 'Be a pioneer in the booming Indian rural retail marketing.',
      buttonText: 'Explore Opportunities',
      link: '/cms/buy-earn-rent',
      photo: '/assets/branding/promo_photo_rent.png',
      bgGradient: 'from-[#fefcf3] via-[#ffffff] to-[#fefcf3]',
    },
    {
      id: 3,
      title: 'Knowledge Bank',
      subtitle: 'KNOW MORE, GROW MORE',
      description: 'Access expert guides, product information and farming insights.',
      buttonText: 'Explore Resources',
      link: '/cms/knowledge-bank',
      photo: '/assets/branding/promo_photo_knowledge.png',
      bgGradient: 'from-[#f0f7f3] via-[#ffffff] to-[#f2f8f4]',
    },
  ];

  // Auto-advance hero banner slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  // Auto-advance promotional showcase banner every 2.5 seconds
  useEffect(() => {
    if (isPromoPaused) return;
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoBanners.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isPromoPaused, promoBanners.length]);

  const handleOpenSubsidy = (product: Product) => {
    setSelectedSubsidyProduct(product);
    setSubsidyModalOpen(true);
  };

  const handleOpenQuote = (product: Product) => {
    setSelectedQuoteProduct(product);
    setQuoteModalOpen(true);
  };

  return (
    <div className="w-full bg-white">
      {/* 1. Hero Banner Carousel: Formal High-Definition Agrimart Showcase */}
      <section className="relative w-full bg-[#f8faf8] overflow-hidden border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto relative aspect-[16/9] sm:aspect-[1024/400] md:aspect-[1024/341] min-h-[190px] sm:min-h-[260px] w-full">
          {heroBanners.map((banner, idx) => {
            const isVisible = idx === currentSlide;
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Formal Pristine Ultra-HD Banner Artwork */}
                <Link
                  href="/products"
                  className="block relative w-full h-full cursor-pointer select-none"
                  aria-label={banner.alt}
                >
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    className="object-cover object-center pointer-events-none select-none"
                    quality={100}
                  />
                </Link>

                {/* Interactive Working "Explore Products" Button Overlay */}
                <Link
                  href="/products"
                  className="absolute z-20 rounded-[3px] sm:rounded-[5px] transition-all duration-200 cursor-pointer overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#0a692d]"
                  style={banner.buttonStyle}
                  aria-label="Explore Products"
                  title="Explore Products"
                >
                  {/* Subtle interactive hover highlight & glow ring */}
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 group-active:bg-black/15 transition-colors duration-200 rounded-[4px]" />
                  <span className="absolute inset-0 rounded-[4px] ring-0 group-hover:ring-2 group-hover:ring-white/60 transition-all duration-200 shadow-sm group-hover:shadow-md" />
                </Link>
              </div>
            );
          })}

          {/* Slider Prev / Next Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1))}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'w-6 sm:w-8 bg-[#0a692d]' : 'w-2 bg-gray-400/80 hover:bg-gray-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Premium Shop by Category Showcase */}
      <ShopByCategory />

      {/* 3. Our Trusted International & In-House Brands Showcase */}
      <TrustedBrandsShowcase />

      {/* 4. Agrimart's Top Picks Showcase (Matching Reference Design) */}
      <TopPicksShowcase onOpenSubsidy={handleOpenSubsidy} />

      {/* 5. Our Featured Products Section (8 Flagship Products with Agrimate Tractor & Interactive Animations) */}
      <OurProductsSection onOpenQuote={handleOpenQuote} />

      {/* 5. Dynamic Promotional Showcase Banner: Agrimart Growth & Opportunities */}
      <section className="py-6 bg-gradient-to-b from-[#f8fafc] to-white border-t border-b border-gray-200">
        <div className="agri-container">
          {/* Section Category Header & Tab Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2d7d32] animate-pulse"></span>
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Agrimart Growth & Opportunities
              </span>
            </div>

            {/* Quick-Jump Category Tab Buttons */}
            <div className="flex items-center gap-1.5">
              {promoBanners.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentPromo(idx)}
                  className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    idx === currentPromo
                      ? 'bg-[#2d7d32] text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  aria-label={`Show ${p.title}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Animated Banner Container (Ultra-HD Vector & High-Res Collage) */}
          <div 
            className="relative w-full aspect-[994/115] min-h-[105px] sm:min-h-[120px] md:min-h-[135px] rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 bg-white"
            onMouseEnter={() => setIsPromoPaused(true)}
            onMouseLeave={() => setIsPromoPaused(false)}
          >
            {promoBanners.map((promo, idx) => {
              const isActive = idx === currentPromo;
              return (
                <Link
                  key={promo.id}
                  href={promo.link}
                  className={`absolute inset-0 flex items-stretch transition-all duration-700 ease-in-out bg-gradient-to-r ${promo.bgGradient} group ${
                    isActive 
                      ? 'opacity-100 scale-100 z-10 pointer-events-auto' 
                      : 'opacity-0 scale-[0.99] z-0 pointer-events-none'
                  }`}
                  aria-label={`${promo.title} - ${promo.description}`}
                >
                  {/* Left: Authentic High-Definition Agrimart Logo */}
                  <div className="w-[18%] sm:w-[16%] md:w-[15%] h-full flex items-center justify-center pl-3 sm:pl-5 shrink-0 select-none">
                    <div className="relative w-full max-w-[130px] h-[65%] flex items-center justify-center">
                      <Image
                        src="/assets/branding/logo.png"
                        alt="Agrimart"
                        fill
                        className="object-contain"
                        priority={idx === 0}
                      />
                    </div>
                  </div>

                  {/* Center: Vector Razor-Sharp Typography & Interactive Button */}
                  <div className="flex-1 h-full flex flex-col justify-center px-3 sm:px-6 py-2 z-10 min-w-0 select-none">
                    <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                      <span className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        {promo.subtitle}
                      </span>
                      <span className="w-5 sm:w-8 h-0.5 bg-[#eab308] rounded-full inline-block"></span>
                    </div>

                    <h3 className="text-xs sm:text-base md:text-xl lg:text-2xl font-black text-[#0a692d] leading-none mb-1 tracking-tight truncate">
                      {promo.title}
                    </h3>

                    <p className="text-[8px] sm:text-[11px] md:text-xs text-gray-600 font-medium leading-tight line-clamp-1 sm:line-clamp-2 max-w-lg mb-1.5 sm:mb-2">
                      {promo.description}
                    </p>

                    <div>
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#0a692d] group-hover:bg-[#075022] active:bg-[#053d19] text-white font-bold text-[8.5px] sm:text-[11px] md:text-xs px-2.5 sm:px-3.5 py-1 rounded-[4px] shadow-sm group-hover:shadow transition-all duration-200">
                        <span>{promo.buttonText}</span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 font-mono">→</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Ultra-HD Photographic Showcase with Curved/Diagonal Framing */}
                  <div 
                    className="relative w-[38%] sm:w-[42%] md:w-[46%] h-full shrink-0 overflow-hidden [clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)] select-none"
                  >
                    <Image
                      src={promo.photo}
                      alt={promo.title}
                      fill
                      sizes="(max-width: 1200px) 50vw, 600px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2d7d32]/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Awards & Recognition Section (Complete All 7 Awards Showcase) */}
      <section className="relative w-full bg-[#f4f7f4] border-t border-b border-gray-200 overflow-hidden py-2 sm:py-4">
        <div className="w-full max-w-[1536px] mx-auto px-2 sm:px-4">
          <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-xs">
            <Image
              src="/assets/awards/awards_showcase_all7_hd.png"
              alt="Agrimart Awards — Recognition for our commitment to a stronger, greener tomorrow (All 7 Awards)"
              width={3072}
              height={1024}
              sizes="(max-width: 1536px) 100vw, 1536px"
              className="w-full h-auto object-contain select-none pointer-events-none block"
              quality={100}
              priority
            />
          </div>
        </div>
      </section>

      {/* 10. Academic & Testing Institute Recognition (3-at-once Carousel Showcase) */}
      <TestingInstitutesShowcase />

      {/* 9. Download Agrimart Mobile App Showcase Banner (Ultra-HD with Working App Store & Google Play Links) */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-[#fbfdfa] border-t border-gray-200/70">
        <div className="agri-container">
          <div className="relative w-full aspect-[3072/1024] rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-950/10 shadow-sm hover:shadow-md transition-all duration-300 select-none">
            {/* 3K Ultra-HD Banner Artwork */}
            <Image
              src="/assets/banners/app_download_banner_hd.png"
              alt="Download Agrimart Mobile App — Get every farming solution in one place"
              fill
              priority
              quality={100}
              sizes="(max-width: 1240px) 100vw, 1240px"
              className="object-cover object-center pointer-events-none select-none"
            />

            {/* Clickable Working Google Play Download Button */}
            <a
              href="https://play.google.com/store/search?q=agrimart&c=apps"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
              title="Download Agrimart App on Google Play"
              className="absolute z-20 rounded-[4px] sm:rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#0a692d] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{
                left: '7.13%',
                top: '72.73%',
                width: '11.33%',
                height: '9.97%',
              }}
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/15 group-active:bg-black/15 transition-colors duration-200 rounded-[4px] sm:rounded-lg" />
            </a>

            {/* Clickable Working Apple App Store Download Button */}
            <a
              href="https://apps.apple.com/search?term=agrimart"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              title="Download Agrimart App on the App Store"
              className="absolute z-20 rounded-[4px] sm:rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#0a692d] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{
                left: '19.14%',
                top: '72.73%',
                width: '11.52%',
                height: '9.97%',
              }}
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/15 group-active:bg-black/15 transition-colors duration-200 rounded-[4px] sm:rounded-lg" />
            </a>
          </div>
        </div>
      </section>

      {/* Subsidy Modal */}
      <SubsidyModal
        product={selectedSubsidyProduct}
        isOpen={subsidyModalOpen}
        onClose={() => setSubsidyModalOpen(false)}
      />

      {/* Quote Request Modal */}
      <QuoteModal
        product={selectedQuoteProduct}
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}
