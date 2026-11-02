'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Phone, 
  PhoneIncoming,
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Search,
  Layers
} from 'lucide-react';
import categoriesData from '@/data/import/categories.json';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenAuth?: (mode: 'signin' | 'otp' | 'register' | 'b2b' | 'admin') => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [activeCategoryHover, setActiveCategoryHover] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cartContext = useCart();
  const totalItems = cartContext?.totalItems || 0;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    // { name: 'Services', href: '/services' }, // Hidden as of now
    { name: 'Contact Us', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* 1. Top Utility Bar */}
      <div className="bg-[#1f2937] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4">
        <div className="agri-container flex justify-between items-center gap-2">
          {/* Slogan */}
          <span className="text-gray-300 hidden md:inline font-medium">
            Farm Equipment | Green Care | Services
          </span>

          {/* Phone / Toll Free (Right End) */}
          <div className="flex items-center space-x-1.5 text-white font-semibold ml-auto md:ml-0">
            <Phone className="w-3.5 h-3.5 text-[#4ade80]" />
            <span className="hidden xs:inline">Toll Free: </span>
            <a href="tel:7393938938" className="hover:text-green-300 font-bold transition-colors">
              7393 938 938
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar (Logo, Desktop Search, Cart & Mobile Toggle) */}
      <div className="py-2.5 sm:py-3 px-3 sm:px-4 bg-white border-b border-gray-100">
        <div className="agri-container flex justify-between items-center gap-3 sm:gap-4">
          
          {/* Logo with Smooth Gentle Scale on Hover (Zero 3D Mirroring) */}
          <Link href="/" className="flex items-center shrink-0 group" aria-label="Agrimart Home">
            <div className="relative h-10 sm:h-12 w-auto flex items-center">
              <Image
                src="/assets/branding/logo.png"
                alt="Agrimart"
                width={190}
                height={55}
                priority
                unoptimized
                className="h-9 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8 justify-end">
            <form 
              onSubmit={handleSearchSubmit}
              className="w-full max-w-md flex items-center border-2 border-[#0d9749] rounded-lg overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-[#0d9749]/20"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by Name, RIPL Code, Brand..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#0d9749] text-white px-4 py-2.5 hover:bg-[#097b3a] transition-colors cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Action Icons: Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#0d9749] hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Row (Clean, dedicated & always accessible on mobile) */}
        <div className="mt-2.5 md:hidden">
          <form 
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50 focus-within:bg-white focus-within:border-[#0d9749] focus-within:ring-2 focus-within:ring-[#0d9749]/20 transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search machinery, RIPL code, brands..."
              className="w-full px-3 py-2 text-xs bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-[#0d9749] text-white px-3.5 py-2 hover:bg-[#097b3a] transition-colors cursor-pointer shrink-0"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Desktop Navigation Bar (Hidden on Mobile) */}
      <nav className="hidden md:block bg-[#0d9749] text-white relative">
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
                className="bg-[#097b3a] hover:bg-[#07642f] px-5 py-3.5 flex items-center gap-2.5 font-bold text-sm tracking-wide transition-colors cursor-pointer"
                aria-haspopup="true"
                aria-expanded={categoryMenuOpen}
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
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-[#097b3a] hover:bg-emerald-100/70 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0d9749]"></span>
                          <span>All Products</span>
                        </span>
                        <span className="text-[10px] bg-[#0d9749] text-white px-2 py-0.5 rounded-full font-bold">
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
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold hover:bg-green-50 hover:text-[#0d9749] transition-colors"
                        >
                          <span>{cat.name}</span>
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-600" />
                          )}
                        </Link>

                        {/* Nested Subcategories Flyout */}
                        {activeCategoryHover === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="absolute left-full top-0 w-72 bg-white text-gray-800 shadow-xl border border-gray-200 z-50 p-3">
                            <h4 className="font-bold text-xs text-[#0d9749] mb-2 uppercase border-b pb-1">
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
            <div className="flex items-center">
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
                        ? 'bg-[#097b3a] text-yellow-300' 
                        : 'hover:bg-[#256c2a] text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right End: Missed Call Number Widget (Matching Reference Design) */}
          <div className="hidden lg:flex items-center py-1.5 ml-auto">
            <a 
              href="tel:7393938938"
              className="inline-flex items-center rounded overflow-hidden shadow-xs hover:shadow-md transition-all group bg-white border border-[#70b308]/40"
              title="Missed Call Number: 7393 938 938"
            >
              <div className="w-10 h-10 bg-[#70b308] group-hover:bg-[#629d06] flex items-center justify-center text-white transition-colors shrink-0">
                <PhoneIncoming className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="px-3 py-1 bg-[#f4f7fb] group-hover:bg-white transition-colors text-left">
                <span className="block text-[9.5px] sm:text-[10px] font-semibold text-gray-500 tracking-tight leading-tight">
                  Missed Call Number
                </span>
                <span className="block text-sm font-black text-[#0f2e5a] tracking-tight leading-tight mt-0.5">
                  7393 938 938
                </span>
              </div>
            </a>
          </div>
        </div>
      </nav>

      {/* 4. Complete Mobile Navigation Drawer (Smooth, Rich, Touch-Friendly) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#097b3a] text-white border-t border-[#07642f]/60 px-4 py-3 shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Main Page Links */}
          <div className="space-y-1 mb-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (link.href === '/products') {
                      window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
                    }
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold transition-colors ${
                    isActive 
                      ? 'bg-white/15 text-yellow-300' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Accordion for "Shop by Categories" */}
          <div className="border-t border-[#07642f]/60 pt-2 mb-3">
            <button
              type="button"
              onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm font-black text-yellow-300 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Shop by Categories</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileCategoriesOpen && (
              <div className="mt-1.5 pl-3 pr-1 py-1 space-y-0.5 bg-black/20 rounded-lg max-h-60 overflow-y-auto">
                <Link
                  href="/products"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
                  }}
                  className="block py-1.5 px-2 text-xs font-bold text-yellow-200 hover:text-white"
                >
                  ★ Browse All 227 Products →
                </Link>
                {categoriesData.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 px-2 text-xs text-gray-200 hover:text-white hover:bg-white/10 rounded truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Action CTAs in Mobile Menu */}
          <div className="border-t border-[#07642f]/60 pt-3">
            <a
              href="tel:7393938938"
              className="w-full inline-flex items-center rounded-lg overflow-hidden shadow-sm bg-white border border-[#70b308]/40"
            >
              <div className="w-11 h-11 bg-[#70b308] flex items-center justify-center text-white shrink-0">
                <PhoneIncoming className="w-5 h-5 text-white" />
              </div>
              <div className="px-3 py-1.5 bg-[#f4f7fb] flex-1 text-left">
                <span className="block text-[10px] font-semibold text-gray-500 tracking-tight leading-tight">
                  Missed Call Number
                </span>
                <span className="block text-sm font-black text-[#0f2e5a] tracking-wide leading-tight mt-0.5">
                  7393 938 938
                </span>
              </div>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
