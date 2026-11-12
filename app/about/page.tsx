import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Compass, Award, ShieldCheck, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { getCmsSetting } from '@/lib/db';
import { DEFAULT_ABOUTUS_CMS, AboutUsCmsData } from '@/lib/cmsDefaults';

export const revalidate = 60;

async function getAboutData(): Promise<AboutUsCmsData> {
  try {
    const dbData = await getCmsSetting<AboutUsCmsData>('aboutus');
    if (dbData) return { ...DEFAULT_ABOUTUS_CMS, ...dbData };
  } catch {
    // Fallback cleanly if DB is unreachable during offline static checks
  }
  return DEFAULT_ABOUTUS_CMS;
}

export default async function AboutPage() {
  const about = await getAboutData();

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="agri-container">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">About Us</span>
        </div>

        {/* Section 1: Welcome to Ratnagiri Impex */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="text-xs font-bold text-[#0d9749] uppercase tracking-wider">
              {about.subtitle}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-4">
              {about.title}
            </h1>
            <div className="w-16 h-1 bg-[#0d9749] mb-6"></div>

            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>{about.description}</p>
              <p>
                <strong>Founded in {about.foundedYear}</strong>, AGRIMART is based in Bangalore and marketed by Ratnagiri Impex Pvt. Ltd., an initiative of the <strong>{about.parentGroup}</strong>, bringing decades of experience in agricultural equipment under our flagship brand <strong>{about.flagshipBrand}</strong>.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200/90 shadow-md bg-white">
              <Image
                src={about.showroomImage || '/assets/about/agrimart_mega_showroom.jpg'}
                alt="Ratnagiri Impex & Agrimart Mega Showroom"
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Vision */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg text-[#0d9749]">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {about.vision}
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {about.mission}
            </p>
          </div>
        </div>

        {/* Section 3: Why Choose Us (Formal, Clean & Corporate) */}
        <div className="bg-[#f8fafc] border border-gray-200/90 rounded-2xl p-8 sm:p-12 mb-16 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#0d9749] inline-block px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200/60 mb-2">
              Reliability & Value
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Why Choose Agrimart?
            </h2>
            <div className="w-16 h-1 bg-[#0d9749] mx-auto mt-3 rounded-full"></div>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 font-normal">
              Empowering Indian agriculture with authentic global brands, certified quality, nationwide parts, and dedicated customer care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Original Brands */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-[#0d9749]/50 transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0d9749] flex items-center justify-center mb-4 group-hover:bg-[#0d9749] group-hover:text-white transition-all duration-300 shadow-2xs">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900 mb-2 group-hover:text-[#0d9749] transition-colors">
                Original Brands
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Direct authorized distributor for globally renowned brands including Agrimate, Kasei, and Oleo-Mac.
              </p>
            </div>

            {/* Card 2: Recognized Quality */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-[#0d9749]/50 transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0d9749] flex items-center justify-center mb-4 group-hover:bg-[#0d9749] group-hover:text-white transition-all duration-300 shadow-2xs">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900 mb-2 group-hover:text-[#0d9749] transition-colors">
                Recognized Quality
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Tested and certified by leading agricultural universities (ANGRAU, TNAU, UAS) and Central FM&amp;TTI testing institutes.
              </p>
            </div>

            {/* Card 3: Readily Available Spares */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-[#0d9749]/50 transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0d9749] flex items-center justify-center mb-4 group-hover:bg-[#0d9749] group-hover:text-white transition-all duration-300 shadow-2xs">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900 mb-2 group-hover:text-[#0d9749] transition-colors">
                Readily Available Spares
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We maintain complete stocks of genuine replacement parts, carburetors, blades, and maintenance kits with unique RIPL codes.
              </p>
            </div>

            {/* Card 4: Dedicated Assistance */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-[#0d9749]/50 transition-all duration-300 flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0d9749] flex items-center justify-center mb-4 group-hover:bg-[#0d9749] group-hover:text-white transition-all duration-300 shadow-2xs">
                <Phone className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900 mb-2 group-hover:text-[#0d9749] transition-colors">
                Dedicated Assistance
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Customer support, technician assistance, and telephone helpline ({about.helpline}) operating 6 days a week.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Registered Office */}
        <div className="border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50">
          <div className="flex items-start gap-4">
            <MapPin className="w-8 h-8 text-[#0d9749] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-base text-gray-900">Headquarters & Corporate Office</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {about.headquarters}
              </p>
            </div>
          </div>
          <Link href="/contact" className="agri-btn-primary text-xs py-2.5 px-6 whitespace-nowrap">
            Contact Us & Direction →
          </Link>
        </div>
      </div>
    </div>
  );
}
