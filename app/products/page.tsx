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

function matchSubcategory(product: Product, subcategory: string): boolean {
  if (!subcategory) return true;
  if (product.subcategory && product.subcategory.toLowerCase() === subcategory.toLowerCase()) {
    return true;
  }

  const subLower = subcategory.toLowerCase().trim();
  const text = `${product.name} ${product.description || ''} ${product.category}`.toLowerCase();

  // 1. Direct substring
  if (text.includes(subLower)) return true;

  // 2. Power source keywords
  const isPetrol = ['petrol', 'gasoline', '2-stroke', '4-stroke', '2 stroke', '4 stroke', ' 2s', ' 4s', ' 2t', 'cc ', 'displacement', 'engine'].some(w => text.includes(w));
  const isElectricOrBattery = ['electric', 'motor', '220v', 'voltage', ' kw', 'battery', 'cordless', 'li-ion', '12v', '24v', 'rechargeable'].some(w => text.includes(w));
  const isDiesel = text.includes('diesel');
  const isManual = text.includes('manual');
  const isAccessory = ['accessory', 'accessories', 'spare', 'spares', 'attachment', 'drill bit', 'blade', 'duster kit', 'pipe', 'hose', 'gun', 'kit'].some(w => text.includes(w));

  // If subcategory has "Two-stroke" or "2-stroke" or "2S"
  if (subLower.includes('two-stroke') || subLower.includes('2-stroke') || subLower.includes('2s')) {
    return text.includes('2-stroke') || text.includes('2 stroke') || text.includes('2s') || text.includes('2t') || (isPetrol && !text.includes('4-stroke') && !text.includes('4 stroke') && !text.includes('4s'));
  }
  // If subcategory has "Four-stroke" or "4-stroke" or "4S"
  if (subLower.includes('four-stroke') || subLower.includes('4-stroke') || subLower.includes('4s')) {
    return text.includes('4-stroke') || text.includes('4 stroke') || text.includes('4s');
  }

  // If subcategory specifies Petrol
  if (subLower.includes('petrol')) {
    return isPetrol;
  }
  // If subcategory specifies Electric or Battery
  if (subLower.includes('electric') || subLower.includes('battery')) {
    return isElectricOrBattery;
  }
  // If subcategory specifies Diesel
  if (subLower.includes('diesel')) {
    return isDiesel;
  }
  // If subcategory specifies Manual
  if (subLower.includes('manual')) {
    return isManual;
  }
  // If subcategory specifies Accessories / Spares
  if (['accessories', 'spares', 'attachments', 'blades', 'fittings'].some(w => subLower.includes(w))) {
    return isAccessory;
  }

  // Two men / One man earth auger
  if (subLower.includes('two men') || subLower.includes('2 men')) {
    return text.includes('2 men') || text.includes('two men') || text.includes('2m-');
  }
  if (subLower.includes('one man') || subLower.includes('single man')) {
    return !text.includes('2 men') && !text.includes('two men') && !text.includes('2m-');
  }

  // Token matching for specific names (e.g., "Tea Harvester", "Coffee", "Paddy", etc.)
  const tokens = subLower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length >= 3 && !['the', 'and', 'with', 'out', 'for', 'type', 'series'].includes(t));
  if (tokens.length > 0) {
    const matches = tokens.map(t => text.includes(t));
    if (matches.every(Boolean)) return true;
    if (matches.filter(Boolean).length >= Math.ceil(tokens.length * 0.7)) return true;
  }

  return false;
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
  const [expandedCategory, setExpandedCategory] = useState<string>('');

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
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(30);

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
    if (cat) setExpandedCategory(cat);
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
      setExpandedCategory('');
      setSelectedBrands([]);
      setSelectedCapacities([]);
      setSelectedPowerSources([]);
      setSearchTerm('');
      setCurrentPage(1);
    };
    window.addEventListener('agrimart-reset-products', handleReset);
    return () => window.removeEventListener('agrimart-reset-products', handleReset);
  }, []);

  const allBrands = ['KASEI', 'OLEO MAC', 'AGRIMATE', 'GREEN PANTHER'];
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
      if (selectedSubcategory && !matchSubcategory(p, selectedSubcategory)) {
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
      <div className="agri-container">
        
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
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr] gap-6 items-start">
          
          {/* ================= DESKTOP SIDEBAR: Authentic MyCategories & Brands ================= */}
          <aside className="hidden lg:block sticky top-[155px] z-30 max-h-[calc(100vh-175px)] overflow-y-auto pr-1 select-none">
            
            {/* Box 1: MyCategories */}
            <div className="border border-[#4d8504] shadow-xs bg-[#558f04] overflow-hidden">
              {/* Header: MyCategories */}
              <div className="bg-[#63b16b] text-white px-3.5 py-2.5 flex items-center justify-between font-bold text-[14px] tracking-wide select-none">
                <span>MyCategories</span>
                {(selectedCategory || selectedSubcategory) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedSubcategory('');
                      setExpandedCategory('');
                      setCurrentPage(1);
                    }}
                    className="text-[11px] font-normal underline text-white/90 hover:text-white cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Categories List */}
              <div className="divide-y divide-[#579304]">
                {categoriesData.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  const isExpanded = expandedCategory.toLowerCase() === cat.name.toLowerCase();

                  return (
                    <div key={cat.id} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected && !selectedSubcategory) {
                            setSelectedCategory('');
                            setSelectedSubcategory('');
                            setExpandedCategory('');
                          } else {
                            setSelectedCategory(cat.name);
                            setSelectedSubcategory('');
                            setExpandedCategory(cat.name);
                          }
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 text-[12px] font-bold uppercase tracking-tight text-white border-b border-[#579304] flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#317e00]'
                            : 'bg-gradient-to-b from-[#64a507] to-[#558f04] hover:from-[#71b608] hover:to-[#5c9805]'
                        }`}
                      >
                        <span className="truncate pr-1">{cat.name}</span>
                      </button>

                      {/* Nested Subcategories Accordion */}
                      {isExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="bg-[#337e04] border-b border-[#255f02]">
                          {cat.subcategories.map((sub: string) => {
                            const isSubActive = selectedSubcategory.toLowerCase() === sub.toLowerCase();
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => {
                                  setSelectedSubcategory(isSubActive ? '' : sub);
                                  setCurrentPage(1);
                                }}
                                className={`w-full text-left py-2 px-5 text-[11px] font-medium text-white/95 border-b border-[#255f02]/70 flex items-center justify-between transition-colors hover:bg-[#3c9006] hover:border-l-4 hover:border-white cursor-pointer ${
                                  isSubActive ? 'bg-[#255f02] border-l-4 border-yellow-300 font-bold text-yellow-200' : ''
                                }`}
                              >
                                <span className="truncate">{sub}</span>
                                {isSubActive && <Check className="w-3 h-3 text-yellow-300 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Box 2: Brands */}
            <div className="mt-3 border border-[#4d8504] shadow-xs bg-[#558f04] overflow-hidden">
              {/* Header: Brands */}
              <div className="bg-[#63b16b] text-white px-3.5 py-2.5 flex items-center justify-between font-bold text-[14px] tracking-wide select-none">
                <span>Brands</span>
                {selectedBrands.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBrands([]);
                      setCurrentPage(1);
                    }}
                    className="text-[11px] font-normal underline text-white/90 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Brands List */}
              <div className="divide-y divide-[#579304]">
                {allBrands.map((brand) => {
                  const isChecked = selectedBrands.some(b => normalizeBrandName(b) === normalizeBrandName(brand));
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => toggleBrand(brand)}
                      className={`w-full text-left px-3 py-2 text-[12px] font-bold uppercase tracking-tight text-white border-b border-[#579304] flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#317e00]'
                          : 'bg-gradient-to-b from-[#64a507] to-[#558f04] hover:from-[#71b608] hover:to-[#5c9805]'
                      }`}
                    >
                      <span>{brand}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* ================= MOBILE FILTER SLIDE-OVER DRAWER ================= */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-sm h-full bg-[#f8fafc] shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-[#4d8504] flex items-center justify-between bg-[#63b16b] text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white" />
                    <h3 className="font-extrabold text-sm text-white">Filter Products</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded text-white/80 hover:text-white hover:bg-black/10 cursor-pointer"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Items Scroll Area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {/* Category Box */}
                  <div className="border border-[#4d8504] shadow-xs bg-[#558f04] overflow-hidden rounded-xs">
                    <div className="bg-[#63b16b] text-white px-3 py-2 font-bold text-xs uppercase tracking-wide flex items-center justify-between">
                      <span>MyCategories</span>
                      {selectedCategory && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('');
                            setSelectedSubcategory('');
                            setExpandedCategory('');
                          }}
                          className="text-[10px] underline font-normal text-white/90"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-[#579304]">
                      {categoriesData.map((cat) => {
                        const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                        const isExpanded = expandedCategory.toLowerCase() === cat.name.toLowerCase();

                        return (
                          <div key={cat.id}>
                            <button
                              type="button"
                              onClick={() => {
                                if (isSelected && !selectedSubcategory) {
                                  setSelectedCategory('');
                                  setSelectedSubcategory('');
                                  setExpandedCategory('');
                                } else {
                                  setSelectedCategory(cat.name);
                                  setSelectedSubcategory('');
                                  setExpandedCategory(cat.name);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-bold uppercase text-white flex items-center justify-between ${
                                isSelected ? 'bg-[#317e00]' : 'bg-gradient-to-b from-[#64a507] to-[#558f04]'
                              }`}
                            >
                              <span className="truncate pr-1">{cat.name}</span>
                            </button>

                            {isExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                              <div className="bg-[#337e04]">
                                {cat.subcategories.map((sub: string) => {
                                  const isSubActive = selectedSubcategory.toLowerCase() === sub.toLowerCase();
                                  return (
                                    <button
                                      key={sub}
                                      type="button"
                                      onClick={() => setSelectedSubcategory(isSubActive ? '' : sub)}
                                      className={`w-full text-left py-2 px-5 text-[11px] text-white/95 border-b border-[#255f02]/70 flex items-center justify-between ${
                                        isSubActive ? 'bg-[#255f02] border-l-4 border-yellow-300 font-bold text-yellow-200' : ''
                                      }`}
                                    >
                                      <span className="truncate">{sub}</span>
                                      {isSubActive && <Check className="w-3 h-3 text-yellow-300" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Brand Box */}
                  <div className="border border-[#4d8504] shadow-xs bg-[#558f04] overflow-hidden rounded-xs">
                    <div className="bg-[#63b16b] text-white px-3 py-2 font-bold text-xs uppercase tracking-wide flex items-center justify-between">
                      <span>Brands</span>
                      {selectedBrands.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedBrands([])}
                          className="text-[10px] underline font-normal text-white/90"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-[#579304]">
                      {allBrands.map((brand) => {
                        const isChecked = selectedBrands.some(b => normalizeBrandName(b) === normalizeBrandName(brand));
                        return (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => toggleBrand(brand)}
                            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase text-white flex items-center justify-between ${
                              isChecked ? 'bg-[#317e00]' : 'bg-gradient-to-b from-[#64a507] to-[#558f04]'
                            }`}
                          >
                            <span>{brand}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="w-1/3 py-2 px-3 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors text-center cursor-pointer"
                  >
                    Reset All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileFilterOpen(false);
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-2 px-4 bg-[#0d9749] hover:bg-[#097b3a] text-white rounded text-xs font-extrabold shadow-sm transition-colors text-center cursor-pointer"
                  >
                    Show ({filteredProducts.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= RIGHT MAIN AREA: Header + Product Grid ================= */}
          <main className="w-full min-w-0">
            
            {/* Top Bar: "X Products found" on Left + Sort & View Controls on Right */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              {/* Products Found Count & Mobile Filter Button */}
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-xl font-black text-gray-900 tracking-tight">
                  <span className="text-[#0d9749]">{filteredProducts.length}</span> Products found
                </h2>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 bg-emerald-50 text-[#0d9749] border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-2xs hover:bg-emerald-100 transition-colors cursor-pointer"
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
                        ? 'bg-[#0d9749] text-white shadow-xs' 
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
                        ? 'bg-[#0d9749] text-white shadow-xs' 
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
                    onClick={() => { setItemsPerPage(30); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-xs ${
                      itemsPerPage === 30 ? 'bg-[#0d9749] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    30
                  </button>
                  <button
                    type="button"
                    onClick={() => { setItemsPerPage(60); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-xs ${
                      itemsPerPage === 60 ? 'bg-[#0d9749] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    60
                  </button>
                  <button
                    type="button"
                    onClick={() => { setItemsPerPage('all'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-xs ${
                      itemsPerPage === 'all' ? 'bg-[#0d9749] text-white' : 'text-gray-600 hover:text-gray-900'
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
                  className="bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                {/* 3-Column Product Cards Grid (Strictly 3 cards per row on all desktop & laptop screens) */}
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6" : "space-y-4"}>
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
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      Showing{' '}
                      <span className="font-bold text-gray-900">
                        {typeof itemsPerPage === 'number' ? (currentPage - 1) * itemsPerPage + 1 : 1}
                      </span>
                      {'–'}
                      <span className="font-bold text-gray-900">
                        {typeof itemsPerPage === 'number'
                          ? Math.min(currentPage * itemsPerPage, filteredProducts.length)
                          : filteredProducts.length}
                      </span>{' '}
                      of <span className="font-bold text-gray-900">{filteredProducts.length}</span> Products • Page{' '}
                      <span className="font-bold text-[#0d9749]">{currentPage}</span> of{' '}
                      <span className="font-bold text-gray-900">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                        aria-label="Previous Page"
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1];
                          const showEllipsis = prev && p - prev > 1;
                          return (
                            <React.Fragment key={p}>
                              {showEllipsis && <span className="px-1 text-gray-400 font-bold text-xs select-none">...</span>}
                              <button
                                onClick={() => {
                                  setCurrentPage(p);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                  currentPage === p
                                    ? 'bg-[#0d9749] text-white shadow-sm shadow-green-600/30 scale-105'
                                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                                aria-label={`Go to page ${p}`}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          );
                        })}

                      <button
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0d9749] text-white hover:bg-[#097b3a] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                        aria-label="Next Page"
                      >
                        <span>Next Page</span>
                        <span>→</span>
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
