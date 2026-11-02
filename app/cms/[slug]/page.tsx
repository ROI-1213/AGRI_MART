'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Handshake, TrendingUp, BookOpen, Download, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CMSPage() {
  const params = useParams();
  const rawSlug = params?.slug as string;
  const slug = rawSlug?.replace(/-/g, '_');

  const contentMap: Record<string, { title: string; subtitle: string; icon: any; body: string }> = {
    become_a_partner: {
      title: 'Become an Authorized Agrimart Business Partner',
      subtitle: 'Join India’s largest organized farm machinery retail and franchise network.',
      icon: Handshake,
      body: `
        <h3>Why Partner with Agrimart?</h3>
        <p>Agrimart is an initiative of Ratnagiri Impex Pvt. Ltd. (Annapurna Group), operating since 2000. With an established footprint across India and trusted partnerships with global manufacturers like Kasei and Oleo-Mac, Agrimart offers business entrepreneurs and rural retailers an unmatched business opportunity.</p>
        
        <h3>Franchise & Dealership Benefits:</h3>
        <ul>
          <li><strong>Exclusive Brand Portfolio:</strong> Authorized distribution rights for Agrimate, Kasei, Oleo-Mac, and Green Panther equipment.</li>
          <li><strong>High Operating Margins:</strong> Attractive profit margins on both complete machine sales and recurring consumable spares.</li>
          <li><strong>Technical & Sales Training:</strong> Free orientation for your staff on machine operation, repair diagnostics, and customer demonstration.</li>
          <li><strong>Marketing & In-Store Branding:</strong> Signage, marketing collateral, localized advertising, and national digital leads passed directly to your outlet.</li>
        </ul>

        <h3>Eligibility Requirements:</h3>
        <p>Prior experience in agricultural inputs, machinery, hardware, or automotive retail with a minimum commercial showroom/storage space of 400–800 sq.ft. in a high-traffic agricultural hub or taluk headquarters.</p>
      `
    },
    buy_earn_rent: {
      title: 'Buy, Earn and Rent Scheme',
      subtitle: 'Create sustainable rural income by providing custom hiring services for farm mechanization.',
      icon: TrendingUp,
      body: `
        <h3>Rural Mechanization Entrepreneurship Program</h3>
        <p>Small and marginal farmers often struggle to invest in expensive machinery individually. Through Agrimart’s 'Buy, Earn and Rent' initiative, progressive farmers, rural youth, and agricultural self-help groups (SHGs) can acquire high-demand equipment and earn recurring rental income by offering custom hiring services to neighboring farms.</p>
        
        <h3>Top Equipment for Custom Hiring:</h3>
        <ul>
          <li><strong>Power Weeders / Intercultivators:</strong> High demand for weeding in sugarcane, maize, cotton, and vegetables.</li>
          <li><strong>Mistblowers & Battery Sprayers:</strong> Essential for timely pest control in orchards, coffee, and arecanut.</li>
          <li><strong>Earth Augers:</strong> In heavy demand for planting saplings, fencing poles, and horticulture.</li>
          <li><strong>Chaff Cutters & Shredders:</strong> Vital for dairy farmers for fodder preparation.</li>
        </ul>

        <h3>Financial Payback Period:</h3>
        <p>Most rental operators recover their initial capital investment within 3 to 6 months of peak agricultural season operation.</p>
      `
    },
    knowledge_bank: {
      title: 'Agricultural Equipment Knowledge Bank',
      subtitle: 'Technical specifications, machine operation guides, and farm mechanization resources.',
      icon: BookOpen,
      body: `
        <h3>Empowering Indian Agriculture with Practical Engineering Knowledge</h3>
        <p>Agrimart believes that effective mechanization begins with knowledge. Our Knowledge Bank serves as an open technical library containing equipment user manuals, two-stroke oil mixing tables, sprayer nozzle calibration guides, and subsidy documentation.</p>
        
        <h3>Essential Operator Resources:</h3>
        <ul>
          <li><strong>2-Stroke Fuel Mixing Guide:</strong> The correct 50:1 or 25:1 fuel-to-Prosint 2T oil ratio to prevent engine seizure.</li>
          <li><strong>Seasonal Storage Tips:</strong> How to drain carburetors, lubricate cylinder heads, and store machinery during off-seasons.</li>
          <li><strong>Government Subsidy Procedures:</strong> Step-by-step application documentation for Central & State mechanization schemes.</li>
          <li><strong>Equipment Troubleshooting:</strong> Quick diagnostic flowcharts for starting issues, spark plug maintenance, and filter cleaning.</li>
        </ul>
      `
    }
  };

  const current = contentMap[slug] || contentMap['become_a_partner'];
  const Icon = current.icon;

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container max-w-4xl">
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{current.title}</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-[#0d9749] text-xs font-bold uppercase mb-2">
            <Icon className="w-4 h-4" />
            <span>Agrimart Initiative</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            {current.title}
          </h1>
          <p className="text-xs text-gray-500 mb-4">{current.subtitle}</p>
          <div className="w-16 h-1 bg-[#0d9749] mb-6"></div>

          <div
            className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: current.body }}
          />

          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/contact" className="agri-btn-primary text-xs py-2.5 px-6">
              Connect with Our Team →
            </Link>
            <a
              href="/assets/brochures/corporate_brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0d9749] font-bold flex items-center gap-1.5 hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Corporate Deck</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
