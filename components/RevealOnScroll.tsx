'use client';

import React, { useEffect, useRef, useState } from 'react';

type RevealVariant = 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';

interface RevealOnScrollProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
}

export default function RevealOnScroll({
  children,
  variant = 'fade-up',
  delayMs = 0,
  durationMs = 700,
  className = '',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform: Record<RevealVariant, string> = {
    'fade-up': 'opacity-0 translate-y-6',
    'fade-in': 'opacity-0',
    'scale-in': 'opacity-0 scale-[0.96]',
    'slide-left': 'opacity-0 -translate-x-6',
    'slide-right': 'opacity-0 translate-x-6',
  };

  const visibleTransform = 'opacity-100 translate-y-0 translate-x-0 scale-100';

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`transition-all will-change-transform motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none ${
        isVisible ? visibleTransform : hiddenTransform[variant]
      } ${className}`}
    >
      {children}
    </div>
  );
}
