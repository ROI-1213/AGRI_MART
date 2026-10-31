'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';

interface AwardItem {
  id: number;
  title: string;
  image: string;
  badge: string;
}

const awardsData: AwardItem[] = [
  {
    id: 1,
    title: 'Lifetime Achievement to our CMD by Franchise India',
    image: '/assets/awards/award_card_1_round.png',
    badge: 'Franchise India',
  },
  {
    id: 2,
    title: 'Agri Business of the Year 2011',
    image: '/assets/awards/award_card_2_round.png',
    badge: 'National Agri Awards',
  },
  {
    id: 3,
    title: 'Best Innovative Retail Concept for Agriculture Equipments & Sprayers – TOI',
    image: '/assets/awards/award_card_3_round.png',
    badge: 'Times of India',
  },
  {
    id: 4,
    title: 'ET Business Excellence 2019',
    image: '/assets/awards/award_card_4_round.png',
    badge: 'Economic Times',
  },
];

type AnimationPhase =
  | 'IDLE'
  | 'GRID_VISIBLE'
  | 'MOVING_TO_CENTRE'
  | 'SPOTLIGHT_HOLD'
  | 'RETURNING_TO_GRID'
  | 'BETWEEN_AWARDS'
  | 'FINAL_PAUSE';

export default function AwardsSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State Machine
  const [phase, setPhase] = useState<AnimationPhase>('IDLE');
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Measured Transform Offsets (deltaX, deltaY, scale)
  const [offsets, setOffsets] = useState<{ [key: number]: { dx: number; dy: number; scale: number } }>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 1. Accessibility: Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 2. Exact Geometry Measurement: Calculate deltaX, deltaY to Section Center
  const measurePositions = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // The visual center of the Awards section (approx 56% down to balance header and bottom ledge)
    const targetCenterX = containerRect.left + containerRect.width / 2;
    const targetCenterY = containerRect.top + containerRect.height * 0.58;

    // Responsive scale
    const viewportWidth = window.innerWidth;
    let targetScale = 1.32;
    if (viewportWidth < 640) {
      targetScale = 1.15;
    } else if (viewportWidth < 1024) {
      targetScale = 1.25;
    }

    const newOffsets: { [key: number]: { dx: number; dy: number; scale: number } } = {};

    cardRefs.current.forEach((cardEl, idx) => {
      if (!cardEl) return;
      const cardRect = cardEl.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;

      newOffsets[idx] = {
        dx: targetCenterX - cardCenterX,
        dy: targetCenterY - cardCenterY,
        scale: targetScale,
      };
    });

    setOffsets(newOffsets);
  }, []);

  // Recalculate on window resize
  useEffect(() => {
    measurePositions();
    const handleResize = () => {
      measurePositions();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measurePositions]);

  // 3. Intersection Observer: Trigger sequence when >= 60% of section is visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
        });
      },
      {
        threshold: 0.55,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 4. Tab Visibility Detection (pause background animations when user switches tabs)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        clearCurrentTimer();
      } else if (isIntersecting && !isUserPaused && !isHovered && !prefersReducedMotion) {
        measurePositions();
        setPhase('GRID_VISIBLE');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isIntersecting, isUserPaused, isHovered, prefersReducedMotion, clearCurrentTimer, measurePositions]);

  // 5. Main Sequential Spotlight Animation Controller
  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('GRID_VISIBLE');
      setActiveCardIndex(null);
      clearCurrentTimer();
      return;
    }

    if (!isIntersecting || isUserPaused || isHovered) {
      clearCurrentTimer();
      return;
    }

    // Sequence Driver
    if (phase === 'IDLE' && isIntersecting) {
      measurePositions();
      // Initial entrance reveal: 0.7s
      timerRef.current = setTimeout(() => {
        setPhase('GRID_VISIBLE');
      }, 700);
    } else if (phase === 'GRID_VISIBLE') {
      // Begin spotlight with Card 1 (or next card in line)
      const nextIndex = activeCardIndex === null ? 0 : activeCardIndex;
      timerRef.current = setTimeout(() => {
        setActiveCardIndex(nextIndex);
        setPhase('MOVING_TO_CENTRE');
      }, 500);
    } else if (phase === 'MOVING_TO_CENTRE') {
      // Travel to center: 0.85s transition
      timerRef.current = setTimeout(() => {
        setPhase('SPOTLIGHT_HOLD');
      }, 850);
    } else if (phase === 'SPOTLIGHT_HOLD') {
      // Spotlight hold: 1.8s
      timerRef.current = setTimeout(() => {
        setPhase('RETURNING_TO_GRID');
      }, 1800);
    } else if (phase === 'RETURNING_TO_GRID') {
      // Return to grid: 0.85s transition
      timerRef.current = setTimeout(() => {
        if (activeCardIndex !== null && activeCardIndex < awardsData.length - 1) {
          // Pause between cards: 0.5s
          setPhase('BETWEEN_AWARDS');
          timerRef.current = setTimeout(() => {
            setActiveCardIndex((prev) => (prev !== null ? prev + 1 : 0));
            setPhase('MOVING_TO_CENTRE');
          }, 500);
        } else {
          // All 4 awards completed: Final loop pause 2.0s
          setPhase('FINAL_PAUSE');
          timerRef.current = setTimeout(() => {
            setActiveCardIndex(0);
            setPhase('MOVING_TO_CENTRE');
          }, 2000);
        }
      }, 850);
    }

    return () => clearCurrentTimer();
  }, [phase, activeCardIndex, isIntersecting, isUserPaused, isHovered, prefersReducedMotion, clearCurrentTimer, measurePositions]);

  // User Click Handler (Instant spotlight on chosen card)
  const handleCardClick = (index: number) => {
    clearCurrentTimer();
    measurePositions();
    if (activeCardIndex === index && (phase === 'MOVING_TO_CENTRE' || phase === 'SPOTLIGHT_HOLD')) {
      // Clicking active card returns it to grid
      setPhase('RETURNING_TO_GRID');
    } else {
      setActiveCardIndex(index);
      setPhase('MOVING_TO_CENTRE');
    }
  };

  const togglePause = () => {
    setIsUserPaused((prev) => !prev);
    if (!isUserPaused) {
      clearCurrentTimer();
    } else {
      measurePositions();
      setPhase('GRID_VISIBLE');
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[2/1] min-h-[300px] sm:min-h-[380px] md:min-h-[440px] rounded-2xl overflow-hidden shadow-md border border-gray-200/90 select-none bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Ultra-HD Clean Scenic Landscape Backdrop (Tea mountains, sky, sun, stone ledge, Awards header) */}
      <Image
        src="/assets/awards/awards_backdrop_clean.png"
        alt="Agrimart Awards — Recognition for our commitment to a stronger, greener tomorrow"
        fill
        sizes="(max-width: 1024px) 100vw, 920px"
        className="object-cover object-center pointer-events-none select-none"
        priority
      />

      {/* Accessible Pause/Play Autoplay Button */}
      <button
        onClick={togglePause}
        className="absolute top-3 right-3 z-30 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors cursor-pointer flex items-center justify-center backdrop-blur-sm"
        aria-label={isUserPaused ? 'Play awards animation' : 'Pause awards animation'}
        title={isUserPaused ? 'Play awards animation' : 'Pause awards animation'}
      >
        {isUserPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>

      {/* 2. Interactive Spotlight Four-Card Track (Positioned on top of the stone ledge) */}
      <div
        ref={cardsTrackRef}
        className="absolute inset-x-0 bottom-[11.5%] top-[37%] flex items-center justify-center px-4 sm:px-8 z-20 pointer-events-none"
      >
        <div className="w-full max-w-[760px] h-full flex items-center justify-center gap-2 sm:gap-3.5 md:gap-5">
          {awardsData.map((award, index) => {
            const isActive = activeCardIndex === index && (phase === 'MOVING_TO_CENTRE' || phase === 'SPOTLIGHT_HOLD');
            const isReturning = activeCardIndex === index && phase === 'RETURNING_TO_GRID';
            const isDimmed = activeCardIndex !== null && activeCardIndex !== index && (phase === 'MOVING_TO_CENTRE' || phase === 'SPOTLIGHT_HOLD');

            // Retrieve transform offset
            const offset = offsets[index] || { dx: 0, dy: 0, scale: 1.3 };
            const transformStyle = isActive
              ? `translate3d(${offset.dx}px, ${offset.dy}px, 0) scale(${offset.scale})`
              : 'translate3d(0, 0, 0) scale(1)';

            return (
              <div
                key={award.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => handleCardClick(index)}
                className={`relative h-full aspect-[1/1.78] pointer-events-auto cursor-pointer select-none transition-all ${
                  isActive ? 'z-50' : isReturning ? 'z-40' : 'z-10'
                }`}
                style={{
                  transform: transformStyle,
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease, box-shadow 0.85s ease',
                  opacity: isDimmed ? 0.68 : 1,
                  willChange: 'transform, opacity',
                }}
                role="button"
                tabIndex={0}
                aria-label={`Award: ${award.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(index);
                  }
                }}
              >
                {/* Visual Card Footprint Placeholder (Retains layout space and visual footprint when active card leaves) */}
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${
                    isActive ? 'opacity-40 border border-green-300/60 bg-white/30 shadow-inner' : 'opacity-0'
                  }`}
                />

                {/* Ultra-HD Award Card Container */}
                <div
                  className={`relative w-full h-full rounded-xl overflow-hidden transition-all duration-500 ${
                    isActive
                      ? 'shadow-2xl ring-2 ring-[#eab308] ring-offset-2 ring-offset-green-900/10'
                      : 'shadow-md hover:shadow-lg'
                  }`}
                >
                  <Image
                    src={award.image}
                    alt={award.title}
                    fill
                    sizes="(max-width: 768px) 30vw, 220px"
                    className="object-contain object-center"
                    priority
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
