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
  X
} from 'lucide-react';
import productsData from '@/data/import/products.json';
import categoriesData from '@/data/import/categories.json';
import { Product } from '@/types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'dealers' | 'enquiries'>('dashboard');
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const adminPageSize = 20;

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

  const products = productsData as unknown as Product[];
  const categories = categoriesData;

  // Mock enquiries
  const mockEnquiries = [
    { id: 'enq_1', name: 'Ramesh Patel', mobile: '9845012345', email: 'ramesh.p@gmail.com', type: 'Product Enquiry', subject: 'Kasei Brush Cutter KZ-5200', date: '28 Oct 2026', status: 'NEW' },
    { id: 'enq_2', name: 'Suresh Gowda', mobile: '9448123456', email: 'sgowda@farms.in', type: 'Dealer/Franchise', subject: 'Dealership Enquiry for Shimoga', date: '27 Oct 2026', status: 'CONTACTED' },
    { id: 'enq_3', name: 'Anand Kumar', mobile: '9731234567', email: 'anand@outlook.com', type: 'Service Enquiry', subject: 'Oleo-Mac 2T Oil Bulk Pack', date: '26 Oct 2026', status: 'RESOLVED' },
  ];

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
              {mockEnquiries.length}
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
                  <p className="text-2xl font-black text-blue-600 mt-1">{mockEnquiries.length}</p>
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
                    <p className="text-xs text-gray-500">Every authentic product extracted from agrimart.in with genuine photos & specs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/master_catalog_export.csv"
                      download="master_catalog_export.csv"
                      className="bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Download Master Catalog (CSV)</span>
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
                        <th className="px-4 py-3 text-right">Action</th>
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
                            <Link
                              href={`/products/${p.id}`}
                              target="_blank"
                              className="text-xs text-[#0d9749] hover:underline font-bold"
                            >
                              View Page →
                            </Link>
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
              <h1 className="text-xl font-bold text-gray-900 mb-4">Master Categories ({categories.length})</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-sm mb-2">{c.name}</h3>
                    <p className="text-gray-500 mb-2">Slug: <code className="text-green-700 font-mono">{c.slug}</code></p>
                    <div className="flex flex-wrap gap-1">
                      {c.subcategories.map((sub, sIdx) => (
                        <span key={sIdx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                          {sub}
                        </span>
                      ))}
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
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-4">Contact Enquiries ({mockEnquiries.length})</h1>
              <div className="space-y-3 text-xs">
                {mockEnquiries.map((enq) => (
                  <div key={enq.id} className="bg-white border rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">{enq.name}</h3>
                        <p className="text-gray-600">Mobile: <strong>+91 {enq.mobile}</strong> • Email: {enq.email}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-2 rounded">
                      <strong>{enq.type}:</strong> {enq.subject}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
