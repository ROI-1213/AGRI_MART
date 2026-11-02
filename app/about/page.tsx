import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Compass, Award, ShieldCheck, CheckCircle2, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {
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
              About Ratnagiri Impex Pvt. Ltd.
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-4">
              Welcome to RATNAGIRI IMPEX
            </h1>
            <div className="w-16 h-1 bg-[#0d9749] mb-6"></div>

            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>
                We have an extensive presence all over India and are a reputable agricultural equipment enterprise that supplies high-quality products, ensuring durability, enhanced yield, and unmatched customer satisfaction.
              </p>
              <p>
                Additionally, we are an all-in-one destination for agricultural equipment that simplifies the procurement process and offers comprehensive after-sales service across the nation.
              </p>
              <p>
                <strong>Ratnagiri Impex was founded in 2000</strong>, and since inception we have worked to achieve technological excellence by importing the most advanced agricultural machinery and introducing private-label innovations under our flagship brand <strong>AGRIMATE</strong>.
              </p>
              <p>
                AGRIMART is based in Bangalore and marketed by Ratnagiri Impex Pvt. Ltd., an initiative of the <strong>Annapurna Group</strong>, who bring decades of deep experience in agricultural equipment, plantations, operations, distribution, and service.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-md bg-gray-50 flex items-center justify-center">
              <Image
                src="/assets/about/aboutFin.png"
                alt="About Ratnagiri Impex & Agrimart"
                fill
                priority
                className="object-contain p-4"
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
              To be the premier agricultural machinery provider across India, revolutionizing farming efficiency through affordable, innovative mechanization that reduces manual labor, conserves water and resources, and maximizes economic returns for every farmer.
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
              To deliver world-class machinery, robust after-sales support, easily accessible spare parts, and comprehensive hands-on training to agricultural communities via our widespread network of over 750+ dedicated dealers and service hubs.
            </p>
          </div>
        </div>

        {/* Section 3: Why Choose Us */}
        <div className="bg-[#097b3a] text-white rounded-lg p-8 sm:p-12 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-yellow-300">
              Reliability & Value
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Why Choose Agrimart?</h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
            <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-8 h-8 text-yellow-300 mb-3" />
              <h3 className="font-bold text-base mb-2">Original Brands</h3>
              <p className="text-green-100 leading-relaxed">
                Direct authorized distributor for globally renowned brands including Kasei, Oleo-Mac, Agrimate, and Green Panther.
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm border border-white/10">
              <Award className="w-8 h-8 text-yellow-300 mb-3" />
              <h3 className="font-bold text-base mb-2">Recognized Quality</h3>
              <p className="text-green-100 leading-relaxed">
                Tested and certified by leading agricultural universities (ANGRAU, TNAU, UAS) and Central FM&TTI testing institutes.
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="w-8 h-8 text-yellow-300 mb-3" />
              <h3 className="font-bold text-base mb-2">Readily Available Spares</h3>
              <p className="text-green-100 leading-relaxed">
                We maintain complete stocks of genuine replacement parts, carburetors, blades, and maintenance kits with unique RIPL codes.
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm border border-white/10">
              <Phone className="w-8 h-8 text-yellow-300 mb-3" />
              <h3 className="font-bold text-base mb-2">Dedicated Assistance</h3>
              <p className="text-green-100 leading-relaxed">
                Customer support, technician assistance, and telephone helpline (7393 938 938) operating 6 days a week.
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
                Ratnagiri Impex Pvt. Ltd. (Annapurna House)<br />
                #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.
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
