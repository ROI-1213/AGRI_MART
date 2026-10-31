'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Phone, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Search
} from 'lucide-react';
import categoriesData from '@/data/import/categories.json';

interface HeaderProps {
  onOpenAuth?: (mode: 'signin' | 'otp' | 'register' | 'b2b' | 'admin') => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [activeCategoryHover, setActiveCategoryHover] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* 1. Top Bar */}
      <div className="bg-[#242424] text-white text-xs py-1.5 px-4">
        <div className="agri-container flex flex-wrap justify-between items-center gap-2">
          {/* Slogan & Phone */}
          <div className="flex items-center space-x-4">
            <span className="text-[#a0a0a0] hidden sm:inline font-medium">
              Farm Equipment | Green Care | Services
            </span>
            <div className="flex items-center space-x-1.5 text-white font-semibold">
              <Phone className="w-3.5 h-3.5 text-[#2d7d32]" />
              <span>Toll Free: </span>
              <a href="tel:7393938938" className="hover:text-green-400 font-bold">7393 938 938</a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Logo, Search) */}
      <div className="py-3 px-4 bg-white border-b border-gray-100">
        <div className="agri-container flex justify-between items-center gap-4">
          {/* Logo with 30-Second Periodic Spin */}
          <Link href="/" className="flex items-center group" aria-label="Agrimart Home">
            <div className="logo-spin-30s inline-block origin-center will-change-transform">
              <Image
                src="/assets/branding/logo.png"
                alt="Agrimart"
                width={190}
                height={55}
                priority
                unoptimized
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6 justify-end">
            <form 
              onSubmit={handleSearchSubmit}
              className="w-full max-w-md flex items-center border-2 border-[#2d7d32] rounded-md overflow-hidden"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by Name, RIPL Code, Brand..."
                className="w-full px-4 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#2d7d32] text-white px-5 py-2 hover:bg-[#1b5e20] transition-colors cursor-pointer"
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-green-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Navigation Bar (Category Mega Dropdown & Nav Links) */}
      <nav className="bg-[#2d7d32] text-white relative">
        <div className="agri-container flex justify-between items-center">
          <div className="flex items-center">
            {/* Mega Dropdown Button */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoryMenuOpen(true)}
              onMouseLeave={() => {
                setCategoryMenuOpen(false);
                setActiveCategoryHover(null);
              }}
            >
              <button 
                className="bg-[#1b5e20] hover:bg-[#144718] px-5 py-3.5 flex items-center gap-2.5 font-bold text-sm tracking-wide transition-colors cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span>SHOP BY CATEGORIES</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {/* Categories Mega Dropdown Menu */}
              {categoryMenuOpen && (
                <div className="absolute top-full left-0 w-80 bg-white text-gray-800 shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
                  <ul className="divide-y divide-gray-100">
                    {/* All Products Quick-Link */}
                    <li className="bg-emerald-50/70 border-b border-emerald-100">
                      <Link
                        href="/products"
                        prefetch={false}
                        onClick={() => setCategoryMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-[#1b5e20] hover:bg-emerald-100/70 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#2d7d32]"></span>
                          <span>All Products</span>
                        </span>
                        <span className="text-[10px] bg-[#2d7d32] text-white px-2 py-0.5 rounded-full font-bold">
                          227
                        </span>
                      </Link>
                    </li>
                    {categoriesData.map((cat) => (
                      <li 
                        key={cat.id} 
                        className="group relative"
                        onMouseEnter={() => setActiveCategoryHover(cat.id)}
                      >
                        <Link
                          href={`/products?category=${encodeURIComponent(cat.name)}`}
                          prefetch={false}
                          onClick={() => setCategoryMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold hover:bg-green-50 hover:text-[#2d7d32] transition-colors"
                        >
                          <span>{cat.name}</span>
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-600" />
                          )}
                        </Link>

                        {/* Nested Subcategories Flyout */}
                        {activeCategoryHover === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="absolute left-full top-0 w-72 bg-white text-gray-800 shadow-xl border border-gray-200 z-50 p-3">
                            <h4 className="font-bold text-xs text-[#2d7d32] mb-2 uppercase border-b pb-1">
                              {cat.name} Subcategories
                            </h4>
                            <ul className="space-y-1">
                              {cat.subcategories.map((sub, sIdx) => (
                                <li key={sIdx}>
                                  <Link
                                    href={`/products?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`}
                                    prefetch={false}
                                    onClick={() => setCategoryMenuOpen(false)}
                                    className="block px-2 py-1 text-xs text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded"
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      if (link.href === '/products') {
                        window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
                      }
                    }}
                    className={`px-4 py-3.5 text-sm font-semibold transition-colors ${
                      isActive 
                        ? 'bg-[#1b5e20] text-yellow-300' 
                        : 'hover:bg-[#256c2a] text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick CTA or Download Brochure */}
          <div className="hidden lg:flex items-center pr-2">
            <a
              href="/assets/brochures/corporate_brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-3 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Download Brochure</span>
            </a>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1b5e20] border-t border-green-700 px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.href === '/products') {
                    window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
                  }
                }}
                className="block py-2 text-sm font-medium hover:text-yellow-300"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-green-800">
              <Link
                href="/products"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
                }}
                className="block py-2 text-sm font-bold text-yellow-300"
              >
                Browse All Product Categories →
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 30-Second Periodic Logo Spin Animation */}
      <style jsx>{`
        @keyframes logoPeriodicSpin {
          0% {
            transform: perspective(800px) rotateY(0deg);
          }
          /* Spins 360 degrees smoothly in 1.4 seconds (4.67% of 30s) */
          4.67% {
            transform: perspective(800px) rotateY(360deg);
          }
          /* Stays still and upright for the rest of the 30-second cycle */
          100% {
            transform: perspective(800px) rotateY(360deg);
          }
        }

        .logo-spin-30s {
          display: inline-block;
          transform-style: preserve-3d;
          backface-visibility: visible;
          animation: logoPeriodicSpin 30s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .logo-spin-30s:hover {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  );
}
