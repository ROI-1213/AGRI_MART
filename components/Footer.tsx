import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, FileText, Download } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#e9f1f4] text-gray-800 text-sm mt-0 border-t-4 border-[#0d9749] overflow-hidden">
      {/* Agricultural Landscape Background Banner Image */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/assets/banners/footer_bg_hd.png"
          alt="Agrimart Farm Fields Background"
          fill
          priority
          unoptimized
          quality={100}
          className="object-cover object-bottom"
        />
        {/* Soft subtle translucent veil at the top so the landscape shines through brightly while guaranteeing 100% black text contrast */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
      </div>

      {/* Top Footer Section */}
      <div className="relative z-10 agri-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Profile & About */}
          <div>
            <div className="mb-4">
              <Image
                src="/assets/branding/logo.png"
                alt="Agrimart"
                width={180}
                height={50}
                unoptimized
                className="h-10 w-auto object-contain drop-shadow-xs"
              />
            </div>
            <p className="text-xs text-gray-800 leading-relaxed mb-4 font-medium">
              AGRIMART is an initiative of <strong className="text-gray-950 font-bold">Ratnagiri Impex Pvt. Ltd.</strong>, part of the Annapurna Group. Founded in 2000, we specialize in high-efficiency agricultural machinery, mechanization solutions, pest control sprayers, garden care equipment, and reliable customer service across India.
            </p>
            <div className="space-y-2">
              <a
                href="/assets/brochures/corporate_brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs bg-[#0d9749] hover:bg-[#097b3a] text-white font-bold px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Corporate Brochure
              </a>
              <br />
              <a
                href="/assets/brochures/agrimart_brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> Download Agrimate Brochure
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links & Business */}
          <div>
            <h3 className="text-gray-950 font-black text-base mb-4 border-b-2 border-[#0d9749]/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-gray-800">
              <li>
                <Link href="/" className="hover:text-[#0d9749] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('agrimart-reset-products'));
                    }
                  }}
                  className="hover:text-[#0d9749] transition-colors"
                >
                  All Products Catalogue
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0d9749] transition-colors">
                  About Us & Vision
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#0d9749] transition-colors">
                  Services & 750+ Dealer Network
                </Link>
              </li>
              <li>
                <Link href="/become-a-partner" className="hover:text-[#0d9749] transition-colors">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/cms/buy-earn-rent" className="hover:text-[#0d9749] transition-colors">
                  Buy, Earn & Rent Program
                </Link>
              </li>
              <li>
                <Link href="/cms/knowledge-bank" className="hover:text-[#0d9749] transition-colors">
                  Knowledge Bank
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Legal */}
          <div>
            <h3 className="text-gray-950 font-black text-base mb-4 border-b-2 border-[#0d9749]/30 pb-2">
              Customer Support & Legal
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-gray-800">
              <li>
                <Link href="/faq" className="hover:text-[#0d9749] transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0d9749] transition-colors">
                  Contact Us & Enquiries
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#0d9749] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0d9749] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal-notice" className="hover:text-[#0d9749] transition-colors">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-[#0d9749] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-[#0d9749] transition-colors">
                  Warranty & Service Guarantee
                </Link>
              </li>
            </ul>

            {/* Mobile App Download badges */}
            <div className="mt-5">
              <p className="text-xs font-bold text-gray-900 mb-2">Download Our Mobile App</p>
              <div className="flex items-center space-x-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.invenzo.ratnagiri&hl=en_IN&gl=US&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-opacity inline-block shadow-sm rounded overflow-hidden"
                >
                  <Image
                    src="/assets/branding/google_play_hd.png"
                    alt="Download on Google Play"
                    width={110}
                    height={34}
                    unoptimized
                    className="h-8 w-auto cursor-pointer"
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/agrimart/id1599062786"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90 transition-opacity inline-block shadow-sm rounded overflow-hidden"
                >
                  <Image
                    src="/assets/branding/app_store_hd.png"
                    alt="Download on App Store"
                    width={110}
                    height={34}
                    unoptimized
                    className="h-8 w-auto cursor-pointer"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Information & Network */}
          <div>
            <h3 className="text-gray-950 font-black text-base mb-4 border-b-2 border-[#0d9749]/30 pb-2">
              Contact Information
            </h3>
            <div className="space-y-3 text-xs text-gray-800 font-medium">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#0d9749] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-950">Annapurna House</strong>, #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#0d9749] shrink-0" />
                <span>
                  Toll Free: <a href="tel:7393938938" className="text-gray-950 hover:text-[#0d9749] font-bold">7393 938 938</a>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#0d9749] shrink-0" />
                <span>
                  Email: <a href="mailto:ask@agrimart.in" className="hover:text-[#0d9749] text-gray-900 font-semibold">ask@agrimart.in</a>
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#0d9749] shrink-0 mt-0.5" />
                <span>
                  Mon – Sat: 9:30 AM – 6:00 PM<br />
                  Sunday: Closed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md py-4 border-t border-gray-300/80 text-center text-xs text-gray-700">
        <div className="agri-container flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-medium text-gray-800">© {new Date().getFullYear()} Agrimart — Ratnagiri Impex Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-4 font-semibold">
            <Link href="/privacy-policy" className="hover:text-[#0d9749] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#0d9749] transition-colors">Terms of Use</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#0d9749] transition-colors">Enquiries</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
