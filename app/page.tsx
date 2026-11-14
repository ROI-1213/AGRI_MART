'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import AwardsShowcase from '@/components/AwardsShowcase';
import RevealOnScroll from '@/components/RevealOnScroll';
import SubsidyModal from '@/components/SubsidyModal';
import QuoteModal from '@/components/QuoteModal';
import { DEFAULT_HOMEPAGE_CMS, HomepageCmsData } from '@/lib/cmsDefaults';
import { Product } from '@/types';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isPromoPaused, setIsPromoPaused] = useState(false);
  const [selectedSubsidyProduct, setSelectedSubsidyProduct] = useState<Product | null>(null);
  const [subsidyModalOpen, setSubsidyModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<Product | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [heroParallaxY, setHeroParallaxY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const [homeCms, setHomeCms] = useState<HomepageCmsData>(DEFAULT_HOMEPAGE_CMS);

  const [heroBanners, setHeroBanners] = useState(
    DEFAULT_HOMEPAGE_CMS.heroBanners
      .filter((b) => b.active !== false)
      .map((b) => ({ id: b.id, image: b.image, alt: b.title, link: b.link }))
  );

  const defaultPromoExtras: Record<number, { tabTitle: string; photo: string; bgGradient: string; mobileObjectPosition: string }> = {
    1: {
      tabTitle: 'Become a Partner',
      photo: '/assets/branding/become_partner_hd.png',
      bgGradient: 'from-[#f2f8f3] via-[#ffffff] to-[#f4f9f5]',
      mobileObjectPosition: '33% center',
    },
    2: {
      tabTitle: 'Buy, Earn & Rent',
      photo: '/assets/branding/buy_earn_rent_hd.png',
      bgGradient: 'from-[#fefcf3] via-[#ffffff] to-[#fefcf3]',
      mobileObjectPosition: '48% center',
    },
    3: {
      tabTitle: 'Knowledge Bank',
      photo: '/assets/branding/knowledge_bank_hd.png',
      bgGradient: 'from-[#f0f7f3] via-[#ffffff] to-[#f2f8f4]',
      mobileObjectPosition: '58% center',
    },
  };

  const [promoBanners, setPromoBanners] = useState(
    DEFAULT_HOMEPAGE_CMS.promoBanners.map((p) => ({
      id: p.id,
      title: p.title,
      tabTitle: defaultPromoExtras[p.id]?.tabTitle || p.title,
      subtitle: p.subtitle,
      description: p.desc,
      buttonText: p.buttonText,
      link: p.link,
      photo: defaultPromoExtras[p.id]?.photo || '/assets/branding/become_partner_hd.png',
      bgGradient: defaultPromoExtras[p.id]?.bgGradient || 'from-[#f2f8f3] via-[#ffffff] to-[#f4f9f5]',
      mobileObjectPosition: defaultPromoExtras[p.id]?.mobileObjectPosition || 'center center',
    }))
  );

  // Sync live CMS updates saved from Admin Console
  useEffect(() => {
    fetch('/api/admin/cms?key=homepage')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          const cms: HomepageCmsData = { ...DEFAULT_HOMEPAGE_CMS, ...resData.data };
          setHomeCms(cms);

          if (Array.isArray(cms.heroBanners)) {
            const activeSlides = cms.heroBanners
              .filter((b: any) => b.active !== false)
              .map((b: any) => ({ id: b.id, image: b.image, alt: b.title, link: b.link }));
            if (activeSlides.length > 0) setHeroBanners(activeSlides);
          }
          if (Array.isArray(cms.promoBanners) && cms.promoBanners.length > 0) {
            setPromoBanners(
              cms.promoBanners.map((p: any) => ({
                id: p.id,
                title: p.title,
                tabTitle: defaultPromoExtras[p.id]?.tabTitle || p.title,
                subtitle: p.subtitle,
                description: p.desc,
                buttonText: p.buttonText,
                link: p.link,
                photo: defaultPromoExtras[p.id]?.photo || '/assets/branding/become_partner_hd.png',
                bgGradient: defaultPromoExtras[p.id]?.bgGradient || 'from-[#f2f8f3] via-[#ffffff] to-[#f4f9f5]',
                mobileObjectPosition: defaultPromoExtras[p.id]?.mobileObjectPosition || 'center center',
              }))
            );
          }
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Smooth GPU-accelerated scroll parallax & top progress bar
  useEffect(() => {
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const factor = window.innerWidth < 768 ? 0.08 : 0.16;
        setHeroParallaxY(Math.min(y * factor, 48));

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docHeight > 0 ? Math.min(100, (y / docHeight) * 100) : 0);
        rafId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = touchStartXRef.current - endX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
      } else {
        setCurrentSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
      }
    }
    touchStartXRef.current = null;
  };

  const handleOpenSubsidy = (product: Product) => {
    setSelectedSubsidyProduct(product);
    setSubsidyModalOpen(true);
  };

  const handleOpenQuote = (product: Product) => {
    setSelectedQuoteProduct(product);
    setQuoteModalOpen(true);
  };

  return (
    <div className="w-full bg-white relative">
      {/* Subtle Luxury Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#0d9749] via-[#70b308] to-[#f59e0b] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 1. Hero Banner Carousel: Cinematic Layered Parallax & Slow Ken Burns Zoom */}
      <section
        className="relative w-full bg-[#0d1f14] overflow-hidden border-b border-gray-200"
        onTouchStart={handleHeroTouchStart}
        onTouchEnd={handleHeroTouchEnd}
      >
        <div className="max-w-[1440px] mx-auto relative aspect-[3/1] min-h-[150px] sm:min-h-[240px] md:min-h-[300px] w-full overflow-hidden">
          {heroBanners.map((banner, idx) => {
            const isVisible = idx === currentSlide;
            return (
              <div
                key={banner.id}
                style={{
                  transform: `translate3d(0, ${heroParallaxY}px, 0)`,
                }}
                className={`absolute inset-0 transition-opacity duration-1000 ease-out will-change-transform ${
                  isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Layered Ultra-HD Banner Artwork with Slow Ken Burns Zoom */}
                <Link
                  href={banner.link}
                  className="block relative w-full h-full cursor-pointer select-none overflow-hidden"
                  aria-label={banner.alt}
                >
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    unoptimized
                    quality={100}
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    className={`object-cover object-center pointer-events-none select-none ${
                      isVisible ? 'animate-hero-kenburns' : ''
                    }`}
                  />
                  {/* Luxury Subtle Vignette Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
                </Link>
              </div>
            );
          })}

          {/* Glassmorphic Slider Prev / Next Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1))}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center bg-black/35 backdrop-blur-md border border-white/25 hover:bg-[#0d9749]/90 active:scale-95 text-white rounded-full shadow-lg transition-all duration-200 cursor-pointer"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center bg-black/35 backdrop-blur-md border border-white/25 hover:bg-[#0d9749]/90 active:scale-95 text-white rounded-full shadow-lg transition-all duration-200 cursor-pointer"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Frosted Glass Slide Indicator Dots */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-black/25 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-md">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'w-6 sm:w-8 bg-white shadow-xs' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Dynamic Promotional Showcase Banner: Agrimart Growth & Opportunities (Prominently Visible Immediately Below Main Header Banner) */}
      <section className="py-6 bg-gradient-to-b from-[#f8fafc] to-white border-t border-b border-gray-200">
        <div className="agri-container">
          {/* Section Category Header & Tab Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0d9749] animate-pulse"></span>
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Agrimart Growth & Opportunities
              </span>
            </div>

            {/* Quick-Jump Category Tab Buttons (Full width 3-column grid on mobile so no text is ever clipped) */}
            <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-1.5 w-full sm:w-auto">
              {promoBanners.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentPromo(idx)}
                  className={`text-[9.5px] min-[360px]:text-[10px] sm:text-xs font-bold px-1.5 min-[360px]:px-2 sm:px-3 py-1 sm:py-1 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-center ${
                    idx === currentPromo
                      ? 'bg-[#0d9749] text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  aria-label={`Show ${p.title}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0 hidden min-[360px]:inline-block"></span>
                  <span className="hidden sm:inline whitespace-nowrap">{p.title}</span>
                  <span className="sm:hidden whitespace-nowrap">{p.tabTitle || p.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Animated Banner Container (Ultra-HD Vector & High-Res Collage) */}
          <div 
            className="relative w-full min-h-[240px] min-[360px]:min-h-[255px] min-[414px]:min-h-[270px] sm:min-h-[120px] md:min-h-[135px] sm:aspect-[994/115] rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 bg-white"
            onMouseEnter={() => setIsPromoPaused(true)}
            onMouseLeave={() => setIsPromoPaused(false)}
          >
            {promoBanners.map((promo, idx) => {
              const isActive = idx === currentPromo;
              return (
                <Link
                  key={promo.id}
                  href={promo.link}
                  className={`absolute inset-0 flex flex-col sm:flex-row items-stretch transition-all duration-700 ease-in-out bg-gradient-to-b sm:bg-gradient-to-r ${promo.bgGradient} group ${
                    isActive 
                      ? 'opacity-100 scale-100 z-10 pointer-events-auto' 
                      : 'opacity-0 scale-[0.99] z-0 pointer-events-none'
                  }`}
                  aria-label={`${promo.title} - ${promo.description}`}
                >
                  {/* Left: Authentic High-Definition Agrimart Logo (Desktop & Tablet) */}
                  <div className="hidden sm:flex sm:w-[16%] md:w-[15%] h-full items-center justify-center pl-3 sm:pl-5 shrink-0 select-none">
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

                  {/* Top on Mobile / Right on Desktop: Ultra-HD Full Banner Artwork Showcase */}
                  <div 
                    className="order-first sm:order-last relative w-full h-36 min-[360px]:h-40 min-[414px]:h-44 sm:h-full sm:aspect-auto sm:w-[50%] md:w-[56%] lg:w-[58%] shrink-0 overflow-hidden sm:[clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)] select-none bg-gradient-to-b sm:bg-none from-white via-white/80 to-transparent p-0"
                  >
                    <Image
                      src={promo.photo}
                      alt={promo.title}
                      fill
                      unoptimized
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 70vw, 1000px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 [object-position:var(--pos)] sm:[object-position:center]"
                      style={{ '--pos': promo.mobileObjectPosition || 'center' } as React.CSSProperties}
                    />
                    {/* Soft gradient mask on the left edge only on tablet/desktop */}
                    <div className="hidden sm:block absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
                  </div>

                  {/* Center/Bottom: Vector Razor-Sharp Typography & Interactive Button */}
                  <div className="flex-1 flex flex-col justify-center px-3.5 sm:px-6 py-2 sm:py-2.5 z-10 min-w-0 select-none">
                    {/* Top Line: Logo & Subtitle */}
                    <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                      {/* Mobile Logo inline with subtitle */}
                      <div className="sm:hidden flex items-center">
                        <Image
                          src="/assets/branding/logo.png"
                          alt="Agrimart"
                          width={75}
                          height={20}
                          className="h-3.5 w-auto object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8.5px] sm:text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                          {promo.subtitle}
                        </span>
                        <span className="w-5 sm:w-8 h-0.5 bg-[#eab308] rounded-full inline-block shrink-0"></span>
                      </div>
                    </div>

                    {/* On Mobile: Title & Interactive Button side-by-side */}
                    <div className="flex sm:hidden items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-black text-[#097b3a] leading-tight tracking-tight truncate flex-1 min-w-0">
                        {promo.title}
                      </h3>

                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1 bg-[#097b3a] group-hover:bg-[#075022] active:bg-[#053d19] text-white font-bold text-[9px] px-2.5 py-1 rounded-[4px] shadow-sm whitespace-nowrap">
                          <span>{promo.buttonText}</span>
                          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 font-mono">→</span>
                        </span>
                      </div>
                    </div>

                    {/* On Desktop: Title on its own row, full width, no truncation (Displayed as it was earlier) */}
                    <h3 className="hidden sm:block text-base md:text-xl lg:text-2xl font-black text-[#097b3a] leading-tight mb-1 tracking-tight">
                      {promo.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[9.5px] sm:text-[11px] md:text-xs text-gray-600 font-medium leading-snug line-clamp-2 max-w-lg mb-0 sm:mb-2">
                      {promo.description}
                    </p>

                    {/* On Desktop: Action Button displayed underneath description (Displayed as it was earlier) */}
                    <div className="hidden sm:block">
                      <span className="inline-flex items-center gap-1.5 bg-[#097b3a] group-hover:bg-[#075022] active:bg-[#053d19] text-white font-bold text-[11px] md:text-xs px-3.5 py-1 rounded-[4px] shadow-sm group-hover:shadow transition-all duration-200 whitespace-nowrap">
                        <span>{promo.buttonText}</span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 font-mono">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Premium Shop by Category Showcase */}
      <RevealOnScroll variant="fade-up" durationMs={650}>
        <ShopByCategory header={homeCms.categoriesSection} />
      </RevealOnScroll>

      {/* 4. Our Trusted International & In-House Brands Showcase */}
      <RevealOnScroll variant="fade-up" delayMs={60} durationMs={700}>
        <TrustedBrandsShowcase
          header={homeCms.brandsSection?.header}
          customBrands={homeCms.brandsSection?.brands}
        />
      </RevealOnScroll>

      {/* 5. Agrimart's Top Picks Showcase (Matching Reference Design) */}
      <RevealOnScroll variant="fade-up" delayMs={60} durationMs={700}>
        <TopPicksShowcase
          header={homeCms.topPicksSection?.header}
          customPicks={homeCms.topPicksSection?.picks}
          onOpenSubsidy={handleOpenSubsidy}
        />
      </RevealOnScroll>

      {/* 6. Our Featured Products Section (8 Flagship Products with Agrimate Tractor & Interactive Animations) */}
      <RevealOnScroll variant="fade-up" delayMs={60} durationMs={700}>
        <OurProductsSection
          header={homeCms.featuredProductsSection?.header}
          customProducts={homeCms.featuredProductsSection?.products}
          onOpenQuote={handleOpenQuote}
        />
      </RevealOnScroll>

      {/* 7. Awards & Recognition Showcase (Clean Background with Continuous Smooth Sliding) */}
      <RevealOnScroll variant="fade-in" durationMs={750}>
        <AwardsShowcase
          header={homeCms.awardsSection?.header}
          customAwards={homeCms.awardsSection?.awards}
        />
      </RevealOnScroll>

      {/* 10. Academic & Testing Institute Recognition (3-at-once Carousel Showcase) */}
      <RevealOnScroll variant="fade-up" durationMs={700}>
        <TestingInstitutesShowcase
          header={homeCms.institutesSection?.header}
          customInstitutes={homeCms.institutesSection?.institutes}
        />
      </RevealOnScroll>

      {/* 9. Download Agrimart Mobile App Showcase Banner (Ultra-HD with Direct Google Play & App Store Buttons) */}
      <RevealOnScroll variant="scale-in" durationMs={700}>
        <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-[#fbfdfa] border-t border-gray-200/70">
          <div className="agri-container">
            <div
              className="relative w-full aspect-[1024/340] rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-950/10 shadow-md hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 select-none group"
            >
            {/* 3K Ultra-HD Banner Artwork (unoptimized for 100% loss-free HD clarity) */}
            <Image
              src={homeCms.appBanner?.bannerImage || "/assets/banners/app_download_banner_hd.png"}
              alt={homeCms.appBanner?.title || "Download Agrimart Mobile App — Get every farming solution in one place"}
              fill
              priority
              unoptimized
              quality={100}
              sizes="(max-width: 1240px) 100vw, 1240px"
              className="object-cover object-center pointer-events-none select-none"
            />

            {/* The 2 Hyperlinked Buttons: Google Play & App Store */}
            <div 
              className="absolute z-20 flex items-center gap-1.5 sm:gap-3 left-[6%] sm:left-[7.5%] bottom-[5%] sm:bottom-[12%]"
            >
              {/* Google Play Store Button */}
              <a
                href={homeCms.appBanner?.googlePlayLink || "https://play.google.com/store/apps/details?id=com.invenzo.ratnagiri&hl=en_IN&gl=US&pli=1"}
                target="_blank"
                rel="noopener noreferrer"
                title="Download Agrimart App on Google Play"
                aria-label="Download on Google Play"
                className="hover:scale-105 active:scale-95 transition-transform duration-200 inline-block shadow-md hover:shadow-lg rounded-sm sm:rounded-md overflow-hidden cursor-pointer shrink-0"
              >
                <Image
                  src="/assets/branding/google_play_hd.png"
                  alt="Get it on Google Play"
                  width={140}
                  height={44}
                  unoptimized
                  quality={100}
                  className="h-5 sm:h-8 md:h-10 lg:h-11 w-auto object-contain cursor-pointer"
                />
              </a>

              {/* Apple App Store Button */}
              <a
                href={homeCms.appBanner?.appStoreLink || "https://apps.apple.com/in/app/agrimart/id1599062786"}
                target="_blank"
                rel="noopener noreferrer"
                title="Download Agrimart App on App Store"
                aria-label="Download on App Store"
                className="hover:scale-105 active:scale-95 transition-transform duration-200 inline-block shadow-md hover:shadow-lg rounded-sm sm:rounded-md overflow-hidden cursor-pointer shrink-0"
              >
                <Image
                  src="/assets/branding/app_store_hd.png"
                  alt="Download on the App Store"
                  width={140}
                  height={44}
                  unoptimized
                  quality={100}
                  className="h-5 sm:h-8 md:h-10 lg:h-11 w-auto object-contain cursor-pointer"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
      </RevealOnScroll>

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
