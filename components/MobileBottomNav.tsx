'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Layers,
  PhoneCall,
  MessageSquare,
  X,
  ChevronRight,
} from 'lucide-react';
import categoriesData from '@/data/import/categories.json';
import { formatCategoryName } from '@/lib/format';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [categoriesSheetOpen, setCategoriesSheetOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => {
    setCategoriesSheetOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';
  const isProducts = pathname?.startsWith('/products');
  const isContact = pathname === '/contact';

  return (
    <>
      {/* Slide-Up Categories Bottom Sheet (Mobile App Experience) */}
      {categoriesSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
            onClick={() => setCategoriesSheetOpen(false)}
          />
          <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl max-h-[78vh] flex flex-col animate-sheet-up pb-safe">
            {/* Drag Handle & Header */}
            <div className="pt-2.5 pb-3 px-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0d9749] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 leading-tight">
                    Shop by Categories
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    28 machinery &amp; farm care segments
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCategoriesSheetOpen(false)}
                className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition-all"
                aria-label="Close categories"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thumb-Friendly Category List */}
            <div className="overflow-y-auto px-3 py-3 space-y-1.5">
              <Link
                href="/products"
                prefetch={true}
                onClick={() => {
                  setCategoriesSheetOpen(false);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
                  }
                }}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#0d9749] text-white font-bold text-sm flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
              >
                <span>Browse All Products (227)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <div className="grid grid-cols-1 gap-1 pt-1">
                {categoriesData.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    prefetch={true}
                    onClick={() => setCategoriesSheetOpen(false)}
                    className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-gray-50/90 hover:bg-emerald-50 active:bg-emerald-100 border border-gray-100 text-gray-800 hover:text-[#0d9749] text-[13px] font-semibold flex items-center justify-between transition-colors active:scale-[0.99]"
                  >
                    <span className="truncate pr-2">{formatCategoryName(cat.name)}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom App Navigation Bar (Mobile Only) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-6px_24px_rgba(15,23,42,0.08)] pb-safe"
      >
        <div className="grid grid-cols-5 items-stretch max-w-lg mx-auto px-1">
          {/* 1. Home */}
          <Link
            href="/"
            prefetch={true}
            className={`relative min-h-[56px] flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isHome ? 'text-[#0d9749]' : 'text-gray-600 hover:text-[#0d9749]'
            }`}
          >
            {isHome && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#0d9749]" />
            )}
            <span
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isHome ? 'bg-emerald-50 text-[#0d9749]' : ''
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.1]" />
            </span>
            <span className="text-[11px] font-semibold leading-none tracking-tight">
              Home
            </span>
          </Link>

          {/* 2. Products */}
          <Link
            href="/products"
            prefetch={true}
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
              }
            }}
            className={`relative min-h-[56px] flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isProducts && !categoriesSheetOpen
                ? 'text-[#0d9749]'
                : 'text-gray-600 hover:text-[#0d9749]'
            }`}
          >
            {isProducts && !categoriesSheetOpen && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#0d9749]" />
            )}
            <span
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isProducts && !categoriesSheetOpen ? 'bg-emerald-50 text-[#0d9749]' : ''
              }`}
            >
              <Package className="w-5 h-5 stroke-[2.1]" />
            </span>
            <span className="text-[11px] font-semibold leading-none tracking-tight">
              Products
            </span>
          </Link>

          {/* 3. Categories Sheet Trigger */}
          <button
            type="button"
            onClick={() => setCategoriesSheetOpen((prev) => !prev)}
            className={`relative min-h-[56px] flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
              categoriesSheetOpen
                ? 'text-[#0d9749]'
                : 'text-gray-600 hover:text-[#0d9749]'
            }`}
            aria-expanded={categoriesSheetOpen}
          >
            {categoriesSheetOpen && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#0d9749]" />
            )}
            <span
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                categoriesSheetOpen ? 'bg-emerald-50 text-[#0d9749]' : ''
              }`}
            >
              <Layers className="w-5 h-5 stroke-[2.1]" />
            </span>
            <span className="text-[11px] font-semibold leading-none tracking-tight">
              Categories
            </span>
          </button>

          {/* 4. Call Helpline */}
          <a
            href="tel:7393938938"
            className="relative min-h-[56px] flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-gray-600 hover:text-[#0d9749] transition-all duration-150 active:scale-95"
          >
            <span className="w-9 h-7 rounded-full flex items-center justify-center bg-emerald-50/70 text-[#0d9749]">
              <PhoneCall className="w-4.5 h-4.5 stroke-[2.2]" />
            </span>
            <span className="text-[11px] font-semibold leading-none tracking-tight">
              Call Us
            </span>
          </a>

          {/* 5. Enquiry */}
          <Link
            href="/contact"
            prefetch={true}
            className={`relative min-h-[56px] flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isContact ? 'text-[#0d9749]' : 'text-gray-600 hover:text-[#0d9749]'
            }`}
          >
            {isContact && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#0d9749]" />
            )}
            <span
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isContact ? 'bg-emerald-50 text-[#0d9749]' : ''
              }`}
            >
              <MessageSquare className="w-5 h-5 stroke-[2.1]" />
            </span>
            <span className="text-[11px] font-semibold leading-none tracking-tight">
              Enquiry
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
