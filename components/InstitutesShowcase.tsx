'use client';

import React from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  MapPin, 
  Award,
  ShieldCheck
} from 'lucide-react';

interface Institute {
  id: number;
  code: string;
  name: string;
  location: string;
  category: string;
  description: string;
  img: string;
}

const institutes: Institute[] = [
  {
    id: 1,
    code: 'ANGRAU',
    name: 'Acharya N.G. Ranga Agricultural University',
    location: 'Hyderabad, Telangana / AP',
    category: 'State Agricultural University',
    description: 'Premier testing and certification authority for agricultural implements, power sprayers, and farm mechanization.',
    img: '/assets/recognition/angrau_hd.png',
  },
  {
    id: 2,
    code: 'ICAR - CIAE',
    name: 'Central Institute of Agricultural Engineering',
    location: 'Bhopal, Madhya Pradesh',
    category: 'Apex ICAR National Research Institute',
    description: 'National apex institute dedicated to agricultural engineering research, power machinery standards, and ergonomic design.',
    img: '/assets/recognition/ciae_hd.png',
  },
  {
    id: 3,
    code: 'NERFMTTI',
    name: 'North Eastern Region FM&TTI',
    location: 'Biswanath Chariali, Assam',
    category: 'Govt. of India — Ministry of Agriculture',
    description: 'Central Government testing authority evaluating hill-slope mechanization, sprayers, and high-humidity endurance.',
    img: '/assets/recognition/nerfmtti_hd.png',
  },
  {
    id: 4,
    code: 'NRFMTTI',
    name: 'Northern Region FM&TTI',
    location: 'Hisar, Haryana',
    category: 'Govt. of India — Ministry of Agriculture',
    description: 'National testing facility assessing heavy-duty engines, tillers, grain machinery, and rigorous field durability.',
    img: '/assets/recognition/nrfmtti_hd.png',
  },
  {
    id: 5,
    code: 'SRFMTTI',
    name: 'Southern Region FM&TTI',
    location: 'Garladinne, Anantapur, Andhra Pradesh',
    category: 'Govt. of India — Ministry of Agriculture',
    description: 'Premier testing authority for plant protection equipment, tractor-drawn sprayers, brush cutters, and engines.',
    img: '/assets/recognition/srfmtti_hd.png',
  },
  {
    id: 6,
    code: 'TNAU',
    name: 'Tamil Nadu Agricultural University',
    location: 'Coimbatore, Tamil Nadu',
    category: 'Premier Agricultural University',
    description: 'Extensively certified for operator safety, fuel efficiency, horticultural spraying precision, and long duty cycles.',
    img: '/assets/recognition/tnau_hd.png',
  },
  {
    id: 7,
    code: 'UAS Bangalore',
    name: 'University of Agricultural Sciences, Bangalore',
    location: 'Bengaluru, Karnataka',
    category: 'State Agricultural University',
    description: 'Validated for soil-working tools, weeders, power tillers, and plantation crop spraying effectiveness.',
    img: '/assets/recognition/uas_hd.png',
  },
];

// Duplicate for seamless 50% translation infinite loop
const doubleInstitutes = [...institutes, ...institutes];

export default function InstitutesShowcase() {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-5 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 bg-green-50 text-[#2d7d32] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-green-200/60">
          <ShieldCheck className="w-4 h-4 text-[#2d7d32]" />
          <span>Government & Academic Accreditation</span>
        </div>
        <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Tested & Approved by Premier Agricultural Universities & FM&TTI Institutes
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-2xl mx-auto">
          Every Agrimart machine undergoes rigorous institutional testing to guarantee maximum durability, fuel efficiency, and farmer safety.
        </p>
      </div>

      {/* Continuously Sliding Track Viewport (Displays 2 large cards at a time, smooth infinite motion) */}
      <div className="relative overflow-hidden w-full max-w-5xl mx-auto py-2 group">
        {/* Soft edge fade masks for high-end cinematic feel */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 sm:gap-5 animate-continuous-marquee">
          {doubleInstitutes.map((inst, idx) => (
            <div
              key={`${inst.id}-${idx}`}
              className="w-[320px] sm:w-[420px] md:w-[480px] shrink-0 flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-gray-50 via-white to-green-50/30 border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-300 select-none"
            >
              {/* Bigger Circular High-Definition Emblem */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-white shadow-sm border-2 border-green-100 p-2.5 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                  <div className="relative w-full h-full">
                    <Image
                      src={inst.img}
                      alt={inst.name}
                      fill
                      sizes="110px"
                      className="object-contain"
                    />
                  </div>
                </div>
                {/* Approved Badge */}
                <div className="absolute -bottom-1.5 bg-[#2d7d32] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-2.5 h-2.5 text-yellow-300" />
                  <span>Approved</span>
                </div>
              </div>

              {/* Institution Information */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-black text-[#2d7d32] bg-green-100/80 px-2 py-0.5 rounded tracking-wide">
                    {inst.code}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{inst.location}</span>
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                  {inst.name}
                </h4>

                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed mb-2.5 line-clamp-2">
                  {inst.description}
                </p>

                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <Award className="w-3 h-3 text-yellow-500 shrink-0" />
                  <span className="truncate">{inst.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accreditation Badges Row (Centered, Clean, No Controls) */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {institutes.map((inst) => (
          <div
            key={inst.id}
            className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-50 hover:bg-green-50 hover:text-green-800 text-gray-700 border border-gray-200/80 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d7d32]"></span>
            <span>{inst.code}</span>
          </div>
        ))}
      </div>

      {/* Continuous CSS Marquee Animation Styles */}
      <style jsx>{`
        @keyframes continuousMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-continuous-marquee {
          width: max-content;
          animation: continuousMarquee 26s linear infinite;
          will-change: transform;
        }
        .animate-continuous-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
