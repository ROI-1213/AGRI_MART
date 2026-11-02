import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Wrench, Shield, Users, Truck, CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="agri-container">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Our Services</span>
        </div>

        {/* Section 1: Services Header & Description */}
        <div className="mb-12">
          <span className="text-xs font-bold text-[#0d9749] uppercase tracking-wider">
            Agricultural Mechanization Support & Dealer Infrastructure
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-3">
            Our Services
          </h1>
          <div className="w-16 h-1 bg-[#0d9749] mb-6"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Ratnagiri Impex</strong> was founded in 2000 and has continuously achieved technological excellence by importing the most advanced agricultural machinery and farm and garden equipment.
              </p>
              <p>
                <strong>&apos;AGRIMATE&apos;</strong> is our very own private label range of agricultural mechanization and pest control equipment. The Agrimate range of equipment is available through our dedicated network of over <strong>750+ dealer touchpoints</strong> across India, ensuring prompt product availability, genuine spare parts, and qualified field technical support.
              </p>
              <p>
                From product selection advice and initial assembly guidance to in-field operational training and routine servicing, Agrimart delivers complete lifecycle support for agricultural, horticultural, plantation, and landscaping equipment.
              </p>

              <div className="pt-4">
                <a
                  href="/assets/brochures/corporate_brochure.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="agri-btn-primary text-xs py-3 px-5 shadow-sm inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Corporate Brochure (PDF)</span>
                </a>
              </div>
            </div>

            {/* Network Map / Image */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 shadow-sm text-center">
              <div className="relative aspect-[4/3] w-full rounded overflow-hidden mb-3">
                <Image
                  src="/assets/services/our_network.jpg"
                  alt="Agrimart 750+ Dealer Network Across India"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="bg-[#097b3a] text-white p-4 rounded-lg flex items-center justify-around">
                <div>
                  <p className="text-3xl font-black text-yellow-300">750+</p>
                  <p className="text-xs uppercase font-semibold tracking-wider text-green-100">
                    Network Touchpoints
                  </p>
                </div>
                <div className="h-10 w-px bg-green-700"></div>
                <div>
                  <p className="text-3xl font-black text-yellow-300">28</p>
                  <p className="text-xs uppercase font-semibold tracking-wider text-green-100">
                    States Covered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Core Service Pillars */}
        <div className="py-10 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Comprehensive Service Offerings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="p-3 bg-green-100 text-[#0d9749] rounded-lg w-fit mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">On-Site & Workshop Servicing</h3>
              <p className="text-gray-600 leading-relaxed">
                Skilled mechanics trained to troubleshoot two-stroke and four-stroke engines, carburetors, spray pumps, clutch assemblies, and drive shafts.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg w-fit mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">Genuine RIPL Spare Parts</h3>
              <p className="text-gray-600 leading-relaxed">
                Immediate access to authentic factory-spec replacement components, including seals, filters, guide bars, spark plugs, nozzles, and delivery hoses.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-lg w-fit mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">Farmer Demonstration & Training</h3>
              <p className="text-gray-600 leading-relaxed">
                Hands-on field demonstrations for weed cutters, mistblowers, and power weeders to maximize fuel efficiency and operator safety.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: B2B Dealer Onboarding CTA */}
        <div className="bg-[#242424] text-white rounded-lg p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Interested in Becoming an Authorized Agrimart Dealer?
            </h3>
            <p className="text-xs text-gray-400 max-w-xl">
              Expand your agribusiness with India&apos;s most reputable agricultural mechanization brands, attractive profit margins, and marketing support.
            </p>
          </div>
          <Link
            href="/cms/become-a-partner"
            className="agri-btn-secondary text-xs px-6 py-3 font-bold whitespace-nowrap"
          >
            Register as Dealer / Franchisee →
          </Link>
        </div>
      </div>
    </div>
  );
}
