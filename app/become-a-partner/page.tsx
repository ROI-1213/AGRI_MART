import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  TrendingUp,
  Award,
  Layers,
  DollarSign,
  Briefcase,
  Maximize2,
  Package,
  Sliders,
  CheckCircle2,
  Users,
  Wrench,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
  FileText,
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Become a Partner & Dealer | Agrimart',
  description: 'Join the Agrimart dealership network. Discover genuine partnership benefits, sales training, extensive agricultural machinery catalog, and quick ROI.',
};

export default function BecomeAPartnerPage() {
  const partnerBenefits = [
    {
      icon: TrendingUp,
      title: 'Sales & Marketing Training',
      desc: 'Structured product orientation, field demonstration techniques, and customer engagement guidance to empower your team for higher conversions.'
    },
    {
      icon: Award,
      title: 'Quality & Value-for-Money Products',
      desc: 'Field-tested, high-performance machinery engineered for demanding Indian soil conditions with rigorous quality benchmarks.'
    },
    {
      icon: DollarSign,
      title: 'Increase Turnover',
      desc: 'High seasonal demand across farming, gardening, and horticulture drives consistent footfall and sustained sales velocity.'
    },
    {
      icon: Sparkles,
      title: 'Increase Profits',
      desc: 'Attractive dealer margins, repeat consumables demand, and profitable spare parts business ensure strong commercial returns.'
    },
    {
      icon: Briefcase,
      title: 'Ease of Doing Business',
      desc: 'Streamlined order processing, predictable dispatch schedules, and dedicated regional support coordinators.'
    },
    {
      icon: Maximize2,
      title: 'Increase Area of Operations',
      desc: 'Expand your commercial footprint across surrounding rural clusters, taluks, and regional farming hubs.'
    },
    {
      icon: Package,
      title: 'Wide Range of Products',
      desc: 'A comprehensive catalog spanning sprayers, power weeders, brush cutters, chaff cutters, chainsaws, pumpsets, and farm tools.'
    },
    {
      icon: Sliders,
      title: 'Wide Range of Price Choices',
      desc: 'Tiered machinery models designed to cater to budget-conscious farmers, progressive growers, contractors, and institutions.'
    }
  ];

  const customerBenefits = [
    {
      icon: Layers,
      title: 'Wide Range of Product Choices',
      desc: 'Farmers select equipment precisely matched to their acreage, crop type, topography, and seasonal farming operations.'
    },
    {
      icon: Wrench,
      title: 'Usage & Maintenance Training',
      desc: 'Hands-on operational training and clear maintenance guidance ensure safe operation and extended machinery service life.'
    },
    {
      icon: DollarSign,
      title: 'Wide Range of Price Choices',
      desc: 'Transparent, accessible price points allow farmers to mechanize within their available working capital and budget.'
    },
    {
      icon: Users,
      title: 'Reduced Dependency on Labour',
      desc: 'Mechanized weeding, spraying, and harvesting overcome critical rural labor shortages during tight seasonal windows.'
    },
    {
      icon: ShieldCheck,
      title: 'Quality & Value-for-Money Products',
      desc: 'Durable engines, robust gearboxes, and wear-resistant components minimize breakdown risks and repair downtime.'
    },
    {
      icon: Clock,
      title: 'Quick ROI',
      desc: 'Immediate operational time savings and significant reduction in manual labor costs deliver swift payback on equipment investments.'
    },
    {
      icon: TrendingUp,
      title: 'Increased Production',
      desc: 'Uniform weed clearance, timely soil aeration, and uniform chemical spraying directly elevate crop yields and harvest quality.'
    },
    {
      icon: CheckCircle2,
      title: 'Savings on Inputs',
      desc: 'Precise chemical delivery, optimized fuel consumption, and minimal seed loss protect agricultural inputs from wastage.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center text-sm text-slate-500 space-x-2">
            <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-semibold">Become a Partner</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#064e2e] via-[#0b633d] to-[#127d4f] text-white py-16 sm:py-24">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-yellow-400 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Agrimart Dealership & Growth Network
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Grow Your Business <br className="hidden sm:inline" />
                <span className="text-yellow-400">with Agrimart</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
                Explore partnership opportunities with Agrimart and discover how our agricultural machinery, power equipment, and green-care product range can support and scale your business across rural and semi-urban markets.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/partner-registration"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#075C36] font-bold text-base shadow-lg shadow-black/15 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Become a Dealer</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#benefits"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-base transition-colors"
                >
                  <span>Explore Partnership Benefits</span>
                </a>
              </div>

              {/* Quick Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15 text-emerald-100 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>25+ Equipment Categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>Sales & Field Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>Genuine Spares Support</span>
                </div>
              </div>
            </div>

            {/* Right Card / Machine Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white/10 backdrop-blur-md p-6 sm:p-8 border border-white/20 shadow-2xl">
                <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                  <Image
                    src="/assets/branding/promo_photo_partner.png"
                    alt="Agrimart Dealership Partner"
                    fill
                    unoptimized
                    className="object-contain p-4 drop-shadow-xl"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white font-semibold text-base">Empowering Rural Retailers Across India</p>
                  <p className="text-emerald-200 text-xs sm:text-sm mt-1">
                    Direct access to genuine brands, RIPL engineering, and technical training.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#075C36]">27</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Specialized Machinery Categories</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#075C36]">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Genuine Spares & Accessories</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#075C36]">Comprehensive</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Sales & Service Enablement</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#075C36]">Pan-India</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Rural & Commercial Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 8 Partnership Benefits */}
      <section id="benefits" className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-emerald-700 font-bold text-xs sm:text-sm uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full inline-block mb-3">
              Why Partner With Us
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Partnership Benefits
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              When you partner with Agrimart, you gain access to an end-to-end commercial ecosystem designed to expand your market presence and accelerate dealership profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerBenefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#075C36] flex items-center justify-center mb-4 group-hover:bg-[#075C36] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: 8 Customer Benefits */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#075C36] font-bold text-xs sm:text-sm uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3 border border-emerald-200">
              Value For Your Customers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Benefits to Your Farming Customers
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Dealers succeed when farmers thrive. Agrimart products provide Indian agriculturists with measurable yield improvements, operational time savings, and accessible farm mechanization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerBenefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Original Agrimart Dealership Infographics Reference */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full inline-block">
                  Verified Agrimart Framework
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Backed by Decades of Agrimart Legacy
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Our partnership principles are built on field-verified practices established by Ratnagiri Impex Pvt. Ltd. (RIPL). Every dealership benefits from genuine equipment distribution, direct technician training, and reliable access to spares.
                </p>
                <div className="pt-2">
                  <Link
                    href="/partner-registration"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#075C36] hover:bg-[#064e2e] text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <span>Apply for Dealership</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Infographic Thumbnails */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 group shadow-sm">
                  <div className="relative h-56 w-full">
                    <Image
                      src="/assets/branding/become_dealer1.jpg"
                      alt="Agrimart Partnership Benefits Infographic"
                      fill
                      unoptimized
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3 bg-white border-t border-slate-200 text-center">
                    <p className="text-xs font-bold text-slate-800">Partnership Benefits Structure</p>
                    <a
                      href="/assets/branding/become_dealer1.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1 mt-1 hover:underline"
                    >
                      <span>View Full Chart</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 group shadow-sm">
                  <div className="relative h-56 w-full">
                    <Image
                      src="/assets/branding/become_dealer.jpg"
                      alt="Agrimart Customer Benefits Infographic"
                      fill
                      unoptimized
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3 bg-white border-t border-slate-200 text-center">
                    <p className="text-xs font-bold text-slate-800">Customer Value Architecture</p>
                    <a
                      href="/assets/branding/become_dealer.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1 mt-1 hover:underline"
                    >
                      <span>View Full Chart</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Dealership Onboarding Process */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#075C36] font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3 border border-emerald-200">
              Simple 4-Step Journey
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Dealership Onboarding Works
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              We ensure a smooth, transparent onboarding process with dedicated support from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <span className="text-3xl font-black text-emerald-600/30">01</span>
              <h4 className="text-base font-bold text-slate-900 mt-2 mb-2">Submit Application</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fill out the quick dealer enquiry form with your store details and business profile.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <span className="text-3xl font-black text-emerald-600/30">02</span>
              <h4 className="text-base font-bold text-slate-900 mt-2 mb-2">Regional Discussion</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our regional territory manager reviews your market area and connects with you.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <span className="text-3xl font-black text-emerald-600/30">03</span>
              <h4 className="text-base font-bold text-slate-900 mt-2 mb-2">Catalog & Stocking</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Select optimal product categories tailored to your local seasonal cropping demands.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <span className="text-3xl font-black text-emerald-600/30">04</span>
              <h4 className="text-base font-bold text-slate-900 mt-2 mb-2">Training & Launch</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive product manuals, demonstration guides, and promotional support for launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-[#075C36] to-[#127d4f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take the Next Step?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join hundreds of trusted agricultural retail partners across India. Submit your dealership enquiry online and our regional partnership coordinator will get in touch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/partner-registration"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#075C36] font-bold text-base shadow-xl transition-all"
            >
              <span>Apply for Dealership Online</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-base transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Contact Dealer Support</span>
            </Link>
          </div>

          <div className="pt-6 text-xs text-emerald-200/80">
            Agrimart is an initiative by Ratnagiri Impex Pvt. Ltd. | Toll-Free: 1800-103-1100
          </div>
        </div>
      </section>
    </div>
  );
}
