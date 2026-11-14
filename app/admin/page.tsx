'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
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
  AlertCircle,
  Home,
  Building2,
  Sparkles,
  Globe,
  Database,
  Phone,
  MapPin,
  Mail,
  Clock,
  Key,
  Lock,
  ShieldCheck,
  EyeOff
} from 'lucide-react';
import productsData from '@/data/import/products.json';
import categoriesData from '@/data/import/categories.json';
import { 
  DEFAULT_HOMEPAGE_CMS, 
  DEFAULT_ABOUTUS_CMS,
  DEFAULT_CONTACTUS_CMS,
  DEFAULT_FOOTER_CMS,
  ContactUsCmsData,
  FooterCmsData,
  SectionHeaderCms,
  BrandCmsItem,
  TopPickCmsItem,
  FeaturedProductCmsItem,
  AwardCmsItem,
  TestingInstituteCmsItem,
  AppDownloadCmsData
} from '@/lib/cmsDefaults';
import { Product } from '@/types';
import { AdminImageUploader, AdminGalleryUploader } from '@/components/AdminImageUploader';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'dealers' | 'enquiries' | 'homepage' | 'aboutus' | 'contactus' | 'footer' | 'security'>('dashboard');
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const adminPageSize = 20;

  // PostgreSQL Connection Health State
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    database?: string;
    host?: string;
    port?: number;
    error?: string;
  } | null>(null);

  // Products & Categories Live State
  const [products, setProducts] = useState<Product[]>(productsData as unknown as Product[]);
  const [categories, setCategories] = useState<any[]>(categoriesData);

  // Home Page CMS State
  const [homeHeroBanners, setHomeHeroBanners] = useState(DEFAULT_HOMEPAGE_CMS.heroBanners);
  const [homePromoBanners, setHomePromoBanners] = useState(DEFAULT_HOMEPAGE_CMS.promoBanners);
  const [homeCategoriesSection, setHomeCategoriesSection] = useState<SectionHeaderCms>(
    DEFAULT_HOMEPAGE_CMS.categoriesSection || {
      badge: 'BROWSE OUR RANGE',
      title: 'Shop by Category',
      subtitle: 'Explore our comprehensive selection of agricultural and gardening machinery designed for precision, durability, and top performance.',
    }
  );
  const [homeBrandsSection, setHomeBrandsSection] = useState(
    DEFAULT_HOMEPAGE_CMS.brandsSection || {
      header: {
        badge: 'WORLD-CLASS MACHINERY BRANDS',
        title: 'Our Trusted In-House & Global Brands',
        subtitle: 'Engineered for performance, trusted by farmers across India. Explore machinery from world-renowned agricultural manufacturers.',
      },
      brands: [],
    }
  );
  const [homeTopPicksSection, setHomeTopPicksSection] = useState(
    DEFAULT_HOMEPAGE_CMS.topPicksSection || {
      header: {
        badge: 'CURATED SELECTION',
        title: "Agrimart's Top Picks",
        subtitle: 'Explore flagship machinery built for peak agricultural performance, durability, and reliability in Indian conditions.',
      },
      picks: [],
    }
  );
  const [homeFeaturedSection, setHomeFeaturedSection] = useState(
    DEFAULT_HOMEPAGE_CMS.featuredProductsSection || {
      header: {
        badge: 'TOP SELLING MACHINERY',
        title: 'Featured Agricultural Products',
        subtitle: 'Discover high-demand farm machinery engineered for modern Indian agriculture — field-tested, certified, and subsidy-approved across states.',
      },
      products: [],
    }
  );
  const [homeAwardsSection, setHomeAwardsSection] = useState(
    DEFAULT_HOMEPAGE_CMS.awardsSection || {
      header: {
        badge: 'EXCELLENCE RECOGNIZED',
        title: 'Awards & Industry Recognition',
        subtitle: 'Over two decades of recognized excellence in agricultural technology and equipment distribution across India and Asia.',
      },
      awards: [],
    }
  );
  const [homeInstitutesSection, setHomeInstitutesSection] = useState(
    DEFAULT_HOMEPAGE_CMS.institutesSection || {
      header: {
        badge: 'GOVERNMENT CERTIFIED & APPROVED',
        title: 'Tested by India’s Premier Agricultural Institutes',
        subtitle: 'Our machinery is tested, verified, and certified by government farm machinery testing centers and state agricultural universities nationwide.',
      },
      institutes: [],
    }
  );
  const [homeAppBanner, setHomeAppBanner] = useState<AppDownloadCmsData>(
    DEFAULT_HOMEPAGE_CMS.appBanner || {
      title: 'Download Agrimart Mobile App — Get every farming solution in one place',
      subtitle: 'Available on Android and iOS',
      bannerImage: '/assets/banners/app_download_banner_hd.png',
      googlePlayLink: 'https://play.google.com/store/apps/details?id=com.invenzo.ratnagiri&hl=en_IN&gl=US&pli=1',
      appStoreLink: 'https://apps.apple.com/in/app/agrimart/id1599062786',
    }
  );
  const [homeSectionFilter, setHomeSectionFilter] = useState<string>('all');
  const [isSavingHome, setIsSavingHome] = useState(false);
  const [homeSaveSuccess, setHomeSaveSuccess] = useState(false);

  // About Us CMS State
  const [aboutData, setAboutData] = useState(DEFAULT_ABOUTUS_CMS);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [aboutSaveSuccess, setAboutSaveSuccess] = useState(false);

  // Contact Us CMS State
  const [contactData, setContactData] = useState<ContactUsCmsData>(DEFAULT_CONTACTUS_CMS);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactSaveSuccess, setContactSaveSuccess] = useState(false);

  // Footer CMS State
  const [footerData, setFooterData] = useState<FooterCmsData>(DEFAULT_FOOTER_CMS);
  const [isSavingFooter, setIsSavingFooter] = useState(false);
  const [footerSaveSuccess, setFooterSaveSuccess] = useState(false);

  // Admin Password & Security State
  const [adminAuthInfo, setAdminAuthInfo] = useState<{
    email: string;
    hasCustomPassword: boolean;
    lastUpdated: string | null;
  }>({
    email: 'admin@agrimart.in',
    hasCustomPassword: false,
    lastUpdated: null,
  });
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Product Edit / Create Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<'basic' | 'pricing' | 'images' | 'specs' | 'brochures' | 'desc'>('basic');
  const [editSpecs, setEditSpecs] = useState<Array<{ key: string; value: string }>>([]);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editBrochures, setEditBrochures] = useState<Array<{ language: string; url: string; name: string }>>([]);
  const [newBrochureLang, setNewBrochureLang] = useState('English');
  const [customBrochureLang, setCustomBrochureLang] = useState('');
  const [newBrochureName, setNewBrochureName] = useState('');
  const [newBrochureUrl, setNewBrochureUrl] = useState('');
  const [editingBrochureIndex, setEditingBrochureIndex] = useState<number | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Category Edit / Create Modal State
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newSubcatInput, setNewSubcatInput] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [catSuccessMsg, setCatSuccessMsg] = useState<string | null>(null);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/admin/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch (e: any) {
      setDbStatus({ connected: false, error: e.message });
    }
  };

  // Sync all admin state with PostgreSQL API on mount
  useEffect(() => {
    fetchDbStatus();

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

    fetch('/api/admin/cms')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.homepage?.heroBanners) setHomeHeroBanners(data.homepage.heroBanners);
          if (data.homepage?.promoBanners) setHomePromoBanners(data.homepage.promoBanners);
          if (data.homepage?.categoriesSection) setHomeCategoriesSection(data.homepage.categoriesSection);
          if (data.homepage?.brandsSection) setHomeBrandsSection(data.homepage.brandsSection);
          if (data.homepage?.topPicksSection) setHomeTopPicksSection(data.homepage.topPicksSection);
          if (data.homepage?.featuredProductsSection) setHomeFeaturedSection(data.homepage.featuredProductsSection);
          if (data.homepage?.awardsSection) setHomeAwardsSection(data.homepage.awardsSection);
          if (data.homepage?.institutesSection) setHomeInstitutesSection(data.homepage.institutesSection);
          if (data.homepage?.appBanner) setHomeAppBanner(data.homepage.appBanner);
          if (data.aboutus) setAboutData(data.aboutus);
          if (data.contactus) setContactData(data.contactus);
          if (data.footer) setFooterData(data.footer);
        }
      })
      .catch(e => console.error('API CMS load error:', e));

    fetch('/api/admin/auth')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAdminAuthInfo({
            email: data.email || 'admin@agrimart.in',
            hasCustomPassword: Boolean(data.hasCustomPassword),
            lastUpdated: data.lastUpdated || null,
          });
        }
      })
      .catch(e => console.error('API auth load error:', e));
  }, []);

  // Product Actions
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setIsNewProduct(false);
    setActiveEditTab('basic');
    setSaveSuccessMsg(null);
    setNewImageUrl('');
    setEditBrochures(Array.isArray(p.brochures) ? [...p.brochures] : []);
    setNewBrochureLang('English');
    setCustomBrochureLang('');
    setNewBrochureName('');
    setNewBrochureUrl('');
    setEditingBrochureIndex(null);
    
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
    setEditBrochures([]);
    setNewBrochureLang('English');
    setCustomBrochureLang('');
    setNewBrochureName('');
    setNewBrochureUrl('');
    setEditingBrochureIndex(null);
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
      brochures: editBrochures.filter(b => b && b.url && b.url.trim() !== ''),
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

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Error deleting category: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Failed to delete category: ' + e.message);
    }
  };

  const handleSaveHomeCms = async () => {
    setIsSavingHome(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'homepage',
          data: {
            heroBanners: homeHeroBanners,
            promoBanners: homePromoBanners,
            categoriesSection: homeCategoriesSection,
            brandsSection: homeBrandsSection,
            topPicksSection: homeTopPicksSection,
            featuredProductsSection: homeFeaturedSection,
            awardsSection: homeAwardsSection,
            institutesSection: homeInstitutesSection,
            appBanner: homeAppBanner,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHomeSaveSuccess(true);
        setTimeout(() => setHomeSaveSuccess(false), 2500);
      } else {
        alert('Error saving Home settings: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Failed to save Home settings: ' + e.message);
    } finally {
      setIsSavingHome(false);
    }
  };

  const handleSaveAboutCms = async () => {
    setIsSavingAbout(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'aboutus',
          data: aboutData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAboutSaveSuccess(true);
        setTimeout(() => setAboutSaveSuccess(false), 2500);
      } else {
        alert('Error saving About Us settings: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Failed to save About Us settings: ' + e.message);
    } finally {
      setIsSavingAbout(false);
    }
  };

  const handleSaveContactCms = async () => {
    setIsSavingContact(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'contactus',
          data: contactData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContactSaveSuccess(true);
        setTimeout(() => setContactSaveSuccess(false), 2500);
      } else {
        alert('Error saving Contact Us settings: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Failed to save Contact Us settings: ' + e.message);
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleSaveFooterCms = async () => {
    setIsSavingFooter(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'footer',
          data: footerData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFooterSaveSuccess(true);
        setTimeout(() => setFooterSaveSuccess(false), 2500);
      } else {
        alert('Error saving Footer settings: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Failed to save Footer settings: ' + e.message);
    } finally {
      setIsSavingFooter(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback({ type: null, message: '' });

    if (!currentPasswordInput.trim()) {
      setPasswordFeedback({ type: 'error', message: 'Please enter your current password.' });
      return;
    }
    if (!newPasswordInput.trim()) {
      setPasswordFeedback({ type: 'error', message: 'Please enter a new password.' });
      return;
    }
    if (newPasswordInput.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordFeedback({ type: 'error', message: 'New password and confirmation password do not match.' });
      return;
    }
    if (newPasswordInput === currentPasswordInput) {
      setPasswordFeedback({ type: 'error', message: 'New password cannot be identical to your current password.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
          confirmPassword: confirmPasswordInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPasswordFeedback({
          type: 'success',
          message: data.message || 'Password changed successfully! Next time you login, please use your new password.',
        });
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        setAdminAuthInfo(prev => ({
          ...prev,
          hasCustomPassword: true,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        }));
      } else {
        setPasswordFeedback({
          type: 'error',
          message: data.message || 'Failed to update password. Please check your current password.',
        });
      }
    } catch (err: any) {
      setPasswordFeedback({
        type: 'error',
        message: err.message || 'Network error while attempting to update password.',
      });
    } finally {
      setIsChangingPassword(false);
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

  const updateApplicationNotes = async (id: string, adminNotes: string) => {
    try {
      const res = await fetch('/api/partner-application', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminNotes })
      });
      const data = await res.json();
      if (data.success) {
        setDealerApplications(prev => prev.map(a => a.id === id ? { ...a, adminNotes } : a));
        if (selectedDealerApp && selectedDealerApp.id === id) {
          setSelectedDealerApp((prev: any) => ({ ...prev, adminNotes }));
        }
      }
    } catch (e) {
      console.error('Failed updating notes:', e);
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

  // Customer Enquiries State (synced with PostgreSQL)
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<any | null>(null);
  const [isNewEnquiry, setIsNewEnquiry] = useState(false);

  const fetchEnquiries = async () => {
    setIsLoadingEnquiries(true);
    try {
      const res = await fetch('/api/enquiry');
      const data = await res.json();
      if (data.success && Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
      }
    } catch (e) {
      console.error('Failed fetching enquiries:', e);
    } finally {
      setIsLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateEnquiryField = async (id: string, updates: Record<string, any>) => {
    setEnquiries(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
    try {
      const res = await fetch('/api/enquiry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.enquiry) {
        setEnquiries(prev => prev.map(item => (item.id === id ? data.enquiry : item)));
      }
    } catch (e) {
      console.error('Failed updating enquiry:', e);
    }
  };

  const handleSaveEnquiryModal = async () => {
    if (!editingEnquiry) return;
    if (!editingEnquiry.name?.trim() || !editingEnquiry.subject?.trim()) {
      alert('Customer name and requirement are required');
      return;
    }
    try {
      const res = await fetch('/api/enquiry', {
        method: isNewEnquiry ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEnquiry),
      });
      const data = await res.json();
      if (data.success && data.enquiry) {
        if (isNewEnquiry) {
          setEnquiries(prev => [data.enquiry, ...prev]);
        } else {
          setEnquiries(prev => prev.map(item => (item.id === data.enquiry.id ? data.enquiry : item)));
        }
        setEditingEnquiry(null);
      } else {
        alert('Error: ' + (data.error || 'Failed to save enquiry'));
      }
    } catch (e: any) {
      alert('Network error: ' + e.message);
    }
  };

  const handleDeleteEnquiry = async (id: string, name: string) => {
    if (!window.confirm(`Delete inquiry from ${name}?`)) return;
    try {
      const res = await fetch(`/api/enquiry?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(prev => prev.filter(item => item.id !== id));
      } else {
        alert('Error deleting enquiry: ' + (data.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Failed to delete enquiry: ' + e.message);
    }
  };

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
          {dbStatus && (
            <span
              className={`hidden md:inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                dbStatus.connected
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-red-950/60 text-red-300 border-red-500/40'
              }`}
              title={dbStatus.connected ? `${dbStatus.database} @ ${dbStatus.host}:${dbStatus.port}` : dbStatus.error}
            >
              <Database className="w-3 h-3" />
              <span>
                {dbStatus.connected ? `PostgreSQL: ${dbStatus.database}` : 'PostgreSQL Disconnected'}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <Link
            href="/"
            target="_blank"
            className="bg-slate-800 hover:bg-slate-700 text-gray-200 px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors border border-slate-700 font-semibold"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>Store: Home</span>
          </Link>
          <Link
            href="/about"
            target="_blank"
            className="bg-slate-800 hover:bg-slate-700 text-gray-200 px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors border border-slate-700 font-semibold"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Store: About Us</span>
          </Link>
          <span className="text-gray-500">|</span>
          <span className="text-gray-300">Logged in as: <strong>Admin User (Ratnagiri Impex)</strong></span>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors font-semibold cursor-pointer border ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
            }`}
            title="Manage Admin Password & Security"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
          <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-56px)] p-4 space-y-1 text-xs font-semibold text-gray-700">
          <div className="pb-1 px-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Core Management</p>
          </div>

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

          {/* Storefront Pages CMS */}
          <div className="pt-4 pb-1 px-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Store Pages & Content</p>
          </div>

          <button
            onClick={() => setActiveTab('homepage')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'homepage' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4" />
              <span>Home Page</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-green-100 text-green-800">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('aboutus')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'aboutus' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4" />
              <span>About Us Page</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-green-100 text-green-800">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contactus')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'contactus' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4" />
              <span>Contact Us Page</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-green-100 text-green-800">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('footer')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'footer' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Global Footer</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-green-100 text-green-800">
              Live
            </span>
          </button>

          <div className="pt-3 pb-1 px-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Security & Account</p>
          </div>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors ${
              activeTab === 'security' ? 'bg-[#0d9749] text-white' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
              Security
            </span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 max-h-[calc(100vh-56px)] overflow-y-auto">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-gray-900">Executive Summary</h1>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    dbStatus?.connected
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : dbStatus === null
                      ? 'bg-slate-100 border-slate-200 text-slate-600'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>
                    {dbStatus === null
                      ? 'Connecting to PostgreSQL...'
                      : dbStatus.connected
                      ? `PostgreSQL Live: ${dbStatus.database} (${dbStatus.host}:${dbStatus.port})`
                      : `PostgreSQL Error: ${dbStatus.error || 'Disconnected'}`}
                  </span>
                </div>
              </div>

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
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditCategory(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0d9749] font-bold rounded border border-emerald-300 text-xs transition-colors cursor-pointer"
                            title="Edit Category & Subcategories"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded border border-red-200 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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

                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Admin Internal Notes (Saved to DB)</p>
                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            value={selectedDealerApp.adminNotes || ''}
                            onChange={(e) =>
                              setSelectedDealerApp((prev: any) => ({ ...prev, adminNotes: e.target.value }))
                            }
                            placeholder="Record follow-up status or territory verification notes..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateApplicationNotes(selectedDealerApp.id, selectedDealerApp.adminNotes || '')}
                            className="px-3 py-2 bg-[#075C36] hover:bg-[#064e2e] text-white text-xs font-bold rounded-lg shrink-0 self-start cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
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
                  <p className="text-xs text-gray-500">Review, update status, record notes, and follow up with farmer and dealer leads (PostgreSQL Synced)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchEnquiries}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEnquiries ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
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
                    <span>Log New Lead / Inquiry</span>
                  </button>
                </div>
              </div>

              {enquiries.length === 0 ? (
                <div className="bg-white border rounded-lg p-12 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-semibold text-sm text-gray-700">No enquiries recorded yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Contact Us forms, Quote Requests, and Subsidy Applications from the storefront appear here live.
                  </p>
                </div>
              ) : (
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
                          {enq.state ? ` • ${enq.city ? enq.city + ', ' : ''}${enq.state}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Interactive Status Selector */}
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-gray-500 font-semibold">Status:</span>
                          <select
                            value={enq.status}
                            onChange={(e) => {
                              handleUpdateEnquiryField(enq.id, { status: e.target.value });
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
                          onClick={() => handleDeleteEnquiry(enq.id, enq.name)}
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
                      {enq.message && enq.message !== enq.subject && (
                        <p className="text-gray-600 text-[11px] mt-1">{enq.message}</p>
                      )}
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
                        onBlur={(e) => handleUpdateEnquiryField(enq.id, { notes: e.target.value })}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateEnquiryField(enq.id, { notes: enq.notes || '' })}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold rounded shrink-0 cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}
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
                    onClick={handleSaveEnquiryModal}
                    className="px-5 py-2 bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {isNewEnquiry ? 'Log Inquiry' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOME PAGE CMS */}
          {activeTab === 'homepage' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Home className="w-5 h-5" />
                    </span>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Home Page Content & Sections</h1>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage main hero carousel, dynamic promotional cards, category shortcuts, and brand spotlights
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Live Home Page ↗</span>
                  </Link>
                  <button
                    onClick={handleSaveHomeCms}
                    disabled={isSavingHome}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {homeSaveSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingHome ? 'Saving...' : homeSaveSuccess ? 'Saved to DB!' : 'Save All Home Settings'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Section Filter Navigation Bar */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-xl border border-gray-200 shadow-sm sticky top-2 z-10">
                <span className="text-[11px] font-bold text-gray-500 uppercase px-2">Jump to Section:</span>
                {[
                  { id: 'all', label: 'All 9 Sections' },
                  { id: 'hero', label: '1. Hero Carousel' },
                  { id: 'promo', label: '2. Promo Cards' },
                  { id: 'categories', label: '3. Categories' },
                  { id: 'brands', label: '4. Brands Strip' },
                  { id: 'toppicks', label: '5. Top Picks' },
                  { id: 'featured', label: '6. Featured Machinery' },
                  { id: 'awards', label: '7. Awards Marquee' },
                  { id: 'institutes', label: '8. Testing Institutes' },
                  { id: 'app', label: '9. Mobile App Banner' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setHomeSectionFilter(s.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      homeSectionFilter === s.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* 1. Hero Banners Carousel Manager */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'hero') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>1. Main Hero Carousel Banners ({homeHeroBanners.length} Slides)</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">Edit slide titles, banner image URLs, destination links, or toggle visibility</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        6s Auto-Transition
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newId = Math.max(0, ...homeHeroBanners.map(b => b.id)) + 1;
                          setHomeHeroBanners(prev => [
                            ...prev,
                            {
                              id: newId,
                              title: 'New Machinery Slide',
                              image: '/assets/banners/hero_agrimate_hd.png',
                              link: '/products',
                              active: true,
                            }
                          ]);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Slide</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {homeHeroBanners.map((banner, bIdx) => (
                      <div key={banner.id} className="border border-gray-200 rounded-lg p-3.5 bg-gray-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                            Slide {bIdx + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="inline-flex items-center gap-1 cursor-pointer text-[11px] font-semibold text-gray-700">
                              <input
                                type="checkbox"
                                checked={banner.active !== false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setHomeHeroBanners(prev => prev.map((b, i) => (i === bIdx ? { ...b, active: checked } : b)));
                                }}
                                className="rounded text-emerald-600"
                              />
                              <span>Active</span>
                            </label>
                            {homeHeroBanners.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove Slide ${bIdx + 1}?`)) {
                                    setHomeHeroBanners(prev => prev.filter((_, i) => i !== bIdx));
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                                title="Delete Slide"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Direct File Upload for Slide Banner Image */}
                        <AdminImageUploader
                          label="Slide Banner Image"
                          value={banner.image}
                          onChange={(val) => setHomeHeroBanners(prev => prev.map((b, i) => (i === bIdx ? { ...b, image: val } : b)))}
                          folder="banners"
                          aspect="banner"
                          helpText="Upload a high-definition slide banner image from your computer."
                          compact
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <label className="block font-semibold text-gray-600 mb-0.5">Banner Title / Alt Text</label>
                            <input
                              type="text"
                              value={banner.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomeHeroBanners(prev => prev.map((b, i) => (i === bIdx ? { ...b, title: val } : b)));
                              }}
                              placeholder="Banner title / alt text"
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-600 mb-0.5">Destination Link</label>
                            <div className="flex gap-1.5 items-center">
                              <input
                                type="text"
                                value={banner.link}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeHeroBanners(prev => prev.map((b, i) => (i === bIdx ? { ...b, link: val } : b)));
                                }}
                                className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded font-mono text-[11px]"
                              />
                              <Link href={banner.link} target="_blank" className="text-emerald-700 hover:underline font-bold shrink-0">
                                ↗
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Promotional Showcase Banners */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'promo') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-emerald-600" />
                        <span>2. Growth & Promo Showcase Cards ({homePromoBanners.length} Cards)</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage interactive cards for Partner Program, Buy & Rent, and Knowledge Bank
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {homePromoBanners.map((promo, pIdx) => (
                      <div key={promo.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-amber-700 uppercase mb-0.5">Tag / Subtitle</label>
                          <input
                            type="text"
                            value={promo.subtitle}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomePromoBanners(prev => prev.map((item, i) => (i === pIdx ? { ...item, subtitle: val } : item)));
                            }}
                            className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Card Title</label>
                          <input
                            type="text"
                            value={promo.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomePromoBanners(prev => prev.map((item, i) => (i === pIdx ? { ...item, title: val } : item)));
                            }}
                            className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Description</label>
                          <textarea
                            rows={2}
                            value={promo.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomePromoBanners(prev => prev.map((item, i) => (i === pIdx ? { ...item, desc: val } : item)));
                            }}
                            className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-[11px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Link</label>
                            <input
                              type="text"
                              value={promo.link}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomePromoBanners(prev => prev.map((item, i) => (i === pIdx ? { ...item, link: val } : item)));
                              }}
                              className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-mono text-[10px]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Button Text</label>
                            <input
                              type="text"
                              value={promo.buttonText}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomePromoBanners(prev => prev.map((item, i) => (i === pIdx ? { ...item, buttonText: val } : item)));
                              }}
                              className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-semibold text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Shop by Category Header Editor */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'categories') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>3. Shop by Category Showcase Section Header</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Edit the top badge, heading, and description intro for the 28 circular category icons grid
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      28 Categories Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={homeCategoriesSection.badge}
                        onChange={(e) => setHomeCategoriesSection(prev => ({ ...prev, badge: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded font-semibold text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Main Heading</label>
                      <input
                        type="text"
                        value={homeCategoriesSection.title}
                        onChange={(e) => setHomeCategoriesSection(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded font-bold text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Section Subtitle / Description</label>
                      <textarea
                        rows={2}
                        value={homeCategoriesSection.subtitle}
                        onChange={(e) => setHomeCategoriesSection(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                    <span>Individual categories, images, and subcategories can be managed in the <strong>Categories</strong> tab on the left.</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('categories')}
                      className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                    >
                      Open Categories Tab →
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Trusted Brands Strip Manager */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'brands') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span>4. Our Trusted In-House & Global Brands Strip ({homeBrandsSection.brands.length} Brands)</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Customize section headers and brand cards (AGRIMATE, KASEI, OLEO-MAC)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHomeBrandsSection(prev => ({
                          ...prev,
                          brands: [
                            ...prev.brands,
                            {
                              name: 'NEW BRAND',
                              tagline: 'Precision Agricultural Solutions',
                              href: '/products',
                              logo: '/assets/branding/agrimate_brand_hd.png',
                            }
                          ]
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Brand</span>
                    </button>
                  </div>

                  {/* Header Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Badge</label>
                      <input
                        type="text"
                        value={homeBrandsSection.header.badge}
                        onChange={(e) => setHomeBrandsSection(prev => ({ ...prev, header: { ...prev.header, badge: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-semibold text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Title</label>
                      <input
                        type="text"
                        value={homeBrandsSection.header.title}
                        onChange={(e) => setHomeBrandsSection(prev => ({ ...prev, header: { ...prev.header, title: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Subtitle</label>
                      <input
                        type="text"
                        value={homeBrandsSection.header.subtitle}
                        onChange={(e) => setHomeBrandsSection(prev => ({ ...prev, header: { ...prev.header, subtitle: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Brands List */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {homeBrandsSection.brands.map((brand, bIdx) => (
                      <div key={bIdx} className="border border-gray-200 rounded-lg p-3.5 bg-gray-50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 text-[11px]">Brand #{bIdx + 1}</span>
                          {homeBrandsSection.brands.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove brand "${brand.name}"?`)) {
                                  setHomeBrandsSection(prev => ({
                                    ...prev,
                                    brands: prev.brands.filter((_, i) => i !== bIdx)
                                  }));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Brand Name</label>
                          <input
                            type="text"
                            value={brand.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomeBrandsSection(prev => ({
                                ...prev,
                                brands: prev.brands.map((b, i) => i === bIdx ? { ...b, name: val } : b)
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded font-bold text-xs"
                          />
                        </div>

                        <div>
                          <AdminImageUploader
                            label="Brand Logo Artwork"
                            value={brand.logo}
                            onChange={(val) => {
                              setHomeBrandsSection(prev => ({
                                ...prev,
                                brands: prev.brands.map((b, i) => i === bIdx ? { ...b, logo: val } : b)
                              }));
                            }}
                            folder="brands"
                            compact
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Tagline / Caption</label>
                          <input
                            type="text"
                            value={brand.tagline}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomeBrandsSection(prev => ({
                                ...prev,
                                brands: prev.brands.map((b, i) => i === bIdx ? { ...b, tagline: val } : b)
                              }));
                            }}
                            className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Link Href</label>
                          <input
                            type="text"
                            value={brand.href}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomeBrandsSection(prev => ({
                                ...prev,
                                brands: prev.brands.map((b, i) => i === bIdx ? { ...b, href: val } : b)
                              }));
                            }}
                            className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-mono text-[10px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Agrimart Top Picks Showcase Manager */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'toppicks') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>5. Agrimart's Top Picks Showcase ({homeTopPicksSection.picks.length} Spotlights)</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Edit curated hero machine spotlights (Weeders, Tillers, Chainsaws) with full specs and imagery
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHomeTopPicksSection(prev => ({
                          ...prev,
                          picks: [
                            ...prev.picks,
                            {
                              id: `pick-${Date.now()}`,
                              brand: 'AGRIMATE',
                              tagline: 'High Performance Machinery',
                              brandLogo: '/assets/branding/agrimate_brand_hd.png',
                              brandSubtitle: 'Premium Quality',
                              category: 'POWER MACHINERY',
                              leadTitle: 'NEW MACHINE SPOTLIGHT',
                              leadSubtitle: 'Engineered for tough agricultural conditions',
                              priceRange: '₹35,000 – ₹85,000',
                              specs: '212cc Engine • 4-Stroke • 3600 RPM',
                              bannerImage: '/assets/branding/power_weeder_hd.png',
                              badge: 'TOP SELECTION',
                              route: '/products?brand=AGRIMATE',
                            }
                          ]
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Spotlight</span>
                    </button>
                  </div>

                  {/* Header Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Badge</label>
                      <input
                        type="text"
                        value={homeTopPicksSection.header.badge}
                        onChange={(e) => setHomeTopPicksSection(prev => ({ ...prev, header: { ...prev.header, badge: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-semibold text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Title</label>
                      <input
                        type="text"
                        value={homeTopPicksSection.header.title}
                        onChange={(e) => setHomeTopPicksSection(prev => ({ ...prev, header: { ...prev.header, title: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Subtitle</label>
                      <input
                        type="text"
                        value={homeTopPicksSection.header.subtitle}
                        onChange={(e) => setHomeTopPicksSection(prev => ({ ...prev, header: { ...prev.header, subtitle: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Picks Grid */}
                  <div className="space-y-4">
                    {homeTopPicksSection.picks.map((pick, pIdx) => (
                      <div key={pick.id || pIdx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="font-bold text-emerald-800 text-xs">Spotlight #{pIdx + 1}: {pick.leadTitle}</span>
                          {homeTopPicksSection.picks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove spotlight "${pick.leadTitle}"?`)) {
                                  setHomeTopPicksSection(prev => ({
                                    ...prev,
                                    picks: prev.picks.filter((_, i) => i !== pIdx)
                                  }));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-1">
                            <AdminImageUploader
                              label="Machine Spotlight Photo"
                              value={pick.bannerImage}
                              onChange={(val) => {
                                setHomeTopPicksSection(prev => ({
                                  ...prev,
                                  picks: prev.picks.map((p, i) => i === pIdx ? { ...p, bannerImage: val } : p)
                                }));
                              }}
                              folder="products"
                              helpText="Upload spotlight machinery image."
                            />
                          </div>

                          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Brand</label>
                              <input
                                type="text"
                                value={pick.brand}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeTopPicksSection(prev => ({
                                    ...prev,
                                    picks: prev.picks.map((p, i) => i === pIdx ? { ...p, brand: val } : p)
                                  }));
                                }}
                                className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Category</label>
                              <input
                                type="text"
                                value={pick.category}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeTopPicksSection(prev => ({
                                    ...prev,
                                    picks: prev.picks.map((p, i) => i === pIdx ? { ...p, category: val } : p)
                                  }));
                                }}
                                className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Badge Text</label>
                              <input
                                type="text"
                                value={pick.badge}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeTopPicksSection(prev => ({
                                    ...prev,
                                    picks: prev.picks.map((p, i) => i === pIdx ? { ...p, badge: val } : p)
                                  }));
                                }}
                                className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs text-amber-700"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Lead Title</label>
                              <input
                                type="text"
                                value={pick.leadTitle}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeTopPicksSection(prev => ({
                                    ...prev,
                                    picks: prev.picks.map((p, i) => i === pIdx ? { ...p, leadTitle: val } : p)
                                  }));
                                }}
                                className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Destination Link</label>
                              <input
                                type="text"
                                value={pick.route}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeTopPicksSection(prev => ({
                                    ...prev,
                                    picks: prev.picks.map((p, i) => i === pIdx ? { ...p, route: val } : p)
                                  }));
                                }}
                                className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-mono text-[10px]"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Technical Specs Tagline</label>
                              <input
                                type="text"
                                value={pick.specs}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeTopPicksSection(prev => ({
                                    ...prev,
                                    picks: prev.picks.map((p, i) => i === pIdx ? { ...p, specs: val } : p)
                                  }));
                                }}
                                className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono text-emerald-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Featured Machinery Products Manager */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'featured') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>6. Featured Agricultural Machinery Section ({homeFeaturedSection.products.length} Products)</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Customize flagship highlight cards including the Agrimate 4WD Tractor, Brush Cutters, and Power Weeders
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHomeFeaturedSection(prev => ({
                          ...prev,
                          products: [
                            ...prev.products,
                            {
                              id: `feat-${Date.now()}`,
                              name: 'AGRIMATE PREMIUM WEEDER',
                              code: 'RIPL123456',
                              brand: 'AGRIMATE',
                              category: 'POWER TILLER - WEEDER',
                              keyFeature: 'Field Tested 7HP',
                              image: '/assets/branding/power_weeder_hd.png',
                              badge: 'TOP SELLER',
                              isFlagship: false,
                            }
                          ]
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {/* Header Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Badge</label>
                      <input
                        type="text"
                        value={homeFeaturedSection.header.badge}
                        onChange={(e) => setHomeFeaturedSection(prev => ({ ...prev, header: { ...prev.header, badge: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-semibold text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Title</label>
                      <input
                        type="text"
                        value={homeFeaturedSection.header.title}
                        onChange={(e) => setHomeFeaturedSection(prev => ({ ...prev, header: { ...prev.header, title: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Subtitle</label>
                      <input
                        type="text"
                        value={homeFeaturedSection.header.subtitle}
                        onChange={(e) => setHomeFeaturedSection(prev => ({ ...prev, header: { ...prev.header, subtitle: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {homeFeaturedSection.products.map((prod, pIdx) => (
                      <div key={prod.id || pIdx} className="border border-gray-200 rounded-lg p-3.5 bg-gray-50 space-y-2 text-xs">
                        <div className="flex items-center justify-between border-b pb-1.5">
                          <span className="font-bold text-emerald-800 text-[11px]">#{pIdx + 1} {prod.code}</span>
                          <div className="flex items-center gap-2">
                            <label className="inline-flex items-center gap-1 cursor-pointer text-[10px] font-semibold text-emerald-800">
                              <input
                                type="checkbox"
                                checked={!!prod.isFlagship}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setHomeFeaturedSection(prev => ({
                                    ...prev,
                                    products: prev.products.map((p, i) => i === pIdx ? { ...p, isFlagship: checked } : p)
                                  }));
                                }}
                                className="rounded text-emerald-600"
                              />
                              <span>Flagship Large Card</span>
                            </label>
                            {homeFeaturedSection.products.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove product "${prod.name}"?`)) {
                                    setHomeFeaturedSection(prev => ({
                                      ...prev,
                                      products: prev.products.filter((_, i) => i !== pIdx)
                                    }));
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-20 h-20 relative rounded bg-white border shrink-0 overflow-hidden flex items-center justify-center">
                            <Image src={prod.image} alt={prod.name} fill unoptimized className="object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div>
                              <label className="block text-[9px] font-bold text-gray-500 uppercase">Product Name</label>
                              <input
                                type="text"
                                value={prod.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeFeaturedSection(prev => ({
                                    ...prev,
                                    products: prev.products.map((p, i) => i === pIdx ? { ...p, name: val } : p)
                                  }));
                                }}
                                className="w-full px-2 py-0.5 bg-white border border-gray-300 rounded font-bold text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div>
                                <label className="block text-[9px] font-bold text-gray-500 uppercase">RIPL Code</label>
                                <input
                                  type="text"
                                  value={prod.code}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setHomeFeaturedSection(prev => ({
                                      ...prev,
                                      products: prev.products.map((p, i) => i === pIdx ? { ...p, code: val } : p)
                                    }));
                                  }}
                                  className="w-full px-2 py-0.5 bg-white border border-gray-300 rounded font-mono text-[10px]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-gray-500 uppercase">Brand</label>
                                <input
                                  type="text"
                                  value={prod.brand}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setHomeFeaturedSection(prev => ({
                                      ...prev,
                                      products: prev.products.map((p, i) => i === pIdx ? { ...p, brand: val } : p)
                                    }));
                                  }}
                                  className="w-full px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-semibold"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase">Category</label>
                            <input
                              type="text"
                              value={prod.category}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomeFeaturedSection(prev => ({
                                  ...prev,
                                  products: prev.products.map((p, i) => i === pIdx ? { ...p, category: val } : p)
                                }));
                              }}
                              className="w-full px-2 py-0.5 bg-white border border-gray-300 rounded text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase">Key Feature Tag</label>
                            <input
                              type="text"
                              value={prod.keyFeature}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomeFeaturedSection(prev => ({
                                  ...prev,
                                  products: prev.products.map((p, i) => i === pIdx ? { ...p, keyFeature: val } : p)
                                }));
                              }}
                              className="w-full px-2 py-0.5 bg-white border border-gray-300 rounded text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                          <div>
                            <AdminImageUploader
                              label="Product Photo"
                              value={prod.image}
                              onChange={(val) => {
                                setHomeFeaturedSection(prev => ({
                                  ...prev,
                                  products: prev.products.map((p, i) => i === pIdx ? { ...p, image: val } : p)
                                }));
                              }}
                              folder="products"
                              compact
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Badge Label</label>
                            <input
                              type="text"
                              value={prod.badge}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomeFeaturedSection(prev => ({
                                  ...prev,
                                  products: prev.products.map((p, i) => i === pIdx ? { ...p, badge: val } : p)
                                }));
                              }}
                              className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded text-[11px] font-bold text-amber-700"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Awards & Recognition Showcase Manager */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'awards') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>7. Awards & Recognition Showcase ({homeAwardsSection.awards.length} Trophies)</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage awards in the sliding marquee (Ministry of Agriculture, Krishi Ratna, Asian Leadership)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = Math.max(0, ...homeAwardsSection.awards.map(a => a.id)) + 1;
                        setHomeAwardsSection(prev => ({
                          ...prev,
                          awards: [
                            ...prev.awards,
                            {
                              id: newId,
                              title: 'Agricultural Excellence Award',
                              organization: 'Government of India',
                              image: '/assets/branding/award_trophy_1.png',
                            }
                          ]
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Award</span>
                    </button>
                  </div>

                  {/* Header Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Badge</label>
                      <input
                        type="text"
                        value={homeAwardsSection.header.badge}
                        onChange={(e) => setHomeAwardsSection(prev => ({ ...prev, header: { ...prev.header, badge: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-semibold text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Title</label>
                      <input
                        type="text"
                        value={homeAwardsSection.header.title}
                        onChange={(e) => setHomeAwardsSection(prev => ({ ...prev, header: { ...prev.header, title: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Subtitle</label>
                      <input
                        type="text"
                        value={homeAwardsSection.header.subtitle}
                        onChange={(e) => setHomeAwardsSection(prev => ({ ...prev, header: { ...prev.header, subtitle: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Awards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {homeAwardsSection.awards.map((award, aIdx) => (
                      <div key={award.id || aIdx} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 text-[11px]">Trophy #{aIdx + 1}</span>
                          {homeAwardsSection.awards.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove award "${award.title}"?`)) {
                                  setHomeAwardsSection(prev => ({
                                    ...prev,
                                    awards: prev.awards.filter((_, i) => i !== aIdx)
                                  }));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 relative rounded bg-white border shrink-0 overflow-hidden flex items-center justify-center">
                            <Image src={award.image} alt={award.title} fill unoptimized className="object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="block text-[9px] font-bold text-gray-500 uppercase">Award Title</label>
                            <input
                              type="text"
                              value={award.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHomeAwardsSection(prev => ({
                                  ...prev,
                                  awards: prev.awards.map((a, i) => i === aIdx ? { ...a, title: val } : a)
                                }));
                              }}
                              className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase">Organization / Category</label>
                          <input
                            type="text"
                            value={award.organization}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomeAwardsSection(prev => ({
                                ...prev,
                                awards: prev.awards.map((a, i) => i === aIdx ? { ...a, organization: val } : a)
                              }));
                            }}
                            className="w-full px-2 py-0.5 bg-white border border-gray-300 rounded text-[11px]"
                          />
                        </div>

                        <div>
                          <AdminImageUploader
                            label="Trophy / Certificate Artwork"
                            value={award.image}
                            onChange={(val) => {
                              setHomeAwardsSection(prev => ({
                                ...prev,
                                awards: prev.awards.map((a, i) => i === aIdx ? { ...a, image: val } : a)
                              }));
                            }}
                            folder="awards"
                            compact
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Academic & Testing Institutes Manager */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'institutes') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span>8. Academic & Testing Institutes ({homeInstitutesSection.institutes.length} Institutes)</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage certified farm machinery testing institutes (ICAR-CIAE, SRFMTTI, UAS, TNAU)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHomeInstitutesSection(prev => ({
                          ...prev,
                          institutes: [
                            ...prev.institutes,
                            {
                              id: `inst-${Date.now()}`,
                              code: 'NEW INSTITUTE',
                              name: 'Central Farm Machinery Institute',
                              logo: '/assets/institutes/icar_ciae_logo.png',
                            }
                          ]
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Institute</span>
                    </button>
                  </div>

                  {/* Header Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Badge</label>
                      <input
                        type="text"
                        value={homeInstitutesSection.header.badge}
                        onChange={(e) => setHomeInstitutesSection(prev => ({ ...prev, header: { ...prev.header, badge: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-semibold text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Title</label>
                      <input
                        type="text"
                        value={homeInstitutesSection.header.title}
                        onChange={(e) => setHomeInstitutesSection(prev => ({ ...prev, header: { ...prev.header, title: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-bold text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Section Subtitle</label>
                      <input
                        type="text"
                        value={homeInstitutesSection.header.subtitle}
                        onChange={(e) => setHomeInstitutesSection(prev => ({ ...prev, header: { ...prev.header, subtitle: e.target.value } }))}
                        className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Institutes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {homeInstitutesSection.institutes.map((inst, iIdx) => (
                      <div key={inst.id || iIdx} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 text-[11px]">Institute #{iIdx + 1}</span>
                          {homeInstitutesSection.institutes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove institute "${inst.code}"?`)) {
                                  setHomeInstitutesSection(prev => ({
                                    ...prev,
                                    institutes: prev.institutes.filter((_, i) => i !== iIdx)
                                  }));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="w-full h-14 relative rounded bg-white border overflow-hidden flex items-center justify-center">
                          <Image src={inst.logo} alt={inst.code} fill unoptimized className="object-contain p-1.5" />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase">Code / Short Name</label>
                          <input
                            type="text"
                            value={inst.code}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomeInstitutesSection(prev => ({
                                ...prev,
                                institutes: prev.institutes.map((item, i) => i === iIdx ? { ...item, code: val } : item)
                              }));
                            }}
                            className="w-full px-2 py-0.5 bg-white border border-gray-300 rounded font-bold text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 uppercase">Full Official Name</label>
                          <input
                            type="text"
                            value={inst.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHomeInstitutesSection(prev => ({
                                ...prev,
                                institutes: prev.institutes.map((item, i) => i === iIdx ? { ...item, name: val } : item)
                              }));
                            }}
                            className="w-full px-2 py-0.5 bg-white border border-gray-300 rounded text-[11px]"
                          />
                        </div>

                        <div>
                          <AdminImageUploader
                            label="Institute Logo"
                            value={inst.logo}
                            onChange={(val) => {
                              setHomeInstitutesSection(prev => ({
                                ...prev,
                                institutes: prev.institutes.map((item, i) => i === iIdx ? { ...item, logo: val } : item)
                              }));
                            }}
                            folder="institutes"
                            compact
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. Mobile App Download Banner Manager */}
              {(homeSectionFilter === 'all' || homeSectionFilter === 'app') && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>9. Download Agrimart Mobile App Banner</span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage Ultra-HD download banner and direct Google Play & Apple App Store buttons
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      3K Ultra-HD Banner
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <AdminImageUploader
                        label="Mobile App Banner Mockup"
                        value={homeAppBanner.bannerImage}
                        onChange={(val) => setHomeAppBanner(prev => ({ ...prev, bannerImage: val }))}
                        folder="banners"
                        aspect="banner"
                        helpText="Upload mobile app promotional artwork."
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3 text-xs">

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Title / Alt Text</label>
                          <input
                            type="text"
                            value={homeAppBanner.title || ''}
                            onChange={(e) => setHomeAppBanner(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Subtitle</label>
                          <input
                            type="text"
                            value={homeAppBanner.subtitle || ''}
                            onChange={(e) => setHomeAppBanner(prev => ({ ...prev, subtitle: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-0.5">
                            Google Play Store Link
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <input
                              type="text"
                              value={homeAppBanner.googlePlayLink}
                              onChange={(e) => setHomeAppBanner(prev => ({ ...prev, googlePlayLink: e.target.value }))}
                              className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-mono text-[10px]"
                            />
                            <Link href={homeAppBanner.googlePlayLink} target="_blank" className="text-emerald-700 hover:underline font-bold shrink-0">
                              ↗
                            </Link>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-800 uppercase mb-0.5">
                            Apple App Store Link
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <input
                              type="text"
                              value={homeAppBanner.appStoreLink}
                              onChange={(e) => setHomeAppBanner(prev => ({ ...prev, appStoreLink: e.target.value }))}
                              className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-mono text-[10px]"
                            />
                            <Link href={homeAppBanner.appStoreLink} target="_blank" className="text-emerald-700 hover:underline font-bold shrink-0">
                              ↗
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Sticky Save Bar for Home Page CMS */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">All 9 Homepage Sections Ready</p>
                    <p className="text-[11px] text-gray-500">Changes are saved directly to PostgreSQL database and synchronized with your live website.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/"
                    target="_blank"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    Preview Homepage ↗
                  </Link>
                  <button
                    onClick={handleSaveHomeCms}
                    disabled={isSavingHome}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    {homeSaveSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingHome ? 'Saving to Database...' : homeSaveSuccess ? 'Saved Successfully!' : 'Save All Homepage Changes'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ABOUT US CMS */}
          {activeTab === 'aboutus' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                      <Building2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">About Us Page Content & Profile</h1>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage corporate profile, founding background, showroom photography, vision, mission, and value pillars
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/about"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Live About Page ↗</span>
                  </Link>
                  <button
                    onClick={handleSaveAboutCms}
                    disabled={isSavingAbout}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {aboutSaveSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingAbout ? 'Saving...' : aboutSaveSuccess ? 'Saved to DB!' : 'Save About Us Settings'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Company Identity & Founding Details */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-gray-900 border-b pb-3">
                  1. Company Identity & Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Company Title</label>
                    <input
                      type="text"
                      value={aboutData.title}
                      onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Founded Year</label>
                    <input
                      type="text"
                      value={aboutData.foundedYear}
                      onChange={(e) => setAboutData({ ...aboutData, foundedYear: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Parent Group & In-House Brand</label>
                    <input
                      type="text"
                      value={`${aboutData.parentGroup} • ${aboutData.flagshipBrand}`}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100 font-bold text-emerald-800"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-gray-700 mb-1">Company Description & Story</label>
                  <textarea
                    rows={4}
                    value={aboutData.description}
                    onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 2. Showroom Showcase Photo */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-gray-900 border-b pb-3">
                  2. Bangalore Mega Showroom Photograph
                </h2>
                <div className="p-2">
                  <AdminImageUploader
                    label="Mega Showroom Facility Photograph"
                    value={aboutData.showroomImage || '/assets/about/agrimart_mega_showroom.jpg'}
                    onChange={(url) => setAboutData({ ...aboutData, showroomImage: url })}
                    folder="about"
                    helpText="Upload Bangalore Mega Showroom photograph (JPG, PNG, WebP) directly from your computer."
                  />
                </div>
              </div>

              {/* 2b. Central Warehouse & Logistics Photo */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-gray-900 border-b pb-3">
                  3. Central Warehouse &amp; Logistics Facility Photograph
                </h2>
                <div className="p-2">
                  <AdminImageUploader
                    label="Central Warehouse Facility Photograph"
                    value={aboutData.warehouseImage || '/assets/about/ratnagiri_impex_warehouse.jpg'}
                    onChange={(url) => setAboutData({ ...aboutData, warehouseImage: url })}
                    folder="about"
                    helpText="Upload central warehouse and logistics facility photo (JPG, PNG, WebP) directly from your computer."
                  />
                </div>
              </div>

              {/* 3. Vision & Mission Statements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2 text-xs">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 text-emerald-800">
                    <Sparkles className="w-4 h-4" />
                    <span>Our Vision Statement</span>
                  </h3>
                  <textarea
                    rows={4}
                    value={aboutData.vision}
                    onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2 text-xs">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 text-amber-800">
                    <Sparkles className="w-4 h-4" />
                    <span>Our Mission Statement</span>
                  </h3>
                  <textarea
                    rows={4}
                    value={aboutData.mission}
                    onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 4. Corporate Headquarters */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3 text-xs">
                <h2 className="text-sm font-bold text-gray-900 border-b pb-2">
                  4. Corporate Headquarters & Contact
                </h2>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Registered Address</label>
                  <input
                    type="text"
                    value={aboutData.headquarters}
                    onChange={(e) => setAboutData({ ...aboutData, headquarters: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Toll-Free Helpline</label>
                  <input
                    type="text"
                    value={aboutData.helpline}
                    onChange={(e) => setAboutData({ ...aboutData, helpline: e.target.value })}
                    className="w-full max-w-xs px-3 py-2 border rounded-lg font-bold text-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACT US CMS */}
          {activeTab === 'contactus' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </span>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Contact Us Page Configuration & Desks</h1>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage corporate head office, nationwide customer care toll-free numbers, direct support emails, operating hours, and Google Maps embed
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/contact"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Live Contact Page ↗</span>
                  </Link>
                  <button
                    onClick={handleSaveContactCms}
                    disabled={isSavingContact}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {contactSaveSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingContact ? 'Saving...' : contactSaveSuccess ? 'Saved to DB!' : 'Save Contact Us Settings'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Header & Introductory Information */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>1. Page Header & Introduction</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Header badges, main title, and introductory text displayed at the top of the Contact Us page</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={contactData.badge}
                      onChange={(e) => setContactData({ ...contactData, badge: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Main Heading</label>
                    <input
                      type="text"
                      value={contactData.title}
                      onChange={(e) => setContactData({ ...contactData, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Form Heading</label>
                    <input
                      type="text"
                      value={contactData.formTitle}
                      onChange={(e) => setContactData({ ...contactData, formTitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block font-bold text-gray-700 mb-1">Subtitle / Overview Description</label>
                    <textarea
                      rows={2}
                      value={contactData.subtitle}
                      onChange={(e) => setContactData({ ...contactData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Head Office Address & Company Identity */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>2. Head Office & Registered Address</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Corporate identity and physical location displayed to prospective clients and farmers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Company / Entity Name</label>
                    <input
                      type="text"
                      value={contactData.companyName}
                      onChange={(e) => setContactData({ ...contactData, companyName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Google Maps Direct Share / Directions Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={contactData.googleMapsLink || ''}
                        onChange={(e) => setContactData({ ...contactData, googleMapsLink: e.target.value })}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full px-3 py-2 border rounded-lg font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      {contactData.googleMapsLink && (
                        <Link href={contactData.googleMapsLink} target="_blank" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-emerald-700 font-bold shrink-0">
                          ↗
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Head Office Complete Physical Address</label>
                    <textarea
                      rows={2}
                      value={contactData.headOfficeAddress}
                      onChange={(e) => setContactData({ ...contactData, headOfficeAddress: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Phone Numbers, Helplines & Emails */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Helplines */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>3. Telephone & Missed Call Numbers</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Primary toll-free and direct phone numbers with one-click calling enabled</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Toll-Free / Missed Call Number</label>
                      <input
                        type="text"
                        value={contactData.tollFreePhone}
                        onChange={(e) => setContactData({ ...contactData, tollFreePhone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg font-bold text-emerald-800 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Direct Landline / Regional Desk</label>
                      <input
                        type="text"
                        value={contactData.supportPhone || ''}
                        onChange={(e) => setContactData({ ...contactData, supportPhone: e.target.value })}
                        placeholder="+91 80 2674 1777"
                        className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Addresses */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>4. Official Inboxes & Email Addresses</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Official support mailboxes for customers, dealers, and corporate enquiries</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Primary Email Address</label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg font-bold text-gray-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Customer Support / Secondary Email</label>
                      <input
                        type="email"
                        value={contactData.supportEmail || ''}
                        onChange={(e) => setContactData({ ...contactData, supportEmail: e.target.value })}
                        placeholder="customercare@agrimart.in"
                        className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Working Hours & Schedule */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>5. Working Hours & Support Availability</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Operating hours during weekdays and weekend schedule</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Weekday Operating Hours</label>
                    <input
                      type="text"
                      value={contactData.workingHoursWeekday}
                      onChange={(e) => setContactData({ ...contactData, workingHoursWeekday: e.target.value })}
                      placeholder="Monday – Saturday: 9:30 AM – 6:00 PM"
                      className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Sunday & Public Holidays</label>
                    <input
                      type="text"
                      value={contactData.workingHoursWeekend}
                      onChange={(e) => setContactData({ ...contactData, workingHoursWeekend: e.target.value })}
                      placeholder="Sunday: Closed"
                      className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Google Maps Embed URL & Live Location Preview */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>6. Google Maps Interactive Embed</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Interactive Google Maps frame embedded directly on the contact page for live directions</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block font-bold text-gray-700">Google Maps Embed URL (iframe src)</label>
                    <textarea
                      rows={3}
                      value={contactData.mapEmbedUrl || ''}
                      onChange={(e) => setContactData({ ...contactData, mapEmbedUrl: e.target.value })}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full px-3 py-2 border rounded-lg font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                    />
                    <p className="text-[10px] text-gray-500">
                      Tip: Obtain this by navigating to your showroom on Google Maps &gt; Click <em>Share</em> &gt; Select <em>Embed a map</em> &gt; Copy only the <code>src=&quot;...&quot;</code> URL.
                    </p>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-bold text-gray-700 mb-1">Live Map Preview</label>
                    <div className="w-full h-36 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      {contactData.mapEmbedUrl ? (
                        <iframe
                          src={contactData.mapEmbedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          title="Preview Map"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-[11px]">
                          No map embed URL provided
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Save Bar for Contact Us CMS */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Contact Us Page Configuration Ready</p>
                    <p className="text-[11px] text-gray-500">Changes will be saved directly into PostgreSQL and immediately reflected on the live Contact Us page.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/contact"
                    target="_blank"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    Preview Contact Page ↗
                  </Link>
                  <button
                    onClick={handleSaveContactCms}
                    disabled={isSavingContact}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    {contactSaveSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingContact ? 'Saving to Database...' : contactSaveSuccess ? 'Saved Successfully!' : 'Save Contact Us Settings'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GLOBAL FOOTER CMS */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Layers className="w-5 h-5" />
                    </span>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Global Website Footer & Social Presence</h1>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage corporate overview, downloadable brochures, pan-India reach statistics, mobile app links, social media channels, and copyright notice
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Live Footer ↗</span>
                  </Link>
                  <button
                    onClick={handleSaveFooterCms}
                    disabled={isSavingFooter}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {footerSaveSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingFooter ? 'Saving...' : footerSaveSuccess ? 'Saved to DB!' : 'Save Footer Settings'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Company Profile & Background Imagery */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>1. Company Overview Blurb & Imagery</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Column 1 summary text, corporate brand logo, and the scenic farm landscape background</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Corporate Overview Paragraph</label>
                    <textarea
                      rows={3}
                      value={footerData.aboutText}
                      onChange={(e) => setFooterData({ ...footerData, aboutText: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <AdminImageUploader
                        label="White Brand Logo Artwork"
                        value={footerData.logoImage || ''}
                        onChange={(url) => setFooterData({ ...footerData, logoImage: url })}
                        folder="branding"
                        helpText="White transparency logo for dark footer."
                        compact
                      />
                    </div>
                    <div>
                      <AdminImageUploader
                        label="Scenic Background Image"
                        value={footerData.backgroundImage || ''}
                        onChange={(url) => setFooterData({ ...footerData, backgroundImage: url })}
                        folder="footer"
                        helpText="Botanical / machinery background watermark."
                        compact
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Downloadable PDF Brochures */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>2. Downloadable PDF Brochures</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Direct PDF download buttons placed in the first column of the footer</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 space-y-2.5">
                    <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider">Button 1: Corporate Brochure</span>
                    <div>
                      <label className="block font-semibold text-gray-600 mb-0.5">Button Label</label>
                      <input
                        type="text"
                        value={footerData.corporateBrochureText || ''}
                        onChange={(e) => setFooterData({ ...footerData, corporateBrochureText: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border rounded font-semibold text-xs"
                      />
                    </div>
                    <div>
                      <AdminImageUploader
                        label="Corporate PDF Document"
                        value={footerData.corporateBrochureUrl || ''}
                        onChange={(url) => setFooterData({ ...footerData, corporateBrochureUrl: url })}
                        folder="brochures"
                        accept=".pdf,application/pdf"
                        placeholder="/assets/brochures/corporate-brochure.pdf"
                        compact
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 space-y-2.5">
                    <span className="font-bold text-amber-800 text-[11px] uppercase tracking-wider">Button 2: Brand / Machinery Brochure</span>
                    <div>
                      <label className="block font-semibold text-gray-600 mb-0.5">Button Label</label>
                      <input
                        type="text"
                        value={footerData.brandBrochureText || ''}
                        onChange={(e) => setFooterData({ ...footerData, brandBrochureText: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border rounded font-semibold text-xs"
                      />
                    </div>
                    <div>
                      <AdminImageUploader
                        label="Brand Profile PDF Document"
                        value={footerData.brandBrochureUrl || ''}
                        onChange={(url) => setFooterData({ ...footerData, brandBrochureUrl: url })}
                        folder="brochures"
                        accept=".pdf,application/pdf"
                        placeholder="/assets/brochures/agrimate-profile.pdf"
                        compact
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Contact & Location Information */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>3. Contact & Headquarters Details</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Details presented in Column 4 of the global footer</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Headquarters Physical Address</label>
                    <input
                      type="text"
                      value={footerData.address}
                      onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Toll-Free Helpline Phone</label>
                    <input
                      type="text"
                      value={footerData.helplinePhone}
                      onChange={(e) => setFooterData({ ...footerData, helplinePhone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg font-bold text-emerald-800 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      value={footerData.email}
                      onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Working Hours String</label>
                    <input
                      type="text"
                      value={footerData.workingHours}
                      onChange={(e) => setFooterData({ ...footerData, workingHours: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Pan-India Network Map & Stats Banner */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>4. Pan-India Network Reach & Statistics</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">India network map graphic and the two green counter badges</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <AdminImageUploader
                      label="India Network Map Artwork"
                      value={footerData.networkMapImage || ''}
                      onChange={(url) => setFooterData({ ...footerData, networkMapImage: url })}
                      folder="footer"
                      compact
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Stat 1 Count</label>
                      <input
                        type="text"
                        value={footerData.touchpointsCount}
                        onChange={(e) => setFooterData({ ...footerData, touchpointsCount: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg font-bold text-emerald-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Stat 1 Label</label>
                      <input
                        type="text"
                        value={footerData.touchpointsLabel}
                        onChange={(e) => setFooterData({ ...footerData, touchpointsLabel: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Stat 2 Count</label>
                      <input
                        type="text"
                        value={footerData.statesCoveredCount}
                        onChange={(e) => setFooterData({ ...footerData, statesCoveredCount: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg font-bold text-emerald-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Stat 2 Label</label>
                      <input
                        type="text"
                        value={footerData.statesCoveredLabel}
                        onChange={(e) => setFooterData({ ...footerData, statesCoveredLabel: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Mobile App Links & Social Media Channels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* App Store Links */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>5. Mobile App Download Links</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Badges in Column 3</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Google Play Store URL</label>
                      <input
                        type="text"
                        value={footerData.googlePlayLink}
                        onChange={(e) => setFooterData({ ...footerData, googlePlayLink: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Apple App Store URL</label>
                      <input
                        type="text"
                        value={footerData.appStoreLink}
                        onChange={(e) => setFooterData({ ...footerData, appStoreLink: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="border-b pb-3">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span>6. Social Media Channels</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Circular icons in Column 4</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-0.5">Facebook</label>
                      <input
                        type="text"
                        value={footerData.facebookUrl || ''}
                        onChange={(e) => setFooterData({ ...footerData, facebookUrl: e.target.value })}
                        className="w-full px-2 py-1 border rounded font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-0.5">Instagram</label>
                      <input
                        type="text"
                        value={footerData.instagramUrl || ''}
                        onChange={(e) => setFooterData({ ...footerData, instagramUrl: e.target.value })}
                        className="w-full px-2 py-1 border rounded font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-0.5">X (Twitter)</label>
                      <input
                        type="text"
                        value={footerData.twitterUrl || ''}
                        onChange={(e) => setFooterData({ ...footerData, twitterUrl: e.target.value })}
                        className="w-full px-2 py-1 border rounded font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-0.5">LinkedIn</label>
                      <input
                        type="text"
                        value={footerData.linkedinUrl || ''}
                        onChange={(e) => setFooterData({ ...footerData, linkedinUrl: e.target.value })}
                        className="w-full px-2 py-1 border rounded font-mono text-[10px]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-0.5">YouTube</label>
                      <input
                        type="text"
                        value={footerData.youtubeUrl || ''}
                        onChange={(e) => setFooterData({ ...footerData, youtubeUrl: e.target.value })}
                        className="w-full px-2 py-1 border rounded font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Bottom Copyright Bar */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>7. Copyright Bar Notice</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Text shown in the bottom frosted bar</p>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-gray-700 mb-1">Copyright Line Text (Year is automatically injected)</label>
                  <input
                    type="text"
                    value={footerData.copyrightText || ''}
                    onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Bottom Sticky Save Bar for Footer CMS */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Global Footer Configuration Ready</p>
                    <p className="text-[11px] text-gray-500">Changes will be saved into PostgreSQL and reflected immediately across all website footers.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/"
                    target="_blank"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    Preview Homepage Footer ↗
                  </Link>
                  <button
                    onClick={handleSaveFooterCms}
                    disabled={isSavingFooter}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    {footerSaveSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                    <span>{isSavingFooter ? 'Saving to Database...' : footerSaveSuccess ? 'Saved Successfully!' : 'Save Footer Settings'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ADMIN PASSWORD & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-4xl pb-16">
              {/* Header Banner */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      Access Credentials & Authentication
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      PostgreSQL: cms_settings (admin_auth)
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <Lock className="w-6 h-6 text-[#0d9749]" />
                    <span>Change Admin Password</span>
                  </h1>
                  <p className="text-xs text-gray-500 max-w-2xl">
                    Update your master administrator password. Changes are securely hashed and stored in your PostgreSQL database, taking effect immediately for all subsequent logins.
                  </p>
                </div>
              </div>

              {/* Security Status Card */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm border border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-300">Authorized Master Account</p>
                      <p className="text-sm font-black text-white flex items-center gap-2">
                        <span>{adminAuthInfo.email}</span>
                        <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                          Super Administrator
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700/60">
                    <p className="text-[11px] text-gray-400">Password Status</p>
                    <p className="text-xs font-bold text-emerald-400 flex items-center sm:justify-end gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {adminAuthInfo.hasCustomPassword ? 'Custom Password Active' : 'Default Credentials (admin123)'}
                    </p>
                    {adminAuthInfo.lastUpdated && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        Last modified: {new Date(adminAuthInfo.lastUpdated).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Feedback Notification */}
              {passwordFeedback.message && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-200 ${
                    passwordFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {passwordFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold">
                      {passwordFeedback.type === 'success' ? 'Password Updated Successfully' : 'Password Update Failed'}
                    </p>
                    <p>{passwordFeedback.message}</p>
                  </div>
                </div>
              )}

              {/* Password Form Card */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
                <div className="p-5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#0d9749]" />
                    <h2 className="text-sm font-bold text-gray-900">Set New Admin Credentials</h2>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">All fields required</span>
                </div>

                <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                  {/* Current Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-lg">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="Enter current password (default: admin123)"
                        required
                        className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      If you have never changed the password before, the initial default password is <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-bold">admin123</code>.
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                    {/* New Password Field */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Enter new strong password"
                          required
                          className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Re-enter new password"
                          required
                          className="w-full px-3.5 py-2.5 pr-10 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Checklist */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 max-w-2xl text-[11px] space-y-1.5">
                    <p className="font-bold text-gray-700">Password Requirements Checklist:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          newPasswordInput.length >= 6 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {newPasswordInput.length >= 6 ? '✓' : '•'}
                        </span>
                        <span>At least 6 characters in length</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          newPasswordInput.length > 0 && newPasswordInput === confirmPasswordInput ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {newPasswordInput.length > 0 && newPasswordInput === confirmPasswordInput ? '✓' : '•'}
                        </span>
                        <span>New & Confirm passwords match</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          newPasswordInput.length > 0 && newPasswordInput !== currentPasswordInput ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {newPasswordInput.length > 0 && newPasswordInput !== currentPasswordInput ? '✓' : '•'}
                        </span>
                        <span>Different from current password</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Submission Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d9749] hover:bg-[#097b3a] disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      {isChangingPassword ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Updating Password in Database...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Update Admin Password</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPasswordInput('');
                        setNewPasswordInput('');
                        setConfirmPasswordInput('');
                        setPasswordFeedback({ type: null, message: '' });
                      }}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              {/* Best Practices Guide */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-5 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Security Recommendations for Agrimart Administrators</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/80">
                  <li>Use a strong password that mixes uppercase letters, numbers, and symbols.</li>
                  <li>Do not share your master administrator credentials with unauthorized personnel.</li>
                  <li>Your password change takes effect immediately on all open sessions and devices.</li>
                  <li>In case of emergency or locked credentials, system administrators can reset credentials directly via PostgreSQL.</li>
                </ul>
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
                    onClick={() => setActiveEditTab('brochures')}
                    className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeEditTab === 'brochures' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>5. Multi-Language Brochures ({editBrochures.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveEditTab('desc')}
                    className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                      activeEditTab === 'desc' ? 'border-[#0d9749] text-[#0d9749]' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    6. Description & Overview
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
                    <div className="space-y-6">
                      {/* Primary Thumbnail with Direct File Upload */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                        <AdminImageUploader
                          label="Primary Thumbnail Photo"
                          value={editingProduct.thumbnailImage || ''}
                          onChange={(url) => setEditingProduct({ ...editingProduct, thumbnailImage: url })}
                          folder="products"
                          helpText="Upload product thumbnail image directly from your computer (JPG, PNG, WebP). Appears in catalog listings, cart, and search previews."
                        />
                      </div>

                      {/* Gallery Images with Multi-File Upload & Drag-Drop */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                        <AdminGalleryUploader
                          images={editImages}
                          onChange={(newImages) => setEditImages(newImages)}
                          folder="products"
                        />
                      </div>

                      {/* Multi-Language Brochures Quick Link in Tab 3 */}
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-xs">
                              Multi-Language Product Brochures ({editBrochures.length})
                            </h4>
                            <p className="text-[11px] text-gray-600 mt-0.5">
                              {editBrochures.length > 0 
                                ? `Configured in: ${Array.from(new Set(editBrochures.map(b => b.language))).join(', ')}`
                                : 'No brochures configured yet. Add brochures in Kannada, Telugu, Hindi, or English.'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveEditTab('brochures')}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-xs cursor-pointer text-center"
                        >
                          Manage Language Brochures →
                        </button>
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

                  {/* TAB 5: MULTI-LANGUAGE BROCHURES */}
                  {activeEditTab === 'brochures' && (
                    <div className="space-y-6">
                      {/* Section Info Banner */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-700" />
                            <h3 className="font-bold text-sm text-emerald-900">Multi-Language Product Brochures &amp; User Manuals</h3>
                          </div>
                          <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                            Upload or link official PDF brochures in English, Kannada, Hindi, Telugu, Tamil, and other regional languages. These show on the live product page so farmers across India can read in their native language.
                          </p>
                        </div>
                        <div className="bg-white/80 border border-emerald-300 px-3 py-1.5 rounded-lg text-center shrink-0">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Brochures</span>
                          <span className="text-base font-extrabold text-emerald-700">{editBrochures.length}</span>
                        </div>
                      </div>

                      {/* Add or Edit Brochure Form */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4 text-emerald-600" />
                            <span>{editingBrochureIndex !== null ? `Edit Brochure (#${editingBrochureIndex + 1})` : 'Add New Multi-Language Brochure'}</span>
                          </h4>
                          {editingBrochureIndex !== null && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBrochureIndex(null);
                                setNewBrochureName('');
                                setNewBrochureUrl('');
                                setNewBrochureLang('English');
                                setCustomBrochureLang('');
                              }}
                              className="text-xs text-gray-500 hover:text-gray-800 underline font-semibold cursor-pointer"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          {/* Language Selector */}
                          <div className="sm:col-span-4">
                            <label className="block font-bold text-gray-700 mb-1">
                              Brochure Language <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={newBrochureLang}
                              onChange={(e) => {
                                const selected = e.target.value;
                                setNewBrochureLang(selected);
                                if (!newBrochureName.trim() || newBrochureName.includes('Brochure')) {
                                  const langDisplay = selected === 'Other' ? '' : selected;
                                  setNewBrochureName(`${editingProduct.name || 'Product'} Brochure ${langDisplay ? `(${langDisplay})` : ''}`.trim());
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                              <option value="English">English</option>
                              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                              <option value="Telugu">Telugu (తెలుగు)</option>
                              <option value="Hindi">Hindi (हिन्दी)</option>
                              <option value="Tamil">Tamil (தமிழ்)</option>
                              <option value="Malayalam">Malayalam (മലയാളം)</option>
                              <option value="Marathi">Marathi (मराठी)</option>
                              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                              <option value="Bengali">Bengali (বাংলা)</option>
                              <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                              <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                              <option value="Other">Other / Custom Language...</option>
                            </select>
                          </div>

                          {/* Custom Language Input if "Other" is chosen */}
                          {newBrochureLang === 'Other' && (
                            <div className="sm:col-span-8">
                              <label className="block font-bold text-gray-700 mb-1">
                                Specify Custom Language <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Assamese, Urdu, Spanish..."
                                value={customBrochureLang}
                                onChange={(e) => setCustomBrochureLang(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                              />
                            </div>
                          )}

                          {/* Brochure Name / Title */}
                          <div className={newBrochureLang === 'Other' ? 'sm:col-span-12' : 'sm:col-span-8'}>
                            <div className="flex items-center justify-between mb-1">
                              <label className="font-bold text-gray-700">
                                Brochure Title / Label <span className="text-red-500">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const effectiveLang = newBrochureLang === 'Other' ? (customBrochureLang || 'Document') : newBrochureLang;
                                  setNewBrochureName(`${editingProduct.name || 'Machinery'} Specifications Brochure (${effectiveLang})`);
                                }}
                                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                              >
                                Auto-fill Title
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="e.g. Heavy Duty Brush Cutter Brochure (Kannada)"
                              value={newBrochureName}
                              onChange={(e) => setNewBrochureName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>

                          {/* Brochure PDF File Path / Upload */}
                          <div className="sm:col-span-12">
                            <AdminImageUploader
                              label="PDF Brochure Document (Upload from Computer or enter path)"
                              value={newBrochureUrl}
                              onChange={(url) => setNewBrochureUrl(url)}
                              folder="brochures"
                              placeholder="/uploads/brochures/brochure.pdf"
                              accept=".pdf,application/pdf"
                              helpText="Select a PDF brochure file from your computer or paste a public link."
                              compact
                            />
                            <div className="mt-2.5 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const effectiveLang = (newBrochureLang === 'Other' ? customBrochureLang : newBrochureLang).trim();
                                  if (!effectiveLang) {
                                    alert('Please specify the brochure language');
                                    return;
                                  }
                                  if (!newBrochureUrl.trim()) {
                                    alert('Please upload a PDF brochure or provide a file path');
                                    return;
                                  }
                                  const effectiveName = newBrochureName.trim() || `${editingProduct.name || 'Machinery'} Brochure (${effectiveLang})`;

                                  if (editingBrochureIndex !== null) {
                                    const updated = [...editBrochures];
                                    updated[editingBrochureIndex] = {
                                      language: effectiveLang,
                                      name: effectiveName,
                                      url: newBrochureUrl.trim(),
                                    };
                                    setEditBrochures(updated);
                                    setEditingBrochureIndex(null);
                                  } else {
                                    setEditBrochures([
                                      ...editBrochures,
                                      {
                                        language: effectiveLang,
                                        name: effectiveName,
                                        url: newBrochureUrl.trim(),
                                      },
                                    ]);
                                  }

                                  setNewBrochureName('');
                                  setNewBrochureUrl('');
                                  setNewBrochureLang('English');
                                  setCustomBrochureLang('');
                                }}
                                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
                              >
                                {editingBrochureIndex !== null ? 'Update Brochure' : '+ Add Brochure'}
                              </button>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1">
                              Supports local brochure uploads under <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">/uploads/product_brochure/1/...</code> or any remote HTTPS document URL.
                            </p>
                          </div>
                        </div>

                        {/* Quick Regional Presets */}
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-[11px] font-bold text-gray-600 mb-2">Quick Regional Language Presets:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { lang: 'English', label: 'English' },
                              { lang: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
                              { lang: 'Telugu', label: 'తెలుగు (Telugu)' },
                              { lang: 'Hindi', label: 'हिन्दी (Hindi)' },
                              { lang: 'Tamil', label: 'தமிழ் (Tamil)' },
                              { lang: 'Malayalam', label: 'മലയാളം (Malayalam)' },
                              { lang: 'Marathi', label: 'मराठी (Marathi)' },
                            ].map((preset) => (
                              <button
                                key={preset.lang}
                                type="button"
                                onClick={() => {
                                  setNewBrochureLang(preset.lang);
                                  setNewBrochureName(`${editingProduct.name || 'Machinery'} Brochure (${preset.lang})`);
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-300 hover:border-emerald-400 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Current Brochures List */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-800 text-xs sm:text-sm">
                            Configured Brochures for this Machine ({editBrochures.length})
                          </h4>
                          {editBrochures.length > 0 && (
                            <span className="text-[11px] text-gray-500">
                              These will appear in the &quot;Brochure&quot; tab on the live website.
                            </span>
                          )}
                        </div>

                        {editBrochures.length === 0 ? (
                          <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-gray-500">
                            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="font-bold text-gray-700 text-xs">No multi-language brochures added yet</p>
                            <p className="text-[11px] text-gray-500 mt-1 max-w-md mx-auto">
                              Add brochures in English, Kannada, Telugu, or Hindi so customers and dealers can download genuine technical specs in their regional language.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {editBrochures.map((b, bIdx) => {
                              const normL = (b.language || 'English').toLowerCase();
                              const badgeColor = normL.includes('kannada') || normL === 'kn'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : normL.includes('telugu') || normL === 'te'
                                ? 'bg-purple-100 text-purple-800 border-purple-300'
                                : normL.includes('hindi') || normL === 'hi'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : normL.includes('tamil') || normL === 'ta'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : normL.includes('malayalam') || normL === 'ml'
                                ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
                                : normL.includes('marathi') || normL === 'mr'
                                ? 'bg-orange-100 text-orange-800 border-orange-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300';

                              return (
                                <div
                                  key={bIdx}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-gray-200 hover:border-emerald-300 rounded-xl gap-3 shadow-2xs transition-all"
                                >
                                  <div className="flex items-start gap-3 min-w-0">
                                    <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0 mt-0.5">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${badgeColor}`}>
                                          {b.language || 'English'}
                                        </span>
                                        <h5 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                                          {b.name || 'Brochure'}
                                        </h5>
                                      </div>
                                      <p className="text-[11px] text-gray-500 font-mono truncate mt-0.5">
                                        {b.url}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                    {b.url && (
                                      <a
                                        href={b.url.startsWith('/') ? b.url : b.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                                        title="Preview in new tab"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Test Link</span>
                                      </a>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingBrochureIndex(bIdx);
                                        setNewBrochureName(b.name);
                                        setNewBrochureUrl(b.url);
                                        const knownLangs = ['English', 'Kannada', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'Odia', 'Punjabi'];
                                        if (knownLangs.includes(b.language)) {
                                          setNewBrochureLang(b.language);
                                          setCustomBrochureLang('');
                                        } else {
                                          setNewBrochureLang('Other');
                                          setCustomBrochureLang(b.language);
                                        }
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditBrochures(editBrochures.filter((_, idx) => idx !== bIdx));
                                        if (editingBrochureIndex === bIdx) {
                                          setEditingBrochureIndex(null);
                                        }
                                      }}
                                      className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                                      title="Delete this brochure"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: DESCRIPTION */}
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
                    <AdminImageUploader
                      label="Category Image / Icon"
                      value={editingCategory.image || ''}
                      onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                      folder="categories"
                      helpText="Category showcase artwork (JPG, PNG, WebP)"
                      compact
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
