'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  ChevronDown, 
  X, 
  RotateCcw,
  LayoutGrid, 
  List,
  Check
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import SubsidyModal from '@/components/SubsidyModal';
import QuoteModal from '@/components/QuoteModal';
import productsData from '@/data/import/products.json';
import categoriesData from '@/data/import/categories.json';
import { Product } from '@/types';

function normalizeBrandName(b: string): string {
  if (!b) return '';
  const clean = b.trim().toLowerCase().replace(/[-_\s]+/g, ' ');
  if (clean === 'oleo mac' || clean === 'oleomac') return 'OLEO MAC';
  if (clean === 'green panther' || clean === 'greenpanther') return 'GREEN PANTHER';
  if (clean === 'agrimate') return 'AGRIMATE';
  if (clean === 'kasei') return 'KASEI';
  return b.toUpperCase();
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const rawBrand = searchParams.get('brand') || '';
  const initialBrand = rawBrand ? normalizeBrandName(rawBrand) : '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [selectedPowerSources, setSelectedPowerSources] = useState<string[]>([]);
  
  const [sortBy, setSortBy] = useState<'relevance' | 'name-asc' | 'brand-asc'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

  // Accordion toggle states
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    capacity: true,
    power: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>('all');

  const [selectedSubsidyProduct, setSelectedSubsidyProduct] = useState<Product | null>(null);
  const [subsidyModalOpen, setSubsidyModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<Product | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const rawB = searchParams.get('brand') || '';
    const brand = rawB ? normalizeBrandName(rawB) : '';
    const search = searchParams.get('search') || '';
    const sub = searchParams.get('sub') || '';
    setSelectedCategory(cat);
    setSelectedSubcategory(sub);
    setSelectedBrands(brand ? [brand] : []);
    setSelectedCapacities([]);
    setSelectedPowerSources([]);
    setSearchTerm(search);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const handleReset = () => {
      setSelectedCategory('');
      setSelectedSubcategory('');
      setSelectedBrands([]);
      setSelectedCapacities([]);
      setSelectedPowerSources([]);
      setSearchTerm('');
      setCurrentPage(1);
    };
    window.addEventListener('agrimart-reset-products', handleReset);
    return () => window.removeEventListener('agrimart-reset-products', handleReset);
  }, []);

  const allBrands = ['AGRIMATE', 'KASEI', 'OLEO MAC', 'GREEN PANTHER'];
  const capacityOptions = ['8 Ltr', '16 Ltr', '20 Ltr'];
  const powerSourceOptions = ['Manual', 'Battery', 'Petrol / Engine'];

  const toggleBrand = (brand: string) => {
    const norm = normalizeBrandName(brand);
    setSelectedBrands(prev => {
      const exists = prev.some(b => normalizeBrandName(b) === norm);
      return exists ? prev.filter(b => normalizeBrandName(b) !== norm) : [...prev, norm];
    });
    setCurrentPage(1);
  };

  const toggleCapacity = (cap: string) => {
    setSelectedCapacities(prev => 
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
    setCurrentPage(1);
  };

  const togglePowerSource = (power: string) => {
    setSelectedPowerSources(prev => 
      prev.includes(power) ? prev.filter(p => p !== power) : [...prev, power]
    );
    setCurrentPage(1);
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return (productsData as unknown as Product[]).filter((p) => {
      // Category filter
      if (selectedCategory) {
        const normSelected = selectedCategory.replace(/\s+/g, ' ').trim().toLowerCase();
        const normProductCat = p.category.replace(/\s+/g, ' ').trim().toLowerCase();
        if (normProductCat !== normSelected) {
          return false;
        }
      }
      // Subcategory filter
      if (selectedSubcategory && !p.name.toLowerCase().includes(selectedSubcategory.toLowerCase()) && !p.description.toLowerCase().includes(selectedSubcategory.toLowerCase())) {
        return false;
      }
      // Brand filter
      if (selectedBrands.length > 0) {
        const normSelected = selectedBrands.map(normalizeBrandName);
        const normProductBrand = normalizeBrandName(p.brand);
        if (!normSelected.includes(normProductBrand)) {
          return false;
        }
      }
      // Tank capacity filter
      if (selectedCapacities.length > 0) {
        const text = (p.name + ' ' + (p.description || '')).toLowerCase();
        const matchesCap = selectedCapacities.some(cap => {
          const num = cap.replace(/[^0-9]/g, '');
          return text.includes(`${num}l`) || text.includes(`${num} l`) || text.includes(`${num}ltr`) || text.includes(`${num} ltr`);
        });
        if (!matchesCap) return false;
      }
      // Power source filter
      if (selectedPowerSources.length > 0) {
        const text = (p.name + ' ' + (p.description || '')).toLowerCase();
        const matchesPower = selectedPowerSources.some(ps => {
          if (ps === 'Manual') return text.includes('manual');
          if (ps === 'Battery') return text.includes('battery') || text.includes('12v');
          if (ps === 'Petrol / Engine') return text.includes('petrol') || text.includes('engine') || text.includes('2s') || text.includes('4s') || text.includes('gasoline');
          return true;
        });
        if (!matchesPower) return false;
      }
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesRipl = p.riplCode.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesRipl && !matchesBrand && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'brand-asc') return a.brand.localeCompare(b.brand);
      return 0;
    });
  }, [selectedCategory, selectedSubcategory, selectedBrands, selectedCapacities, selectedPowerSources, searchTerm, sortBy]);

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    if (itemsPerPage === 'all') return filteredProducts;
    return filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedSubcategory ? 1 : 0) + selectedBrands.length + (searchTerm ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedBrands([]);
    setSelectedCapacities([]);
    setSelectedPowerSources([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Helper to count products matching a specific criteria
  const getCategoryCount = (catName: string) => {
    return (productsData as unknown as Product[]).filter(p => p.category.toLowerCase() === catName.toLowerCase()).length;
  };

  const getBrandCount = (brandName: string) => {
    const normTarget = normalizeBrandName(brandName);
    return (productsData as unknown as Product[]).filter(p => {
      if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      return normalizeBrandName(p.brand) === normTarget;
    }).length;
  };

  const getCapacityCount = (capStr: string) => {
    const num = capStr.replace(/[^0-9]/g, '');
    return (productsData as unknown as Product[]).filter(p => {
      if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      const text = (p.name + ' ' + (p.description || '')).toLowerCase();
      return text.includes(`${num}l`) || text.includes(`${num} l`) || text.includes(`${num}ltr`) || text.includes(`${num} ltr`);
    }).length;
  };

  const getPowerSourceCount = (ps: string) => {
    return (productsData as unknown as Product[]).filter(p => {
      if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      const text = (p.name + ' ' + (p.description || '')).toLowerCase();
      if (ps === 'Manual') return text.includes('manual');
      if (ps === 'Battery') return text.includes('battery') || text.includes('12v');
      if (ps === 'Petrol / Engine') return text.includes('petrol') || text.includes('engine') || text.includes('2s') || text.includes('4s') || text.includes('gasoline');
      return true;
    }).length;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 sm:py-8">
      <div className="agri-container px-3 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-gray-500 mb-4 flex items-center space-x-1.5 select-none">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-green-700">Products</Link>
          {selectedCategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 font-bold">{selectedCategory}</span>
            </>
          )}
        </div>

        {/* ================= MAIN 2-COLUMN LAYOUT: Filter Sidebar + Products Grid ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* ================= DESKTOP SIDEBAR: Filter Products ================= */}
          <aside className="hidden lg:block bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs sticky top-24">
            
            {/* Sidebar Header: Filter Products + Reset All Button */}
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm sm:text-base">
                <Filter className="w-4 h-4 text-[#2d7d32]" />
                <span>Filter Products</span>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs text-[#2d7d32] hover:text-[#1b5e20] font-bold hover:underline cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Accordion 1: Product Category */}
            <div className="py-2.5 border-b border-gray-100">
              <button
                type="button"
                onClick={() => toggleSection('category')}
                className="w-full flex items-center justify-between font-bold text-xs sm:text-sm text-gray-900 tracking-tight cursor-pointer py-1"
              >
                <span>Product Category</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openSections.category ? 'rotate-180' : ''}`} />
              </button>

              {openSections.category && (
                <div className="mt-2.5 space-y-1.5 max-h-52 overflow-y-auto pr-1 no-scrollbar">
                  {/* All Products Option */}
                  <label
                    className="flex items-center justify-between text-xs py-1 px-1 rounded hover:bg-emerald-50/60 cursor-pointer select-none group border-b border-gray-100 pb-1.5 mb-1"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          !selectedCategory ? 'bg-[#2d7d32] border-[#2d7d32] text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'
                        }`}
                      >
                        {!selectedCategory && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`truncate ${!selectedCategory ? 'text-[#2d7d32] font-bold' : 'text-gray-700'}`}>
                        All Products
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-semibold shrink-0 ml-1">
                      (227)
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={!selectedCategory}
                      onChange={() => {
                        setSelectedCategory('');
                        setSelectedSubcategory('');
                        setCurrentPage(1);
                      }}
                    />
                  </label>

                  {categoriesData.map((cat) => {
                    const isChecked = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                    const count = getCategoryCount(cat.name);
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center justify-between text-xs py-1 px-1 rounded hover:bg-gray-50 cursor-pointer select-none group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div 
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isChecked ? 'bg-[#2d7d32] border-[#2d7d32] text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`truncate ${isChecked ? 'text-[#2d7d32] font-bold' : 'text-gray-700'}`}>
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-semibold shrink-0 ml-1">
                          ({count})
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedCategory(isChecked ? '' : cat.name);
                            setSelectedSubcategory('');
                            setCurrentPage(1);
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 2: Brand */}
            <div className="py-2.5 mb-4">
              <button
                type="button"
                onClick={() => toggleSection('brand')}
                className="w-full flex items-center justify-between font-bold text-xs sm:text-sm text-gray-900 tracking-tight cursor-pointer py-1"
              >
                <span>Brand</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openSections.brand ? 'rotate-180' : ''}`} />
              </button>

              {openSections.brand && (
                <div className="mt-2.5 space-y-1.5">
                  {allBrands.map((brand) => {
                    const isChecked = selectedBrands.some(b => normalizeBrandName(b) === normalizeBrandName(brand));
                    const count = getBrandCount(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center justify-between text-xs py-1 px-1 rounded hover:bg-gray-50 cursor-pointer select-none group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div 
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isChecked ? 'bg-[#2d7d32] border-[#2d7d32] text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`truncate ${isChecked ? 'text-[#2d7d32] font-bold' : 'text-gray-700'}`}>
                            {brand}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-semibold shrink-0 ml-1">
                          ({count})
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Primary Button: Apply Filters (Matching Mockup) */}
            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-[#2d7d32] hover:bg-[#1b5e20] text-white text-xs sm:text-sm font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-white" />
              <span>Apply Filters ({filteredProducts.length})</span>
            </button>
          </aside>

          {/* ================= MOBILE FILTER SLIDE-OVER DRAWER ================= */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#2d7d32]" />
                    <h3 className="font-extrabold text-sm text-gray-900">Filter Machinery</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Items Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Category */}
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Category</h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      <label className="flex items-center justify-between text-xs py-1 px-1 rounded hover:bg-emerald-50 cursor-pointer">
                        <span className={!selectedCategory ? 'text-[#2d7d32] font-bold' : 'text-gray-700'}>All Categories</span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!selectedCategory}
                          onChange={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}
                        />
                      </label>
                      {categoriesData.map((cat) => (
                        <label key={cat.id} className="flex items-center justify-between text-xs py-1 px-1 rounded hover:bg-gray-50 cursor-pointer">
                          <span className={selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'text-[#2d7d32] font-bold' : 'text-gray-700'}>
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-gray-400">({getCategoryCount(cat.name)})</span>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={selectedCategory.toLowerCase() === cat.name.toLowerCase()}
                            onChange={() => {
                              setSelectedCategory(selectedCategory.toLowerCase() === cat.name.toLowerCase() ? '' : cat.name);
                              setSelectedSubcategory('');
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="border-t border-gray-100 pt-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Brand</h4>
                    <div className="space-y-1.5">
                      {allBrands.map((brand) => (
                        <label key={brand} className="flex items-center justify-between text-xs py-1 px-1 rounded hover:bg-gray-50 cursor-pointer">
                          <span className={selectedBrands.some(b => normalizeBrandName(b) === normalizeBrandName(brand)) ? 'text-[#2d7d32] font-bold' : 'text-gray-700'}>
                            {brand}
                          </span>
                          <span className="text-[10px] text-gray-400">({getBrandCount(brand)})</span>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={selectedBrands.some(b => normalizeBrandName(b) === normalizeBrandName(brand))}
                            onChange={() => toggleBrand(brand)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="w-1/3 py-2.5 px-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors text-center cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileFilterOpen(false);
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-2.5 px-4 bg-[#2d7d32] hover:bg-[#1b5e20] text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors text-center cursor-pointer"
                  >
                    Apply ({filteredProducts.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= RIGHT MAIN AREA: Header + Product Grid ================= */}
          <main className="lg:col-span-3">
            
            {/* Top Bar: "X Products found" on Left + Sort & View Controls on Right */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              {/* Products Found Count & Mobile Filter Button */}
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-xl font-black text-gray-900 tracking-tight">
                  <span className="text-[#2d7d32]">{filteredProducts.length}</span> Products found
                </h2>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 bg-emerald-50 text-[#2d7d32] border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-2xs hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
                </button>
              </div>

              {/* Controls: Sort Dropdown + View Toggle Buttons */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative inline-flex items-center bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs font-semibold text-gray-700">
                  <span className="text-gray-500 mr-1.5 hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent focus:outline-none cursor-pointer pr-4 appearance-none font-bold text-gray-800"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="name-asc">Product Name (A-Z)</option>
                    <option value="brand-asc">Brand (A-Z)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                </div>

                {/* View Switcher: Grid vs List */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      viewMode === 'grid' 
                        ? 'bg-[#2d7d32] text-white shadow-xs' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      viewMode === 'list' 
                        ? 'bg-[#2d7d32] text-white shadow-xs' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Per-Page / Show All Products Switcher */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 text-xs shadow-2xs font-bold select-none">
                  <span className="text-gray-400 px-1.5 hidden sm:inline text-[11px]">Show:</span>
                  <button
                    type="button"
                    onClick={() => { setItemsPerPage(16); setCurrentPage(1); }}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer text-xs ${
                      itemsPerPage === 16 ? 'bg-[#2d7d32] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    16
                  </button>
                  <button
                    type="button"
                    onClick={() => { setItemsPerPage(32); setCurrentPage(1); }}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer text-xs ${
                      itemsPerPage === 32 ? 'bg-[#2d7d32] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    32
                  </button>
                  <button
                    type="button"
                    onClick={() => { setItemsPerPage('all'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-xs ${
                      itemsPerPage === 'all' ? 'bg-[#2d7d32] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All ({filteredProducts.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                <span className="text-xs text-gray-500 font-bold">Active Filters:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedBrands.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold">
                    Brand: {b}
                    <button onClick={() => toggleBrand(b)} className="hover:text-red-600"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-800 border border-gray-300 px-2.5 py-0.5 rounded-full font-semibold">
                    Search: &quot;{searchTerm}&quot;
                    <button onClick={() => setSearchTerm('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Zero State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
                <p className="text-gray-600 text-sm font-semibold mb-4">
                  No agricultural machinery found matching the selected filter criteria.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-[#2d7d32] hover:bg-[#1b5e20] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                {/* 4-Column Compact Product Cards Grid */}
                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4" : "space-y-4"}>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      layout="vertical"
                      onOpenSubsidy={(p) => {
                        setSelectedSubsidyProduct(p);
                        setSubsidyModalOpen(true);
                      }}
                      onOpenQuote={(p) => {
                        setSelectedQuoteProduct(p);
                        setQuoteModalOpen(true);
                      }}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs">
                    <div className="text-xs text-gray-500 font-medium">
                      Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCurrentPage(p => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1];
                          const showEllipsis = prev && p - prev > 1;
                          return (
                            <React.Fragment key={p}>
                              {showEllipsis && <span className="px-1 text-gray-400 text-xs">...</span>}
                              <button
                                onClick={() => {
                                  setCurrentPage(p);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                  currentPage === p
                                    ? 'bg-[#2d7d32] text-white shadow-xs'
                                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          );
                        })}

                      <button
                        onClick={() => {
                          setCurrentPage(p => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <SubsidyModal
        product={selectedSubsidyProduct}
        isOpen={subsidyModalOpen}
        onClose={() => setSubsidyModalOpen(false)}
      />

      <QuoteModal
        product={selectedQuoteProduct}
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">Loading Agrimart Products Catalogue...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
