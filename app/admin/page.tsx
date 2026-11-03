'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  MessageSquare, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  LogOut,
  Handshake,
  Download,
  Search,
  Filter,
  RefreshCw,
  X,
  ExternalLink,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';
import productsData from '@/data/import/products.json';
import categoriesData from '@/data/import/categories.json';
import { Product } from '@/types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'dealers' | 'enquiries'>('dashboard');
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const adminPageSize = 20;

  // Products & Categories Live State
  const [products, setProducts] = useState<Product[]>(productsData as unknown as Product[]);
  const [categories, setCategories] = useState<any[]>(categoriesData);

  // Product Edit / Create Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<'basic' | 'pricing' | 'images' | 'specs' | 'desc'>('basic');
  const [editSpecs, setEditSpecs] = useState<Array<{ key: string; value: string }>>([]);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Category Edit / Create Modal State
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newSubcatInput, setNewSubcatInput] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [catSuccessMsg, setCatSuccessMsg] = useState<string | null>(null);

  // Sync with API on mount
  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch(e => console.error('API products load error:', e));

    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(e => console.error('API categories load error:', e));
  }, []);

  // Product Actions
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setIsNewProduct(false);
    setActiveEditTab('basic');
    setSaveSuccessMsg(null);
    setNewImageUrl('');
    
    const specsArr = Object.entries(p.specifications || {}).map(([key, value]) => ({
      key,
      value: String(value),
    }));
    setEditSpecs(specsArr);
    setEditImages(Array.isArray(p.images) && p.images.length > 0 ? [...p.images] : [p.thumbnailImage || '/assets/branding/logo.png']);
  };

  const handleOpenAddProduct = () => {
    const defaultCat = categories[0]?.name || 'POWER WEEDER & TILLERS';
    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: '',
      slug: '',
      riplCode: 'RIPL' + Math.floor(100000 + Math.random() * 900000),
      brand: 'AGRIMATE',
      category: defaultCat,
      subcategory: '',
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      currency: 'INR',
      taxInclusive: true,
      stockQuantity: 10,
      availability: 'In Stock',
      images: ['/assets/branding/logo.png'],
      thumbnailImage: '/assets/branding/logo.png',
      description: '',
      specifications: {
        'Engine Type': '4-Stroke, Air-Cooled',
        'Displacement': '212 cc',
        'Power': '7.0 HP',
        'Fuel Tank': '3.6 Litres',
        'Weight': '42 kg'
      },
      brochures: [],
      videos: [],
      accessories: [],
      spareParts: []
    };
    setEditingProduct(newProd);
    setIsNewProduct(true);
    setActiveEditTab('basic');
    setSaveSuccessMsg(null);
    setNewImageUrl('');
    setEditSpecs(Object.entries(newProd.specifications).map(([key, value]) => ({ key, value: String(value) })));
    setEditImages([...newProd.images]);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!editingProduct.riplCode.trim()) {
      alert('RIPL code is required');
      return;
    }

    setIsSavingProduct(true);
    setSaveSuccessMsg(null);

    const specsRecord: Record<string, string> = {};
    editSpecs.forEach(s => {
      if (s.key.trim()) {
        specsRecord[s.key.trim()] = s.value;
      }
    });

    const payload: Product = {
      ...editingProduct,
      slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      thumbnailImage: editImages[0] || editingProduct.thumbnailImage || '/assets/branding/logo.png',
      images: editImages.length > 0 ? editImages : [editingProduct.thumbnailImage || '/assets/branding/logo.png'],
      specifications: specsRecord,
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: isNewProduct ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        if (isNewProduct) {
          setProducts(prev => [data.product, ...prev]);
        } else {
          setProducts(prev => prev.map(p => p.id === data.product.id ? data.product : p));
        }
        setSaveSuccessMsg('Product saved successfully!');
        setTimeout(() => {
          setEditingProduct(null);
          setSaveSuccessMsg(null);
        }, 800);
      } else {
        alert('Error: ' + (data.error || 'Failed to save product'));
      }
    } catch (e: any) {
      alert('Network error: ' + e.message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        if (editingProduct?.id === id) {
          setEditingProduct(null);
        }
      } else {
        alert('Error deleting product: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Failed to delete product: ' + e.message);
    }
  };

  // Category Actions
  const handleOpenEditCategory = (c: any) => {
    setEditingCategory({
      ...c,
      subcategories: Array.isArray(c.subcategories) ? [...c.subcategories] : []
    });
    setIsNewCategory(false);
    setCatSuccessMsg(null);
    setNewSubcatInput('');
  };

  const handleOpenAddCategory = () => {
    setEditingCategory({
      id: `cat_${Date.now()}`,
      name: '',
      slug: '',
      icon: 'Layers',
      subcategories: [],
      count: 0,
      image: '/assets/branding/logo.png'
    });
    setIsNewCategory(true);
    setCatSuccessMsg(null);
    setNewSubcatInput('');
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    setIsSavingCategory(true);
    setCatSuccessMsg(null);

    const payload = {
      ...editingCategory,
      name: editingCategory.name.toUpperCase(),
      slug: editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };

    try {
      const res = await fetch('/api/admin/categories', {
        method: isNewCategory ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        if (isNewCategory) {
          setCategories(prev => [...prev, data.category]);
        } else {
          setCategories(prev => prev.map(c => c.id === data.category.id ? data.category : c));
        }
        setCatSuccessMsg('Category saved successfully!');
        setTimeout(() => {
          setEditingCategory(null);
          setCatSuccessMsg(null);
        }, 800);
      } else {
        alert('Error: ' + (data.error || 'Failed to save category'));
      }
    } catch (e: any) {
      alert('Network error: ' + e.message);
    } finally {
      setIsSavingCategory(false);
    }
  };

  // Dealer Applications State
  const [dealerApplications, setDealerApplications] = useState<any[]>([]);
  const [dealerSearch, setDealerSearch] = useState('');
  const [dealerStatusFilter, setDealerStatusFilter] = useState('ALL');
  const [selectedDealerApp, setSelectedDealerApp] = useState<any | null>(null);
  const [isLoadingDealers, setIsLoadingDealers] = useState(false);

  const fetchDealerApplications = async () => {
    setIsLoadingDealers(true);
    try {
      const res = await fetch('/api/partner-application');
      const data = await res.json();
      if (data.success && Array.isArray(data.applications)) {
        setDealerApplications(data.applications);
      }
    } catch (e) {
      console.error('Failed fetching dealer applications:', e);
    } finally {
      setIsLoadingDealers(false);
    }
  };

  useEffect(() => {
    fetchDealerApplications();
  }, []);

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/partner-application', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setDealerApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        if (selectedDealerApp && selectedDealerApp.id === id) {
          setSelectedDealerApp((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error('Failed updating status:', e);
    }
  };

  const exportDealerApplicationsCSV = () => {
    if (dealerApplications.length === 0) {
      alert('No dealer applications to export.');
      return;
    }
    const headers = ['Application ID', 'Date', 'Status', 'Full Name', 'Company Name', 'Business Type', 'Mobile', 'WhatsApp', 'Email', 'Address', 'City', 'State', 'Pincode', 'Years in Business', 'GSTIN', 'PAN', 'Categories', 'Message'];
    const rows = dealerApplications.map(a => [
      `"${a.id || ''}"`,
      `"${a.createdAt ? a.createdAt.slice(0, 10) : ''}"`,
      `"${a.status || ''}"`,
      `"${(a.fullName || '').replace(/"/g, '""')}"`,
      `"${(a.companyName || '').replace(/"/g, '""')}"`,
      `"${a.businessType || ''}"`,
      `"${a.phone || ''}"`,
      `"${a.whatsapp || ''}"`,
      `"${a.email || ''}"`,
      `"${(a.address || '').replace(/"/g, '""')}"`,
      `"${a.city || ''}"`,
      `"${a.state || ''}"`,
      `"${a.pincode || ''}"`,
      `"${a.yearsInBusiness || ''}"`,
      `"${a.gstin || ''}"`,
      `"${a.pan || ''}"`,
      `"${(a.categoriesOfInterest || []).join(', ')}"`,
      `"${(a.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrimart_dealer_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDealerApplications = dealerApplications.filter((app) => {
    const q = dealerSearch.toLowerCase();
    const matchSearch =
      !q ||
      app.fullName?.toLowerCase().includes(q) ||
      app.companyName?.toLowerCase().includes(q) ||
      app.city?.toLowerCase().includes(q) ||
      app.state?.toLowerCase().includes(q) ||
      app.phone?.includes(q) ||
      app.id?.toLowerCase().includes(q);

    const matchStatus = dealerStatusFilter === 'ALL' || app.status === dealerStatusFilter;
    return matchSearch && matchStatus;
  });

  // Customer Enquiries State
  const [enquiries, setEnquiries] = useState([
    { id: 'enq_1', name: 'Ramesh Patel', mobile: '9845012345', email: 'ramesh.p@gmail.com', type: 'Product Enquiry', subject: 'Kasei Brush Cutter KZ-5200', date: '28 Oct 2026', status: 'NEW', notes: 'Farmer inquiring about KZ-5200 stock & blade kit.' },
    { id: 'enq_2', name: 'Suresh Gowda', mobile: '9448123456', email: 'sgowda@farms.in', type: 'Dealer/Franchise', subject: 'Dealership Enquiry for Shimoga', date: '27 Oct 2026', status: 'CONTACTED', notes: 'Interested in becoming official retail partner.' },
    { id: 'enq_3', name: 'Anand Kumar', mobile: '9731234567', email: 'anand@outlook.com', type: 'Service Enquiry', subject: 'Oleo-Mac 2T Oil Bulk Pack', date: '26 Oct 2026', status: 'RESOLVED', notes: 'Bulk dispatch completed.' },
  ]);
  const [editingEnquiry, setEditingEnquiry] = useState<any | null>(null);
  const [isNewEnquiry, setIsNewEnquiry] = useState(false);

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      {/* Top Admin Nav */}
      <div className="bg-[#1e293b] text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image
              src="/assets/branding/logo.png"
              alt="Agrimart"
              width={140}
              height={40}
              className="h-8 w-auto object-contain brightness-125"
            />
          </Link>
          <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Admin Console
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <span className="text-gray-300">Logged in as: <strong>Admin User (Ratnagiri Impex)</strong></span>
          <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-56px)] p-4 space-y-1 text-xs font-semibold text-gray-700">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors ${
              activeTab === 'dashboard' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'products' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Products Catalogue</span>
            </div>
            <span className="bg-gray-200 text-gray-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'categories' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Categories & Subs</span>
            </div>
            <span className="bg-gray-200 text-gray-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dealers')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'dealers' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Handshake className="w-4 h-4" />
              <span>Dealer Applications</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
              {dealerApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'enquiries' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Contact Enquiries</span>
            </div>
            <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
              {enquiries.length}
            </span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 max-h-[calc(100vh-56px)] overflow-y-auto">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-xl font-bold text-gray-900">Executive Summary</h1>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Total Products</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{products.length}</p>
                  <span className="text-[11px] text-green-700 font-medium">Verified RIPL codes</span>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Categories</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{categories.length}</p>
                  <span className="text-[11px] text-green-700 font-medium">Catalog Segments</span>
                </div>
                <div
                  onClick={() => setActiveTab('dealers')}
                  className="bg-white p-5 rounded-lg border border-emerald-200 hover:border-emerald-500 cursor-pointer shadow-sm transition-all"
                >
                  <p className="text-xs text-emerald-800 font-semibold uppercase">Dealer Applications</p>
                  <p className="text-2xl font-black text-[#075C36] mt-1">{dealerApplications.length}</p>
                  <span className="text-[11px] text-emerald-700 font-medium">B2B Dealership Leads</span>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Customer Inquiries</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">{enquiries.length}</p>
                  <span className="text-[11px] text-blue-700 font-medium">Web & Mobile Leads</span>
                </div>
              </div>

              {/* Recent Orders / Enquiries */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm font-bold text-gray-900">Recent Inbound Submissions</h2>
                  <span className="text-xs text-slate-500">Live Inquiries & Applications</span>
                </div>
                <div className="divide-y divide-gray-100 text-xs">
                  {dealerApplications.slice(0, 3).map((d) => (
                    <div key={d.id} className="py-2.5 flex justify-between items-center bg-emerald-50/40 px-2 rounded my-1">
                      <div>
                        <p className="font-bold text-gray-900">
                          {d.fullName} — <span className="text-emerald-800 font-semibold">{d.companyName}</span> ({d.businessType || 'Dealership'})
                        </p>
                        <p className="text-gray-500 text-[11px]">
                          {d.city}, {d.state} • Ph: {d.phone} • {d.id}
                        </p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {d.status || 'NEW'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (() => {
            const filtered = products.filter(p => {
              if (!productSearch) return true;
              const q = productSearch.toLowerCase();
              return p.name.toLowerCase().includes(q) || 
                     p.riplCode.toLowerCase().includes(q) || 
                     p.brand.toLowerCase().includes(q) || 
                     p.category.toLowerCase().includes(q);
            });
            const totalAdminPages = Math.ceil(filtered.length / adminPageSize) || 1;
            const displayed = filtered.slice((productPage - 1) * adminPageSize, productPage * adminPageSize);

            return (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Products Catalogue ({products.length})</h1>
                    <p className="text-xs text-gray-500">Every authentic product with complete real-time edit, pricing & spec controls</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenAddProduct}
                      className="bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold px-3.5 py-2 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Product</span>
                    </button>
                    <a
                      href="/master_catalog_export.csv"
                      download="master_catalog_export.csv"
                      className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-500" />
                      <span>Export CSV</span>
                    </a>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4 flex items-center justify-between gap-4">
                  <input
                    type="text"
                    placeholder="Search by product name, RIPL code, brand, or category..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setProductPage(1);
                    }}
                    className="w-full max-w-md px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-600 focus:outline-none"
                  />
                  <div className="text-xs text-gray-500 font-semibold shrink-0">
                    Showing {displayed.length} of {filtered.length} products
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden text-xs">
                  <table className="w-full text-left divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-[11px]">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">RIPL Code</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayed.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 flex items-center gap-2">
                            <div className="w-8 h-8 relative rounded bg-gray-50 border shrink-0">
                              <Image src={p.thumbnailImage} alt={p.name} fill unoptimized className="object-contain p-0.5" />
                            </div>
                            <span className="font-semibold text-gray-900 max-w-xs truncate" title={p.name}>{p.name}</span>
                          </td>
                          <td className="px-4 py-2.5 font-mono font-bold text-gray-700">{p.riplCode}</td>
                          <td className="px-4 py-2.5 font-bold text-green-800">{p.brand}</td>
                          <td className="px-4 py-2.5 text-gray-600">{p.category}</td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0d9749] font-bold rounded border border-emerald-300 text-xs transition-colors cursor-pointer"
                                title="Edit Complete Product Details"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1 text-red-500 hover:bg-red-50 hover:text-red-700 rounded transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <Link
                                href={`/products/${p.id}`}
                                target="_blank"
                                className="p-1 text-gray-400 hover:text-[#0d9749] rounded transition-colors inline-flex items-center"
                                title="View Product Page"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Admin Pagination Controls */}
                {totalAdminPages > 1 && (
                  <div className="mt-4 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 text-xs">
                    <span className="text-gray-500">
                      Page <strong>{productPage}</strong> of <strong>{totalAdminPages}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setProductPage(p => Math.max(1, p - 1))}
                        disabled={productPage === 1}
                        className="px-2.5 py-1 rounded border bg-white disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setProductPage(p => Math.min(totalAdminPages, p + 1))}
                        disabled={productPage === totalAdminPages}
                        className="px-2.5 py-1 rounded border bg-white disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Master Categories ({categories.length})</h1>
                  <p className="text-xs text-gray-500">Manage catalog taxonomy, slugs, and associated subcategories</p>
                </div>
                <button
                  onClick={handleOpenAddCategory}
                  className="bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold px-3.5 py-2 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-sm">{c.name}</h3>
                        <button
                          onClick={() => handleOpenEditCategory(c)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0d9749] font-bold rounded border border-emerald-300 text-xs transition-colors cursor-pointer"
                          title="Edit Category & Subcategories"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <p className="text-gray-500 mb-2">Slug: <code className="text-green-700 font-mono">{c.slug}</code></p>
                      <div className="flex flex-wrap gap-1">
                        {c.subcategories.map((sub: string, sIdx: number) => (
                          <span key={sIdx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DEALER APPLICATIONS */}
          {activeTab === 'dealers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">Dealer & Partner Applications</h1>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      {dealerApplications.length} Total
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Official B2B channel network registrations submitted through the new Agrimart website.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchDealerApplications}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDealers ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={exportDealerApplicationsCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#075C36] hover:bg-[#064e2e] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by applicant name, company, city, state, or phone..."
                    value={dealerSearch}
                    onChange={(e) => setDealerSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {dealerSearch && (
                    <button
                      onClick={() => setDealerSearch('')}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={dealerStatusFilter}
                    onChange={(e) => setDealerStatusFilter(e.target.value)}
                    className="text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">NEW</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              {/* List / Table */}
              {filteredDealerApplications.length === 0 ? (
                <div className="bg-white border rounded-lg p-12 text-center text-gray-500">
                  <Handshake className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-semibold text-sm text-gray-700">No dealer applications match your filter</p>
                  <p className="text-xs text-gray-400 mt-1">Dealer applications submitted via /partner-registration will appear here in real time.</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Application ID</th>
                          <th className="py-3 px-4">Applicant / Contact</th>
                          <th className="py-3 px-4">Dealership / Firm</th>
                          <th className="py-3 px-4">Location</th>
                          <th className="py-3 px-4">Interests</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredDealerApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-gray-900">{app.id}</span>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-gray-900">{app.fullName}</p>
                              <p className="text-gray-500 text-[11px]">{app.phone}</p>
                              <p className="text-gray-400 text-[10px]">{app.email}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-gray-900">{app.companyName}</p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                                {app.businessType || 'Proprietorship'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-gray-900 font-medium">{app.city}, {app.state}</p>
                              <p className="text-gray-400 text-[10px]">{app.pincode}</p>
                            </td>
                            <td className="py-3 px-4 max-w-[180px]">
                              {app.categoriesOfInterest && app.categoriesOfInterest.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {app.categoriesOfInterest.slice(0, 2).map((c: string) => (
                                    <span key={c} className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                                      {c}
                                    </span>
                                  ))}
                                  {app.categoriesOfInterest.length > 2 && (
                                    <span className="text-[9px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                                      +{app.categoriesOfInterest.length - 2}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-[10px] italic">General Catalog</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                app.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                app.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                                app.status === 'CONTACTED' ? 'bg-purple-100 text-purple-800' :
                                app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedDealerApp(app)}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Detail Modal */}
              {selectedDealerApp && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                      <div>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                          {selectedDealerApp.id}
                        </span>
                        <h2 className="text-lg font-bold text-gray-900 mt-1">
                          {selectedDealerApp.companyName}
                        </h2>
                        <p className="text-xs text-gray-500">
                          Submitted on {new Date(selectedDealerApp.createdAt || Date.now()).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedDealerApp(null)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="py-4 space-y-4 text-xs">
                      {/* Status Update Control */}
                      <div className="p-3 bg-slate-50 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="font-bold text-gray-700">Application Status:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['NEW', 'UNDER_REVIEW', 'CONTACTED', 'APPROVED', 'REJECTED'].map((st) => (
                            <button
                              key={st}
                              onClick={() => updateApplicationStatus(selectedDealerApp.id, st)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                                selectedDealerApp.status === st
                                  ? 'bg-[#075C36] text-white shadow-xs'
                                  : 'bg-white border text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Contact Person</p>
                          <p className="font-bold text-gray-900 mt-1">{selectedDealerApp.fullName}</p>
                          <p className="text-gray-600">Mobile: {selectedDealerApp.phone}</p>
                          {selectedDealerApp.whatsapp && <p className="text-gray-600">WhatsApp: {selectedDealerApp.whatsapp}</p>}
                          <p className="text-gray-600">Email: {selectedDealerApp.email}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Firm Details</p>
                          <p className="font-bold text-gray-900 mt-1">{selectedDealerApp.businessType}</p>
                          <p className="text-gray-600">Experience: {selectedDealerApp.yearsInBusiness}</p>
                          {selectedDealerApp.gstin && <p className="text-gray-600">GSTIN: {selectedDealerApp.gstin}</p>}
                          {selectedDealerApp.pan && <p className="text-gray-600">PAN: {selectedDealerApp.pan}</p>}
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Physical Address</p>
                        <p className="text-gray-800 mt-1">{selectedDealerApp.address || 'Not provided'}</p>
                        <p className="text-gray-600">{selectedDealerApp.city}, {selectedDealerApp.state} - {selectedDealerApp.pincode}</p>
                      </div>

                      {selectedDealerApp.categoriesOfInterest && selectedDealerApp.categoriesOfInterest.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Categories of Interest</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedDealerApp.categoriesOfInterest.map((c: string) => (
                              <span key={c} className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedDealerApp.existingBrands && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Existing Brands Handled</p>
                          <p className="text-gray-700 bg-gray-50 p-2 rounded mt-1">{selectedDealerApp.existingBrands}</p>
                        </div>
                      )}

                      {selectedDealerApp.message && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Applicant Message</p>
                          <p className="text-gray-700 bg-gray-50 p-2.5 rounded mt-1 italic">
                            &ldquo;{selectedDealerApp.message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex justify-end">
                      <button
                        onClick={() => setSelectedDealerApp(null)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Contact Enquiries & Leads ({enquiries.length})</h1>
                  <p className="text-xs text-gray-500">Review, update status, record notes, and follow up with farmer and dealer leads</p>
                </div>
                <button
                  onClick={() => {
                    setEditingEnquiry({
                      id: `enq_${Date.now()}`,
                      name: '',
                      mobile: '',
                      email: '',
                      type: 'Product Enquiry',
                      subject: '',
                      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                      status: 'NEW',
                      notes: ''
                    });
                    setIsNewEnquiry(true);
                  }}
                  className="bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold px-3.5 py-2 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Log New Lead / Inquiry</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="bg-white border rounded-lg p-5 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-gray-900">{enq.name}</h3>
                          <span className="text-[10px] text-gray-400 font-mono">({enq.date})</span>
                        </div>
                        <p className="text-gray-600 mt-0.5">
                          Mobile: <strong className="text-gray-900">+91 {enq.mobile}</strong> {enq.email ? `• Email: ${enq.email}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Interactive Status Selector */}
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-gray-500 font-semibold">Status:</span>
                          <select
                            value={enq.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setEnquiries(prev => prev.map(item => item.id === enq.id ? { ...item, status: newStatus } : item));
                            }}
                            className={`text-xs font-bold px-2.5 py-1 rounded border cursor-pointer focus:outline-none ${
                              enq.status === 'NEW' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              enq.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              enq.status === 'CONTACTED' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                              enq.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            <option value="NEW">NEW</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </div>

                        <button
                          onClick={() => {
                            setEditingEnquiry({ ...enq });
                            setIsNewEnquiry(false);
                          }}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200 transition-colors"
                          title="Edit Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete inquiry from ${enq.name}?`)) {
                              setEnquiries(prev => prev.filter(item => item.id !== enq.id));
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                      <p className="text-gray-800">
                        <strong className="text-gray-900">{enq.type}:</strong> {enq.subject}
                      </p>
                    </div>

                    {/* Internal Follow-up Notes */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add quick follow-up note (e.g. called farmer, demo scheduled)..."
                        value={enq.notes || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEnquiries(prev => prev.map(item => item.id === enq.id ? { ...item, notes: val } : item));
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="text-[10px] text-gray-400 font-semibold shrink-0">Auto-saved</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Enquiry Edit / Add Modal */}
          {editingEnquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
                  <h2 className="text-base font-bold text-white">
                    {isNewEnquiry ? 'Log New Inquiry' : `Edit Lead: ${editingEnquiry.name}`}
                  </h2>
                  <button
                    onClick={() => setEditingEnquiry(null)}
                    className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Customer / Farmer Name *</label>
                    <input
                      type="text"
                      value={editingEnquiry.name}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Mobile Number *</label>
                      <input
                        type="text"
                        value={editingEnquiry.mobile}
                        onChange={(e) => setEditingEnquiry({ ...editingEnquiry, mobile: e.target.value })}
                        placeholder="9845012345"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editingEnquiry.email}
                        onChange={(e) => setEditingEnquiry({ ...editingEnquiry, email: e.target.value })}
                        placeholder="customer@gmail.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Inquiry Type</label>
                      <select
                        value={editingEnquiry.type}
                        onChange={(e) => setEditingEnquiry({ ...editingEnquiry, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Product Enquiry">Product Enquiry</option>
                        <option value="Dealer/Franchise">Dealer/Franchise</option>
                        <option value="Service Enquiry">Service Enquiry</option>
                        <option value="Subsidy Guidance">Subsidy Guidance</option>
                        <option value="Bulk Order">Bulk Order</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Status</label>
                      <select
                        value={editingEnquiry.status}
                        onChange={(e) => setEditingEnquiry({ ...editingEnquiry, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subject / Requirement *</label>
                    <textarea
                      rows={3}
                      value={editingEnquiry.subject}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, subject: e.target.value })}
                      placeholder="Requirement description..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Follow-up Notes</label>
                    <textarea
                      rows={2}
                      value={editingEnquiry.notes || ''}
                      onChange={(e) => setEditingEnquiry({ ...editingEnquiry, notes: e.target.value })}
                      placeholder="Internal team notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingEnquiry(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingEnquiry.name.trim() || !editingEnquiry.subject.trim()) {
                        alert('Customer name and requirement are required');
                        return;
                      }
                      if (isNewEnquiry) {
                        setEnquiries(prev => [editingEnquiry, ...prev]);
                      } else {
                        setEnquiries(prev => prev.map(item => item.id === editingEnquiry.id ? editingEnquiry : item));
                      }
                      setEditingEnquiry(null);
                    }}
                    className="px-5 py-2 bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {isNewEnquiry ? 'Log Inquiry' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* COMPLETE PRODUCT EDIT / CREATE MODAL */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Top Header */}
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                        {isNewProduct ? 'New Catalogue Entry' : 'Complete Edit Mode'}
                      </span>
                      <span className="text-xs text-gray-400 font-mono font-bold">
                        {editingProduct.riplCode || 'NO CODE'}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white mt-1 line-clamp-1">
                      {isNewProduct ? 'Create New Machinery Product' : editingProduct.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Navigation Tabs */}
                <div className="bg-gray-100 border-b border-gray-200 px-6 flex items-center gap-2 overflow-x-auto shrink-0 text-xs font-bold">
                  <button
                    onClick={() => setActiveEditTab('basic')}
                    className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                      activeEditTab === 'basic' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    1. General & Brand
                  </button>
                  <button
                    onClick={() => setActiveEditTab('pricing')}
                    className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                      activeEditTab === 'pricing' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    2. Pricing & Stock
                  </button>
                  <button
                    onClick={() => setActiveEditTab('images')}
                    className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                      activeEditTab === 'images' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    3. Photos & Media ({editImages.length})
                  </button>
                  <button
                    onClick={() => setActiveEditTab('specs')}
                    className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                      activeEditTab === 'specs' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    4. Technical Specs ({editSpecs.length})
                  </button>
                  <button
                    onClick={() => setActiveEditTab('desc')}
                    className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                      activeEditTab === 'desc' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    5. Description & Overview
                  </button>
                </div>

                {/* Modal Tab Content (Scrollable) */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
                  {/* TAB 1: BASIC INFO */}
                  {activeEditTab === 'basic' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Product Name / Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          placeholder="e.g. BV 250 - BLOWER – HANDHELD"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            RIPL Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={editingProduct.riplCode}
                            onChange={(e) => setEditingProduct({ ...editingProduct, riplCode: e.target.value })}
                            placeholder="e.g. RIPL037328"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Model Number
                          </label>
                          <input
                            type="text"
                            value={(editingProduct as any).modelNumber || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, modelNumber: e.target.value } as any)}
                            placeholder="e.g. BV 250"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Brand <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={editingProduct.brand}
                            onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-emerald-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="AGRIMATE">AGRIMATE</option>
                            <option value="KASEI">KASEI</option>
                            <option value="OLEO-MAC">OLEO-MAC</option>
                            <option value="GREEN PANTHER">GREEN PANTHER</option>
                            <option value="KAWASAKI">KAWASAKI</option>
                            <option value="SUBARU">SUBARU</option>
                            <option value="HONDA">HONDA</option>
                            <option value="MTD">MTD</option>
                            <option value="STIGA">STIGA</option>
                            <option value="RATNAGIRI">RATNAGIRI</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => {
                              const newCat = e.target.value;
                              const matched = categories.find(c => c.name === newCat);
                              setEditingProduct({ 
                                ...editingProduct, 
                                category: newCat,
                                subcategory: matched?.subcategories?.[0] || ''
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Subcategory
                          </label>
                          <input
                            type="text"
                            value={editingProduct.subcategory || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                            placeholder="e.g. Petrol Mistblower"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            URL Slug
                          </label>
                          <input
                            type="text"
                            value={editingProduct.slug || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                            placeholder="bv-250-blower-handheld"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono text-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PRICING & INVENTORY */}
                  {activeEditTab === 'pricing' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            MRP (₹)
                          </label>
                          <input
                            type="number"
                            value={editingProduct.mrp || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Selling Price (₹)
                          </label>
                          <input
                            type="number"
                            value={editingProduct.sellingPrice || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            value={editingProduct.discountPercentage || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, discountPercentage: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Stock Quantity
                          </label>
                          <input
                            type="number"
                            value={editingProduct.stockQuantity ?? 10}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Availability Status
                          </label>
                          <select
                            value={editingProduct.availability || 'In Stock'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, availability: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                            <option value="Available on Order">Available on Order</option>
                            <option value="Coming Soon">Coming Soon</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PHOTOS & MEDIA */}
                  {activeEditTab === 'images' && (
                    <div className="space-y-5">
                      {/* Primary Thumbnail */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block font-bold text-gray-800 mb-1">
                          Primary Thumbnail Photo
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 relative bg-white rounded border border-gray-300 overflow-hidden shrink-0">
                            <Image
                              src={editingProduct.thumbnailImage || '/assets/branding/logo.png'}
                              alt="Thumbnail"
                              fill
                              unoptimized
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={editingProduct.thumbnailImage || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, thumbnailImage: e.target.value })}
                              placeholder="/assets/products/ripl037328/img_1.jpg"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <p className="text-[11px] text-gray-500 mt-1">
                              Appears in catalog listings and search previews.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Images */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-bold text-gray-800">
                            Product Gallery Images ({editImages.length})
                          </label>
                        </div>

                        {/* Add New Gallery Image input */}
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            placeholder="Enter image URL (e.g. /assets/products/...)"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newImageUrl.trim()) {
                                setEditImages([...editImages, newImageUrl.trim()]);
                                setNewImageUrl('');
                              }
                            }}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors shrink-0"
                          >
                            + Add Image
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {editImages.map((imgUrl, iIdx) => (
                            <div key={iIdx} className="relative group bg-white border border-gray-200 rounded-lg p-2 flex flex-col items-center">
                              <div className="w-full h-24 relative bg-gray-50 rounded overflow-hidden mb-1">
                                <Image
                                  src={imgUrl}
                                  alt={`Gallery ${iIdx + 1}`}
                                  fill
                                  unoptimized
                                  className="object-contain p-1"
                                />
                              </div>
                              <span className="text-[10px] text-gray-500 truncate w-full font-mono text-center mb-1">
                                {imgUrl.split('/').pop()}
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditImages(editImages.filter((_, idx) => idx !== iIdx))}
                                className="w-full py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-bold transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: TECHNICAL SPECIFICATIONS */}
                  {activeEditTab === 'specs' && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-900 text-xs">
                        <p className="font-bold">Comprehensive Machinery Specifications</p>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          Add or adjust technical attributes (Engine Displacement, HP, Cutting Width, Weight, Tank Capacity, Fuel Ratio, etc.) shown on the product detail page.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {editSpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <input
                              type="text"
                              value={spec.key}
                              placeholder="Spec Name (e.g. Engine Type)"
                              onChange={(e) => {
                                const copy = [...editSpecs];
                                copy[sIdx].key = e.target.value;
                                setEditSpecs(copy);
                              }}
                              className="w-1/3 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <input
                              type="text"
                              value={spec.value}
                              placeholder="Spec Value (e.g. 2-Stroke, 51.7 cc)"
                              onChange={(e) => {
                                const copy = [...editSpecs];
                                copy[sIdx].value = e.target.value;
                                setEditSpecs(copy);
                              }}
                              className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => setEditSpecs(editSpecs.filter((_, idx) => idx !== sIdx))}
                              className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded transition-colors"
                              title="Delete this specification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditSpecs([...editSpecs, { key: '', value: '' }])}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Specification Field</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 5: DESCRIPTION */}
                  {activeEditTab === 'desc' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Product Overview & Marketing Description
                        </label>
                        <textarea
                          rows={10}
                          value={editingProduct.description || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          placeholder="Provide detailed description, farming benefits, warranty information, and package contents..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Sticky Bottom Action Bar */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
                  <div>
                    {!isNewProduct && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(editingProduct.id, editingProduct.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Product</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {saveSuccessMsg && (
                      <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{saveSuccessMsg}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProduct}
                      disabled={isSavingProduct}
                      className="px-5 py-2 bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingProduct ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>{isNewProduct ? 'Create Product' : 'Save Changes'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPLETE CATEGORY EDIT / CREATE MODAL */}
          {editingCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
                  <h2 className="text-base font-bold text-white">
                    {isNewCategory ? 'Add New Category' : `Edit Category: ${editingCategory.name}`}
                  </h2>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      placeholder="e.g. POWER WEEDER & TILLERS"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={editingCategory.slug}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                      placeholder="e.g. power-weeder-tillers"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono text-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Subcategories ({editingCategory.subcategories?.length || 0})
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add subcategory name..."
                        value={newSubcatInput}
                        onChange={(e) => setNewSubcatInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSubcatInput.trim()) {
                            setEditingCategory({
                              ...editingCategory,
                              subcategories: [...(editingCategory.subcategories || []), newSubcatInput.trim()]
                            });
                            setNewSubcatInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs transition-colors shrink-0"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-gray-50 rounded border border-gray-200">
                      {(editingCategory.subcategories || []).map((sub: string, sIdx: number) => (
                        <span
                          key={sIdx}
                          className="bg-white border border-gray-300 text-gray-800 px-2 py-0.5 rounded text-[11px] flex items-center gap-1.5"
                        >
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingCategory.subcategories.filter((_: any, idx: number) => idx !== sIdx);
                              setEditingCategory({ ...editingCategory, subcategories: updated });
                            }}
                            className="text-gray-400 hover:text-red-500 font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(!editingCategory.subcategories || editingCategory.subcategories.length === 0) && (
                        <span className="text-gray-400 italic text-[11px]">No subcategories defined</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
                  {catSuccessMsg ? (
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{catSuccessMsg}</span>
                    </span>
                  ) : <span />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCategory}
                      disabled={isSavingCategory}
                      className="px-5 py-2 bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingCategory ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>{isNewCategory ? 'Create Category' : 'Save Changes'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
